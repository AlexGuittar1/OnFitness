-- ################################################
-- GYM APP SAAS PREMIUM - DATABASE SCHEMA (PRODUCTION READY)
-- ################################################

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type stripe_event_status as enum ('received', 'processing', 'processed', 'failed');
create type reservation_status as enum ('active', 'completed', 'expired', 'canceled');
create type order_status as enum ('pending', 'paid', 'failed');

-- 3. TABLES

-- Plans Table (synced with Stripe)
create table plans (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text unique not null,
    stripe_price_id text unique not null,
    price_cents int not null,
    currency text default 'mxn',
    interval text default 'month',
    features jsonb default '[]',
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Products Table
create table products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    price_cents int not null,
    currency text default 'mxn',
    stock int not null default 0,
    reserved_stock int not null default 0,
    image_url text,
    category text default 'general',
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    constraint stock_non_negative check (stock >= 0),
    constraint reserved_stock_bounds check (reserved_stock >= 0 and reserved_stock <= stock)
);

-- Profiles Table (extends Supabase auth.users)
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    avatar_url text,
    phone text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Memberships Table
create table memberships (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references profiles(id) on delete cascade,
    plan_id uuid references plans(id),
    stripe_customer_id text,
    stripe_subscription_id text unique,
    price_id text,
    status text default 'inactive',
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Stripe Event Ledger (Financial Auditing)
create table stripe_event_ledger (
    id text primary key, -- Stripe Event ID
    type text not null,
    status stripe_event_status default 'received',
    payload jsonb not null,
    attempts int default 0,
    error_message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Product Reservations
create table product_reservations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references profiles(id) on delete cascade,
    product_id uuid not null references products(id) on delete cascade,
    quantity int not null default 1,
    status reservation_status default 'active',
    stripe_session_id text,
    expires_at timestamptz not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    constraint positive_quantity check (quantity > 0)
);

-- Orders Table
create table orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references profiles(id) on delete cascade,
    reservation_id uuid references product_reservations(id),
    product_id uuid references products(id),
    quantity int not null default 1,
    total_amount int not null,
    currency text default 'mxn',
    status order_status default 'pending',
    stripe_payment_intent_id text,
    stripe_session_id text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. INDEXES
create index idx_ledger_status on stripe_event_ledger(status);
create index idx_ledger_type on stripe_event_ledger(type);
create index idx_reservations_status on product_reservations(status);
create index idx_reservations_expires on product_reservations(expires_at) where status = 'active';
create index idx_reservations_user_product on product_reservations(user_id, product_id) where status = 'active';
create index idx_orders_user on orders(user_id);
create index idx_orders_stripe_session on orders(stripe_session_id);
create index idx_memberships_user on memberships(user_id);
create index idx_memberships_stripe_sub on memberships(stripe_subscription_id);
create index idx_products_active on products(is_active) where is_active = true;

-- 5. UPDATED_AT TRIGGER
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at before update on products
for each row execute function update_updated_at();

create trigger trg_profiles_updated_at before update on profiles
for each row execute function update_updated_at();

create trigger trg_memberships_updated_at before update on memberships
for each row execute function update_updated_at();

create trigger trg_ledger_updated_at before update on stripe_event_ledger
for each row execute function update_updated_at();

create trigger trg_reservations_updated_at before update on product_reservations
for each row execute function update_updated_at();

create trigger trg_orders_updated_at before update on orders
for each row execute function update_updated_at();

-- 6. RPC FUNCTIONS

-- 6.1 Assert Inventory Invariant
create or replace function assert_inventory(p_product uuid)
returns void as $$
declare
    r int;
    s int;
begin
    select reserved_stock, stock into r, s
    from products where id = p_product;

    if r < 0 or r > s then
        raise exception 'Inventory invariant violated for product %: reserved=%, stock=%', p_product, r, s;
    end if;
end;
$$ language plpgsql;

-- 6.2 Reserve Stock (Atomic)
create or replace function reserve_stock(
    p_user uuid,
    p_product uuid,
    p_qty int
)
returns uuid as $$
declare
    v_product record;
    v_reservation_id uuid;
begin
    -- Lock the product row
    select * into v_product
    from products
    where id = p_product
    for update;

    if not found then
        raise exception 'Product not found: %', p_product;
    end if;

    -- Check availability
    if (v_product.stock - v_product.reserved_stock) < p_qty then
        raise exception 'No stock available for product %', p_product;
    end if;

    -- Increment reserved_stock
    update products
    set reserved_stock = reserved_stock + p_qty
    where id = p_product;

    -- Create reservation (15 min TTL)
    insert into product_reservations (user_id, product_id, quantity, status, expires_at)
    values (p_user, p_product, p_qty, 'active', now() + interval '15 minutes')
    returning id into v_reservation_id;

    -- Verify invariant
    perform assert_inventory(p_product);

    return v_reservation_id;
end;
$$ language plpgsql;

-- 6.3 Release Stock (Atomic)
create or replace function release_stock(p_reservation uuid)
returns void as $$
declare
    r record;
begin
    select * into r
    from product_reservations
    where id = p_reservation
    for update;

    if not found or r.status <> 'active' then
        return; -- Nothing to release
    end if;

    -- Release reserved stock
    update products
    set reserved_stock = reserved_stock - r.quantity
    where id = r.product_id;

    -- Mark reservation as canceled
    update product_reservations
    set status = 'canceled'
    where id = p_reservation;

    -- Verify invariant
    perform assert_inventory(r.product_id);
end;
$$ language plpgsql;

-- 6.4 Process Order Transaction (Atomic - Critical Path)
create or replace function process_order_tx(
    p_user uuid,
    p_reservation uuid,
    p_amount int,
    p_pi text
)
returns uuid as $$
declare
    r record;
    v_order_id uuid;
begin
    -- Lock reservation row
    select * into r
    from product_reservations
    where id = p_reservation::uuid
    for update;

    if not found or r.status <> 'active' then
        raise exception 'Invalid or already processed reservation: %', p_reservation;
    end if;

    -- Verify ownership
    if r.user_id <> p_user::uuid then
        raise exception 'Reservation ownership mismatch';
    end if;

    -- Create order
    insert into orders (user_id, reservation_id, product_id, quantity, total_amount, status, stripe_payment_intent_id)
    values (p_user, p_reservation::uuid, r.product_id, r.quantity, p_amount, 'paid', p_pi)
    returning id into v_order_id;

    -- Complete reservation
    update product_reservations
    set status = 'completed'
    where id = p_reservation::uuid;

    -- Decrement actual stock (sold)
    update products
    set stock = stock - r.quantity,
        reserved_stock = reserved_stock - r.quantity
    where id = r.product_id;

    -- Verify invariant
    perform assert_inventory(r.product_id);

    return v_order_id;
end;
$$ language plpgsql;

-- 6.5 Release Expired Reservations (Cron Target)
create or replace function release_expired_reservations()
returns int as $$
declare
    v_count int;
begin
    with expired as (
        update product_reservations
        set status = 'expired'
        where expires_at < now()
          and status = 'active'
        returning product_id, quantity
    )
    update products p
    set reserved_stock = p.reserved_stock - e.quantity
    from expired e
    where p.id = e.product_id;

    get diagnostics v_count = row_count;
    return v_count;
end;
$$ language plpgsql;

-- 7. ROW LEVEL SECURITY (RLS)

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table product_reservations enable row level security;
alter table orders enable row level security;
alter table products enable row level security;
alter table plans enable row level security;
alter table stripe_event_ledger enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id);

