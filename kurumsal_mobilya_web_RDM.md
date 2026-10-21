# Kurumsal Mobilya Web Sitesi

## Gereksinim ve Uygulama Tanım Dokümanı (RDM)

**Doküman türü:** Ürün gereksinimleri ve kod ajanı uygulama talimatı\
**Durum:** İlk sürüm / kapsam taslağı\
**Backend:** ASP.NET Core Web API (.NET)\
**Frontend:** React\
**Dil:** Türkçe (ilk sürüm)\
**Proje amacı:** Kurumsal mobilya markasının ürünlerini profesyonel
biçimde sergileyen, potansiyel müşterilerden talep toplayan ve
içeriklerin yönetim panelinden yönetilmesini sağlayan responsive web
sitesi.

------------------------------------------------------------------------

## 1. Kod ajanı için genel talimat

Mevcut proje deposunu ve dosya yapısını önce incele. Var olan
yapılandırmaları, kod standartlarını ve çalışan özellikleri koru;
projeyi incelemeden yeni bir iskelet oluşturma veya mevcut dosyaları
topluca değiştirme.

Bu dokümandaki gereksinimleri aşamalı şekilde uygula. Önce mimariyi ve
yapılacak işleri özetle, ardından küçük ve doğrulanabilir adımlarla
ilerle. Belirsiz kalan marka, tasarım veya iş kuralı ayrıntılarında
aşağıdaki varsayılanları kullan; kritik bir karar mevcut kodla
çelişiyorsa uygulamadan önce bunu belirt.

-   Backend: ASP.NET Core Entity Framework Web API; mevcut .NET sürümünü ve mimariyi
    koru. Yeni proje ise desteklenen güncel LTS sürümünü tercih et.
-   Frontend: React; mevcut bundler ve paket yöneticisini koru. Yeni
    kurulum gerekiyorsa Vite tercih et.
-   Veritabanı: mevcut veritabanı varsa onu kullan. Yeni kurulumda
    ilişkisel veritabanı ve Entity Framework Core tercih et; veritabanı
    türünü yapılandırmadan varsayılan olarak sabitleme.
-   API sözleşmeleri, doğrulama, hata yanıtları ve yetkilendirme açık ve
    tutarlı olsun.
-   Gizli anahtarları, bağlantı dizelerini ve kimlik bilgilerini kaynak
    koda yazma.
-   Gerçek marka metinleri, ürünler ve görseller henüz verilmediyse
    bunları örnek içerik olarak işaretle; gerçek müşteri referansı veya
    gerçek ürün özelliği uydurma.
-   Önce çalışan temel uçtan uca akışı tamamla; ardından SEO,
    erişilebilirlik ve performans iyileştirmelerini uygula.
-   Önemli kararları README veya `docs/` altında belgeleyerek kurulum ve
    çalıştırma adımlarını yaz.

## 2. Proje hedefleri

1.  Markayı ve kurumsal kimliği güven veren, modern bir tasarımla
    tanıtmak.
2.  Ürünleri kategori, alt kategori ve detay sayfalarıyla katalog
    şeklinde sunmak.
3.  Kullanıcının ürünler hakkında bilgi almasını ve firma ile kolayca
    iletişime geçmesini sağlamak.
4.  Ürün ve içerik yönetimini yetkili kullanıcılar için yönetim
    panelinden mümkün kılmak.
5.  Masaüstü, tablet ve mobil cihazlarda kullanılabilir deneyim sunmak.
6.  Temel teknik SEO, performans, güvenlik ve erişilebilirlik
    gereksinimlerini karşılamak.

### Kapsam dışı (ayrıca kararlaştırılmadıkça)

-   Online ödeme, sepet, sipariş ve e-ticaret lojistiği
-   Stok/ERP entegrasyonu
-   Çoklu dil desteği
-   Müşteri hesabı ve üyelik sistemi
-   Gelişmiş teklif/CRM iş akışı
-   Otomatik kampanya, pazarlama otomasyonu veya üçüncü taraf
    entegrasyonları

Bu özellikler mimariyi gereksiz yere karmaşıklaştırmadan ileride
eklenebilir olmalıdır.

## 3. Kullanıcı rolleri

### 3.1 Ziyaretçi

-   Açık sayfaları görüntüler.
-   Kategori ve ürünleri inceler, ürünleri arar/filtreler.
-   İletişim formu gönderir.
-   Telefon, e-posta, WhatsApp ve harita bağlantılarını kullanır.

### 3.2 Yönetici

