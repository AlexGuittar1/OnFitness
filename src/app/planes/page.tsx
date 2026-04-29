import { createSupabaseAdmin } from "@/lib/supabase/server";
import { PremiumButton } from "@/components/PremiumButton";
import type { Plan } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Planes — IronFit",
  description: "Elige tu membresía: Core, Pro o Elite. Transforma tu vida hoy.",
};

export default async function PlanesPage() {
  const supabase = createSupabaseAdmin();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("price_cents", { ascending: true });

  return (
    <main style={{ paddingTop: 96, minHeight: "100vh" }}>
      <div className="container">
        <div className="section__header">
          <span className="section__label">Membresías</span>
          <h1 className="section__title">Elige tu plan</h1>
          <p className="section__desc">
            Sin contratos. Cancela cuando quieras. Tu primera semana es gratis.
          </p>
        </div>

        <div className="plans-grid">
          {(plans as Plan[] | null)?.map((plan, index) => (
            <div
              key={plan.id}
              className={`plan-card ${index === 1 ? "plan-card--featured" : ""}`}
            >
              <span className="plan-card__name">{plan.name}</span>
              <div className="plan-card__price">
                ${(plan.price_cents / 100).toLocaleString("es-MX")}
                <span> MXN</span>
              </div>
              <p className="plan-card__interval">por {plan.interval === "month" ? "mes" : plan.interval}</p>

              <ul className="plan-card__features">
                {(plan.features as string[]).map((feature, fi) => (
                  <li key={fi}>{feature}</li>
                ))}
              </ul>

              <Link href="/auth/register">
                <PremiumButton variant={index === 1 ? "primary" : "outline"} style={{ width: "100%" }}>
                  {index === 1 ? "Comenzar Ahora" : "Elegir Plan"}
                </PremiumButton>
              </Link>
            </div>
          )) ?? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", gridColumn: "1/-1" }}>
              Cargando planes...
            </p>
          )}
        </div>
      </div>

      <footer className="footer" style={{ marginTop: 80 }}>
        <div className="container">
          <p className="footer__text">© 2026 <span>IronFit</span>. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