create policy "Users can insert own profile"
    on profiles for insert
    with check (auth.uid() = id);

-- Memberships: users can read their own
create policy "Users can view own membership"
    on memberships for select
    using (auth.uid() = user_id);

-- Products: public read
create policy "Products are publicly readable"
    on products for select
    using (true);

-- Plans: public read
create policy "Plans are publicly readable"
    on plans for select
    using (true);

-- Reservations: users can view their own
create policy "Users can view own reservations"
    on product_reservations for select
    using (auth.uid() = user_id);

-- Orders: users can view their own
create policy "Users can view own orders"
    on orders for select
    using (auth.uid() = user_id);

-- Ledger: no public access (service_role only)
-- No policies = no access via anon/authenticated

-- 8. AUTO-CREATE PROFILE ON SIGNUP
create or replace function handle_new_user()
returns trigger as $$
begin
    insert into profiles (id, full_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();

-- 9. SEED DATA (Plans)
-- Replace price IDs with your actual Stripe Price IDs
insert into plans (name, slug, stripe_price_id, price_cents, features) values
    ('Core', 'core', 'price_REPLACE_CORE', 29900, '["Acceso al gym", "Horario completo", "Casillero"]'),
    ('Pro', 'pro', 'price_REPLACE_PRO', 49900, '["Todo Core", "Clases grupales", "Nutriólogo básico", "App premium"]'),
    ('Elite', 'elite', 'price_REPLACE_ELITE', 79900, '["Todo Pro", "Coach personal", "Spa & Recovery", "Invitados gratis"]');

-- 10. SAMPLE PRODUCTS
insert into products (name, description, price_cents, stock, image_url, category) values
    ('Proteína Whey 2kg', 'Proteína de suero de leche premium, sabor chocolate', 89900, 50, '/products/whey.webp', 'suplementos'),
    ('Guantes de Entrenamiento', 'Guantes premium con soporte de muñeca', 34900, 30, '/products/gloves.webp', 'accesorios'),
    ('Shaker Pro 700ml', 'Vaso mezclador con compartimento para suplementos', 19900, 100, '/products/shaker.webp', 'accesorios'),
    ('Banda de Resistencia Set', 'Set de 5 bandas con diferentes resistencias', 44900, 25, '/products/bands.webp', 'equipamiento'),
    ('Cuerda para Saltar Pro', 'Cuerda de velocidad con rodamientos', 24900, 40, '/products/rope.webp', 'equipamiento'),
    ('Pre-Workout Explosion', 'Pre-entreno con 300mg cafeína y beta-alanina', 59900, 35, '/products/preworkout.webp', 'suplementos');
