import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Layers,
  Eye,
  Truck,
  ShieldCheck,
  Compass,
  CreditCard,
  Star,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import type { Banner, Category, ProductListItem } from '../../types';

interface ShowcaseItem {
  id: number;
  name: string;
  categoryName: string;
  categorySlug: string;
  slug: string;
  imageUrl: string;
  price: string;
  oldPrice?: string;
  badgeText?: string;
  badgeType?: 'teal' | 'gold';
  hasCompare?: boolean;
}

// Görseldeki ve popüler ürünleri içeren zengin varsayılan vitrin ürünleri
const DEFAULT_NEW_PRODUCTS: ShowcaseItem[] = [
  {
    id: 101,
    name: 'Siena Yatak Odası Takımı',
    categoryName: 'Yatak Odası',
    categorySlug: 'yatak-odasi',
    slug: 'siena-yatak-odasi-takimi',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    price: '62.990,00 TL',
    badgeText: 'Yeni Ürün',
    badgeType: 'teal',
  },
  {
    id: 102,
    name: 'Siena Koltuk Takımı',
    categoryName: 'Oturma Grupları',
    categorySlug: 'oturma-gruplari',
    slug: 'siena-koltuk-takimi',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    price: '39.745,00 TL',
    badgeText: 'Lansmana Özel Fiyat',
    badgeType: 'gold',
  },
  {
    id: 103,
    name: 'Woody Mutfak Masa Takımı',
    categoryName: 'Yemek Odası',
    categorySlug: 'yemek-odasi',
    slug: 'woody-mutfak-masa-takimi',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    price: '24.990,00 TL',
    badgeText: 'Yeni Ürün',
    badgeType: 'teal',
    hasCompare: true,
  },
  {
    id: 104,
    name: 'Flat Portmanto',
    categoryName: 'Tamamlayıcı Ürünler',
    categorySlug: 'tamamlayici-urunler',
    slug: 'flat-portmanto',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    price: '27.580,00 TL',
    badgeText: 'Yeni Ürün',
    badgeType: 'teal',
  },
  {
    id: 105,
    name: 'Milano Yemek Odası Takımı',
    categoryName: 'Yemek Odası',
    categorySlug: 'yemek-odasi',
    slug: 'milano-yemek-odasi-takimi',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    price: '48.850,00 TL',
    oldPrice: '56.000,00 TL',
    badgeText: 'Yeni Ürün',
    badgeType: 'teal',
  },
  {
    id: 106,
    name: 'Alesta Modern Köşe Takımı',
    categoryName: 'Oturma Grupları',
    categorySlug: 'oturma-gruplari',
    slug: 'alesta-modern-kose-takimi',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    price: '34.900,00 TL',
    badgeText: 'Lansmana Özel Fiyat',
    badgeType: 'gold',
  },
];

const DEFAULT_BEST_SELLERS: ShowcaseItem[] = [
  {
    id: 201,
    name: 'Palermo Doğal Ahşap Konsol',
    categoryName: 'Yemek Odası',
    categorySlug: 'yemek-odasi',
    slug: 'palermo-ahsap-konsol',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    price: '21.450,00 TL',
    badgeText: 'Çok Satan',
    badgeType: 'teal',
  },
  {
    id: 202,
    name: 'Luna Ortopedik Baza & Başlık',
    categoryName: 'Baza & Başlık',
    categorySlug: 'baza-baslik',
    slug: 'luna-ortopedik-baza-baslik',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    price: '18.990,00 TL',
    badgeText: 'Çok Satan',
    badgeType: 'teal',
    hasCompare: true,
  },
  {
    id: 203,
    name: 'Capri Rattan Bahçe Oturma Grubu',
    categoryName: 'Bahçe Mobilyası',
    categorySlug: 'bahce-mobilyasi',
    slug: 'capri-bahce-oturma-grubu',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    price: '31.250,00 TL',
    oldPrice: '38.000,00 TL',
    badgeText: 'Fırsat',
    badgeType: 'gold',
  },
  {
    id: 204,
    name: 'Aura Modern Dinlenme Berjeri',
    categoryName: 'Oturma Grupları',
    categorySlug: 'oturma-gruplari',
    slug: 'aura-dinlenme-berjeri',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    price: '14.800,00 TL',
    badgeText: 'Çok Satan',
    badgeType: 'teal',
  },
];

