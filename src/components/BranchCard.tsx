import Link from "next/link";

interface BranchCardProps {
  id: string;
  name: string;
  image: string;
  slug: string;
  mapLink: string;
}

export function BranchCard({ id, name, image, slug, mapLink }: BranchCardProps) {
  return (
    <div className="branch-card">
      <div className="branch-card__img-container">
        <img src={image} alt={name} className="branch-card__img" />
      </div>
      <div className="branch-card__body">
        <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>{name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="btn btn--outline" style={{ width: '100%', fontSize: '16px' }}>
            Ver ubicación
          </a>
          <button className="btn btn--ghost" style={{ width: '100%', fontSize: '14px', border: '1px solid var(--border)' }}>
            Contacto
          </button>
          <Link href={`/inscripcion?sucursal=${id}`} className="btn btn--primary" style={{ width: '100%', fontSize: '16px' }}>
            Inscribirme
          </Link>
        </div>
      </div>
    </div>
  );
}