-   Güvenli şekilde yönetim paneline giriş yapar.
-   Ürün, kategori, görsel ve içerikleri oluşturur, düzenler, yayına
    alır veya kaldırır.
-   Gelen iletişim mesajlarını görüntüler ve durumlarını yönetir.
-   Site genelindeki iletişim ve sosyal medya bilgilerini günceller.
-   İhtiyaç etkinleştirirse blog, duyuru ve referans içeriklerini
    yönetir.

Yetki kontrolü hem arayüzde hem backend API üzerinde uygulanmalıdır.
Yalnızca butonları gizlemek güvenlik önlemi sayılmaz.

## 4. Bilgi mimarisi ve sayfalar

### 4.1 Herkese açık web sitesi

1.  **Ana Sayfa**
    -   Hero alanı ve ana mesaj
    -   Yönetilebilir slider/banner veya tek görsel banner
    -   Öne çıkan kategoriler
    -   Öne çıkan ürünler
    -   Firma hakkında kısa tanıtım
    -   Hizmetler/çalışma alanları
    -   Varsa projeler/referanslar
    -   İletişime yönlendiren CTA
    -   Telefon/WhatsApp gibi hızlı iletişim bağlantıları
2.  **Hakkımızda**
    -   Firma tanıtımı, misyon, vizyon ve değerler
    -   Yönetilebilir metin ve görseller
3.  **Kurumsal**
    -   Kurumsal içeriklerin gösterileceği genel sayfa veya alt sayfalar
    -   Gereksinime göre kalite belgeleri, üretim yaklaşımı ve kurumsal
        bilgiler
4.  **Ürünler / Ürün Kataloğu**
    -   Ürün kartları, görsel, ürün adı ve ürün kodu (varsa)
    -   Kategori/alt kategori filtreleri
    -   Metin tabanlı arama
    -   Sayfalama veya performanslı "daha fazla yükle" davranışı
    -   Sıralama: varsayılan, ada göre; yalnızca veri destekliyorsa
        diğer sıralamalar
5.  **Kategori ve alt kategori sayfaları**
    -   Kategori adı, açıklaması ve varsa kapak görseli
    -   İlgili ürün listesi
    -   SEO dostu kategori URL'si
6.  **Ürün Detay**
    -   Ürün adı ve ürün kodu
    -   Ana görsel ve galeri
    -   Açıklama
    -   Özellikler, ölçüler, malzeme, renk seçenekleri ve teknik
        bilgiler (varsa)
    -   Kategori/alt kategori
    -   Benzer veya ilişkili ürünler (veri mevcutsa)
    -   "Bilgi alın" / "Teklif isteyin" CTA'sı; e-ticaret sipariş akışı
        oluşturulmayacak
7.  **Hizmetlerimiz / Çalışma Alanlarımız**
    -   Hizmet listesi ve detayları
    -   İsteğe bağlı sektör veya kullanım alanı içerikleri
8.  **Projeler / Referanslar** (opsiyonel)
    -   Müşteri içerik ve görsel sağlarsa etkinleştirilir
    -   Yayına alınmış proje kartları ve proje detayları
9.  **Kampanyalar / Duyurular** (opsiyonel)
    -   Yönetilebilir liste ve detay sayfası
    -   İçerik yoksa boş bir menü öğesi gösterilmemeli
10. **Blog / Haberler** (opsiyonel)
    -   Liste, detay, yayın tarihi, kapak görseli ve SEO alanları
    -   İçerik yoksa navigasyonda gizlenebilir
11. **İletişim**
    -   Ad, e-posta, telefon, adres, çalışma saatleri
    -   İletişim formu
    -   Telefon, e-posta ve WhatsApp bağlantıları
    -   Sosyal medya bağlantıları
12. **Konum / Harita**
    -   Yönetilebilir adres ve harita bağlantısı veya gömülü harita
    -   Harita yüklenemese de adres ve harici harita bağlantısı
        kullanılabilir olmalı
13. **Yasal sayfalar**
    -   Gizlilik Politikası
    -   KVKK Aydınlatma Metni
    -   Çerez Politikası (çerez/analitik kullanımı varsa)
    -   Yasal Bilgilendirme
    -   Metinler yönetilebilir olmalı. Hukuki metinler örnek olarak
        otomatik uydurulmamalı; yayına alınmadan önce işletme/hukuk
        danışmanı tarafından doğrulanmalı.

### 4.2 Yönetim paneli

Yönetim paneli ayrı bir `/admin` alanında veya mevcut proje yapısına
uygun korumalı bir bölümde yer alabilir. Tasarım sade, iş odaklı ve
responsive olmalıdır.

