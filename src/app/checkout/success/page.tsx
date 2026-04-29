import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¡Compra Exitosa! — IronFit",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="success-page">
      <div>
        <div className="success-page__icon">✓</div>
        <h1 className="success-page__title">
          ¡Compra <span style={{ color: "var(--neon)" }}>Exitosa</span>!
        </h1>
        <p className="success-page__desc">
          Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" className="btn btn--primary">
            Ir al Dashboard
          </Link>
          <Link href="/tienda" className="btn btn--outline">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
