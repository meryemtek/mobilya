import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Armchair,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { MEGA_MENU_DATA } from '../../data/megaMenuData';
import type { Category, SiteSettings } from '../../types';

interface NavCategoryItem {
  id?: number;
  name: string;
  slug: string;
  isSpecial?: boolean;
}

const DEFAULT_NAV_ITEMS: NavCategoryItem[] = [
  { name: 'OTURMA GRUPLARI', slug: 'oturma-gruplari' },
  { name: 'YEMEK ODASI', slug: 'yemek-odasi' },
  { name: 'YATAK ODASI', slug: 'yatak-odasi' },
  { name: 'YATAK', slug: 'yatak' },
  { name: 'BAZA & BAŞLIK', slug: 'baza-baslik' },
  { name: 'GENÇ VE ÇOCUK ODASI', slug: 'genc-ve-cocuk-odasi' },
  { name: 'BAHÇE MOBİLYASI', slug: 'bahce-mobilyasi' },
  { name: 'TAMAMLAYICI ÜRÜNLER', slug: 'tamamlayici-urunler' },
  { name: 'İNDİRİMLİ ÜRÜNLER', slug: 'indirimli-urunler', isSpecial: true },
];

export const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  
  // Mega Menü Etkileşim Durumları
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    publicApi.getCategories().then((data) => {
      setCategories(data.filter((c) => !c.parentCategoryId));
    }).catch(() => {});

    publicApi.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/urunler?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const phone = settings.PhoneNumber || '0850 222 33 11';

  // Mega Menü Fare Olayları
  const handleCategoryMouseEnter = (slug: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredCategory(slug);
  };

  const handleCategoryMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  const handleMegaMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMegaMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  const handleCloseMegaMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredCategory(null);
  };

  useEffect(() => {
    handleCloseMegaMenu();
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Belirtilen kategori sıralaması ve API'den gelen ek kategorileri birleştir
  const navItems: NavCategoryItem[] = DEFAULT_NAV_ITEMS.map((defaultItem) => {
    const match = categories.find(
      (c) =>
        c.slug.toLowerCase() === defaultItem.slug.toLowerCase() ||
        c.name.trim().toLocaleLowerCase('tr') === defaultItem.name.trim().toLocaleLowerCase('tr')
    );
    return {
      ...defaultItem,
      id: match?.id,
    };
  });

  const extraCategories: NavCategoryItem[] = categories
    .filter(
      (c) =>
        !DEFAULT_NAV_ITEMS.some(
          (d) =>
            d.slug.toLowerCase() === c.slug.toLowerCase() ||
            d.name.trim().toLocaleLowerCase('tr') === c.name.trim().toLocaleLowerCase('tr')
        )
    )
    .map((c) => ({
      id: c.id,
      name: c.name.toUpperCase(),
      slug: c.slug,
      isSpecial: c.slug.includes('indirim') || c.name.toLowerCase().includes('indirim'),
    }));

  const allNavItems = [...navItems, ...extraCategories];

  return (
    <header className="header-wrapper">
      {/* 1. Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-links">
            <Link to="/iletisim">İletişim</Link>
            <span className="divider">|</span>
            <Link to="/kampanyalar">Kampanyalar</Link>
          </div>
          <div className="top-contact">
            <a href={`tel:${phone.replace(/\s+/g, '')}`}>
              <Phone size={14} /> {phone}
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="main-header">
        <div className="container main-header-inner">
          {/* Logo */}
          <Link to="/" className="logo-container">
            <img
              src="/demo-logo.svg"
              alt="ABC Mobilya"
              className="header-logo-img"
            />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          {/* Actions */}
          <div className="header-actions">
            <Link to="/admin/giris" className="action-link">
              <User size={20} />
              <span className="action-text">Giriş</span>
            </Link>
            <Link to="/urunler" className="action-link">
              <Heart size={20} />
              <span className="action-text">Favoriler</span>
            </Link>
            <Link to="/iletisim" className="action-link">
              <ShoppingBag size={20} />
              <span className="action-text">Sepet</span>
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation with Interactive Mega Menu */}
      <nav className="nav-bar">
        <div className="container nav-bar-inner">
          <ul className="nav-list">
            {allNavItems.map((category) => {
              const categoryPath = `/urunler/${category.slug}`;
              const isActive = location.pathname === categoryPath;
              const isHovered = hoveredCategory === category.slug;
              return (
                <li
                  key={category.slug}
                  onMouseEnter={() => handleCategoryMouseEnter(category.slug)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <Link
                    to={categoryPath}
                    className={`${isActive ? 'active' : ''} ${isHovered ? 'nav-link-hovered' : ''} ${category.isSpecial ? 'nav-link-discount' : ''}`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mega Menu Dropdown */}
        {hoveredCategory && MEGA_MENU_DATA[hoveredCategory] && (
          <div
            className="mega-menu-wrapper"
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleMegaMenuMouseLeave}
          >
            <div className="container mega-menu-container">
              {/* Alt Kategoriler Izgarası (Görsel + İsim) */}
              <div className="mega-menu-grid">
                {MEGA_MENU_DATA[hoveredCategory].subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/urunler/${hoveredCategory}?search=${encodeURIComponent(sub.searchKeyword || sub.name)}`}
                    className="mega-sub-item"
                    onClick={handleCloseMegaMenu}
                  >
                    <div className="mega-sub-img-box">
                      <img
                        src={sub.imageUrl}
                        alt={sub.name}
                        className="mega-sub-img"
                        loading="lazy"
                      />
                    </div>
                    <span className="mega-sub-title">{sub.name}</span>
                  </Link>
                ))}
              </div>

              {/* Sağ Taraf: Büyük Öne Çıkan Koleksiyon Görseli */}
              {MEGA_MENU_DATA[hoveredCategory].featuredImage && (
                <Link
                  to={MEGA_MENU_DATA[hoveredCategory].featuredLink}
                  className="mega-featured-card"
                  onClick={handleCloseMegaMenu}
                >
                  <img
                    src={MEGA_MENU_DATA[hoveredCategory].featuredImage}
                    alt={MEGA_MENU_DATA[hoveredCategory].featuredTitle}
                    className="mega-featured-img"
                  />
                  <div className="mega-featured-overlay">
                    <span className="mega-featured-tag">ÖNE ÇIKAN KOLEKSİYON</span>
                    <h4 className="mega-featured-title">
                      {MEGA_MENU_DATA[hoveredCategory].featuredTitle}
                    </h4>
                    {MEGA_MENU_DATA[hoveredCategory].featuredSubtitle && (
                      <p className="mega-featured-desc">
                        {MEGA_MENU_DATA[hoveredCategory].featuredSubtitle}
                      </p>
                    )}
                    <span className="mega-featured-link">
                      Koleksiyonu İncele <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-list">
            <li>
              <Link to="/urunler" onClick={() => setMobileMenuOpen(false)}>
                Tüm Ürünler
              </Link>
            </li>
            {allNavItems.map((category) => {
              const mega = MEGA_MENU_DATA[category.slug];
              const isExpanded = expandedMobileCategory === category.slug;
              return (
                <li key={category.slug}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      to={`/urunler/${category.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={category.isSpecial ? { color: '#008779', fontWeight: 700 } : undefined}
                    >
                      {category.name}
                    </Link>
                    {mega && mega.subcategories.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedMobileCategory(isExpanded ? null : category.slug);
                        }}
                        style={{ background: 'none', border: 'none', padding: '0.4rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    )}
                  </div>

                  {/* Mobil Alt Kategoriler */}
                  {isExpanded && mega && (
                    <ul className="mobile-sub-list">
                      {mega.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            to={`/urunler/${category.slug}?search=${encodeURIComponent(sub.searchKeyword || sub.name)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="mobile-sub-link"
                          >
                            <img src={sub.imageUrl} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li><Link to="/iletisim" onClick={() => setMobileMenuOpen(false)}>İletişim</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};