-   Giriş ve çıkış
-   Özet ekranı: ürün sayısı, kategori sayısı ve okunmamış mesaj sayısı
    gibi temel göstergeler
-   Ürün yönetimi
-   Kategori ve alt kategori yönetimi
-   Ürün görsel galerisi yönetimi
-   Ana sayfa banner/slider yönetimi
-   Hakkımızda ve kurumsal içerik yönetimi
-   Hizmet yönetimi
-   Referans/proje yönetimi (opsiyonel)
-   Duyuru ve blog yönetimi (opsiyonel)
-   İletişim bilgileri ve sosyal medya ayarları
-   Gelen iletişim mesajları
-   Yasal sayfa metinleri ve temel SEO alanları
-   Yayında/taslak durumu

Opsiyonel modüller yapılandırılabilir olmalı; etkin olmayan modüller boş
sayfalar veya bozuk menüler üretmemelidir.

## 5. Ürün kataloğu gereksinimleri

### 5.1 Ürün alanları

Her ürün için aşağıdaki alanları destekle:

-   `Id`: benzersiz kimlik
-   `Name`: zorunlu ürün adı
-   `Slug`: SEO uyumlu, benzersiz URL parçası
-   `ProductCode`: ürün kodu; varsa benzersiz olmalı
-   `ShortDescription`: kısa tanıtım
-   `Description`: ayrıntılı açıklama
-   `CategoryId`: zorunlu kategori ilişkisi
-   `SubcategoryId`: tasarıma göre kategori hiyerarşisi içinde temsil
    edilebilir
-   `Specifications`: özellik adı/değer çiftleri
-   `Dimensions`: genişlik, yükseklik, derinlik ve birim gibi
    yapılandırılmış ölçüler; ürün tipine göre eksik alanlara izin ver
-   `Materials`: malzeme bilgileri
-   `ColorOptions`: renk seçenekleri
-   `TechnicalDetails`: ek teknik bilgi alanları
-   `Images`: bir veya daha fazla görsel; sıralama ve kapak görseli
    desteği
-   `IsFeatured`: öne çıkan ürün
-   `Status`: taslak/yayında/arşiv gibi kontrollü durum
-   `SortOrder`: manuel sıralama
-   `MetaTitle`, `MetaDescription`
-   `CreatedAt`, `UpdatedAt`

Dinamik özellikler için gereksiz yere her yeni niteliğe ayrı veritabanı
sütunu ekleme. Yapılandırılmış JSON veya ilişkisel özellik/değer modeli
seçimini mevcut mimari, sorgulama ihtiyacı ve veritabanı özelliklerine
göre gerekçelendir.

### 5.2 Ürün davranışları

-   Ziyaretçi yalnızca yayındaki ürünleri görür.
-   Taslak/arşiv ürünler herkese açık API üzerinden sızdırılmaz.
-   Ürün detayları slug ile açılabilir; kimlik tabanlı dahili API
    rotaları da kullanılabilir.
-   Arama ve filtreleme backend tarafında yapılır.
-   Liste uç noktaları sayfalama, sıralama ve sınırlandırılmış sayfa
    boyutu destekler.
-   Kategori silme işleminde ilişkili ürünler için açık davranış
    tanımlanır; ürünler sessizce kaybolmamalıdır.
-   Görsel sıralaması ve kapak görseli tutarlı biçimde saklanır.
-   Görsel yoksa kırık resim yerine tasarlanmış bir placeholder
    gösterilir.

## 6. İçerik ve medya yönetimi

-   Ürün, kategori, banner ve içerik görselleri yönetim panelinden
    yüklenebilmelidir.
-   Yükleme sırasında dosya türü, dosya boyutu ve dosya adı
    doğrulanmalıdır.
-   İzin verilen türler yalnızca ihtiyaç duyulan güvenli raster görsel
    biçimleriyle sınırlandırılmalıdır (ör. JPEG, PNG, WebP); SVG
    yüklemesi ayrıca güvenlik değerlendirmesi yapılmadan açılmamalıdır.
-   Dosyalar rastgele/güvenli adlarla saklanmalı; kullanıcıdan gelen
    dosya adı doğrudan fiziksel yol olarak kullanılmamalıdır.
-   Üretim ortamında kalıcı depolama kullanılmalıdır. Yerel dosya
    sistemi veya bulut nesne depolama seçimi yapılandırılabilir olmalı.
