import api from './client';
import { demoContent } from './demoContent';
import type {
  Category,
  ProductListItem,
  ProductDetail,
  Banner,
  ServiceItem,
  StoreItem,
  PageContent,
  ContactMessage,
  SiteSettings,
  PagedResult,
  AuthUser,
} from '../types';

// ── Public API ───────────────────────────────────────────────────────────────

export const publicApi = {
  // Kategoriler
  getCategories: () => api.get<Category[]>('/categories').then((r) => demoContent(r.data)),
  getCategoryBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`).then((r) => demoContent(r.data)),

  // Ürünler
  getProducts: (params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
  }) => api.get<PagedResult<ProductListItem>>('/products', { params }).then((r) => demoContent(r.data)),

  getProductBySlug: (slug: string) => api.get<ProductDetail>(`/products/${slug}`).then((r) => demoContent(r.data)),

  // Vitrin (Yeni Ürünler & Çok Satanlar)
  getShowcase: () => api.get<{ newProducts: any[]; bestSellers: any[] }>('/products/showcase').then((r) => demoContent(r.data)),

  // Bannerlar & Hizmetler
  getBanners: () => api.get<Banner[]>('/banners').then((r) => demoContent(r.data)),
  getServices: () => api.get<ServiceItem[]>('/services').then((r) => demoContent(r.data)),
  getStores: () => api.get<StoreItem[]>('/stores').then((r) => demoContent(r.data)),

  // Sayfalar & Ayarlar
  getPageBySlug: (slug: string) => api.get<PageContent>(`/pages/${slug}`).then((r) => demoContent(r.data)),
  getSiteSettings: () => api.get<SiteSettings>('/site-settings/public').then((r) => demoContent(r.data)),

  // İletişim Formu
  sendContactMessage: (data: {
    fullName: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
  }) => api.post<{ message: string; id: number }>('/contact-messages', data).then((r) => demoContent(r.data)),
};

// ── Admin API ────────────────────────────────────────────────────────────────

export const adminApi = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; email: string }>('/auth/login', credentials).then((r) => r.data),

  getMe: () => api.get<AuthUser>('/auth/me').then((r) => r.data),

  // Dashboard
  getDashboardStats: () =>
    api.get<{
      totalProducts: number;
      publishedProducts: number;
      totalCategories: number;
      totalMessages: number;
      newMessages: number;
      totalBanners: number;
      totalServices: number;
      recentMessages: Array<{ id: number; fullName: string; email?: string; subject?: string; status: string; createdAt: string }>;
    }>('/admin/dashboard').then((r) => r.data),

  // Kategoriler
  getCategories: () => api.get<Category[]>('/admin/categories').then((r) => r.data),
  getCategory: (id: number) => api.get<Category>(`/admin/categories/${id}`).then((r) => r.data),
  createCategory: (data: Partial<Category>) => api.post<Category>('/admin/categories', data).then((r) => r.data),
  updateCategory: (id: number, data: Partial<Category>) => api.put<Category>(`/admin/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`),

  // Ürünler
  getProducts: (params?: { page?: number; pageSize?: number; search?: string; status?: string; categoryId?: number }) =>
    api.get<PagedResult<ProductListItem>>('/admin/products', { params }).then((r) => r.data),
  getProduct: (id: number) => api.get<ProductDetail>(`/admin/products/${id}`).then((r) => r.data),
  createProduct: (data: any) => api.post<{ id: number }>('/admin/products', data).then((r) => r.data),
  updateProduct: (id: number, data: any) => api.put<{ id: number }>(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),
  deleteProductPermanent: (id: number) => api.delete(`/admin/products/${id}/permanent`),

  // Vitrin Yönetimi
  getShowcaseSettings: () =>
    api.get<{ newProductIds: number[]; bestSellerIds: number[] }>('/admin/products/showcase-settings').then((r) => r.data),
  updateShowcaseSettings: (data: { newProductIds: number[]; bestSellerIds: number[] }) =>
    api.put<{ message: string }>('/admin/products/showcase-settings', data).then((r) => r.data),

  // Bannerlar
  getBanners: () => api.get<Banner[]>('/admin/banners').then((r) => r.data),
  createBanner: (data: Partial<Banner>) => api.post<Banner>('/admin/banners', data).then((r) => r.data),
  updateBanner: (id: number, data: Partial<Banner>) => api.put<Banner>(`/admin/banners/${id}`, data).then((r) => r.data),
  deleteBanner: (id: number) => api.delete(`/admin/banners/${id}`),

  // Hizmetler
  getServices: () => api.get<ServiceItem[]>('/admin/services').then((r) => r.data),
  createService: (data: Partial<ServiceItem>) => api.post<ServiceItem>('/admin/services', data).then((r) => r.data),
  updateService: (id: number, data: Partial<ServiceItem>) => api.put<ServiceItem>(`/admin/services/${id}`, data).then((r) => r.data),
  deleteService: (id: number) => api.delete(`/admin/services/${id}`),
  getStores: () => api.get<StoreItem[]>('/admin/stores').then((r) => r.data),
  createStore: (data: Partial<StoreItem>) => api.post<StoreItem>('/admin/stores', data).then((r) => r.data),
  updateStore: (id: number, data: Partial<StoreItem>) => api.put<StoreItem>(`/admin/stores/${id}`, data).then((r) => r.data),
  deleteStore: (id: number) => api.delete(`/admin/stores/${id}`),

  // Sayfalar
  getPages: () => api.get<PageContent[]>('/admin/pages').then((r) => r.data),
  getPage: (id: number) => api.get<PageContent>(`/admin/pages/${id}`).then((r) => r.data),
  createPage: (data: Partial<PageContent>) => api.post<PageContent>('/admin/pages', data).then((r) => r.data),
  updatePage: (id: number, data: Partial<PageContent>) => api.put<PageContent>(`/admin/pages/${id}`, data).then((r) => r.data),
  deletePage: (id: number) => api.delete(`/admin/pages/${id}`),

  // İletişim Mesajları
  getMessages: (params?: { status?: string; page?: number; pageSize?: number }) =>
    api.get<PagedResult<ContactMessage>>('/admin/contact-messages', { params }).then((r) => r.data),
  updateMessageStatus: (id: number, status: string, adminNote?: string) =>
    api.patch(`/admin/contact-messages/${id}/status`, { status, adminNote }).then((r) => r.data),
  deleteMessage: (id: number) => api.delete(`/admin/contact-messages/${id}`),

  // Site Ayarları
  getSettings: () => api.get<Array<{ key: string; value: string; group: string }>>('/admin/site-settings').then((r) => r.data),
  updateSettings: (settings: Record<string, string | null>) => api.put('/admin/site-settings', settings).then((r) => r.data),

  // Medya & Dosya Yükleme
  getMediaFiles: () =>
    api.get<Array<{ fileName: string; url: string; size: number; createdAt: string; source: string }>>('/admin/media/files').then((r) => r.data),
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string; fileName: string; size: number }>('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  deleteMediaFile: (fileName: string) => api.delete(`/admin/media/files/${encodeURIComponent(fileName)}`),
  addProductImage: (productId: number, data: { url: string; altText?: string; isCover: boolean; sortOrder: number }) =>
    api.post(`/admin/media/products/${productId}/images`, data).then((r) => r.data),
  deleteProductImage: (imageId: number) => api.delete(`/admin/media/product-images/${imageId}`),
};