export const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setFeaturedProducts] = useState<ProductListItem[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Sekmeli vitrin durumu (Yeni Ürünler / En Çok Satanlar)
  const [activeTab, setActiveTab] = useState<'yeni' | 'cok-satan'>('yeni');
  const [sliderIndex, setSliderIndex] = useState(0);

  // Favoriler & Karşılaştırma interaktif durumları
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compared, setCompared] = useState<number[]>([]);

  const [showcaseNew, setShowcaseNew] = useState<ShowcaseItem[]>(DEFAULT_NEW_PRODUCTS);
  const [showcaseBest, setShowcaseBest] = useState<ShowcaseItem[]>(DEFAULT_BEST_SELLERS);

  useEffect(() => {
    publicApi.getBanners().then((data) => {
      setBanners(data.filter((b) => b.isPublished).sort((a, b) => a.sortOrder - b.sortOrder));
    }).catch(() => {});

    publicApi.getCategories().then((data) => {
      setCategories(data.filter((c) => !c.parentCategoryId).slice(0, 8));
    }).catch(() => {});

    publicApi.getProducts({ page: 1, pageSize: 8, featured: true }).then((res) => {
      setFeaturedProducts(res.items);
    }).catch(() => {});

    // Dinamik vitrin (Yeni Ürünler & En Çok Satanlar)
    publicApi.getShowcase().then((data) => {
      if (data.newProducts && data.newProducts.length > 0) {
        setShowcaseNew(data.newProducts as ShowcaseItem[]);
      }
      if (data.bestSellers && data.bestSellers.length > 0) {
        setShowcaseBest(data.bestSellers as ShowcaseItem[]);
      }
    }).catch(() => {});
  }, []);

  const defaultBanners: Banner[] = banners.length > 0 ? banners : [
    {
      id: 1,
      title: 'Zarif Yaşam Alanları',
      subtitle: 'Doğal ahşap dokular ve modern çizgilerle evinizi yeniden keşfedin.',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80',
      buttonText: 'Koleksiyonu İncele',
      buttonLink: '/urunler',
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      title: '2026 Salon Trendleri',
      subtitle: 'Konforu estetikle buluşturan özel tasarım oturma grupları.',
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80',
      buttonText: 'Oturma Gruplarını Gör',
      buttonLink: '/urunler/oturma-gruplari',
      sortOrder: 2,
      isPublished: true,
    },
  ];

  useEffect(() => {
    if (defaultBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % defaultBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [defaultBanners.length]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompared((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentProducts = activeTab === 'yeni' ? showcaseNew : showcaseBest;
  const visibleProductsCount = 4;
  const maxSliderIndex = Math.max(0, currentProducts.length - visibleProductsCount);

  const handleNextSlide = () => {
    setSliderIndex((prev) => (prev >= maxSliderIndex ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setSliderIndex((prev) => (prev <= 0 ? maxSliderIndex : prev - 1));
  };

  const displayedProducts = currentProducts.slice(sliderIndex, sliderIndex + visibleProductsCount);
  // Eğer sona geldiyse ve 4'ten azsa baştan tamamla
  const finalDisplay = displayedProducts.length < visibleProductsCount && currentProducts.length >= visibleProductsCount
    ? [...displayedProducts, ...currentProducts.slice(0, visibleProductsCount - displayedProducts.length)]
    : displayedProducts;

  return (
    <>
      <SeoHead
        title="Ana Sayfa | ABC Mobilya & Tasarım"
        description="Aydınlık, ferah ve modern mobilya çözümleri. Oturma grupları, yemek odaları, yatak odaları ve tamamlayıcı mobilyalar."
      />


      {/* 2. Hero Slider (Gelişmiş & Animasyonlu) */}
      <section className="hero-slider">
        {defaultBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            <div className="slide-overlay"></div>
            <div className="container slide-content">
              {/* <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '30px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                <Sparkles size={16} color="#fbbf24" />
                <span>2026 Yeni Sezon Tasarımları</span>
              </div> */}
              <h1 className="slide-title">{banner.title}</h1>
              {banner.subtitle && <p className="slide-subtitle">{banner.subtitle}</p>}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                <Link to={banner.buttonLink || '/urunler'} className="btn btn-primary btn-lg">
                  {banner.buttonText || 'Keşfet'} <ArrowRight size={18} />
                </Link>
                <Link to="/iletisim" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff' }}>
                  Fiyat Teklifi Al
                </Link>
              </div>
            </div>
          </div>
        ))}
        {defaultBanners.length > 1 && (
          <>
            <button
              className="slider-btn prev"
              onClick={() => setActiveSlide((p) => (p - 1 + defaultBanners.length) % defaultBanners.length)}
              aria-label="Önceki Slayt"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="slider-btn next"
              onClick={() => setActiveSlide((p) => (p + 1) % defaultBanners.length)}
              aria-label="Sonraki Slayt"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </section>

      {/* 3. GÖRSELDEKİ VİTRİN: Yeni Ürünler & En Çok Satanlar Sekmeli Slider */}
      <section className="showcase-section">
        <div className="container">
          {/* Sekme Başlıkları */}
          <div className="showcase-tabs-container">
            <button
              className={`showcase-tab-btn ${activeTab === 'yeni' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('yeni');
                setSliderIndex(0);
              }}
            >
              <strong className="tab-accent">Yeni</strong> Ürünler
            </button>
            <button
              className={`showcase-tab-btn ${activeTab === 'cok-satan' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('cok-satan');
                setSliderIndex(0);
              }}
            >
              <strong>En Çok</strong> Satanlar
            </button>
          </div>

          {/* Slider Kapsayıcısı */}
          <div className="showcase-slider-wrapper">
            <button
              className="slider-nav-btn prev"
              onClick={handlePrevSlide}
              aria-label="Önceki Ürünler"
            >
              <ChevronLeft size={22} />
            </button>

            {/* 4'lü Ürün Satırı */}
            <div className="showcase-products-row">
              {finalDisplay.map((item) => {
                const isFav = favorites.includes(item.id);
                const isComp = compared.includes(item.id);
                return (
                  <div key={item.id} className="modern-product-card">
                    {/* Görsel Alanı ve Hover Animasyonları */}
                    <div className="product-visual-box">
                      <Link to={`/urunler/${item.categorySlug}/${item.slug}`}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="product-visual-img"
                        />
                      </Link>

                      {/* Sol Üst Rozet */}
                      {item.badgeText && (
                        <span className={`card-badge-tag ${item.badgeType === 'gold' ? 'badge-gold' : 'badge-teal'}`}>
                          {item.badgeText}
                        </span>
                      )}

                      {/* Sağ Üst Favori Kalp */}
                      <button
                        className={`card-fav-btn ${isFav ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.id)}
                        aria-label="Favorilere Ekle"
                        title={isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                      >
                        <Heart size={18} fill={isFav ? '#ef4444' : 'none'} />
                      </button>

                      {/* Sol Alt Karşılaştır Butonu */}
                      {item.hasCompare && (
                        <button
                          className="card-compare-pill"
                          onClick={() => toggleCompare(item.id)}
                          style={isComp ? { backgroundColor: '#008779', color: '#fff', borderColor: '#008779' } : undefined}
                          title="Ürünleri Karşılaştır"
                        >
                          <Layers size={14} />
                          <span>{isComp ? 'Karşılaştırılıyor' : 'Karşılaştır'}</span>
                        </button>
                      )}

                      {/* Hover Eylem Çubuğu */}
                      <div className="card-hover-actions">
                        <Link to={`/urunler/${item.categorySlug}/${item.slug}`} className="quick-view-btn">
                          <Eye size={15} /> İncele
                        </Link>
                      </div>
                    </div>

                    {/* Ürün Bilgisi */}
                    <div className="modern-product-info">
                      <h3 className="modern-product-title">
                        <Link to={`/urunler/${item.categorySlug}/${item.slug}`}>
                          {item.name}
                        </Link>
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.oldPrice && (
                          <span className="modern-old-price">{item.oldPrice}</span>
                        )}
                        <span className="modern-product-price">{item.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="slider-nav-btn next"
              onClick={handleNextSlide}
              aria-label="Sonraki Ürünler"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. YAŞAM ALANLARI / ODA KONSEPTLERİ (Lookbook) */}
      <section className="concepts-section">
        <div className="container">
          <div className="section-header center" style={{ marginBottom: '2.5rem' }}>
            <span style={{ color: '#008779', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              İlham Veren Odalar
            </span>
            <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Eviniz İçin Yaşam Alanları</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Tarzınıza uygun parçaları bir araya getirdik. Yaşam alanlarınızı baştan sona dekore edin.
            </p>
          </div>

          <div className="concepts-grid">
            <Link to="/urunler/oturma-gruplari" className="concept-card">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                alt="Salon ve Oturma Odası"
                className="concept-img"
              />
              <div className="concept-overlay">
                <span className="concept-tag">Konfor & Estetik</span>
                <h3 className="concept-title">Salon & Oturma Odası</h3>
                <span className="concept-link-btn">
                  Koleksiyonu Keşfet <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link to="/urunler/yemek-odasi" className="concept-card">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
                alt="Yemek Alanları"
                className="concept-img"
              />
              <div className="concept-overlay">
                <span className="concept-tag">Sıcak Sofralar</span>
                <h3 className="concept-title">Yemek Odası Trendleri</h3>
                <span className="concept-link-btn">
                  Koleksiyonu Keşfet <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <Link to="/urunler/yatak-odasi" className="concept-card">
              <img
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"
                alt="Huzurlu Uykular"
                className="concept-img"
              />
              <div className="concept-overlay">
                <span className="concept-tag">Dinginlik & Zarafet</span>
                <h3 className="concept-title">Yatak Odası Zarafeti</h3>
                <span className="concept-link-btn">
                  Koleksiyonu Keşfet <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. ÖZEL KAMPANYA & FIRSAT BANNERI */}
      <section className="deal-section">
        <div className="container deal-container">
          <div>
            <span className="deal-tag">Sezon Sonu Fırsatları</span>
            <h2 className="deal-title">Seçili Koleksiyonlarda %35'e Varan İndirim</h2>
            <p className="deal-desc">
              Doğal masif ahşap işçiliği ve zamansız tasarım çizgileriyle üretilen ABC Mobilya modelleri şimdi sınırlı süre için avantajlı fiyatlarla.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/urunler/indirimli-urunler" className="btn btn-primary btn-lg">
                Fırsat Ürünlerini İncele <ArrowRight size={18} />
              </Link>
              <Link to="/iletisim" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                Mağazayı Ziyaret Et
              </Link>
            </div>
          </div>
          <div className="deal-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
              alt="Kampanyalı Mobilyalar"
              className="deal-img"
            />
          </div>
        </div>
      </section>

      {/* 6. NEDEN ABC MOBİLYA? (Kurumsal Güven & Ayrıcalıklar) */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <Truck size={24} />
              </div>
              <div>
                <h4>Ücretsiz Teslimat & Montaj</h4>
                <p>Türkiye geneli sigortalı nakliye ve alanında uzman montaj ekibi desteği.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4>2 Yıl Garanti & Destek</h4>
                <p>1. sınıf fırınlanmış gürgen iskelet ve leke tutmayan ithal kumaş garantisi.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Compass size={24} />
              </div>
              <div>
                <h4>İç Mimarlık Danışmanlığı</h4>
                <p>Evinizin ölçülerine özel 3 boyutlu planlama ve ücretsiz renk danışmanlığı.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <CreditCard size={24} />
              </div>
              <div>
                <h4>Taksit & Güvenli Ödeme</h4>
                <p>Tüm kredi kartlarına vade farksız taksit imkanları ve esnek ödeme planı.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MÜŞTERİ YORUMLARI & SOSYAL KANIT (İsteğe bağlı olarak gizlendi) */}
      {/*
      <section className="reviews-section">
        <div className="container">
          <div className="section-header center" style={{ marginBottom: '3rem' }}>
            <span style={{ color: '#008779', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Müşteri Deneyimleri
            </span>
            <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Evinizde Mutluluk Yaratan Hikayeler</h2>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="review-text">
                "Siena Yatak Odası takımını 2 ay önce aldık. Ahşap kalitesi, menteşelerin yumuşaklığı ve teslimat ekibinin ilgisi kusursuzdu. Herkese tavsiye ederim."
              </p>
              <div className="review-author">
                <div className="review-avatar">EA</div>
                <div>
                  <div className="review-author-name">Elif & Ahmet Yılmaz</div>
                  <div className="review-author-info">
                    <CheckCircle2 size={13} color="#008779" style={{ display: 'inline', marginRight: '4px' }} />
                    Doğrulanmış Alıcı · İstanbul
                  </div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="review-text">
                "Salonumuz için koltuk takımı ve yemek masası siparişi verdik. Kumaş dokusu beklediğimden de kaliteli geldi. Özel ölçü konusunda çok yardımcı oldular."
              </p>
              <div className="review-author">
                <div className="review-avatar">MD</div>
                <div>
                  <div className="review-author-name">Murat Demir</div>
                  <div className="review-author-info">
                    <CheckCircle2 size={13} color="#008779" style={{ display: 'inline', marginRight: '4px' }} />
                    Doğrulanmış Alıcı · Ankara
                  </div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="review-text">
                "Hem şık hem de inanılmaz dayanıklı. Fiyat/performans olarak piyasadaki birçok ünlü markanın çok üzerinde. ABC Mobilya ekibine teşekkürler!"
              </p>
              <div className="review-author">
                <div className="review-avatar">SK</div>
                <div>
                  <div className="review-author-name">Selin Kaya</div>
                  <div className="review-author-info">
                    <CheckCircle2 size={13} color="#008779" style={{ display: 'inline', marginRight: '4px' }} />
                    Doğrulanmış Alıcı · İzmir
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* 8. SHOWROOM & İLHAM GALERİSİ */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header center" style={{ marginBottom: '2.5rem' }}>
            <span style={{ color: '#008779', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              #ABCMobilya
            </span>
            <h2 className="section-title" style={{ marginTop: '0.5rem' }}>İlham Veren Yaşam Köşeleri</h2>
            <p style={{ color: '#64748b' }}>Müşterilerimizin evlerinden ve showroomumuzdan kareler.</p>
          </div>

          <div className="gallery-grid">
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
                alt="İlham 1"
                className="gallery-img"
              />
              <div className="gallery-hover-overlay">
                <Eye size={24} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>@abcmobilyademo</span>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                alt="İlham 2"
                className="gallery-img"
              />
              <div className="gallery-hover-overlay">
                <Eye size={24} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>@abcmobilyademo</span>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                alt="İlham 3"
                className="gallery-img"
              />
              <div className="gallery-hover-overlay">
                <Eye size={24} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>@abcmobilyademo</span>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
                alt="İlham 4"
                className="gallery-img"
              />
              <div className="gallery-hover-overlay">
                <Eye size={24} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>@abcmobilyademo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
