"use client";

import { BranchCard } from "@/components/BranchCard";
import Link from "next/link";
import { useEffect, useState } from "react";

const SUCURSALES = [
  {
    id: "tlahuac-uuid", // In a real app this would come from DB
    name: "On Fitness Tlahuac",
    slug: "tlahuac",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070",
    mapLink: "https://share.google/tqU25xFWo0gy6DTw6"
  },
  {
    id: "sucursal2-uuid",
    name: "On Fitness 2",
    slug: "on-fitness-2",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075",
    mapLink: "https://share.google/rJNEi1NWH3EF4797W"
  }
];

const AREAS = [
  { title: "Área de peso libre", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070" },
  { title: "Máquinas de espalda", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069" },
  { title: "Máquinas de pierna", img: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1974" },
  { title: "Área de cardio", img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1974" }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const HERO_SLIDES = [
    {
      title1: "ENTRENA SIN",
      title2: "LÍMITES",
      subtitle: "SUPERA TUS METAS CADA DÍA.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
    },
    {
      title1: "FUERZA Y",
      title2: "DISCIPLINA",
      subtitle: "FORJA TU MEJOR VERSIÓN.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070",
    },
    {
      title1: "POTENCIAL",
      title2: "ABSOLUTO",
      subtitle: "EL DOLOR ES TEMPORAL, EL ORGULLO ES PARA SIEMPRE.",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    <main>
      {/* 1. HERO SECTION (DYNAMIC SLIDER) */}
      <section className="hero" style={{ 
        backgroundImage: `url('${HERO_SLIDES[currentSlide].image}')`,
        transition: 'background-image 1s ease-in-out'
      }}>
        <div className="container">
          <div className="hero__content" key={currentSlide}> {/* El key fuerza re-render para la animación */}
            <h1 className="hero__title animate-on-scroll">
              {HERO_SLIDES[currentSlide].title1}<br/>
              <span className="on-text-brand">{HERO_SLIDES[currentSlide].title2}</span>
            </h1>
            <p className="hero__subtitle animate-on-scroll delay-100" style={{ fontSize: '24px', textTransform: 'uppercase', color: 'white', fontWeight: 600, marginBottom: '30px' }}>
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <div className="animate-on-scroll delay-200" style={{ display: 'flex', gap: '20px' }}>
              <Link href="/inscripcion" className="btn btn--primary" style={{ padding: '18px 40px', fontSize: '22px' }}>
                Join Now
              </Link>
              <Link href="#sucursales" className="btn btn--outline" style={{ padding: '18px 40px', fontSize: '22px' }}>
                Ver Centros
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRANCHES (SUCURSALES) */}
      <section id="sucursales" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="reveal-target" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '60px' }}>Nuestras Sucursales</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Encuentra tu centro OnFitness más cercano</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {SUCURSALES.map((suc, idx) => (
              <div key={suc.id} className={`reveal-target delay-${(idx + 1) * 100}`}>
                <BranchCard {...suc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEMBERSHIP PLANS SECTION */}
      <section id="planes" className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="reveal-target" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '60px' }}>Planes OnFitness</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Sin letras chiquitas, solo resultados.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="branch-card plan-card-container reveal-target delay-100" style={{ padding: '40px', background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '32px', color: 'var(--brand)' }}>Plan Mensual</h3>
              <div style={{ fontSize: '48px', fontWeight: 700, margin: '20px 0' }}>$449<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>/mes</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '40px', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '10px' }}>✓ Acceso ilimitado</li>
                <li style={{ marginBottom: '10px' }}>✓ Sin contrato forzoso</li>
                <li style={{ marginBottom: '10px' }}>✓ Todas las áreas</li>
              </ul>
              <Link href="/inscripcion?plan=mensual" className="btn btn--outline" style={{ width: '100%' }}>Seleccionar plan</Link>
            </div>

            <div className="branch-card plan-card-container reveal-target delay-200" style={{ padding: '40px', background: 'var(--bg-elevated)', border: '2px solid var(--brand)', transform: 'scale(1.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--brand)', color: 'white', padding: '4px 15px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, zIndex: 10 }}>RECOMENDADO</div>
              <h3 style={{ fontSize: '32px', color: 'var(--brand)' }}>Plan Anual</h3>
              <div style={{ fontSize: '48px', fontWeight: 700, margin: '20px 0' }}>$399<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>/mes</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '40px', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '10px' }}>✓ Precio preferencial</li>
                <li style={{ marginBottom: '10px' }}>✓ Pago anual diferido</li>
                <li style={{ marginBottom: '10px' }}>✓ Playera de regalo</li>
              </ul>
              <Link href="/inscripcion?plan=anual" className="btn btn--primary" style={{ width: '100%' }}>Seleccionar plan</Link>
            </div>

            <div className="branch-card plan-card-container reveal-target delay-300" style={{ padding: '40px', background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '32px', color: 'var(--brand)' }}>Plan Estudiante</h3>
              <div style={{ fontSize: '48px', fontWeight: 700, margin: '20px 0' }}>$349<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>/mes</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '40px', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '10px' }}>✓ Credencial vigente</li>
                <li style={{ marginBottom: '10px' }}>✓ Horario completo</li>
                <li style={{ marginBottom: '10px' }}>✓ Coach incluido</li>
              </ul>
              <Link href="/inscripcion?plan=estudiante" className="btn btn--outline" style={{ width: '100%' }}>Seleccionar plan</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AREAS SECTION */}
      <section className="section">
        <div className="container">
          <div className="reveal-target" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '60px' }}>Nuestras Áreas</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Equipamiento de clase mundial para tu progreso</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {AREAS.map((area, idx) => (
              <div key={area.title} className={`branch-card reveal-target delay-${(idx + 1) * 100}`} style={{ cursor: 'pointer' }}>
                <div className="branch-card__img-container">
                  <img 
                    src={area.img} 
                    alt={area.title} 
                    className="area-image"
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, left: 0, right: 0, 
                    padding: '20px', 
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' 
                  }}>
                    <h3 style={{ fontSize: '24px', color: 'white' }}>{area.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SCHEDULE SECTION */}
      <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '60px' }}>Horarios Globales</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--brand)', fontSize: '32px' }}>Lunes a Viernes</h3>
              <p style={{ fontSize: '24px' }}>06:00 - 23:00</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--brand)', fontSize: '32px' }}>Sábado</h3>
              <p style={{ fontSize: '24px' }}>08:00 - 18:00</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--brand)', fontSize: '32px' }}>Domingo</h3>
              <p style={{ fontSize: '24px' }}>08:00 - 16:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/5215500000000" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
      >
        <svg viewBox="0 0 24 24" width="34" height="34" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </main>
  );
}
