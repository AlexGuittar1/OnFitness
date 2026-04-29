"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const BRANCH_MAP: Record<string, string> = {
  "tlahuac-uuid": "On Fitness Tlahuac",
  "sucursal2-uuid": "On Fitness 2"
};

const PLAN_MAP: Record<string, any> = {
  "mensual": { name: "Plan Mensual", price: 449, description: "Acceso total flexible" },
  "anual": { name: "Plan Anual", price: 399, description: "Mejor valor garantizado" },
  "estudiante": { name: "Plan Estudiante", price: 349, description: "Especial para alumnos" }
};

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [loadingText, setLoadingText] = useState("Validando datos...");

  const sucursalId = searchParams.get("sucursal") || "tlahuac-uuid";
  const planId = searchParams.get("plan") || "mensual";

  const branchName = BRANCH_MAP[sucursalId] || "Sucursal seleccionada";
  const plan = PLAN_MAP[planId] || PLAN_MAP["mensual"];
  
  // Calculate total: if plan is anual, multiply by 12.
  const isAnual = planId === "anual";
  const totalHoy = isAnual ? plan.price * 12 : plan.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment sequence
    setTimeout(() => setLoadingText("Conectando con procesador de pagos..."), 1000);
    setTimeout(() => setLoadingText("Autorizando transacción..."), 2000);
    setTimeout(() => setStep('success'), 3500);
  };

  if (step === 'processing') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader" style={{ 
            width: '60px', height: '60px', border: '4px solid var(--border)', 
            borderTop: '4px solid var(--brand)', borderRadius: '50%', 
            margin: '0 auto 30px', animation: 'spin 1s linear infinite' 
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: '24px', color: 'white' }}>{loadingText}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>No cierres esta ventana</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="success-anim">
            <div className="check-circle">✓</div>
            <h1 style={{ fontSize: '56px', marginBottom: '20px' }}>¡BIENVENIDO A LA FAMILIA!</h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              Tu inscripción a <strong>{branchName}</strong> se ha completado con éxito. Hemos enviado los detalles a tu correo.
            </p>
            
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', textAlign: 'left', marginBottom: '40px' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Plan contratado</span>
                <p style={{ fontSize: '20px', fontWeight: 700 }}>{plan.name} — ${plan.price}/mes</p>
                {isAnual && <p style={{ fontSize: '14px', color: 'var(--brand)', marginTop: '5px' }}>Pago único por 12 meses: ${totalHoy}</p>}
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Estado de cuenta</span>
                <p style={{ fontSize: '18px', color: 'var(--success)', fontWeight: 600 }}>ACTIVO / PAGADO</p>
              </div>
            </div>

            <Link href="/" className="btn btn--primary" style={{ padding: '18px 60px' }}>
              Comenzar a entrenar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="form-grid">
          {/* Left: Modern Form */}
          <div>
            <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>DATOS PERSONALES</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Crea tu perfil de atleta para activar tu membresía.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nombre completo</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input type="text" placeholder="Como aparece en tu identificación" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Email personal</label>
                  <div className="input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input type="email" placeholder="ejemplo@correo.com" required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Teléfono móvil</label>
                  <div className="input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <input type="tel" placeholder="55 1234 5678" required />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Sexo</label>
                  <div className="input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <select required>
                      <option value="">Seleccionar...</option>
                      <option value="H">Hombre</option>
                      <option value="M">Mujer</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Fecha de nacimiento</label>
                  <div className="input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <input type="date" required />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '25px', background: 'var(--bg-elevated)', borderRadius: '15px' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '14px' }}>Preferencias de contacto</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked /> Quiero recibir notificaciones por Email
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked /> Quiero recibir alertas por SMS
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked /> Quiero estar en contacto vía WhatsApp
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '40px', padding: '20px', fontSize: '20px' }}>
                Continuar al pago
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="summary-card">
            <h2 style={{ fontSize: '24px', marginBottom: '25px' }}>RESUMEN DE COMPRA</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--brand-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '16px' }}>{branchName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tu centro de entrenamiento</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border)', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 700 }}>{plan.name}</span>
                <span style={{ color: 'var(--brand)', fontWeight: 800 }}>${plan.price}.00{isAnual ? '/mes' : ''}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{plan.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div className="summary-item">
                <span>Inscripción</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>GRATIS</span>
              </div>
              <div className="summary-item">
                <span>Mantenimiento</span>
                <span>$0.00</span>
              </div>
              <div className="summary-item">
                <span>{isAnual ? 'Pago Anual (12 Meses)' : 'Mensualidad'}</span>
                <span>${totalHoy}.00</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 800 }}>TOTAL HOY</span>
              <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)' }}>${totalHoy}.00</span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
              Transacción protegida con cifrado de 256 bits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