-   Görseller için alternatif metin (`alt`) alanı desteklenmelidir.
-   Büyük görseller için uygun boyutlandırma, sıkıştırma ve lazy loading
    uygulanmalıdır.
-   İçerik düzenleyici varsa HTML çıktısı güvenli şekilde temizlenmeli;
    XSS'e açık içerik çalıştırılmamalıdır.

## 7. İletişim ve potansiyel müşteri toplama

### 7.1 İletişim formu alanları

-   Ad soyad (zorunlu)
-   E-posta veya telefon (en az biri zorunlu)
-   Telefon (opsiyonel olabilir)
-   Konu (opsiyonel)
-   Mesaj (zorunlu)
-   Gizlilik/KVKK bilgilendirmesine ilişkin uygun metin ve gerekiyorsa
    onay alanı

KVKK metni ve açık rıza gerekliliği kullanım amacına göre hukuk
danışmanı tarafından doğrulanmalıdır; aydınlatma metni ile açık rıza
aynı şeymiş gibi tasarlanmamalıdır.

### 7.2 Form davranışları

-   Frontend ve backend doğrulaması yapılır.
-   Başarılı gönderimde kullanıcıya anlaşılır onay mesajı gösterilir.
-   Hatalar alan bazında ve erişilebilir biçimde sunulur.
-   Sunucu hataları teknik ayrıntıları veya stack trace'i kullanıcıya
    göstermez.
-   Basit spam koruması ve rate limiting uygulanır; CAPTCHA gerekiyorsa
    ayrıca kararlaştırılır.
-   Mesajlar yönetim panelinde tarih, iletişim bilgileri ve durumuyla
    görüntülenir.
-   Durumlar en azından "Yeni", "İnceleniyor", "Yanıtlandı" olarak
    yönetilebilir.
-   Form verileri gereğinden uzun süre tutulmamalı; saklama ve silme
    politikası belirlenmelidir.

### 7.3 Hızlı iletişim bağlantıları

-   Telefon: `tel:` bağlantısı
-   E-posta: `mailto:` bağlantısı
-   WhatsApp: yapılandırılmış telefon numarası ile doğru biçimde
    oluşturulan bağlantı
-   Harita: harici harita bağlantısı veya onaylanan gömülü harita
-   Sosyal medya: yalnızca yönetim panelinde tanımlanan bağlantılar
    gösterilir

İletişim bilgileri kod içine gömülmek yerine yönetilebilir site
ayarlarında saklanmalıdır.

## 8. Teknik mimari

### 8.1 Genel yapı

Önerilen sorumluluk ayrımı:

-   **Frontend:** React uygulaması; ziyaretçi arayüzü ve admin paneli
-   **Backend:** ASP.NET Core Web API; iş kuralları, doğrulama, kimlik
    doğrulama, yetkilendirme ve veri erişimi
-   **Veritabanı:** ilişkisel veritabanı; Entity Framework Core
    kullanımı
-   **Medya depolama:** yapılandırılabilir yerel veya nesne depolama
-   **API dokümantasyonu:** geliştirme ortamında Swagger/OpenAPI

Mevcut proje mimarisi farklıysa gereksiz yeniden yapılandırma yapmadan
bu sorumlulukları mevcut yapıya uyarlayın.

### 8.2 Backend modülleri

-   Authentication / Authorization
-   Products
-   Categories
-   SiteContent / Pages
-   Banners
-   Services
-   Projects / References (opsiyonel)
-   News / Blog (opsiyonel)
-   ContactMessages
-   SiteSettings
-   Media / Uploads
-   SEO metadata

Kod tekrarını azalt; ancak küçük bir projede gereksiz katmanlar veya
aşırı soyutlama üretme. DTO'ları entity'lerden ayır. İstek modellerini
doğrula ve istemciye veritabanı entity'lerini doğrudan açma.

### 8.3 Örnek API uç noktaları

Rotalar mevcut projedeki konvansiyonlara göre uyarlanabilir.

**Herkese açık** -
`GET /api/products?page=1&pageSize=12&category=&search=&sort=` -
`GET /api/products/{slug}` - `GET /api/categories` -
`GET /api/categories/{slug}` - `GET /api/pages/{slug}` -
`GET /api/banners` - `GET /api/services` - `GET /api/projects`
(opsiyonel) - `GET /api/news` ve `GET /api/news/{slug}` (opsiyonel) -
`GET /api/site-settings/public` - `POST /api/contact-messages`

