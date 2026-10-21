import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Target, Clock, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import type { PageContent } from '../../types';

export const AboutPage: React.FC = () => {
  const [page, setPage] = useState<PageContent | null>(null);

  useEffect(() => {
    publicApi.getPageBySlug('hakkimizda').then(setPage).catch(() => {});
  }, []);

  return (
    <>
      <SeoHead
        title={page?.metaTitle || 'Hakkımızda'}
        description={page?.metaDescription || 'ABC Mobilya hakkında — köklü üretim deneyimi, değerlerimiz, kalite politikamız ve vizyonumuz.'}
      />

      {/* Hero Başlık */}
      <div style={{ backgroundColor: 'var(--color-primary-dark)', color: '#fff', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="section-badge" style={{ backgroundColor: 'rgba(197, 155, 39, 0.2)', color: 'var(--color-accent-light)' }}>
            Kurumsal Hikayemiz
          </span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
            {page?.title || 'Mobilya Sanatında Güven ve Ustalık'}
          </h1>
          <p style={{ color: '#d6cfc7', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Geçmişten gelen el işçiliği mirasını, modern teknolojinin hassasiyetiyle birleştirerek yaşam alanlarınızı dönüştürüyoruz.
          </p>
        </div>
      </div>

      {/* Ana Hikaye & Görsel */}
      <div className="container section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            marginBottom: '5rem',
          }}
        >
          <div>
            <span className="section-badge">Biz Kimiz?</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', lineHeight: 1.25 }}>
              Detaylara Verilen Özen, Mekanlara Yansıyan Estetik
            </h2>
            
            {page?.content ? (
              <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
                {page.content}
              </div>
            ) : (
              <>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  ABC Mobilya olarak, kurulduğumuz ilk günden bu yana ahşabın sıcaklığını ve dayanıklılığını modern tasarım anlayışıyla harmanlamayı hedefledik. Kaliteli hammadde, titiz işçilik ve müşteri memnuniyeti ilkelerimizle sektörde güven veren bir marka konumuna ulaştık.
                </p>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Yalnızca mobilya üretmiyor; konforlu, işlevsel ve zamana meydan okuyan mekanlar tasarlıyoruz. Kurumsal ofislerden lüks konutlara, otel projelerinden özel siparişlere kadar geniş bir yelpazede hizmet sunmaktayız.
                </p>
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)', display: 'block' }}>%100</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Müşteri Memnuniyeti</span>
              </div>
              <div style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)', display: 'block' }}>1. Sınıf</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sertifikalı Hammadde</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80"
                alt="ABC Mobilya Atölye ve İşçilik"
                style={{ width: '100%', height: '460px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <div className="section-title-wrap">
            <span className="section-badge">İlkelerimiz</span>
            <h2 className="section-title">Temel Değerlerimiz</h2>
            <p className="section-desc">Her projemize ve ürünümüze yön veren vazgeçilmez prensiplerimiz.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="card">
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                <Award size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Ödünsüz Kalite</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Üretimin her aşamasında en yüksek dayanıklılık ve estetik standartlarına bağlı kalırız.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                <Target size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>İnovasyon & Tasarım</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Dünya trendlerini takip eder, ergonomiyi estetikle harmanlayan yenilikçi modeller geliştiririz.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                <HeartHandshake size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Şeffaf İletişim</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Müşterilerimizle projelendirmeden teslimata kadar dürüst ve sürekli iletişim halinde oluruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
