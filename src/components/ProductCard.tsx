"use client";

import { Product } from "@/lib/types";
import { StockIndicator } from "./StockIndicator";
import { PremiumButton } from "./PremiumButton";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const available = product.stock - product.reserved_stock;
  const priceMXN = (product.price_cents / 100).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  async function handleBuy() {
    if (loading || available <= 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error al procesar");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card__image">
        <span className="card__category">{product.category}</span>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(223,255,0,0.3)" strokeWidth="1.5">
            <path d="M6.5 6.5h11v11h-11z" /><path d="M3 3h18v18H3z" />
          </svg>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        <p className="card__desc">{product.description}</p>
        <div className="card__footer">
          <span className="card__price">
            {priceMXN} <span>MXN</span>
          </span>
          <PremiumButton
            loading={loading}
            loadingText="Procesando pago..."
            disabled={available <= 0}
            onClick={handleBuy}
          >
            {available <= 0 ? "Agotado" : "Comprar"}
          </PremiumButton>
        </div>
        <StockIndicator product={product} />
      </div>
    </div>
  );
}