**Yönetici tarafından kullanılan, kimlik doğrulama ve yetki
gerektiren** - `POST /api/admin/products` -
`PUT /api/admin/products/{id}` - `DELETE /api/admin/products/{id}` veya
arşivleme - `GET /api/admin/products` - `POST /api/admin/categories` -
`PUT /api/admin/categories/{id}` - `DELETE /api/admin/categories/{id}` -
Benzer CRUD rotaları banner, içerik, hizmet, referans ve blog modülleri
için - `GET /api/admin/contact-messages` -
`PATCH /api/admin/contact-messages/{id}/status` -
`PUT /api/admin/site-settings` - `POST /api/admin/media`

Admin rotalarının tamamı backend tarafında doğrulanmış yönetici yetkisi
gerektirmelidir. Örnek rotalar nihai API sözleşmesi değildir; tutarlı
REST yaklaşımıyla tamamlanmalıdır.

### 8.4 API standartları

-   Tutarlı HTTP durum kodları kullan.
-   Liste sonuçlarında tutarlı sayfalama metaverisi döndür.
-   Hataları tek bir anlaşılır formatta sun; ASP.NET Core
    `ProblemDetails` kullanılabilir.
-   Beklenmeyen hataları logla, fakat hassas verileri loglama.
-   İstemciye stack trace, SQL ayrıntısı veya gizli yapılandırma
    döndürme.
-   Geliştirme ortamı dışında Swagger erişimini ihtiyaca göre sınırla.
-   CORS yalnızca tanımlı frontend origin'lerine izin verecek şekilde
    yapılandırılmalı.
-   Veritabanı değişiklikleri migration ile yönetilmeli.
-   Zaman damgalarında tutarlı UTC yaklaşımı kullan; arayüzde
    gerektiğinde yerel saat göster.

## 9. Kimlik doğrulama ve güvenlik

-   Admin paneli anonim kullanıcılara yönetim işlemi yaptırmamalıdır.
-   Kimlik doğrulama yöntemi mevcut projeye göre seçilmeli; token
    tabanlı yaklaşım kullanılırsa token saklama ve yenileme güvenliği
    dikkatle ele alınmalıdır.
-   Parolalar düz metin tutulmamalı; ASP.NET Core Identity veya
    güvenilir parola hash mekanizması kullanılmalıdır.
-   Yetki kontrolü API üzerinde uygulanmalıdır.
-   Giriş denemeleri için rate limiting ve uygun hata mesajları
    kullanılmalıdır.
-   Girdi doğrulama, SQL injection, XSS, CSRF (kullanılan kimlik
    doğrulama modeline göre), açık yönlendirme ve dosya yükleme riskleri
    ele alınmalıdır.
-   Secret ve bağlantı dizeleri environment variable veya secret manager
    ile sağlanmalıdır.
-   Üretim ortamında HTTPS zorunlu olmalıdır.
-   Güvenlik başlıkları ve uygun cache politikaları
    değerlendirilmelidir.
-   Kişisel veriler loglara gereksiz yere yazılmamalıdır.
-   Yönetici hesapları için ilk kurulum/seed süreci güvenli olmalı;
    varsayılan herkese açık admin parolası bulunmamalıdır.

## 10. Frontend gereksinimleri

### 10.1 Tasarım yaklaşımı

-   Modern, kurumsal, sade ve ürün görsellerini öne çıkaran tasarım.
-   Mobilya fotoğraflarını ön plana alan geniş görsel alanlar ve temiz
    tipografi.
-   Tutarlı renk, boşluk, buton, kart, form ve başlık sistemi.
-   Marka renkleri ve logo sağlandığında tasarıma entegre edilmeli;
    sağlanmadıysa kolay değiştirilebilir tasarım token'ları
    kullanılmalı.
-   Gerçek içerik sağlanana kadar örnek içeriklerin örnek olduğu açık
    olmalı.

### 10.2 Responsive davranış

-   Mobil, tablet, dizüstü ve geniş masaüstü ekranlarda test et.
-   Mobil navigasyon açılıp kapanabilir ve klavye ile kullanılabilir
    olmalı.
-   Ürün grid'i ekran genişliğine göre sütun sayısını değiştirmeli.
-   Görseller en-boy oranını korumalı ve sayfa düzeninde ani kaymalara
    yol açmamalı.
-   Form alanları ve CTA butonları dokunmatik ekranda rahat
    kullanılmalı.
-   Yatay taşma olmamalı.

### 10.3 Kullanılabilirlik ve erişilebilirlik

-   Semantik HTML kullan; tek ve anlamlı bir H1, mantıklı başlık
    hiyerarşisi oluştur.
