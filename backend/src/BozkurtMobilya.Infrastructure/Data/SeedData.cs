using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BozkurtMobilya.Infrastructure.Data;

/// <summary>
/// Uygulama ilk çalıştığında admin kullanıcı ve temel site ayarlarını oluşturur.
/// Gerçek kimlik bilgileri environment variable ile sağlanmalıdır.
/// </summary>
public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider services, IConfiguration configuration)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var db = services.GetRequiredService<AppDbContext>();

        // Rol oluştur
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));

        // Admin kullanıcı oluştur (yalnızca daha önce oluşturulmadıysa)
        var adminEmail = configuration["AdminSeed:Email"]
            ?? throw new InvalidOperationException("AdminSeed:Email yapılandırılmamış.");
        var adminPassword = configuration["AdminSeed:Password"]
            ?? throw new InvalidOperationException("AdminSeed:Password yapılandırılmamış.");

        var existing = await userManager.FindByEmailAsync(adminEmail);
        if (existing is null)
        {
            var admin = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(admin, adminPassword);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Temel site ayarlarını oluştur (yoksa)
        var defaultSettings = new[]
        {
            new { Key = "SiteName",       Value = "Bozkurt Mobilya",              Group = "General" },
            new { Key = "PhoneNumber",    Value = "+90 555 000 0000",             Group = "Contact" },
            new { Key = "Email",          Value = "info@ornekbozkurtmobilya.com", Group = "Contact" },
            new { Key = "WhatsApp",       Value = "+905550000000",                Group = "Contact" },
            new { Key = "Address",        Value = "Örnek Mah. Mobilya Cad. No:1, Şehir",  Group = "Contact" },
            new { Key = "WorkingHours",   Value = "Pzt-Cts: 09:00-18:00",        Group = "Contact" },
            new { Key = "InstagramUrl",   Value = "",                             Group = "Social" },
            new { Key = "FacebookUrl",    Value = "",                             Group = "Social" },
            new { Key = "YoutubeUrl",     Value = "",                             Group = "Social" },
            new { Key = "LinkedInUrl",    Value = "",                             Group = "Social" },
            new { Key = "MapEmbedUrl",    Value = "",                             Group = "Location" },
            new { Key = "MapExternalUrl", Value = "https://maps.google.com",     Group = "Location" },
        };

        foreach (var s in defaultSettings)
        {
            if (!db.SiteSettings.Any(x => x.Key == s.Key))
            {
                db.SiteSettings.Add(new Domain.Entities.SiteSetting
                {
                    Key = s.Key,
                    Value = s.Value,
                    Group = s.Group
                });
            }
        }

        // Temel kategorileri oluştur (yoksa)
        var defaultCategories = new[]
        {
            new { Name = "Oturma Grupları", Slug = "oturma-gruplari", SortOrder = 1 },
            new { Name = "Yemek Odası", Slug = "yemek-odasi", SortOrder = 2 },
            new { Name = "Yatak Odası", Slug = "yatak-odasi", SortOrder = 3 },
            new { Name = "Yatak", Slug = "yatak", SortOrder = 4 },
            new { Name = "Baza & Başlık", Slug = "baza-baslik", SortOrder = 5 },
            new { Name = "Genç ve Çocuk Odası", Slug = "genc-ve-cocuk-odasi", SortOrder = 6 },
            new { Name = "Bahçe Mobilyası", Slug = "bahce-mobilyasi", SortOrder = 7 },
            new { Name = "Tamamlayıcı Ürünler", Slug = "tamamlayici-urunler", SortOrder = 8 },
            new { Name = "İndirimli Ürünler", Slug = "indirimli-urunler", SortOrder = 9 }
        };

        foreach (var c in defaultCategories)
        {
            if (!db.Categories.Any(x => x.Slug == c.Slug))
            {
                db.Categories.Add(new Domain.Entities.Category
                {
                    Name = c.Name,
                    Slug = c.Slug,
                    SortOrder = c.SortOrder,
                    IsPublished = true,
                    Description = $"{c.Name} koleksiyonu ve modelleri.",
                    MetaTitle = $"{c.Name} Modelleri | Bozkurt Mobilya",
                    MetaDescription = $"En şık ve modern {c.Name.ToLower()} modelleri Bozkurt Mobilya'da."
                });
            }
        }

        await db.SaveChangesAsync();

        // Temel ürünleri oluştur (eksikler varsa ekle)
        if (db.Categories.Any())
        {
            var categories = db.Categories.ToList();
            var catMap = categories.ToDictionary(c => c.Slug, c => c.Id);

            var initialProducts = new[]
            {
                new
                {
                    Name = "Siena Yatak Odası Takımı",
                    Slug = "siena-yatak-odasi-takimi",
                    ProductCode = "BM-YTK-01",
                    CategorySlug = "yatak-odasi",
                    ShortDescription = "Doğal ahşap kaplama ve lake detaylarla lüks yatak odası takımı.",
                    Description = "Siena Yatak Odası Takımı, şıklığı ve fonksiyonelliği bir arada sunar. 6 kapaklı aynalı gardırop, bazalı karyola, 2 adet komodin ve aynalı şifonyerden oluşmaktadır. 1. sınıf fırınlanmış gürgen iskelet ve sessiz menteşe sistemi kullanılmıştır.",
                    Materials = "1. Sınıf Masif Ahşap, İthal Nubuk Başlık",
                    ColorOptions = "[\"Krem\", \"Ceviz\", \"Meşe\"]",
                    Dimensions = "{\"width\": 260, \"height\": 220, \"depth\": 65, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"62.990,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Verona Modern Yatak Odası",
                    Slug = "verona-modern-yatak-odasi",
                    ProductCode = "BM-YTK-02",
                    CategorySlug = "yatak-odasi",
                    ShortDescription = "Minimalist tasarım ve geniş depolama alanına sahip modern yatak odası takımı.",
                    Description = "Verona Yatak Odası Takımı, zarif çizgileri ve fonksiyonel gardırop düzeniyle yatak odanızı dönüştürüyor.",
                    Materials = "Doğal Meşe Kaplama, Dokulu Kumaş Başlık",
                    ColorOptions = "[\"Açık Meşe\", \"Antrasit\"]",
                    Dimensions = "{\"width\": 240, \"height\": 215, \"depth\": 60, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"54.500,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = false,
                    ImageUrl = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Siena Koltuk Takımı",
                    Slug = "siena-koltuk-takimi",
                    ProductCode = "BM-OTR-01",
                    CategorySlug = "oturma-gruplari",
                    ShortDescription = "3+3+1 lüks kumaş kaplama, ekstra konforlu süngerli oturma grubu.",
                    Description = "Siena Koltuk Takımı, 1. sınıf nubuk kumaş ve HR sünger yapısıyla üstün oturum rahatlığı sağlar.",
                    Materials = "Fırınlanmış Gürgen Ağacı, İthal Leke Tutmaz Nubuk",
                    ColorOptions = "[\"Krem\", \"Zümrüt Yeşili\", \"Bej\"]",
                    Dimensions = "{\"width\": 230, \"height\": 85, \"depth\": 95, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"39.745,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Alesta Modern Köşe Takımı",
                    Slug = "alesta-modern-kose-takimi",
                    ProductCode = "BM-OTR-02",
                    CategorySlug = "oturma-gruplari",
                    ShortDescription = "Yataklı ve sandıklı fonksiyonel modern L koltuk takımı.",
                    Description = "Alesta Köşe Takımı, modüler parçaları ve kolay açılır yatak mekanizması ile salonunuz için idealdir.",
                    Materials = "Masif İskelet, Silinebilir Şönil Kumaş",
                    ColorOptions = "[\"Gri\", \"Antrasit\", \"Terracotta\"]",
                    Dimensions = "{\"width\": 290, \"height\": 80, \"depth\": 180, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"34.900,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Woody Mutfak Masa Takımı",
                    Slug = "woody-mutfak-masa-takimi",
                    ProductCode = "BM-YMK-01",
                    CategorySlug = "yemek-odasi",
                    ShortDescription = "Doğal ahşap açılabilir masa ve 4 adet ergonomik sandalye.",
                    Description = "Woody Yemek Masası Takımı, masif meşe ayakları ve açılır tablası sayesinde kalabalık davetleriniz için pratik çözümdür.",
                    Materials = "Masif Meşe, Ergonomik Döşeme",
                    ColorOptions = "[\"Açık Ahşap\", \"Ceviz\"]",
                    Dimensions = "{\"width\": 160, \"height\": 76, \"depth\": 90, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"24.990,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Milano Yemek Odası Takımı",
                    Slug = "milano-yemek-odasi-takimi",
                    ProductCode = "BM-YMK-02",
                    CategorySlug = "yemek-odasi",
                    ShortDescription = "Aynalı konsol, açılır masa ve 6 sandalyeli lüks yemek odası.",
                    Description = "Milano Yemek Odası Takımı, zarif pirinç detayları ve zengin ceviz tonlarıyla sofralarınıza asaleti taşır.",
                    Materials = "Doğal Ceviz Kaplama, Pirinç Detay",
                    ColorOptions = "[\"Koyu Ceviz\", \"Mat Siyah\"]",
                    Dimensions = "{\"width\": 200, \"height\": 78, \"depth\": 100, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"48.850,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Flat Portmanto",
                    Slug = "flat-portmanto",
                    ProductCode = "BM-TMM-01",
                    CategorySlug = "tamamlayici-urunler",
                    ShortDescription = "Aynalı, çekmeceli ve askılıklı kompakt antre vestiyeri.",
                    Description = "Flat Portmanto, antrenizi düzenli tutacak fonksiyonel iç rafları ve şık aynasıyla geniş bir depolama sunar.",
                    Materials = "1. Kalite MDF Lake & Doğal Meşe",
                    ColorOptions = "[\"Beyaz\", \"Meşe\"]",
                    Dimensions = "{\"width\": 120, \"height\": 205, \"depth\": 42, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"27.580,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Palermo Doğal Ahşap Konsol",
                    Slug = "palermo-ahsap-konsol",
                    ProductCode = "BM-TMM-02",
                    CategorySlug = "tamamlayici-urunler",
                    ShortDescription = "Özel tasarım çıtalı kapaklı masif konsol ve dresuar.",
                    Description = "Palermo Konsol, el işçiliği ahşap çıtaları ve modern metal ayaklarıyla salonunuza estetik katar.",
                    Materials = "Fırınlanmış Masif Meşe, Elektrostatik Metal Ayak",
                    ColorOptions = "[\"Doğal Ahşap\"]",
                    Dimensions = "{\"width\": 180, \"height\": 82, \"depth\": 45, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"21.450,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = false,
                    ImageUrl = "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Luna Ortopedik Baza & Başlık",
                    Slug = "luna-ortopedik-baza-baslik",
                    ProductCode = "BM-BAZ-01",
                    CategorySlug = "baza-baslik",
                    ShortDescription = "Çift amortisörlü çelik iskeletli sandıklı baza ve kapitone başlık.",
                    Description = "Luna Baza & Başlık seti, yüksek iç hacmi ve emniyet kilitli amortisörleriyle güvenli ve konforludur.",
                    Materials = "Çelik Profil İskelet, İthal Keten Kumaş",
                    ColorOptions = "[\"Antrasit\", \"Bej\", \"Vizon\"]",
                    Dimensions = "{\"width\": 160, \"height\": 120, \"depth\": 200, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"18.990,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Capri Rattan Bahçe Oturma Grubu",
                    Slug = "capri-bahce-oturma-grubu",
                    ProductCode = "BM-BHC-01",
                    CategorySlug = "bahce-mobilyasi",
                    ShortDescription = "Hava koşullarına dayanıklı sentetik rattan ikili koltuk, 2 tekli ve sehpa.",
                    Description = "Capri Bahçe Takımı, UV ışınlarına ve suya dayanıklı rattan dokusuyla balkon ve bahçeleriniz için üretilmiştir.",
                    Materials = "Alüminyum İskelet, UV Korumalı Rattan, Su İtici Kumaş",
                    ColorOptions = "[\"Kahverengi\", \"Gri\"]",
                    Dimensions = "{\"width\": 190, \"height\": 75, \"depth\": 80, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"31.250,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Therapedic Bamboo Yatak",
                    Slug = "therapedic-bamboo-yatak",
                    ProductCode = "BM-YTK-03",
                    CategorySlug = "yatak",
                    ShortDescription = "Doğal bambu lifli nefes alan kumaşı ve 7 bölgeli paket yay sistemiyle ortopedik uyku.",
                    Description = "Therapedic Bamboo Yatak, omurgayı destekleyen anatomik yay yapısı ve terletmeyen bambu kumaşı ile konforlu bir uyku sağlar.",
                    Materials = "Doğal Bambu Kumaş, 7 Bölgeli Paket Yay, Yüksek Yoğunluklu Sünger",
                    ColorOptions = "[\"Beyaz\", \"Krem\"]",
                    Dimensions = "{\"width\": 160, \"height\": 32, \"depth\": 200, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"14.990,00 TL\", \"Garanti\": \"5 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Comfort Prime Visco Yatak",
                    Slug = "comfort-prime-visco-yatak",
                    ProductCode = "BM-YTK-04",
                    CategorySlug = "yatak",
                    ShortDescription = "Vücut ısısına duyarlı visco elastik hafızalı sünger katmanıyla basınçsız uyku.",
                    Description = "Comfort Prime Visco Yatak, vücudun ağırlık noktalarına göre şekil alarak kan dolaşımını rahatlatır ve derin dinlenme sağlar.",
                    Materials = "Visco Akıllı Sünger, HR Destek Süngeri, Örme Kumaş",
                    ColorOptions = "[\"Beyaz\"]",
                    Dimensions = "{\"width\": 180, \"height\": 28, \"depth\": 200, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"16.750,00 TL\", \"Garanti\": \"5 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = false,
                    ImageUrl = "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Nova Genç Odası Takımı",
                    Slug = "nova-genc-odasi-takimi",
                    ProductCode = "BM-GNC-01",
                    CategorySlug = "genc-ve-cocuk-odasi",
                    ShortDescription = "Çalışma masası, kitaplık, 3 kapaklı gardırop ve başlıklı karyoladan oluşan modern genç odası.",
                    Description = "Nova Genç Odası, fonksiyonel depolama alanları, ergonomik çalışma masası ve dayanıklı gövdesiyle gençlerin dinamik dünyasına uygun olarak tasarlandı.",
                    Materials = "1. Kalite MDF ve E1 Standartlarında Melamin Yonga Levha",
                    ColorOptions = "[\"Meşe & Antrasit\", \"Beyaz & Ceviz\"]",
                    Dimensions = "{\"width\": 200, \"height\": 210, \"depth\": 60, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"34.900,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Mars Montessori Çocuk Odası",
                    Slug = "mars-montessori-cocuk-odasi",
                    ProductCode = "BM-GNC-02",
                    CategorySlug = "genc-ve-cocuk-odasi",
                    ShortDescription = "Çocukların bağımsız gelişimini destekleyen doğal ahşap yer yatağı ve alçak dolap ünitesi.",
                    Description = "Mars Montessori Çocuk Odası, çocuğunuzun güvenliği ve bağımsızlığı için sıfır kimyasal su bazlı vernik ve yuvarlatılmış masif çam köşelerle üretilmiştir.",
                    Materials = "Doğal Masif Çam Ağacı, Toksiksiz Su Bazlı Boya",
                    ColorOptions = "[\"Doğal Ahşap\", \"Beyaz\"]",
                    Dimensions = "{\"width\": 100, \"height\": 140, \"depth\": 200, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"21.500,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\"}",
                    IsFeatured = false,
                    ImageUrl = "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Torino Koltuk Takımı (%25 İndirim)",
                    Slug = "torino-koltuk-takimi-indirim",
                    ProductCode = "BM-IND-01",
                    CategorySlug = "indirimli-urunler",
                    ShortDescription = "Leke tutmaz kadife dokuma kumaş ve ceviz ayak detaylarıyla sınırlı stok kampanya ürünü.",
                    Description = "Torino Koltuk Takımı, 3'lü yataklı koltuk ve 1 adet döner berjerden oluşmaktadır. Sezon sonuna özel avantajlı indirim fırsatıyla Bozkurt Mobilya mağazalarında.",
                    Materials = "Fırınlanmış Gürgen İskelet, Silinebilir Kadife Kumaş",
                    ColorOptions = "[\"Zümrüt Yeşili\", \"Krem\"]",
                    Dimensions = "{\"width\": 230, \"height\": 85, \"depth\": 95, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"28.900,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\", \"Eski Fiyat\": \"38.500,00 TL\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
                },
                new
                {
                    Name = "Venedik Yatak Odası Takımı (%30 İndirim)",
                    Slug = "venedik-yatak-odasi-takimi-indirim",
                    ProductCode = "BM-IND-02",
                    CategorySlug = "indirimli-urunler",
                    ShortDescription = "Aynalı sürgülü gardırop, bazalı karyola ve şifonyer içeren teşhir indirim fırsatı.",
                    Description = "Venedik Yatak Odası Takımı, şıklığı ve fonksiyonelliği bir arada sunan özel indirimli koleksiyon parçasıdır.",
                    Materials = "MDF Kaplama, Akrilik Lake Boya",
                    ColorOptions = "[\"Krem & Altın\"]",
                    Dimensions = "{\"width\": 250, \"height\": 220, \"depth\": 65, \"unit\": \"cm\"}",
                    Specs = "{\"Fiyat\": \"43.800,00 TL\", \"Garanti\": \"2 Yıl\", \"Montaj\": \"Ücretsiz\", \"Eski Fiyat\": \"62.000,00 TL\"}",
                    IsFeatured = true,
                    ImageUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                }
            };

            var existingSlugs = db.Products.Select(p => p.Slug).ToHashSet();

            foreach (var p in initialProducts)
            {
                if (existingSlugs.Contains(p.Slug))
                    continue;

                if (catMap.TryGetValue(p.CategorySlug, out var catId))
                {
                    var product = new Domain.Entities.Product
                    {
                        Name = p.Name,
                        Slug = p.Slug,
                        ProductCode = p.ProductCode,
                        CategoryId = catId,
                        ShortDescription = p.ShortDescription,
                        Description = p.Description,
                        Materials = p.Materials,
                        ColorOptions = p.ColorOptions,
                        Dimensions = p.Dimensions,
                        Specifications = p.Specs,
                        Status = Domain.Enums.ProductStatus.Published,
                        IsFeatured = p.IsFeatured,
                        SortOrder = 1,
                        Images = new List<Domain.Entities.ProductImage>
                        {
                            new Domain.Entities.ProductImage
                            {
                                Url = p.ImageUrl,
                                AltText = p.Name,
                                IsCover = true,
                                SortOrder = 1
                            }
                        }
                    };
                    db.Products.Add(product);
                }
            }

            await db.SaveChangesAsync();
        }
    }
}
