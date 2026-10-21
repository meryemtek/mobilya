import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Network,
  ClipboardList,
  UploadCloud,
  LayoutTemplate,
  GalleryHorizontalEnd,
  Briefcase,
  MessageSquare,
  Settings2,
  ContactRound,
  FileText,
  Scale,
  LogOut,
  Menu,
  ExternalLink,
  Armchair,
  Sparkles,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../api/endpoints';
import '../styles/admin.css';

type BadgeTone = 'default' | 'teal' | 'red';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: string | null;
  badgeTone?: BadgeTone;
}

interface NavGroup {
  key: string;
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

interface Stats {
  totalProducts: number;
  publishedProducts: number;
  totalCategories: number;
  newMessages: number;
  totalBanners: number;
  totalServices: number;
}

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menü rozetleri için canlı istatistikler (sayfa değiştikçe tazelenir)
  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((s) => setStats(s))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/giris');
  };

  const groups: NavGroup[] = [
    {
      key: 'A',
      title: 'A. Katalog & Ürün Yönetimi',
      icon: Package,
      items: [
        {
          to: '/admin/kategoriler',
          label: 'Kategori Yönetimi',
          icon: Network,
          badge: stats ? `${stats.totalCategories} Kategori` : null,
        },
        {
          to: '/admin/urunler',
          label: 'Ürün Kataloğu & Yeni Ekle',
          icon: ClipboardList,
          badge: stats ? `${stats.publishedProducts}/${stats.totalProducts} Yayında` : null,
          badgeTone: 'teal',
        },
        {
          to: '/admin/medya',
          label: 'Medya & Ürün Görselleri',
          icon: UploadCloud,
        },
      ],
    },
    {
      key: 'B',
      title: 'B. İçerik & Görsel Vitrin',
      icon: LayoutTemplate,
      items: [
        {
          to: '/admin/vitrin',
          label: 'Vitrin & Öne Çıkan Ürünler',
          icon: Sparkles,
          badge: 'Yeni/Çok Satan',
          badgeTone: 'teal',
        },
        {
          to: '/admin/bannerlar',
          label: 'Ana Slider & Kampanya Banner\'ları',
          icon: GalleryHorizontalEnd,
          badge: stats ? `${stats.totalBanners} Görsel` : null,
        },
        {
          to: '/admin/hizmetler',
          label: 'Hizmetlerimiz',
          icon: Briefcase,
          badge: stats ? `${stats.totalServices} Hizmet` : null,
        },
        {
          to: '/admin/magazalar',
          label: 'Mağazalar & Showroomlar',
          icon: MapPin,
        },
        {
          to: '/admin/mesajlar',
          label: 'Müşteri Mesajları',
          icon: MessageSquare,
          badge: stats && stats.newMessages > 0 ? `${stats.newMessages} Yeni` : null,
          badgeTone: 'red',
        },
      ],
    },
    {
      key: 'C',
      title: 'C. Kurumsal & Genel Ayarlar',
      icon: Settings2,
      items: [
        {
          to: '/admin/ayarlar',
          label: 'Firma & İletişim Bilgileri',
          icon: ContactRound,
        },
        {
          to: '/admin/sayfalar',
          label: 'Kurumsal Sayfalar (Hakkımızda)',
          icon: FileText,
        },
        {
          to: '/admin/sayfalar?tur=yasal',
          label: 'Sözleşmeler, KVKK & Çerez',
          icon: Scale,
        },
      ],
    },
  ];

  // Sorgu parametresi içeren menü öğeleri için aktiflik kontrolü
  const isItemActive = (item: NavItem) => {
    const [path, query] = item.to.split('?');
    if (item.end) return location.pathname === path;
    if (location.pathname !== path && !location.pathname.startsWith(path + '/')) return false;
    const currentQuery = location.search.replace(/^\?/, '');
    return query ? currentQuery === query : currentQuery === '';
  };

  const allItems = groups.flatMap((g) => g.items);
  const activeItem = allItems.find(isItemActive);
  const activeGroup = groups.find((g) => g.items.some(isItemActive));
  const pageTitle =
    location.pathname === '/admin' ? 'Özet Paneli' : activeItem?.label || 'Yönetim Portalı';

  const userInitial = (user?.email || 'Y').charAt(0).toUpperCase();

  const renderLink = (item: NavItem) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        className={`admin-nav-link ${active ? 'active' : ''}`}
      >
        <Icon size={17} />
        <span className="admin-nav-label">{item.label}</span>
        {item.badge && (
          <span className={`admin-nav-badge ${item.badgeTone && item.badgeTone !== 'default' ? item.badgeTone : ''}`}>
            {item.badge}
          </span>
        )}
        {active && !item.badge && <span className="admin-nav-dot" />}
      </Link>
    );
  };

  return (
    <div className="admin-layout">
      {/* Mobil karartma katmanı */}
      <div className={`admin-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Yan Menü */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand" style={{ gap: '0.85rem', alignItems: 'center' }}>
          <img
            src="/logo.png"
            alt="Bozkurt Mobilya"
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <span className="admin-brand-title">BOZKURT</span>
            <span className="admin-brand-sub">Yönetim Paneli</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-overview">
            <NavLink
              to="/admin"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={17} />
              <span className="admin-nav-label">Özet Paneli</span>
            </NavLink>
          </div>

          {groups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.key} className="admin-nav-group">
                <div className="admin-nav-group-title">
                  <span>{group.title}</span>
                  <GroupIcon size={14} />
                </div>
                {group.items.map(renderLink)}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <span>Web Sitesini Görüntüle</span>
            <ExternalLink size={15} />
          </a>
          <button onClick={handleLogout}>
            <LogOut size={16} />
            <span>Güvenli Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Ana İçerik */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menüyü Aç"
            >
              <Menu size={22} />
            </button>
            <div>
              <div className="admin-breadcrumb">
                {activeGroup ? activeGroup.title.replace(/^[A-C]\.\s*/, '') : 'Yönetim Portalı'}
              </div>
              <h1 className="admin-page-title">{pageTitle}</h1>
            </div>
          </div>

          <div className="admin-user">
            <div className="admin-user-meta" style={{ textAlign: 'right' }}>
              <span className="admin-user-name">{user?.email || 'Yönetici'}</span>
              <span className="admin-user-role">● Yetkili Hesap</span>
            </div>
            <div className="admin-user-avatar">{userInitial}</div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
