"use client";

import { use, useState, useEffect } from "react";
import products from "@/data/products.json";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = products.find(p => p.id === resolvedParams.id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-target').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!product) return notFound();

  return (
    <main style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container">
        <Link href="/tienda" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '40px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          ← Volver a la tienda
        </Link>
        
        <div className="responsive-grid-2" style={{ display: 'grid', gap: '60px', alignItems: 'start' }}>
          {/* Left: Product Gallery */}
          <div className="reveal-target">
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '20px' }}>
              <img src={product.gallery[activeImage] || product.image} alt={product.name} style={{ width: '100%', height: '600px', objectFit: 'cover' }} />
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '15px' }}>
                {product.gallery.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    style={{ 
                      width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer',
                      border: activeImage === idx ? '2px solid var(--brand)' : '2px solid transparent'
                    }}
                  >
                    <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="reveal-target delay-100">
            <h1 style={{ fontSize: '64px', lineHeight: 1, marginBottom: '20px' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', color: 'var(--warning)' }}>
                {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                  <svg key={i} width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                ))}
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>{product.rating} Estrellas</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              {product.originalPrice && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '24px' }}>${product.originalPrice}</span>
              )}
              <span style={{ color: 'var(--brand)', fontSize: '48px', fontWeight: 700 }}>${product.price}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, marginBottom: '50px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '15px 25px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>-</button>
                <input type="text" value={quantity} readOnly style={{ width: '50px', textAlign: 'center', background: 'transparent', border: 'none', color: 'white', fontSize: '18px', fontWeight: 700 }} />
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '15px 25px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>+</button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="btn btn--primary" 
                style={{ flex: 1, padding: '20px' }}
              >
                Añadir al Carrito
              </button>
            </div>
            
            <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                En stock y listo para enviar
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Envíos seguros a todo el país
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
