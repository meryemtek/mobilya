import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Layers,
  Sparkles,
  X,
  PackageOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import { PlaceholderImage } from '../../components/common/PlaceholderImage';
import { MEGA_MENU_DATA } from '../../data/megaMenuData';
import type { Category, ProductListItem, PagedResult } from '../../types';

export const CatalogPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [productsData, setProductsData] = useState<PagedResult<ProductListItem>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Favoriler ve Karşılaştırma Durumu
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('bm_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compared, setCompared] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('bm_compared');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('bm_favs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleCompare = (id: number) => {
    setCompared((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('bm_compared', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Kategorileri Çek
  useEffect(() => {
    publicApi
      .getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Açık Alt Kategori Listeleri (varsayılan: aktif kategori açık)
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  useEffect(() => {
    if (categorySlug) {
      setOpenCategories((prev) => (prev.includes(categorySlug) ? prev : [...prev, categorySlug]));
    }
  }, [categorySlug]);

  // Aktif Kategori Belirle
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const found = categories.find((c) => c.slug === categorySlug);
      setCurrentCategory(found || null);
    } else {
      setCurrentCategory(null);
    }
  }, [categorySlug, categories]);

  // Ürünleri Çek
  useEffect(() => {
    setLoading(true);
    publicApi
      .getProducts({
        page,
        pageSize: 12,
        category: categorySlug,
        search: search || undefined,
        sort: sort || undefined,
      })
      .then((data) => {
        setProductsData(data);
      })
      .catch(() => {
        setProductsData({ items: [], totalCount: 0, page: 1, pageSize: 12, totalPages: 1 });
      })
      .finally(() => setLoading(false));
  }, [categorySlug, search, sort, page]);

  // Fiyat ayrıştırma yardımcısı
  const getProductPrice = (item: ProductListItem): string => {
    if (item.price) return item.price;
    if (item.specifications) {
      try {
        const specs = JSON.parse(item.specifications);
        if (specs['Fiyat']) return specs['Fiyat'];
        if (specs['Price']) return specs['Price'];
        if (specs['fiyat']) return specs['fiyat'];
      } catch {}
    }
    return '';
  };

  // Eski fiyat (indirimli ise)
  const getProductOldPrice = (item: ProductListItem): string | undefined => {
    if (item.specifications) {
      try {
        const specs = JSON.parse(item.specifications);
        return specs['Eski Fiyat'] || specs['oldPrice'];
      } catch {}
    }
    return undefined;
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('search') as string) || '';
    const newParams = new URLSearchParams(searchParams);
    if (q.trim()) newParams.set('search', q.trim());
    else newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSort) newParams.set('sort', newSort);
    else newParams.delete('sort');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Kategori bir URL parametresi olduğu için yalnızca query string'i temizlemek yetmez
  const clearFilters = () => {
    navigate('/urunler');
  };

  const removeCategoryFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('page');
    navigate({ pathname: '/urunler', search: newParams.toString() ? `?${newParams.toString()}` : '' });
  };

  const removeSearchFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const pageTitle = currentCategory ? `${currentCategory.name} Modelleri` : 'Tüm Ürün Koleksiyonu';
  const pageDescription =
    currentCategory?.description ||
    'ABC Mobilya estetik, konfor ve fonksiyonelliği bir araya getiren özgün mobilya tasarımlarını keşfedin.';

  // Kategoriye ait banner içeriği (MEGA_MENU_DATA'dan; tüm ürünler sayfasında varsayılan)
  const featured = categorySlug ? MEGA_MENU_DATA[categorySlug] : undefined;
  const bannerEyebrow = featured?.featuredTitle || 'Ürün Kataloğu';
  const bannerSubtitle = featured?.featuredSubtitle || pageDescription;

  return (
    <>
      <SeoHead
        title={currentCategory?.metaTitle || `${pageTitle} | ABC Mobilya`}
        description={currentCategory?.metaDescription || pageDescription}
      />

      {/* 1. KURUMSAL KOMPAKT BANNER */}
      <div
        style={{
          background: 'linear-gradient(120deg, #2a2118 0%, #1c1712 60%, #33261a 100%)',
          color: '#ffffff',
          padding: '1.5rem 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(194, 136, 89, 0.18)',
        }}
      >
        {/* Sol Vurgu Çizgisi */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(180deg, #e0a77a, #c28859)',
          }}
        />
        {/* Dekoratif Işıklandırma */}
        <div
          style={{
            position: 'absolute',
            top: '-60%',
            right: '-5%',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(194, 136, 89, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0 }}>
            {/* Breadcrumb Navigasyonu */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: '#94a3b8',
                marginBottom: '0.6rem',
              }}
            >
              <Link to="/" style={{ color: '#cbd5e1' }}>
                Ana Sayfa
              </Link>
              <span>/</span>
              <Link
                to="/urunler"
                style={{
                  color: categorySlug ? '#cbd5e1' : '#e0a77a',
                  fontWeight: !categorySlug ? 600 : 400,
                }}
              >
                Ürün Kataloğu
              </Link>
              {currentCategory && (
                <>
                  <span>/</span>
                  <span style={{ color: '#e0a77a', fontWeight: 600 }}>{currentCategory.name}</span>
                </>
              )}
            </nav>

            <span
              style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#e0a77a',
                marginBottom: '0.3rem',
              }}
            >
              {bannerEyebrow}
            </span>

            <h1
              style={{
                color: '#ffffff',
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                margin: '0 0 0.35rem 0',
              }}
            >
              {pageTitle}
            </h1>

            <p
              style={{
                color: '#94a3b8',
                maxWidth: '560px',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {bannerSubtitle}
            </p>
          </div>

          {/* Kategoriye Ait Görsel (yalnızca kategori sayfasında) */}
          {featured?.featuredImage && (
            <img
              src={featured.featuredImage}
              alt={pageTitle}
              style={{
                width: '120px',
                height: '72px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>

      {/* 2. ANA KATALOG İÇERİK ALANI */}
      <div style={{ backgroundColor: '#f8fafc', padding: '2.5rem 0 4.5rem' }}>
        <div className="catalog-page-wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '270px 1fr',
              gap: '2.5rem',
              alignItems: 'flex-start',
            }}
            className="catalog-grid-layout"
          >
            {/* SOL: Kategori Listesi / Filtre Kenar Çubuğu */}
            <aside className="catalog-sidebar">
              <div className="catalog-sidebar-header">
                <div className="catalog-sidebar-icon">
                  <Filter size={18} />
                </div>
                <div>
                  <h2 className="catalog-sidebar-title">Kategoriler</h2>
                </div>
              </div>

              <div className="catalog-cat-list">
                <Link
                  to="/urunler"
                  className={`catalog-cat-link ${!categorySlug ? 'is-active' : ''}`}
                >
                  <span>Tüm Koleksiyon</span>
                  <span className="catalog-count">
                    {!categorySlug ? productsData.totalCount : 'Hepsi'}
                  </span>
                </Link>

                {categories.map((c) => {
                  const isActive = categorySlug === c.slug;
                  const subcategories = MEGA_MENU_DATA[c.slug]?.subcategories ?? [];
                  const isOpen = openCategories.includes(c.slug);
                  return (
                    <div key={c.id}>
                      <div className="catalog-cat-row">
                        <Link
                          to={`/urunler/${c.slug}`}
                          className={`catalog-cat-link ${isActive ? 'is-active' : ''}`}
                        >
                          <span>{c.name}</span>
                          {isActive && <span className="catalog-count">{productsData.totalCount}</span>}
                        </Link>

                        {subcategories.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleCategory(c.slug)}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? 'Alt kategorileri kapat' : 'Alt kategorileri aç'}
                            className={`catalog-cat-toggle ${isActive ? 'is-active' : ''}`}
                          >
                            <ChevronDown size={16} />
                          </button>
                        )}
                      </div>

                      {/* Alt Kategoriler (Header mega menü ile aynı arama anahtarını kullanır) */}
                      {isOpen && subcategories.length > 0 && (
                        <div className="catalog-sub-list">
                          {subcategories.map((sub) => {
                            const keyword = sub.searchKeyword || sub.name;
                            const isSubActive = isActive && search === keyword;
                            return (
                              <Link
                                key={sub.slug}
                                to={`/urunler/${c.slug}?search=${encodeURIComponent(keyword)}`}
                                className={`catalog-sub-link ${isSubActive ? 'is-active' : ''}`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hızlı Yardım / İletişim Kutusu */}
              <div
                style={{
                  marginTop: '2rem',
                  padding: '1.2rem',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#008779',
                    marginBottom: '0.35rem',
                  }}
                >
                  Özel Ölçü ve Tasarım
                </span>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                  Mekanınıza uygun özel üretim mobilyalar için bize ulaşın.
                </p>
                <Link
                  to="/iletisim"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#008779',
                  }}
                >
                  İletişime Geçin <ArrowRight size={14} />
                </Link>
              </div>
            </aside>

            {/* SAĞ: Arama, Sıralama ve Ürün Kartları */}
            <div>
              {/* Üst Filtre & Sıralama Çubuğu */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.75rem',
                }}
              >
                {/* Arama Formu */}
                <form
                  onSubmit={handleSearchSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexGrow: 1,
                    maxWidth: '420px',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      name="search"
                      defaultValue={search}
                      placeholder="Ürün adı veya kodu ile arayın..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem 0.65rem 2.4rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#008779')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                    <Search
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#008779',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Ara
                  </button>
                </form>

                {/* Sıralama & Toplam Sayı */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                    <strong style={{ color: '#0f172a' }}>{productsData.totalCount}</strong> ürün
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <SlidersHorizontal size={15} color="#64748b" />
                    <select
                      value={sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      style={{
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="">Varsayılan Sıralama</option>
                      <option value="newest">En Yeniler</option>
                      <option value="name_asc">İsim (A-Z)</option>
                      <option value="name_desc">İsim (Z-A)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Aktif Filtreler */}
              {(search || categorySlug) && (
                <div className="catalog-active-filters">
                  <div className="catalog-active-filters-list">
                    <span className="catalog-active-label">Aktif Filtreler</span>

                    {categorySlug && (
                      <span className="catalog-chip">
                        <span className="catalog-chip-key">Kategori</span>
                        {currentCategory?.name || categorySlug}
                        <button
                          type="button"
                          className="catalog-chip-remove"
                          onClick={removeCategoryFilter}
                          aria-label="Kategori filtresini kaldır"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    )}

                    {search && (
                      <span className="catalog-chip">
                        <span className="catalog-chip-key">Arama</span>
                        "{search}"
                        <button
                          type="button"
                          className="catalog-chip-remove"
                          onClick={removeSearchFilter}
                          aria-label="Arama filtresini kaldır"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    )}
                  </div>

                  <button type="button" className="catalog-clear-all" onClick={clearFilters}>
                    <X size={14} />
                    Tümünü Temizle
                  </button>
                </div>
              )}

              {/* ÜRÜN YÜKLENİYOR VEYA LİSTE DURUMU */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '42px',
                      height: '42px',
                      border: '3px solid #e2e8f0',
                      borderTopColor: '#008779',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem' }}>
                    Ürünler listeleniyor...
                  </p>
                </div>
              ) : productsData.items.length === 0 ? (
                /* Boş Durum */
                <div
                  style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 135, 121, 0.1)',
                      color: '#008779',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <PackageOpen size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Bu Kategoride Henüz Ürün Bulunmuyor
                  </h3>
                  <p
                    style={{
                      color: '#64748b',
                      marginBottom: '1.75rem',
                      maxWidth: '480px',
                      margin: '0 auto 1.75rem auto',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {search
                      ? `"${search}" aramasıyla eşleşen bir ürün bulunamadı. Lütfen farklı bir arama terimi deneyin.`
                      : 'Seçili kategorideki yeni modellerimiz hazırlanmaktadır. Diğer koleksiyonlarımızı keşfedebilir veya yetkili panelinden ürün ekleyebilirsiniz.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                      onClick={clearFilters}
                      style={{
                        backgroundColor: '#008779',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Tüm Kataloğu İncele
                    </button>
                    <Link
                      to="/admin/giris"
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      Yetkili Ürün Ekle
                    </Link>
                  </div>
                </div>
              ) : (
                /* Ürün Kartları Grid (Anasayfa ile %100 Uyumlu) */
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '1.75rem',
                    }}
                  >
                    {productsData.items.map((item) => {
                      const isFav = favorites.includes(item.id);
                      const isComp = compared.includes(item.id);
                      const formattedPrice = getProductPrice(item);
                      const oldPrice = getProductOldPrice(item);

                      return (
                        <div
                          key={item.id}
                          className="modern-product-card"
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            background: '#ffffff',
                          }}
                        >
                          {/* Görsel Kutusu ve Hover Animasyonları */}
                          <div
                            className="product-visual-box"
                            style={{
                              aspectRatio: '4/3',
                              position: 'relative',
                              overflow: 'hidden',
                              backgroundColor: '#f8fafc',
                              borderTopLeftRadius: '11px',
                              borderTopRightRadius: '11px',
                            }}
                          >
                            <Link to={`/urunler/${item.categorySlug}/${item.slug}`}>
                              {item.coverImageUrl ? (
                                <img
                                  src={item.coverImageUrl}
                                  alt={item.name}
                                  className="product-visual-img"
                                />
                              ) : (
                                <PlaceholderImage text={item.name} />
                              )}
                            </Link>

                            {/* Rozet */}
                            {item.isFeatured ? (
                              <span className="card-badge-tag badge-teal">ÖNE ÇIKAN</span>
                            ) : item.categoryName ? (
                              <span className="card-badge-tag badge-teal">
                                {item.categoryName}
                              </span>
                            ) : null}

                            {/* Favori Kalp Butonu */}
                            <button
                              className={`card-fav-btn ${isFav ? 'active' : ''}`}
                              onClick={() => toggleFavorite(item.id)}
                              aria-label="Favorilere Ekle"
                              title={isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                            >
                              <Heart size={18} fill={isFav ? '#ef4444' : 'none'} />
                            </button>

                            {/* Karşılaştır Butonu */}
                            <button
                              className="card-compare-pill"
                              onClick={() => toggleCompare(item.id)}
                              style={
                                isComp
                                  ? {
                                      backgroundColor: '#008779',
                                      color: '#ffffff',
                                      borderColor: '#008779',
                                    }
                                  : undefined
                              }
                              title="Ürünleri Karşılaştır"
                            >
                              <Layers size={14} />
                              <span>{isComp ? 'Karşılaştırılıyor' : 'Karşılaştır'}</span>
                            </button>

                            {/* Hover Eylem Çubuğu */}
                            <div className="card-hover-actions">
                              <Link
                                to={`/urunler/${item.categorySlug}/${item.slug}`}
                                className="quick-view-btn"
                              >
                                <Eye size={15} /> Detaylı İncele
                              </Link>
                            </div>
                          </div>

                          {/* Ürün Bilgisi */}
                          <div
                            className="modern-product-info"
                            style={{ padding: '1.25rem 1rem 1.25rem', textAlign: 'center' }}
                          >
                            <span
                              style={{
                                display: 'block',
                                fontSize: '0.78rem',
                                color: '#008779',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                marginBottom: '0.3rem',
                              }}
                            >
                              {item.categoryName}
                            </span>

                            <h3
                              className="modern-product-title"
                              style={{
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                color: '#0f172a',
                                margin: '0 0 0.5rem 0',
                                minHeight: '2.6rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              <Link
                                to={`/urunler/${item.categorySlug}/${item.slug}`}
                                style={{ color: 'inherit' }}
                              >
                                {item.name}
                              </Link>
                            </h3>

                            {item.productCode && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#94a3b8',
                                  marginBottom: '0.6rem',
                                  fontFamily: 'monospace',
                                }}
                              >
                                Kod: {item.productCode}
                              </div>
                            )}

                            {/* Fiyat Alanı */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '0.4rem',
                              }}
                            >
                              {oldPrice && (
                                <span className="modern-old-price" style={{ fontSize: '0.85rem' }}>
                                  {oldPrice}
                                </span>
                              )}
                              <span
                                className="modern-product-price"
                                style={{
                                  fontSize: '1.15rem',
                                  fontWeight: 700,
                                  color: '#008779',
                                }}
                              >
                                {formattedPrice || 'Fiyat Teklifi Alınız'}
                              </span>
                            </div>

                            {/* Hızlı Link Butonu */}
                            <div style={{ marginTop: '1rem' }}>
                              <Link
                                to={`/urunler/${item.categorySlug}/${item.slug}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.35rem',
                                  width: '100%',
                                  padding: '0.6rem 1rem',
                                  borderRadius: '8px',
                                  backgroundColor: '#f1f5f9',
                                  color: '#1e293b',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#008779';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                                  e.currentTarget.style.color = '#1e293b';
                                }}
                              >
                                Ürün Detayı →
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sayfalama Kontrolleri */}
                  {productsData.totalPages > 1 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '3.5rem',
                      }}
                    >
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: page <= 1 ? '#94a3b8' : '#1e293b',
                          cursor: page <= 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        <ChevronLeft size={16} /> Önceki
                      </button>

                      {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((pNum) => (
                        <button
                          key={pNum}
                          onClick={() => handlePageChange(pNum)}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            border: pNum === page ? 'none' : '1px solid #cbd5e1',
                            backgroundColor: pNum === page ? '#008779' : '#ffffff',
                            color: pNum === page ? '#ffffff' : '#1e293b',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {pNum}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= productsData.totalPages}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: page >= productsData.totalPages ? '#94a3b8' : '#1e293b',
                          cursor: page >= productsData.totalPages ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        Sonraki <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
