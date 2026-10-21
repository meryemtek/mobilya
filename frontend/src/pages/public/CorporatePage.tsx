import React, { useEffect, useState } from 'react';
import { ShieldCheck, Factory, CheckCircle, FileCheck, Layers } from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import type { PageContent } from '../../types';

export const CorporatePage: React.FC = () => {
  const [page, setPage] = useState<PageContent | null>(null);

  useEffect(() => {
    publicApi.getPageBySlug('kurumsal').then(setPage).catch(() => {});
  }, []);

  return (
    <>
      <SeoHead
        title={page?.metaTitle || 'Kurumsal'}
        description={page?.metaDescription || 'Bozkurt Mobilya kurumsal yapısı, üretim kapasitesi, kalite belgeleri ve standartları.'}
      />

      {/* Hero Başlık */}
      <div style={{ backgroundColor: 'var(--color-primary-dark)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="section-badge" style={{ backgroundColor: 'rgba(197, 155, 39, 0.2)', color: 'var(--color-accent-light)' }}>
            Kurumsal Kimlik
          </span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            {page?.title || 'Üretim Gücü ve Kurumsal Çözüm Ortaklığı'}
          </h1>
          <p style={{ color: '#d6cfc7', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Yüksek üretim standartları, güçlü tedarik ağı ve kurumsal projelere özel mimari çözümler.
          </p>
        </div>
      </div>

      <div className="container section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            marginBottom: '4rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Üretim & Kalite Standartlarımız</h2>
            
            {page?.content ? (
              <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
                {page.content}
              </div>
            ) : (
              <>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Bozkurt Mobilya, modern makine parkuru ve tecrübeli usta kadrosuyla yüksek kapasiteli kurumsal projelere hız ve kalite kazandırmaktadır.
                </p>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Otel, ofis, restoran ve toplu konut projelerinde mimari ekiplerle koordineli çalışarak, şartnamelere birebir uygun malzeme seçimi ve zamanında teslimat garantisi sunmaktayız.
                </p>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color="var(--color-accent)" />
                <span style={{ fontWeight: 600 }}>TSE ve Avrupa Standartlarına Uygun Üretim</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color="var(--color-accent)" />
                <span style={{ fontWeight: 600 }}>Çevreye Duyarlı ve Sürdürülebilir Hammadde</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color="var(--color-accent)" />
                <span style={{ fontWeight: 600 }}>Özel Ölçü ve 3 Boyutlu Modelleme Desteği</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--color-bg-subtle)' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileCheck size={24} color="var(--color-accent)" /> Kalite ve Uygunluk Belgeleri
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Tüm ürünlerimizde kullanılan ahşap, sünger, kumaş ve metal aksesuarlar uluslararası dayanıklılık testlerinden geçmiş sertifikalı bileşenlerdir.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>ISO 9001</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Kalite Yönetim</span>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>E1 Normu</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Çevre & Sağlık</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