-   Görsellerde uygun alt metin; dekoratif görsellerde boş alt metin
    kullan.
-   Formlarda görünür etiketler ve anlaşılır hata mesajları bulunmalı.
-   Klavye odağı görünür olmalı; menü, modal ve formlar klavyeyle
    kullanılabilmeli.
-   Renk kontrastı yeterli olmalı.
-   Yükleniyor, boş sonuç, hata ve başarı durumları tasarlanmalı.
-   API isteği başarısız olduğunda kullanıcıya anlaşılır hata ve
    gerektiğinde tekrar deneme imkânı sunulmalı.
-   React bileşenleri anlamlı sorumluluklara ayrılmalı; gereksiz tek
    dosya yığılması önlenmeli.

### 10.4 Frontend teknik yaklaşımı

-   API base URL yapılandırma üzerinden okunmalı; kaynak koda ortama
    özel adres yazılmamalı.
-   API çağrıları ortak bir katmanda toplanmalı.
-   Yükleniyor/hata/boş durumları tutarlı yönetilmeli.
-   Form doğrulaması kullanıcı deneyimi için frontend'de, güvenlik ve
    veri tutarlılığı için backend'de yapılmalı.
-   Projede TypeScript zaten kullanılıyorsa korunmalı; yeni kurulumda
    tercih edilmesi önerilir.
-   Gereksiz global state kullanma; yerel state ve gerektiğinde uygun
    bir veri getirme/cache çözümü kullan.
-   Paket eklemeden önce mevcut bağımlılıkları değerlendir.

## 11. SEO gereksinimleri

-   Okunabilir ve benzersiz slug yapısı.
-   Her önemli sayfa için yönetilebilir `title` ve `meta description`.
-   Ürün/kategori detaylarında sayfaya özgü metadata.
-   Canonical URL desteği, gerektiğinde.
-   `robots.txt` ve XML `sitemap.xml`.
-   Yalnızca indekslenmesi istenen yayınlanmış içerikleri sitemap'e
    ekle.
-   Taslak, admin ve hassas sayfaları indekslenebilir hale getirme.
-   Görsel alt metinleri.
-   Doğru H1-H2-H3 hiyerarşisi.
-   Sosyal paylaşım için Open Graph metadata; ihtiyaç varsa Twitter/X
    kart metadata'sı.
-   Uygunsa Organization, BreadcrumbList ve Product benzeri
    yapılandırılmış veriler; gerçek olmayan fiyat, stok veya
    değerlendirme bilgisi üretme.
-   React uygulamasında arama motoru indeksleme ihtiyacı
    değerlendirilmelidir. Gerekliyse SSR/SSG veya prerender yaklaşımı
    seç; yalnızca client-side render'ın her durumda yeterli olduğunu
    varsayma.
-   URL değişiklikleri için gerekirse 301 yönlendirmeleri planla.

## 12. Performans

-   Ürün listelerinde backend sayfalaması kullan.
-   Görselleri uygun boyut ve formatta sun; lazy loading uygula.
-   İlk ekranda görünen ana görseli gereksiz yere lazy-load etme.
-   Gereksiz yeniden render ve büyük bundle'lardan kaçın.
-   Statik dosyalarda cache politikaları uygula.
-   API sorgularında gerekli alanları çek; N+1 sorgu risklerini kontrol
    et.
-   Liste endpoint'lerine makul varsayılan ve maksimum sayfa boyutu koy.
-   Üretim derlemesi ve temel Lighthouse/Web Vitals kontrolleri
    yapılabilir olmalı.

## 13. Yasal ve çerez yaklaşımı

-   Gizlilik, KVKK, çerez ve yasal bilgilendirme metinleri yönetilebilir
    içerik olarak tasarlanmalı.
-   Hukuki metinler işletme tarafından onaylanmadan "hukuken uygundur"
    şeklinde sunulmamalı.
-   Zorunlu olmayan analitik/reklam çerezleri kullanılacaksa gerekli
    izin ve tercih mekanizması ayrıca planlanmalıdır.
-   Üçüncü taraf harita, video, analitik veya benzeri gömülü servislerin
    veri ve çerez etkileri dikkate alınmalıdır.
-   Bu doküman hukuki danışmanlık yerine geçmez.

## 14. Önerilen veri modeli

Aşağıdaki model başlangıç önerisidir; mevcut veritabanı ve mimariye göre
uyarlanmalıdır.

-   `Product`
-   `ProductImage`
-   `Category` (üst kategori ilişkisiyle alt kategorileri
    destekleyebilir)
