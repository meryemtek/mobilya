import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Düzenler (Layouts)
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Ziyaretçi Sayfaları
import { HomePage } from './pages/public/HomePage';
import { CatalogPage } from './pages/public/CatalogPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { CorporatePage } from './pages/public/CorporatePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ContactPage } from './pages/public/ContactPage';
import { LegalPage } from './pages/public/LegalPage';

// Yönetim Sayfaları
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminStoresPage } from './pages/admin/AdminStoresPage';
import { AdminPagesPage } from './pages/admin/AdminPagesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminShowcasePage } from './pages/admin/AdminShowcasePage';

// Korunan Yönetici Rotası Koruması (Protected Route)
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Oturum kontrol ediliyor...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/giris" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Ziyaretçi Rotaları ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/urunler" element={<CatalogPage />} />
            <Route path="/urunler/:categorySlug" element={<CatalogPage />} />
            <Route path="/urunler/:categorySlug/:productSlug" element={<ProductDetailPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/kurumsal" element={<CorporatePage />} />
            <Route path="/hizmetlerimiz" element={<ServicesPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/gizlilik-politikasi" element={<LegalPage />} />
            <Route path="/kvkk" element={<LegalPage />} />
            <Route path="/cerez-politikasi" element={<LegalPage />} />
          </Route>

          {/* ── Yönetici Girişi ── */}
          <Route path="/admin/giris" element={<AdminLoginPage />} />

          {/* ── Korumalı Yönetim Paneli Rotaları ── */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="urunler" element={<AdminProductsPage />} />
            <Route path="kategoriler" element={<AdminCategoriesPage />} />
            <Route path="vitrin" element={<AdminShowcasePage />} />
            <Route path="bannerlar" element={<AdminBannersPage />} />
            <Route path="hizmetler" element={<AdminServicesPage />} />
            <Route path="magazalar" element={<AdminStoresPage />} />
            <Route path="sayfalar" element={<AdminPagesPage />} />
            <Route path="mesajlar" element={<AdminMessagesPage />} />
            <Route path="ayarlar" element={<AdminSettingsPage />} />
            <Route path="medya" element={<AdminMediaPage />} />
          </Route>

          {/* 404 Yönlendirmesi */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
