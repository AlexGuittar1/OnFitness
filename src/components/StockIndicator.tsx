"use client";

import { Product } from "@/lib/types";

interface StockIndicatorProps {
  product: Product;
}

export function StockIndicator({ product }: StockIndicatorProps) {
  const available = product.stock - product.reserved_stock;
  const maxStock = Math.max(product.stock, 1);
  const pct = Math.min((available / maxStock) * 100, 100);

  let level: "green" | "yellow" | "red";
  let label: string;

  if (available > 10) {
    level = "green";
    label = "Disponible";
  } else if (available > 5) {
    level = "yellow";
    label = "Pocas unidades";
  } else if (available > 0) {
    level = "red";
    label = `¡Solo quedan ${available}!`;
  } else {
    level = "red";
    label = "Agotado";
  }

  return (
    <div className="stock-indicator">
      <div className="stock-indicator__bar">
        <div
          className={`stock-indicator__fill stock-indicator__fill--${level}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`stock-indicator__label stock-indicator__label--${level}`}>
        {label}
      </span>
    </div>
  );
}
