"use client";

import Link from "next/link";
import { useEffect } from "react";
import products from "@/data/products.json";
import { useCart } from "@/components/CartProvider";

export default function StorePage() {
  const { addToCart } = useCart();

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

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <section className="section">
        <div className="container">
          <div className="reveal-target" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '72px', margin: 0 }}>NUESTRA <span className="on-text-brand">TIENDA</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Potencia tu entrenamiento con nuestros productos oficiales.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
            {products.map((product, idx) => (
              <div key={product.id} className={`branch-card reveal-target delay-${(idx + 1) * 100}`} style={{ overflow: 'hidden' }}>
                <Link href={`/tienda/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="branch-card__img-container" style={{ height: '350px' }}>
                    <img src={product.image} alt={product.name} className="branch-card__img" />
                    {product.originalPrice && (
                      <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--brand)', color: 'white', padding: '5px 15px', borderRadius: '100px', fontWeight: 'bold', fontSize: '12px', zIndex: 10 }}>
                        OFERTA
                      </div>
                    )}
                  </div>
                  <div className="branch-card__body" style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', color: 'var(--warning)', marginBottom: '10px' }}>
                      {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                        <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                      ))}
                    </div>
                    <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{product.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                      {product.originalPrice && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>${product.originalPrice}</span>
                      )}
                      <span style={{ color: 'var(--brand)', fontSize: '24px', fontWeight: 700 }}>${product.price}</span>
                    </div>
                  </div>
                </Link>
                <div style={{ padding: '0 20px 30px' }}>
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
                    className="btn btn--outline" 
                    style={{ width: '100%', borderRadius: '4px', fontSize: '16px' }}
                  >
                    AGREGAR AL CARRITO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
