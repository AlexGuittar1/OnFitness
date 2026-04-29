"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" style={{ background: '#050505', paddingTop: '100px', position: 'relative' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '80px' }}>
          
          {/* Columna 1: About */}
          <div>
            <Link href="/" className="logo-brand" style={{ fontSize: '48px', marginBottom: '20px' }}>
              ON<span>FITNESS</span>
            </Link>
            <p style={{ marginTop: '20px', color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8 }}>
              No somos un gimnasio más. Somos una comunidad diseñada para forjar disciplina, fuerza y potenciar tu máximo rendimiento físico.
            </p>
            <div className="social-links" style={{ marginTop: '30px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.4 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--brand)', marginBottom: '30px', fontSize: '24px', position: 'relative' }}>Links Útiles</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li><Link href="/#sucursales" className="nav__link" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Sucursales</Link></li>
              <li><Link href="/#planes" className="nav__link" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Membresías</Link></li>
              <li><Link href="/tienda" className="nav__link" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Tienda Oficial</Link></li>
              <li><Link href="/contacto" className="nav__link" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contact */}
          <div>
            <h4 style={{ color: 'var(--brand)', marginBottom: '30px', fontSize: '24px' }}>Contacto</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" style={{ marginTop: '3px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>+52 55 1234 5678</span>
              </li>
              <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" style={{ marginTop: '3px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>contacto@onfitness.mx</span>
              </li>
              <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" style={{ marginTop: '3px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Av. Tláhuac 5856, CDMX</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div>
            <h4 style={{ color: 'var(--brand)', marginBottom: '30px', fontSize: '24px' }}>Newsletter</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '20px', lineHeight: 1.6 }}>
              Suscríbete para recibir rutinas exclusivas y promociones especiales.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white', outline: 'none' }} 
              />
              <button className="btn btn--primary" style={{ width: '100%', borderRadius: '4px' }}>SUSCRIBIRME</button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '30px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            © {new Date().getFullYear()} OnFitness Gym. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
             <Link href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</Link>
             <Link href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Arrow */}
      <button 
        onClick={scrollToTop}
        style={{ 
          position: 'fixed', bottom: '30px', right: '110px', /* Espacio para no chocar con WhatsApp */
          width: '50px', height: '50px', borderRadius: '4px', background: 'var(--brand)', color: 'white',
          border: 'none', cursor: 'pointer', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: showScroll ? 1 : 0, visibility: showScroll ? 'visible' : 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 5px 15px var(--brand-dim)', transform: showScroll ? 'translateY(0)' : 'translateY(20px)'
        }}
        title="Volver arriba"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
    </footer>
  );
}