-   `PageContent`
-   `Banner`
-   `Service`
-   `Project` (opsiyonel)
-   `NewsArticle` (opsiyonel)
-   `ContactMessage`
-   `SiteSetting`
-   `AdminUser` (Identity veya mevcut güvenli kullanıcı altyapısı)
-   Gerekirse `ProductSpecification` veya yapılandırılmış özellik alanı

Genel alanlar için uygun yerlerde `Id`, `CreatedAt`, `UpdatedAt`,
`IsPublished` veya durum alanları kullan. İlişkiler, indeksler,
benzersizlik kuralları ve silme davranışları açıkça tanımlansın.
Veritabanına özgü türleri veya karmaşık JSON modelini seçmeden önce
sorgulama ihtiyaçlarını göz önünde bulundur.

## 15. Önemli iş kuralları

1.  Ziyaretçi yalnızca yayındaki içerikleri görür.
2.  Admin CRUD uç noktaları yetkisiz erişime kapalıdır.
3.  Slug alanları ilgili içerik türünde benzersiz olmalıdır.
4.  Ürün listeleme filtreleri, sayfalama ve sıralama backend tarafından
    uygulanır.
5.  Form doğrulaması frontend ve backend'de yapılır.
6.  İletişim formu mesajı kaydedilmeden başarılı yanıt dönülmez.
7.  Ürün/kategori silme işlemleri ilişkili kayıtları kontrol eder.
8.  Silme yerine arşivleme tercih edilebilecek içeriklerde yanlışlıkla
    veri kaybı önlenir.
9.  Site iletişim bilgileri ve sosyal medya bağlantıları tek bir
    yönetilebilir ayar kaynağından okunur.
10. Opsiyonel modüller içerik yokken boş menü veya kırık bağlantı
    üretmez.
11. Örnek/seed veriler gerçek müşteri veya gerçek ürün bilgisi gibi
    sunulmaz.
12. Yönetim işlemleri için gerektiğinde audit log eklenebilir; hassas
    kişisel veriler loglanmaz.

## 16. Test gereksinimleri

### Backend

-   Ürün listeleme, arama, filtreleme ve sayfalama testleri
-   Slug ile ürün detayı ve yayın durumu testleri
-   DTO ve doğrulama testleri
-   Yetkisiz admin isteğinin reddedilmesi
-   İletişim formu doğrulama ve başarılı kayıt testleri
-   Kategori silme ve ilişkili ürün davranışı testleri
-   Dosya yükleme türü/boyutu kontrolleri

### Frontend

-   Sayfaların yüklenme, hata ve boş durumları
-   Ürün filtreleme ve ürün detay navigasyonu
-   İletişim formu doğrulama ve gönderim davranışı
-   Admin rotalarının yetkisiz kullanıcıya açılmaması
-   Mobil menü ve responsive ürün grid'i
-   Temel klavye erişilebilirliği

### Entegrasyon / kabul

-   Yeni kurulum talimatlarıyla uygulama ayağa kalkabilmeli.
-   Migration'lar uygulanabilmeli.
-   Yönetici giriş yaptıktan sonra ürün oluşturup düzenleyebilmeli.
-   Yayına alınan ürün katalogda ve detay sayfasında görünmeli.
-   Ziyaretçinin gönderdiği iletişim mesajı admin panelinde görünmeli.
-   Telefon, e-posta, WhatsApp ve harita bağlantıları doğru çalışmalı.
-   SEO dosyaları ve sayfa metadata'sı doğrulanmalı.

## 17. Teslimat ve geliştirme aşamaları

### Aşama 1 --- Depo inceleme ve plan

-   Mevcut klasör yapısı, .NET ve React sürümleri, bağımlılıklar,
    veritabanı ve mevcut kod incelenir.
-   Önerilen mimari ve yapılacak işler kısa bir plan halinde sunulur.
-   Çalışan mevcut özellikler korunur.

### Aşama 2 --- Temel altyapı

-   Backend yapılandırması, veritabanı bağlantısı ve migration
-   Frontend routing ve ortak layout
-   Ortak hata/validasyon yaklaşımı
-   Geliştirme ortamı yapılandırması ve README

### Aşama 3 --- Katalog

-   Kategori ve ürün modeli/API'leri
-   Ürün listeleme, arama, filtreleme, sayfalama
-   Ürün detay ve galeri
-   Admin ürün/kategori CRUD işlemleri

### Aşama 4 --- Kurumsal içerikler

