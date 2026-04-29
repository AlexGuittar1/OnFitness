"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="nav" style={{ height: '72px', borderBottom: '1px solid var(--border)' }}>
      <div className="nav__inner" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        
        {/* Left Side: Hamburger (Mobile) + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
          
          <Link href="/" className="logo-brand" style={{ fontSize: '32px' }}>
            ON<span>FITNESS</span>
          </Link>
        </div>
        
        {/* Desktop Links */}
        <ul className="nav__links desktop-only" style={{ display: 'flex', gap: '30px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><Link href="/#sucursales" className="nav__link" style={{ fontSize: '14px', fontWeight: 600 }}>SUCURSALES</Link></li>
          <li><Link href="/#planes" className="nav__link" style={{ fontSize: '14px', fontWeight: 600 }}>PLANES</Link></li>
          <li><Link href="/tienda" className="nav__link" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand)' }}>TIENDA</Link></li>
        </ul>

        {/* Right Actions: Theme Toggle, Cart, Inscribete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <button 
            onClick={toggleTheme}
            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}
          >
            {theme === "dark" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>

          <button onClick={toggleCart} style={{ position: 'relative', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-8px', background: 'var(--brand)', color: 'white', fontSize: '11px', fontWeight: 'bold', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {cartCount}
              </span>
            )}
          </button>
          
          <Link href="/inscripcion" className="btn btn--primary desktop-only" style={{ padding: '10px 24px', fontSize: '14px', marginLeft: '10px' }}>
            INSCRIBIRSE
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" style={{ position: 'absolute', top: '72px', left: 0, width: '100%', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 99, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <Link href="/#sucursales" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', fontSize: '20px', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>Sucursales</Link>
          <Link href="/#planes" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', fontSize: '20px', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>Planes</Link>
          <Link href="/tienda" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--brand)', fontSize: '20px', textDecoration: 'none', fontWeight: 600, paddingBottom: '10px' }}>Tienda</Link>
          <Link href="/inscripcion" onClick={() => setIsMobileMenuOpen(false)} className="btn btn--primary" style={{ padding: '16px', fontSize: '18px', textAlign: 'center', marginTop: '10px', width: '100%' }}>
            Inscríbete Ahora
          </Link>
        </div>
      )}
    </nav>
  );
}
