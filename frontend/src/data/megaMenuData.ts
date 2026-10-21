export interface SubcategoryItem {
  name: string;
  slug: string;
  searchKeyword?: string;
  imageUrl: string;
}

export interface CategoryMegaMenuData {
  featuredImage: string;
  featuredTitle: string;
  featuredSubtitle?: string;
  featuredLink: string;
  subcategories: SubcategoryItem[];
}

export const MEGA_MENU_DATA: Record<string, CategoryMegaMenuData> = {
  'oturma-gruplari': {
    featuredImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80',
    featuredTitle: '2026 Oturma Odası Trendleri',
    featuredSubtitle: 'Üstün konfor ve modern hatların mükemmel uyumu.',
    featuredLink: '/urunler/oturma-gruplari',
    subcategories: [
      {
        name: 'Koltuk Takımları',
        slug: 'koltuk-takimlari',
        searchKeyword: 'Koltuk Takımı',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Köşe Koltuk',
        slug: 'kose-koltuk',
        searchKeyword: 'Köşe Koltuk',
        imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Kanepe / Koltuk',
        slug: 'kanepe-koltuk',
        searchKeyword: 'Kanepe',
        imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Sleeper (Yataklı)',
        slug: 'sleeper',
        searchKeyword: 'Yataklı',
        imageUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Tekli Koltuk & Berjer',
        slug: 'tekli-koltuk-berjer',
        searchKeyword: 'Berjer',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'TV Koltuğu & Baba Koltuğu',
        slug: 'tv-koltugu',
        searchKeyword: 'TV Koltuğu',
        imageUrl: 'https://images.unsplash.com/photo-1580481077111-9a7428fef6f8?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'TV Üniteleri & Tv Sehpaları',
        slug: 'tv-uniteleri',
        searchKeyword: 'TV Ünitesi',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Sehpa & Sehpa Takımı',
        slug: 'sehpa-takimi',
        searchKeyword: 'Sehpa',
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'yemek-odasi': {
    featuredImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Zarif ve Şık Sofralar',
    featuredSubtitle: 'Doğal ahşap dokular ve ergonomik yemek odası tasarımları.',
    featuredLink: '/urunler/yemek-odasi',
    subcategories: [
      {
        name: 'Yemek Odası Takımları',
        slug: 'yemek-odasi-takimlari',
        searchKeyword: 'Yemek Odası',
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Yemek Masaları',
        slug: 'yemek-masalari',
        searchKeyword: 'Masa',
        imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Sandalyeler',
        slug: 'sandalyeler',
        searchKeyword: 'Sandalye',
        imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Konsol & Konsol Aynası',
        slug: 'konsol-ayna',
        searchKeyword: 'Konsol',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Vitrin & Gümüşlük',
        slug: 'vitrin-gumusluk',
        searchKeyword: 'Vitrin',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Bank & Benchler',
        slug: 'benchler',
        searchKeyword: 'Bench',
        imageUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Mutfak Masa Takımları',
        slug: 'mutfak-masa-takimlari',
        searchKeyword: 'Mutfak Masa',
        imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Servis Sehpası & Yan Üniteler',
        slug: 'servis-sehpalari',
        searchKeyword: 'Servis',
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'yatak-odasi': {
    featuredImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Huzurlu ve Dingin Yaşam Alanı',
    featuredSubtitle: 'Geniş gardırop hacimleri ve konforlu yatak odası koleksiyonu.',
    featuredLink: '/urunler/yatak-odasi',
    subcategories: [
      {
        name: 'Yatak Odası Takımları',
        slug: 'yatak-odasi-takimlari',
        searchKeyword: 'Yatak Odası',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Gardıroplar (Sürgülü & Kapaklı)',
        slug: 'gardiroplar',
        searchKeyword: 'Gardırop',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Karyolalar & Başlıklar',
        slug: 'karyolalar',
        searchKeyword: 'Karyola',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Şifonyer & Makyaj Masası',
        slug: 'sifonyer-makyaj-masasi',
        searchKeyword: 'Şifonyer',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Komodinler',
        slug: 'komodinler',
        searchKeyword: 'Komodin',
        imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Boy Aynaları & Dilsiz Uşak',
        slug: 'boy-aynalari',
        searchKeyword: 'Ayna',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Yatak Odası Pufları',
        slug: 'yatak-odasi-puflari',
        searchKeyword: 'Puf',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'yatak': {
    featuredImage: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Yenilikçi Uyku Teknolojisi',
    featuredSubtitle: 'Omurga destekli ortopedik ve visco akıllı sünger katmanları.',
    featuredLink: '/urunler/yatak',
    subcategories: [
      {
        name: 'Çift Kişilik Yataklar',
        slug: 'cift-kisilik-yataklar',
        searchKeyword: 'Çift Kişilik',
        imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Tek Kişilik Yataklar',
        slug: 'tek-kisilik-yataklar',
        searchKeyword: 'Tek Kişilik',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Ortopedik & Yaylı Yataklar',
        slug: 'ortopedik-yataklar',
        searchKeyword: 'Ortopedik',
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Visco Akıllı Yataklar',
        slug: 'visco-yataklar',
        searchKeyword: 'Visco',
        imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Lateks & Doğal Yataklar',
        slug: 'lateks-yataklar',
        searchKeyword: 'Lateks',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Bebek & Çocuk Yatakları',
        slug: 'bebek-cocuk-yataklari',
        searchKeyword: 'Çocuk Yatak',
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Yatak Pedi & Topper',
        slug: 'yatak-pedleri',
        searchKeyword: 'Ped',
        imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'baza-baslik': {
    featuredImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Yüksek Depolama & Emniyet',
    featuredSubtitle: 'Geniş sandıklı, emniyet kilitli bazalar ve estetik yatak başlıkları.',
    featuredLink: '/urunler/baza-baslik',
    subcategories: [
      {
        name: 'Çift Kişilik Bazalar',
        slug: 'cift-kisilik-bazalar',
        searchKeyword: 'Çift Kişilik Baza',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Tek Kişilik Bazalar',
        slug: 'tek-kisilik-bazalar',
        searchKeyword: 'Tek Kişilik Baza',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Sandıklı Depolamalı Bazalar',
        slug: 'sandikli-bazalar',
        searchKeyword: 'Sandıklı',
        imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Modern Kumaş Başlıklar',
        slug: 'kumas-basliklar',
        searchKeyword: 'Kumaş Başlık',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Ahşap & Deri Başlıklar',
        slug: 'ahsap-deri-basliklar',
        searchKeyword: 'Ahşap Başlık',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Motorlu Hareketli Bazalar',
        slug: 'motorlu-bazalar',
        searchKeyword: 'Motorlu Baza',
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Baza + Başlık Setleri',
        slug: 'baza-baslik-setleri',
        searchKeyword: 'Baza Başlık',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'genc-ve-cocuk-odasi': {
    featuredImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Yaratıcı Genç & Çocuk Dünyası',
    featuredSubtitle: 'Ders çalışma alanları, ergonomik depolama ve güvenli Montessori yataklar.',
    featuredLink: '/urunler/genc-ve-cocuk-odasi',
    subcategories: [
      {
        name: 'Genç Odası Takımları',
        slug: 'genc-odasi-takimlari',
        searchKeyword: 'Genç Odası',
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Çocuk Odası Takımları',
        slug: 'cocuk-odasi-takimlari',
        searchKeyword: 'Çocuk Odası',
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Montessori Yataklar',
        slug: 'montessori-yataklar',
        searchKeyword: 'Montessori',
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Çalışma Masaları & Kitaplıklar',
        slug: 'calisma-masalari',
        searchKeyword: 'Çalışma Masası',
        imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Ranzalar & Karyolalar',
        slug: 'ranzalar',
        searchKeyword: 'Ranza',
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Genç Gardıropları',
        slug: 'genc-gardiroplari',
        searchKeyword: 'Gardırop',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Çalışma Koltukları',
        slug: 'calisma-koltuklari',
        searchKeyword: 'Çalışma Koltuğu',
        imageUrl: 'https://images.unsplash.com/photo-1580481077111-9a7428fef6f8?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'bahce-mobilyasi': {
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Açık Hava & Balkon Keyfi',
    featuredSubtitle: 'Güneşe ve suya dayanıklı rattan takımlar, salıncaklar ve şezlonglar.',
    featuredLink: '/urunler/bahce-mobilyasi',
    subcategories: [
      {
        name: 'Bahçe Oturma Grupları',
        slug: 'bahce-oturma-gruplari',
        searchKeyword: 'Bahçe Oturma',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Bahçe Yemek Masaları',
        slug: 'bahce-yemek-masalari',
        searchKeyword: 'Bahçe Masa',
        imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Rattan Balkon Takımları',
        slug: 'rattan-takimlar',
        searchKeyword: 'Rattan',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Salıncaklar & Hamaklar',
        slug: 'salincaklar',
        searchKeyword: 'Salıncak',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Şezlonglar & Daybed',
        slug: 'sezlonglar',
        searchKeyword: 'Şezlong',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Bahçe Sehpaları & Sandıkları',
        slug: 'bahce-sehpalari',
        searchKeyword: 'Bahçe Sehpa',
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Güneş Şemsiyeleri',
        slug: 'gunes-semsiyeleri',
        searchKeyword: 'Şemsiye',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'tamamlayici-urunler': {
    featuredImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Evinizi Bütünleyen Aksesuarlar',
    featuredSubtitle: 'Portmanto, dresuar, zigon sehpa ve dekoratif tamamlayıcı üniteler.',
    featuredLink: '/urunler/tamamlayici-urunler',
    subcategories: [
      {
        name: 'Portmanto & Vestiyer',
        slug: 'portmanto-vestiyer',
        searchKeyword: 'Portmanto',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Dresuarlar & Aynalar',
        slug: 'dresuar-ayna',
        searchKeyword: 'Dresuar',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Kitaplıklar & Raflar',
        slug: 'kitapliklar',
        searchKeyword: 'Kitaplık',
        imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Zigon & Yan Sehpalar',
        slug: 'zigon-sehpa',
        searchKeyword: 'Zigon',
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Puflar & Markizler',
        slug: 'puflar',
        searchKeyword: 'Puf',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Ayakkabılıklar',
        slug: 'ayakkabiliklar',
        searchKeyword: 'Ayakkabılık',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Dekoratif Lambader',
        slug: 'lambaderler',
        searchKeyword: 'Lambader',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },

  'indirimli-urunler': {
    featuredImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80',
    featuredTitle: 'Sezon Sonu Fırsatları %35 İndirim',
    featuredSubtitle: 'Sınırlı stoklarla teşhir ve kampanya koleksiyonlarını kaçırmayın.',
    featuredLink: '/urunler/indirimli-urunler',
    subcategories: [
      {
        name: 'Teşhir & Fırsat Koltuklar',
        slug: 'firsat-koltuklar',
        searchKeyword: 'Koltuk',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'İndirimli Yatak Odaları',
        slug: 'indirimli-yatak-odalari',
        searchKeyword: 'Yatak Odası',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Kampanyalı Yemek Masaları',
        slug: 'kampanyali-yemek-odalari',
        searchKeyword: 'Yemek Odası',
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Sezon Sonu Özel Fiyatlar',
        slug: 'sezon-sonu-firsat',
        searchKeyword: 'İndirim',
        imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Outlet Tamamlayıcılar',
        slug: 'outlet-tamamlayicilar',
        searchKeyword: 'Sehpa',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=320&q=80',
      },
      {
        name: 'Çok Satan İndirimler',
        slug: 'cok-satan-indirimler',
        searchKeyword: 'Koltuk',
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },
};
