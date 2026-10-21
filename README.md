# Bozkurt Mobilya — Kurumsal Web Sitesi & Yönetim Paneli

Bozkurt Mobilya için geliştirilmiş, Clean Architecture ve SOLID prensiplerine uygun, ASP.NET Core 10 Web API backend ve React + TypeScript (Vite) frontend uygulaması.

---

## 🏛 Mimari ve Tasarım İlkeleri

### Backend (Clean Architecture & SOLID)
- **Domain Katmanı**:
  - `BaseEntity<TKey>` ve `BaseEntity`: Varlık kimlik ve eşitlik soyutlaması.
  - `IAuditableEntity`, `ISoftDeletable`: Interface Segregation Principle (ISP).
  - Varlıklar: `Category`, `Product`, `ProductImage`, `Banner`, `Service`, `PageContent`, `ContactMessage`, `SiteSetting`.
- **Application Katmanı**:
  - `IApplicationDbContext`: Dependency Inversion Principle (DIP).
  - `ApiResponse<T>`, `PagedResponse<T>`: Standart REST yanıt sarmalayıcıları.
- **Infrastructure Katmanı**:
  - PostgreSQL 16 + Entity Framework Core 10.
  - ASP.NET Core Identity entegrasyonu ve güvenli seed mekanizması.
- **API Katmanı**:
  - `BaseApiController`: Standart HTTP dönüşleri (`Success`, `PagedSuccess`, `CreatedResponse`, `NotFoundProblem`, `BadRequestProblem`, `ConflictProblem`), kimlik doğrulama yardımcıları.
  - `BaseAdminController`: `[Authorize(Roles = "Admin")]` koruması altındaki yönetim denetleyicileri.
  - `ExceptionHandlingMiddleware`: Merkezi RFC 7807 `ProblemDetails` hata yakalama ve loglama.

### Frontend (React + Vite + TypeScript)
- **Ziyaretçi Arayüzü**:
  - Hero Slider / Banner, Öne Çıkan Koleksiyonlar ve Ürünler.
  - Detaylı Ürün Kataloğu: Arama, kategori filtreleri, sayfalama ve sıralama.
  - Zengin Ürün Detayı: Görsel galerisi, ölçüler, teknik özellikler, benzer ürünler ve WhatsApp/Form teklif CTA'sı.
  - Kurumsal, Hakkımızda, Hizmetlerimiz, İletişim ve Yasal Sayfalar (Gizlilik, KVKK, Çerez).
  - Yüzen Hızlı WhatsApp Danışma Butonu.
- **Yönetim Paneli (`/admin`)**:
  - Güvenli JWT oturumu (`/admin/giris`).
  - Gösterge Paneli (Dashboard) ve anlık KPI istatistikleri.
  - Ürün, Kategori, Banner, Hizmet, Sayfa, Mesaj ve Site Ayarları CRUD yönetimi.
  - Güvenli Medya Yükleme Paneli.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Veritabanını Başlatma (Docker)
PostgreSQL konteynerini başlatın:
```bash
docker compose up -d
```
*Veritabanı portu `5434` olarak yapılandırılmıştır.*

### 2. Backend'i Çalıştırma (.NET 10)
```bash
cd backend\src\BozkurtMobilya.Api
dotnet run
```
- API adresi: `http://localhost:5000` veya `https://localhost:5001`
- OpenAPI dökümantasyonu: `http://localhost:5000/openapi/v1.json`
- Varsayılan Yönetici: `admin@bozkurtmobilya.local` / `Admin123!` *(Development ortamında otomatik seed edilir)*

### 3. Frontend'i Çalıştırma (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web sitesi: `http://localhost:5173`
- Yönetici paneli: `http://localhost:5173/admin/giris`

---

## 🛡 Güvenlik ve Doğrulama
- Parolalar ASP.NET Core Identity ile güvenli şekilde hash'lenir.
- Admin rotaları backend API katmanında JWT Bearer token ile doğrulanır.
- Dosya yüklemeleri raster görsel biçimleriyle (.jpg, .jpeg, .png, .webp) ve maksimum 5MB boyutuyla sınırlandırılmıştır.
- Tüm SQL sorguları ve hassas sistem hataları istemciye sızdırılmaz; standart RFC 7807 ProblemDetails döndürülür.
