export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  parentCategoryId?: number | null;
  sortOrder: number;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  productCode?: string;
  shortDescription?: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  isFeatured: boolean;
  coverImageUrl?: string;
  status?: string;
  specifications?: string;
  price?: string;
}

export interface ShowcaseProduct {
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

export interface ShowcaseResponse {
  newProducts: ShowcaseProduct[];
  bestSellers: ShowcaseProduct[];
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isCover: boolean;
  sortOrder: number;
}

export interface ProductDetail extends ProductListItem {
  description?: string;
  specifications?: string; // JSON string
  dimensions?: string;     // JSON string
  materials?: string;
  colorOptions?: string;   // JSON or comma-separated
  technicalDetails?: string;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  images: ProductImage[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl: string;
  imageAlt?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface ServiceItem {
  id: number;
  title: string;
  description?: string;
  iconOrImageUrl?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface StoreItem {
  id: number;
  name: string;
  address: string;
  phone?: string;
  whatsApp?: string;
  email?: string;
  workingHours?: string;
  mapEmbedUrl?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface PageContent {
  id: number;
  slug: string;
  title: string;
  content?: string;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ContactMessage {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'New' | 'InReview' | 'Replied';
  adminNote?: string;
  createdAt: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthUser {
  email: string;
  roles: string[];
}
