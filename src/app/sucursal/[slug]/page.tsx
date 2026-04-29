"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const BRANCH_DATA: Record<string, any> = {
  "tlahuac": {
    id: "tlahuac-uuid",
    name: "On Fitness Tlahuac",
    address: "Av. Tláhuac 5856 - Bo, Santa Ana Poniente Ciudad de México, CDMX - 13300",
    weekday: "6h - 23h",
    weekend: "8h - 18h",
    sunday: "8h - 16h",
    mainImg: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070",
    mapLink: "https://share.google/tqU25xFWo0gy6DTw6",
    gallery: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2070",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070"
    ]
  },
  "on-fitness-2": {
    id: "sucursal2-uuid",
    name: "On Fitness 2",
    address: "Premium Location, CDMX",
    weekday: "6h - 23h",
    weekend: "8h - 18h",
    sunday: "8h - 16h",
    mainImg: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075",
    mapLink: "https://share.google/rJNEi1NWH3EF4797W",
    gallery: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070"
    ]
  }
};

const PLANS = [
  { id: "mensual", name: "Plan Mensual", price: "$449", benefits: ["Acceso ilimitado", "Sin contrato forzoso", "Todas las áreas"] },
  { id: "anual", name: "Plan Anual", price: "$399", benefits: ["Precio preferencial", "Pago anual diferido", "Playera de regalo"], featured: true },
  { id: "estudiante", name: "Plan Estudiante", price: "$349", benefits: ["Credencial vigente", "Horario completo", "Coach incluido"] }
];

export default function BranchDetail() {
  const { slug } = useParams();
  const branch = BRANCH_DATA[slug as string];
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!branch) return <div className="container" style={{ paddingTop: '120px' }}>Sucursal no encontrada</div>;

  const scrollToPlanes = () => {
    document.getElementById("planes-selection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="container">
        <div style={{ display: 'flex', gap: '40px', marginBottom: '80px', flexWrap: 'wrap' }}>
          {/* Left: Gallery */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{branch.name}</h1>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '500px', marginBottom: '20px' }}>
              <img src={branch.mainImg} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {branch.gallery.map((img: string, i: number) => (
                <div key={i} style={{ height: '100px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info Panel */}
          <div style={{ width: '400px', minWidth: '300px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', position: 'sticky', top: '120px' }}>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--brand)', marginBottom: '10px' }}>Horario</h3>
                <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lun a Vie:</span> <span>{branch.weekday}</span></p>
                <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sáb/Feriados:</span> <span>{branch.weekend}</span></p>
                <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Dom:</span> <span>{branch.sunday}</span></p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--brand)', marginBottom: '10px' }}>Dirección</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{branch.address}</p>
                <a href={branch.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" style={{ padding: '5px 0', fontSize: '14px', color: 'var(--brand)' }}>
                  Ver mapa en Google Maps
                </a>
              </div>

              <button onClick={scrollToPlanes} className="btn btn--primary" style={{ width: '100%', padding: '20px' }}>
                ¡Quiero entrenar aquí!
              </button>
            </div>
          </div>
        </div>

        {/* 4. MEMBERSHIP PLANS SECTION */}
        <section id="planes-selection" style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '56px' }}>Selecciona tu plan</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Sin letras chiquitas, solo resultados.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            {PLANS.map(plan => (
              <div 
                key={plan.id} 
                className={`branch-card ${selectedPlan === plan.id ? 'active' : ''}`}
                style={{ 
                  padding: '40px', 
                  border: selectedPlan === plan.id ? '2px solid var(--brand)' : plan.featured ? '1px solid var(--brand-glow)' : '1px solid var(--border)',
                  background: plan.featured ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  transform: plan.featured ? 'scale(1.05)' : 'none'
                }}
              >
                {plan.featured && <div style={{ background: 'var(--brand)', color: 'white', padding: '4px 12px', fontSize: '12px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>RECOMENDADO</div>}
                <h3 style={{ fontSize: '32px' }}>{plan.name}</h3>
                <div style={{ fontSize: '48px', fontWeight: 700, margin: '20px 0' }}>{plan.price}<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>/mes</span></div>
                <ul style={{ listStyle: 'none', marginBottom: '40px' }}>
                  {plan.benefits.map(b => <li key={b} style={{ marginBottom: '10px' }}>✓ {b}</li>)}
                </ul>
                <button 
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`btn ${selectedPlan === plan.id ? 'btn--primary' : 'btn--outline'}`}
                  style={{ width: '100%' }}
                >
                  {selectedPlan === plan.id ? 'Plan seleccionado' : 'Seleccionar plan'}
                </button>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s var(--ease)' }}>
              <Link 
                href={`/inscripcion?sucursal=${branch.id}&plan=${selectedPlan}`} 
                className="btn btn--primary" 
                style={{ padding: '20px 60px', fontSize: '24px' }}
              >
                Continuar con la inscripción
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
