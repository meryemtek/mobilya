import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, ArrowRight, Sparkles, Building, Home, ShieldCheck } from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import type { ServiceItem } from '../../types';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultServices: ServiceItem[] = [
    {
      id: 1,
      title: 'Özel Mimari Tasarım & Modelleme',
      description: 'Mekanınızın ölçülerine ve kurumsal kimliğinize uygun 3D çizim ve mimari projelendirme hizmeti.',
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      title: 'Kurumsal Ofis & Toplu Donatı',
      description: 'Çalışma masaları, yönetici odaları, toplantı ve dinlenme alanları için ergonomik ve estetik toplu mobilya üretimi.',
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 3,
      title: 'Otel, Restoran & Cafe Projeleri',
      description: 'Yüksek kullanım yoğunluğuna uygun, estetik ve dayanıklı ağırlama sektörü mobilyaları.',
      sortOrder: 3,
      isPublished: true,
    },
    {
      id: 4,
      title: 'Lojistik, Teslimat & Profesyonel Montaj',
      description: 'Kendi lojistik ekibimizle Türkiye genelinde güvenli nakliye ve yerinde eksiksiz montaj.',
      sortOrder: 4,
      isPublished: true,
    },
  ];

  const items = services.length > 0 ? services : defaultServices;

  return (
    <>
      <SeoHead
        title="Hizmetlerimiz"
        description="Bozkurt Mobilya hizmetleri — özel tasarım, kurumsal projeler, otel donatıları, teslimat ve montaj."
      />

      {/* Hero Başlık */}
      <div style={{ backgroundColor: 'var(--color-primary-dark)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="section-badge" style={{ backgroundColor: 'rgba(197, 155, 39, 0.2)', color: 'var(--color-accent-light)' }}>
            Hizmet Yelpazemiz
          </span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            A'dan Z'ye Mobilya ve Mekan Çözümleri
          </h1>
          <p style={{ color: '#d6cfc7', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Tasarım aşamasından anahtar teslim montaja kadar tüm süreçte kurumsal çözüm ortağınız.
          </p>
        </div>
      </div>

      <div className="container section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {items.map((service, idx) => (
            <div key={service.id} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--color-accent-subtle)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <Layers size={30} />
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Hizmet 0{idx + 1}
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: 1.7, flexGrow: 1 }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bilgi Alma CTA */}
        <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Projenize Özel Fiyat ve Keşif Talebi</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Teknik şartnamenizi veya mekan bilgilerinizi bize iletin, uzman mimari kadromuz projenizi değerlendirsin.
          </p>
          <Link to="/iletisim" className="btn btn-primary btn-lg">
            Hemen İletişime Geçin <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </>
  );
};
