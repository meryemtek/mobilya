import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import type { PageContent } from '../../types';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const slug = location.pathname.replace('/', '') || 'gizlilik-politikasi';

  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi.getPageBySlug(slug)
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const defaultTitles: Record<string, string> = {
    'gizlilik-politikasi': 'Gizlilik Politikası',
    'kvkk': 'KVKK Aydınlatma Metni',
    'cerez-politikasi': 'Çerez Politikası',
  };

  const defaultTitle = defaultTitles[slug] || 'Yasal Bilgilendirme';

  return (
    <>
      <SeoHead
        title={page?.metaTitle || page?.title || defaultTitle}
        description={page?.metaDescription || `Bozkurt Mobilya ${defaultTitle} ve bilgilendirmesi.`}
      />

      <div style={{ backgroundColor: 'var(--color-primary-dark)', color: '#fff', padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '2.2rem' }}>{page?.title || defaultTitle}</h1>
          <span style={{ fontSize: '0.8125rem', color: '#c5bfb9', marginTop: '0.5rem', display: 'block' }}>
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', padding: '3rem', lineHeight: 1.8 }}>
          {page?.content ? (
            <div style={{ whiteSpace: 'pre-line' }}>{page.content}</div>
          ) : (
            <div>
              <p style={{ marginBottom: '1.5rem' }}>
                İşbu <strong>{defaultTitle}</strong>, Bozkurt Mobilya tarafından ziyaretçilerimizin ve müşterilerimizin kişisel verilerinin korunması, gizliliğinin sağlanması ve yasal haklarının korunması amacıyla hazırlanmıştır.
              </p>

              <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '0.75rem' }}>1. Veri Sorumlusu</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Bozkurt Mobilya olarak veri sorumlusu sıfatıyla tarafımıza ilettiğiniz kimlik, iletişim ve talep verilerinizi kanuna uygun olarak işlemekteyiz.
              </p>

              <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '0.75rem' }}>2. Verilerin İşlenme Amacı</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Web sitemizdeki iletişim formları ve hızlı danışma kanalları üzerinden paylaştığınız bilgiler yalnızca ürünlerimiz hakkında teklif sunmak, taleplerinizi yanıtlamak ve müşteri memnuniyeti sağlamak amacıyla işlenir.
              </p>

              <h3 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '0.75rem' }}>3. Haklarınız</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                KVKK'nın 11. maddesi kapsamında dilediğiniz zaman firmamıza başvurarak verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz.
              </p>

              <div style={{ marginTop: '2.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                * Not: Bu metin bilgilendirme amaçlı şablon olup, yönetim paneli üzerinden dilediğiniz zaman işletmenize özel hukuki metinlerle güncellenebilir.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
