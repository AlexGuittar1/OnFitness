"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function PremiumButton({
  variant = "primary",
  loading = false,
  loadingText = "Procesando...",
  children,
  disabled,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={`btn btn--${variant}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn__spinner" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
