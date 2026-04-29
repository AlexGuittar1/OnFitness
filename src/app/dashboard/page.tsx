import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isMembershipValid } from "@/services/membership-service";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — IronFit",
  description: "Tu panel de control: membresía, pedidos y perfil.",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch membership
  const { data: membership } = await supabase
    .from("memberships")
    .select("*, plan:plans(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const isValid = membership ? isMembershipValid(membership) : false;
  const displayName = profile?.full_name || user.email?.split("@")[0] || "Usuario";

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__header">
          <h1 className="dashboard__greeting">
            Hola, <span>{displayName}</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>{user.email}</p>
        </div>

        <div className="dashboard__grid">
          {/* Membership Card */}
          <div className="stat-card">
            <p className="stat-card__label">Membresía</p>
            {membership ? (
              <>
                <p className="stat-card__value">{membership.plan?.name || "—"}</p>
                <div style={{ marginTop: 12 }}>
                  <span className={`membership-badge membership-badge--${isValid ? "active" : "inactive"}`}>
                    {isValid ? "● Activa" : "● Inactiva"}
                  </span>
                </div>
                {membership.current_period_end && (
                  <p className="stat-card__detail">
                    {isValid ? "Vence" : "Venció"}: {new Date(membership.current_period_end).toLocaleDateString("es-MX")}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="stat-card__value" style={{ color: "var(--text-muted)" }}>Sin plan</p>
                <Link href="/planes" className="btn btn--primary" style={{ marginTop: 16, display: "inline-flex" }}>
                  Ver Planes
                </Link>
              </>
            )}
          </div>

          {/* Orders Card */}
          <div className="stat-card">
            <p className="stat-card__label">Pedidos Recientes</p>
            <p className="stat-card__value">{orders?.length || 0}</p>
            {orders && orders.length > 0 ? (
              <div style={{ marginTop: 16 }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
                  }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {new Date(order.created_at).toLocaleDateString("es-MX")}
                    </span>
                    <span style={{ color: "var(--neon)", fontWeight: 600 }}>
                      ${(order.total_amount / 100).toLocaleString("es-MX")} MXN
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="stat-card__detail">Aún no tienes pedidos</p>
            )}
          </div>

          {/* Account Card */}
          <div className="stat-card">
            <p className="stat-card__label">Mi Cuenta</p>
            <p className="stat-card__value" style={{ fontSize: 24, wordBreak: "break-all" }}>{user.email}</p>
            <p className="stat-card__detail">
              Miembro desde {new Date(user.created_at).toLocaleDateString("es-MX")}
            </p>
            <form action="/auth/logout" method="POST" style={{ marginTop: 16 }}>
              <button type="submit" className="btn btn--outline" style={{ fontSize: 12, padding: "8px 16px" }}>
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