-   Ana sayfa, hakkımızda, kurumsal, hizmetler ve iletişim
-   Banner ve site ayarları
-   Opsiyonel modüllerin gereksinime göre eklenmesi

### Aşama 5 --- Admin ve güvenlik

-   Güvenli admin giriş/çıkış
-   Rol/yetki kontrolleri
-   İletişim mesajları ve medya yönetimi
-   Güvenlik doğrulamaları

### Aşama 6 --- SEO, responsive ve kalite

-   Metadata, sitemap, robots
-   Mobil/tablet/masaüstü testleri
-   Erişilebilirlik ve performans iyileştirmeleri
-   Otomatik testler ve hata düzeltmeleri

### Aşama 7 --- Son kontrol ve teslim

-   Kurulum/çalıştırma dokümantasyonu
-   Environment değişkenleri örnek dosyası (`.env.example` gibi; gerçek
    sırlar olmadan)
-   Migration ve seed yönergeleri
-   Bilinen eksikler ve sonraki adımlar

Her aşamanın sonunda yapılan değişiklikleri, test sonuçlarını ve kalan
işleri özetle. Test çalıştırılamadıysa başarılıymış gibi belirtme.

## 18. Kabul kriterleri

Proje aşağıdaki koşullar sağlandığında ilk sürüm için kabul edilebilir:

-   [ ] Belirlenen temel sayfalar responsive şekilde görüntüleniyor.
-   [ ] Ürünler kategori ve detay sayfaları üzerinden gezilebiliyor.
-   [ ] Ürün arama, filtreleme ve sayfalama çalışıyor.
-   [ ] Yönetici güvenli şekilde giriş yapabiliyor.
-   [ ] Yönetici ürün, kategori ve görselleri yönetebiliyor.
-   [ ] Ana sayfa banner ve temel kurumsal içerikler yönetilebilir.
-   [ ] İletişim formu doğrulanmış mesajları kaydediyor.
-   [ ] Yönetici gelen mesajları görebiliyor ve durumunu
    güncelleyebiliyor.
-   [ ] Telefon, e-posta, WhatsApp ve harita bağlantıları
    yapılandırılabiliyor.
-   [ ] Yayınlanmış sayfalarda temel SEO metadata'sı bulunuyor.
-   [ ] Sitemap ve robots dosyaları doğru içerik üretiyor.
-   [ ] Yetkisiz kullanıcılar admin işlemlerini API üzerinden
    gerçekleştiremiyor.
-   [ ] Dosya yüklemeleri doğrulanıyor.
-   [ ] Hata, yükleniyor ve boş durumları ele alınmış.
-   [ ] Temel testler ve kurulum talimatları mevcut.
-   [ ] Gerçek olmayan içerik, müşteri referansı veya ürün özelliği
    gerçekmiş gibi sunulmuyor.

## 19. Açık kararlar / müşteriden beklenen bilgiler

Kod ajanı geliştirmeyi bloke etmeyen alanlarda varsayılanlarla
ilerleyebilir; aşağıdaki bilgiler sağlandığında içerik ve görsel tasarım
kesinleştirilmelidir.

-   Marka adı, logo, kurumsal renkler ve tipografi
-   Firma iletişim bilgileri, adres ve harita bağlantısı
-   WhatsApp/telefon/e-posta bilgileri
-   Gerçek ürün listesi, kategori ağacı, ürün kodları ve teknik veriler
-   Ürün fotoğrafları ve görsel kullanım hakları
-   Hakkımızda, kurumsal ve hizmet metinleri
-   Referans/proje, kampanya ve blog modüllerinin etkinleştirilip
    etkinleştirilmeyeceği
-   Veritabanı türü ve barındırma ortamı
-   Medya depolama tercihi
-   Admin kullanıcılarının ve rollerinin kapsamı
-   İstatistik/analitik veya üçüncü taraf servis ihtiyacı
-   Hukuk danışmanı tarafından onaylanmış yasal metinler

## 20. Kod ajanından beklenen ilk yanıt

Kod yazmaya başlamadan önce: 1. Mevcut depo yapısını ve teknoloji
sürümlerini özetle. 2. Bu gereksinimlere göre mevcut mimariyle uyumlu
uygulama planını çıkar. 3. Belirsiz veya riskli kararları ve
varsayımlarını belirt. 4. İlk aşamada değiştirilecek/oluşturulacak
dosyaları listele. 5. Ardından Aşama 1'den başlayarak ilerle; tüm
projeyi tek seferde kontrolsüz biçimde yeniden yazma.
