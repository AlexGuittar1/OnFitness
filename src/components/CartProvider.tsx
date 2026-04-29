"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: any, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, isCartOpen, toggleCart, cartTotal }}>
      {children}
      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }} onClick={toggleCart} />
          <div style={{ position: 'relative', width: '400px', maxWidth: '100%', background: 'var(--bg-card)', height: '100vh', padding: '30px', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s var(--ease)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--text-primary)' }}>TU CARRITO</h2>
              <button onClick={toggleCart} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '28px', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Tu carrito está vacío.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '5px' }}>{item.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ color: 'var(--brand)', fontWeight: 700 }}>${item.price}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '5px 10px', cursor: 'pointer' }}>-</button>
                            <span style={{ fontSize: '14px', width: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '5px 10px', cursor: 'pointer' }}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>Remover</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '24px', fontWeight: 800 }}>
                <span>TOTAL:</span>
                <span style={{ color: 'var(--brand)' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn btn--primary" style={{ width: '100%' }}>Proceder al Checkout</button>
            </div>
          </div>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
