import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Layers,
  Info,
  FileText,
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import { PlaceholderImage } from '../../components/common/PlaceholderImage';
import type { ProductDetail, ProductListItem, SiteSettings } from '../../types';

// Sayfa renk paleti (katalog ile uyumlu)
const COLOR = {
  accent: '#008779',
  accentDark: '#006f63',
  text: '#0f172a',
  body: '#334155',
  muted: '#64748b',
  border: '#e2e8f0',
  subtle: '#f8fafc',
  whatsapp: '#25D366',
};

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

// Açılır-kapanır bölüm (dropdown)
const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: `1px solid ${COLOR.border}` }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          fontSize: '0.975rem',
          fontWeight: 700,
          color: COLOR.text,
        }}
      >
        <span
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: 'rgba(0, 135, 121, 0.1)',
            color: COLOR.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span style={{ flex: 1 }}>{title}</span>
        <ChevronDown
          size={18}
          style={{
            color: COLOR.muted,
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </button>
      {open && <div style={{ paddingBottom: '1.25rem', paddingLeft: '2.75rem' }}>{children}</div>}
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    setError(false);

    publicApi.getProductBySlug(productSlug)
      .then((data) => {
        setProduct(data);
        setSelectedImageIndex(0);

        // İlgili benzer ürünleri getir (aynı kategoriden)
        if (data.categorySlug) {
          publicApi.getProducts({ category: data.categorySlug, pageSize: 4 })
            .then((res) => {
              setRelatedProducts(res.items.filter((item) => item.slug !== data.slug).slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));

    publicApi.getSiteSettings().then(setSettings).catch(() => {});
  }, [productSlug]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div
          style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: `3px solid ${COLOR.border}`,
            borderTopColor: COLOR.accent,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ marginTop: '1rem', color: COLOR.muted }}>Ürün detayları yükleniyor...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ fontSize: '1.6rem', color: COLOR.text, marginBottom: '0.75rem' }}>Ürün Bulunamadı</h2>
        <p style={{ color: COLOR.muted, marginBottom: '1.5rem' }}>
          Aradığınız ürün mevcut değil veya yayından kaldırılmış olabilir.
        </p>
        <Link
          to="/urunler"
          style={{
            display: 'inline-flex',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: COLOR.accent,
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          Ürün Kataloğuna Dön
        </Link>
      </div>
    );
  }

  // Galeri: kapak görseli önce, ardından tüm görseller; tekrar eden URL'ler ayıklanır
  const galleryUrls = Array.from(
    new Set(
      [product.coverImageUrl, ...(product.images ?? []).map((img) => img.url)].filter(
        (url): url is string => !!url
      )
    )
  );
  const galleryCount = galleryUrls.length;
  const currentImage = galleryUrls[selectedImageIndex] ?? product.coverImageUrl;

  const showPrevImage = () => setSelectedImageIndex((i) => (i - 1 + galleryCount) % galleryCount);
  const showNextImage = () => setSelectedImageIndex((i) => (i + 1) % galleryCount);

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || galleryCount < 2) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) showNextImage();
      else showPrevImage();
    }
    touchStartX.current = null;
  };

  const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    [side]: '12px',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    color: COLOR.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
    zIndex: 2,
  });

  // JSON Alanlarını Ayrıştırma
  let specsObj: Record<string, string> = {};
  if (product.specifications) {
    try {
      specsObj = JSON.parse(product.specifications);
    } catch {
      // JSON değilse düz metin olarak ele al
    }
  }

  let dimensionsObj: { width?: number; height?: number; depth?: number; unit?: string } = {};
  if (product.dimensions) {
    try {
      dimensionsObj = JSON.parse(product.dimensions);
    } catch {}
  }

  const dimensionTiles = [
    { label: 'Genişlik', value: dimensionsObj.width },
    { label: 'Yükseklik', value: dimensionsObj.height },
    { label: 'Derinlik', value: dimensionsObj.depth },
  ].filter((d) => d.value);
  const hasDimensions = dimensionTiles.length > 0;
  const hasSpecs = Object.keys(specsObj).length > 0;

  const whatsapp = settings.WhatsApp || '905550000000';
  const waText = encodeURIComponent(
    `Merhaba, "${product.name}" (Kod: ${product.productCode || 'Belirtilmedi'}) ürünü hakkında bilgi ve teklif almak istiyorum.`
  );
  const waUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${waText}`;

  return (
    <>
      <SeoHead
        title={product.metaTitle || product.name}
        description={
          product.metaDescription ||
          product.shortDescription ||
          `${product.name} modelimiz hakkında detaylı bilgi, ölçüler ve özellikler.`
        }
        ogImage={currentImage}
      />

      {/* Breadcrumb */}
      <div style={{ backgroundColor: COLOR.subtle, padding: '0.9rem 0', borderBottom: `1px solid ${COLOR.border}` }}>
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.85rem',
            color: COLOR.muted,
            flexWrap: 'wrap',
          }}
        >
          <Link to="/" style={{ color: COLOR.muted }}>Ana Sayfa</Link>
          <span>/</span>
          <Link to="/urunler" style={{ color: COLOR.muted }}>Ürünler</Link>
          <span>/</span>
          <Link to={`/urunler/${product.categorySlug}`} style={{ color: COLOR.muted }}>
            {product.categoryName}
          </Link>
          <span>/</span>
          <span style={{ color: COLOR.accent, fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 0 4rem' }}>
        {/* Üst Bölüm: Galeri + Bilgi */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Sol: Görsel Galerisi */}
          <div>
            {/* Ana Görsel Alanı (kaydırma, oklar ve noktalar) */}
            <div
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={handleTouchEnd}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: COLOR.subtle,
                aspectRatio: '4 / 3',
                position: 'relative',
                border: `1px solid ${COLOR.border}`,
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                marginBottom: '1rem',
              }}
            >
              {currentImage ? (
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.name} - ${selectedImageIndex + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <PlaceholderImage text={product.name} />
              )}

              {galleryCount > 1 && (
                <>
                  <button type="button" onClick={showPrevImage} aria-label="Önceki görsel" style={arrowStyle('left')}>
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={showNextImage} aria-label="Sonraki görsel" style={arrowStyle('right')}>
                    <ChevronRight size={20} />
                  </button>

                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {selectedImageIndex + 1} / {galleryCount}
                  </span>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '6px',
                      zIndex: 2,
                    }}
                  >
                    {galleryUrls.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        aria-label={`${idx + 1}. görsele git`}
                        style={{
                          width: idx === selectedImageIndex ? '22px' : '8px',
                          height: '8px',
                          borderRadius: '999px',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          backgroundColor: idx === selectedImageIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.25s ease',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {galleryCount > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {galleryUrls.map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`${idx + 1}. görseli göster`}
                    style={{
                      width: '78px',
                      height: '78px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? `2px solid ${COLOR.accent}` : `1px solid ${COLOR.border}`,
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: selectedImageIndex === idx ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                    }}
                  >
                    <img src={url} alt={`${product.name} - ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ: Ürün Bilgileri */}
          <div>
            <span
              style={{
                display: 'inline-block',
                color: COLOR.accent,
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.6rem',
              }}
            >
              {product.categoryName}
            </span>

            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: COLOR.text,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                margin: '0 0 0.75rem 0',
              }}
            >
              {product.name}
            </h1>

            {product.productCode && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: COLOR.subtle,
                  border: `1px solid ${COLOR.border}`,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: COLOR.muted,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  marginBottom: '1.25rem',
                }}
              >
                Kod: {product.productCode}
              </span>
            )}

            {product.shortDescription && (
              <p style={{ fontSize: '1rem', color: COLOR.muted, lineHeight: 1.7, margin: '0 0 1.5rem 0' }}>
                {product.shortDescription}
              </p>
            )}

            {/* Dropdown Bölümler */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${COLOR.border}`,
                borderRadius: '14px',
                padding: '0 1.25rem',
              }}
            >
              {product.description && (
                <AccordionItem title="Ürün Detayları" icon={<FileText size={17} />} defaultOpen>
                  <p style={{ whiteSpace: 'pre-line', fontSize: '0.92rem', color: COLOR.body, lineHeight: 1.75, margin: 0 }}>
                    {product.description}
                  </p>
                </AccordionItem>
              )}

              {hasDimensions && (
                <AccordionItem title="Ölçüler ve Boyutlar" icon={<Maximize2 size={17} />} defaultOpen={!product.description}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.6rem' }}>
                    {dimensionTiles.map((d) => (
                      <div
                        key={d.label}
                        style={{
                          backgroundColor: COLOR.subtle,
                          border: `1px solid ${COLOR.border}`,
                          borderRadius: '10px',
                          padding: '0.7rem',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: COLOR.muted, marginBottom: '0.2rem' }}>{d.label}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: COLOR.text }}>
                          {d.value} {dimensionsObj.unit || 'cm'}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              )}

              {(product.materials || product.colorOptions) && (
                <AccordionItem title="Malzeme & Renk Seçenekleri" icon={<Layers size={17} />}>
                  {product.materials && (
                    <p style={{ fontSize: '0.92rem', color: COLOR.body, margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: COLOR.text }}>Malzeme:</strong> {product.materials}
                    </p>
                  )}
                  {product.colorOptions && (
                    <p style={{ fontSize: '0.92rem', color: COLOR.body, margin: 0 }}>
                      <strong style={{ color: COLOR.text }}>Renkler:</strong> {product.colorOptions}
                    </p>
                  )}
                </AccordionItem>
              )}

              {hasSpecs && (
                <AccordionItem title="Teknik Özellikler" icon={<Info size={17} />}>
                  <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                    {Object.entries(specsObj).map(([key, val], idx, arr) => (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          padding: '0.6rem 0.9rem',
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : COLOR.subtle,
                          fontSize: '0.875rem',
                          borderBottom: idx === arr.length - 1 ? 'none' : `1px solid ${COLOR.border}`,
                        }}
                      >
                        <span style={{ width: '40%', fontWeight: 600, color: COLOR.text }}>{key}</span>
                        <span style={{ width: '60%', color: COLOR.muted }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              )}
            </div>
            {/* Teklif CTA Kartı */}
            <div
              style={{
                backgroundColor: COLOR.subtle,
                padding: '1.25rem 1.35rem',
                borderRadius: '14px',
                border: `1px solid ${COLOR.border}`,
                marginTop: '1.5rem',
              }}
            >
              <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: COLOR.text, margin: '0 0 0.35rem 0' }}>
                Fiyat & Proje Bilgisi Alın
              </h4>
              <p style={{ fontSize: '0.85rem', color: COLOR.muted, margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                Müşteri temsilcimizle hemen iletişime geçerek bu ürün için teklif alabilirsiniz.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: '1 1 200px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: COLOR.whatsapp,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  <MessageCircle size={18} />
                  WhatsApp ile Bilgi Alın
                </a>
                <button
                  type="button"
                  onClick={() =>
                    navigate('/iletisim', { state: { productInterest: product.name, productCode: product.productCode } })
                  }
                  style={{
                    flex: '1 1 200px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: COLOR.accent,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <FileText size={18} />
                  Teklif Formu Doldur
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Geri Dön */}
        <div style={{ marginTop: '3rem' }}>
          <Link
            to={`/urunler/${product.categorySlug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: COLOR.accent,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={16} />
            {product.categoryName} koleksiyonuna dön
          </Link>
        </div>

        {/* Benzer Ürünler */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: `1px solid ${COLOR.border}` }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLOR.text, margin: '0 0 1.75rem 0' }}>
              Benzer Modeller
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {relatedProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-card-img-wrap">
                    {p.coverImageUrl ? (
                      <img src={p.coverImageUrl} alt={p.name} className="product-card-img" />
                    ) : (
                      <PlaceholderImage text={p.name} />
                    )}
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-category">{p.categoryName}</span>
                    <h3 className="product-card-title">{p.name}</h3>
                    <div className="product-card-footer">
                      <Link
                        to={`/urunler/${p.categorySlug}/${p.slug}`}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%' }}
                      >
                        İncele →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
