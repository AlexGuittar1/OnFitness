// ===========================
// Database Types (mirrors SQL schema)
// ===========================

export interface Plan {
  id: string;
  name: string;
  slug: string;
  stripe_price_id: string;
  price_cents: number;
  currency: string;
  interval: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  stock: number;
  reserved_stock: number;
  image_url: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  price_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type ReservationStatus = "active" | "completed" | "expired" | "canceled";

export interface ProductReservation {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  status: ReservationStatus;
  stripe_session_id: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  user_id: string;
  reservation_id: string | null;
  product_id: string | null;
  quantity: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export type StripeEventStatus = "received" | "processing" | "processed" | "failed";

export interface StripeEventLedger {
  id: string;
  type: string;
  status: StripeEventStatus;
  payload: Record<string, unknown>;
  attempts: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// ===========================
// Computed Types
// ===========================

export interface ProductWithAvailability extends Product {
  available: number;
  stock_level: "green" | "yellow" | "red";
}

export interface MembershipWithPlan extends Membership {
  plan?: Plan;
  is_valid: boolean;
}
