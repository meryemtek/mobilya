import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Archive,
  Image as ImageIcon,
  CheckCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { ProductListItem, Category, ProductDetail } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'seo'>('general');
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    productCode: '',
    categoryId: 0,
    price: '',
    shortDescription: '',
    description: '',
    status: 'Published',
    isFeatured: false,
    sortOrder: 0,
    materials: '',
    colorOptions: '',
    width: '',
    height: '',
    depth: '',
    unit: 'cm',
    specKeys: ['', ''],
    specVals: ['', ''],
    metaTitle: '',
    metaDescription: '',
    coverImageUrl: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getProducts({
        search: search || undefined,
        status: statusFilter || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        pageSize: 50,
      }),
      adminApi.getCategories(),
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.items);
        setCategories(catRes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, categoryFilter]);

  const handleSlugify = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      slug: '',
      productCode: '',
      categoryId: categories[0]?.id || 0,
      price: '',
      shortDescription: '',
      description: '',
      status: 'Published',
      isFeatured: false,
      sortOrder: 0,
      materials: '',
      colorOptions: '',
      width: '',
      height: '',
      depth: '',
      unit: 'cm',
      specKeys: ['', ''],
      specVals: ['', ''],
      metaTitle: '',
      metaDescription: '',
      coverImageUrl: '',
    });
    setActiveTab('general');
    setModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    try {
      const p = await adminApi.getProduct(id);
      setEditingProduct(p);

      let w = '', h = '', d = '', unit = 'cm';
      if (p.dimensions) {
        try {
          const dim = JSON.parse(p.dimensions);
          w = dim.width || '';
          h = dim.height || '';
          d = dim.depth || '';
          unit = dim.unit || 'cm';
        } catch {}
      }

      let priceVal = '';
      let keys: string[] = [];
      let vals: string[] = [];
      if (p.specifications) {
        try {
          const sObj = JSON.parse(p.specifications);
          priceVal = sObj['Fiyat'] || sObj['Price'] || sObj['fiyat'] || '';
          keys = Object.keys(sObj).filter((k) => k !== 'Fiyat' && k !== 'Price' && k !== 'fiyat');
          vals = keys.map((k) => sObj[k]);
        } catch {}
      }
      if (keys.length === 0) {
        keys = ['', ''];
        vals = ['', ''];
      }

      let colorsVal = '';
      if (p.colorOptions) {
        try {
          const parsed = JSON.parse(p.colorOptions);
          colorsVal = Array.isArray(parsed) ? parsed.join(', ') : p.colorOptions;
        } catch {
          colorsVal = p.colorOptions;
        }
      }

      const coverImg = p.images?.find((i) => i.isCover)?.url || p.images?.[0]?.url || '';

      setForm({
        name: p.name,
        slug: p.slug,
        productCode: p.productCode || '',
        categoryId: p.categoryId,
        price: priceVal,
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        status: p.status || 'Published',
        isFeatured: p.isFeatured,
        sortOrder: p.sortOrder || 0,
        materials: p.materials || '',
        colorOptions: colorsVal,
        width: w.toString(),
        height: h.toString(),
        depth: d.toString(),
        unit: unit,
        specKeys: keys,
        specVals: vals,
        metaTitle: p.metaTitle || '',
        metaDescription: p.metaDescription || '',
        coverImageUrl: coverImg,
      });

      setActiveTab('general');
      setModalOpen(true);
    } catch {
      alert('Ürün bilgileri alınırken hata oluştu.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.categoryId) {
      alert('Lütfen zorunlu alanları (Ürün Adı, Slug, Kategori) doldurunuz.');
      return;
    }

    setSaving(true);

    // Boyutlar JSON
    let dimensionsJson: string | null = null;
    if (form.width || form.height || form.depth) {
      dimensionsJson = JSON.stringify({
        width: form.width ? Number(form.width) : undefined,
        height: form.height ? Number(form.height) : undefined,
        depth: form.depth ? Number(form.depth) : undefined,
        unit: form.unit,
      });
    }

    // Teknik Özellikler JSON
    let specsJson: string | null = null;
    const specObj: Record<string, string> = {};
    if (form.price && form.price.trim()) {
      specObj['Fiyat'] = form.price.trim();
    }
    form.specKeys.forEach((k, idx) => {
      if (k.trim() && form.specVals[idx]?.trim()) {
        specObj[k.trim()] = form.specVals[idx].trim();
      }
    });
    if (Object.keys(specObj).length > 0) {
      specsJson = JSON.stringify(specObj);
    }

    // Renk Seçenekleri JSON
    let colorsJson: string | null = null;
    if (form.colorOptions && form.colorOptions.trim()) {
      const parts = form.colorOptions.split(',').map((s) => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        colorsJson = JSON.stringify(parts);
      }
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      productCode: form.productCode || null,
      categoryId: Number(form.categoryId),
      shortDescription: form.shortDescription || null,
      description: form.description || null,
      status: form.status,
      isFeatured: form.isFeatured,
      sortOrder: Number(form.sortOrder),
      materials: form.materials || null,
      colorOptions: colorsJson,
      dimensions: dimensionsJson,
      specifications: specsJson,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      coverImageUrl: form.coverImageUrl || null,
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        // Kapak görseli eklendiyse ve yeni ise
        if (form.coverImageUrl && form.coverImageUrl !== editingProduct.coverImageUrl) {
          await adminApi.addProductImage(editingProduct.id, {
            url: form.coverImageUrl,
            isCover: true,
            sortOrder: 0,
          });
        }
      } else {
        const res: any = await adminApi.createProduct(payload);
        const newId = res?.data?.id || res?.id;
        if (form.coverImageUrl && newId) {
          try {
            await adminApi.addProductImage(newId, {
              url: form.coverImageUrl,
              isCover: true,
              sortOrder: 0,
            });
          } catch {}
        }
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || err.response?.data?.title || 'Kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ürünü arşive almak istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteProduct(id);
      loadData();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Ürün Kataloğu Yönetimi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Mobilya ürünlerini ekleyin, düzenleyin, görsellerini ve teknik detaylarını yönetin.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Arama & Filtre Çubuğu */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Ürün adı veya kodu ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="">Tüm Durumlar</option>
          <option value="Published">Yayında</option>
          <option value="Draft">Taslak</option>
          <option value="Archived">Arşivlendi</option>
        </select>
      </div>

      {/* Ürün Tablosu */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Ürünler yükleniyor...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Kayıtlı ürün bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Ürün Kodu</th>
                  <th>Durum</th>
                  <th>Öne Çıkan</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--color-bg-subtle)', flexShrink: 0 }}>
                          {p.coverImageUrl ? (
                            <img src={p.coverImageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a49e98' }}><ImageIcon size={20} /></div>
                          )}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.categoryName}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{p.productCode || '-'}</td>
                    <td>
                      <span className={`badge ${p.status === 'Published' ? 'badge-success' : p.status === 'Draft' ? 'badge-warning' : 'badge-info'}`}>
                        {p.status === 'Published' ? 'Yayında' : p.status === 'Draft' ? 'Taslak' : 'Arşiv'}
                      </span>
                    </td>
                    <td>
                      {p.isFeatured ? (
                        <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.8125rem' }}>★ Evet</span>
                      ) : (
                        <span style={{ color: '#a49e98', fontSize: '0.8125rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <a
                          href={`/urunler/${p.categorySlug}/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Sitede İncele"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => openEditModal(p.id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Edit2 size={14} /> Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                          title="Arşive Al"
                        >
                          <Archive size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ürün Ekle / Düzenle Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '750px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Sekmeleri */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', padding: '0 1.5rem', backgroundColor: 'var(--color-bg-subtle)' }}>
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                style={{
                  padding: '0.8rem 1.25rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: activeTab === 'general' ? '2px solid var(--color-accent)' : 'none',
                  color: activeTab === 'general' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                Genel Bilgiler & Görsel
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                style={{
                  padding: '0.8rem 1.25rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: activeTab === 'specs' ? '2px solid var(--color-accent)' : 'none',
                  color: activeTab === 'specs' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                Ölçüler & Teknik Özellikler
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                style={{
                  padding: '0.8rem 1.25rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: activeTab === 'seo' ? '2px solid var(--color-accent)' : 'none',
                  color: activeTab === 'seo' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                SEO Meta Verileri
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              {/* Sekme 1: Genel Bilgiler */}
              {activeTab === 'general' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Ürün Adı *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => {
                          const n = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            name: n,
                            slug: editingProduct ? prev.slug : handleSlugify(n),
                          }));
                        }}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ürün Kodu</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Örn: BZK-101"
                        value={form.productCode}
                        onChange={(e) => setForm({ ...form, productCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">URL Parçası (Slug) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: handleSlugify(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kategori *</label>
                      <select
                        className="form-control"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                        required
                      >
                        <option value={0} disabled>Kategori Seçiniz</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Satış Fiyatı (TL veya Metin)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Örn: 62.990,00 TL"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Yayın Durumu</label>
                      <select
                        className="form-control"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option value="Published">Yayında</option>
                        <option value="Draft">Taslak</option>
                        <option value="Archived">Arşiv</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kapak Görseli URL'si</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://... veya /uploads/..."
                      value={form.coverImageUrl}
                      onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                      Medya Yükleme sayfasından yüklediğiniz görsel URL'sini buraya yapıştırabilirsiniz.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kısa Açıklama (Kartlarda görünür)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ayrıntılı Açıklama</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div className="form-group">
                      <label className="form-label">Durum</label>
                      <select
                        className="form-control"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option value="Published">Yayında</option>
                        <option value="Draft">Taslak</option>
                        <option value="Archived">Arşiv</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sıralama No</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.sortOrder}
                        onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="isFeatured" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                        Öne Çıkan Ürün
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Sekme 2: Ölçüler & Teknik */}
              {activeTab === 'specs' && (
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Boyutlar</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Genişlik</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="120"
                        value={form.width}
                        onChange={(e) => setForm({ ...form, width: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Yükseklik</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="75"
                        value={form.height}
                        onChange={(e) => setForm({ ...form, height: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Derinlik</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="60"
                        value={form.depth}
                        onChange={(e) => setForm({ ...form, depth: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Birim</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Malzeme Bilgisi</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Doğal Meşe Kaplama, Fırın Boyalı Metal"
                        value={form.materials}
                        onChange={(e) => setForm({ ...form, materials: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Renk Seçenekleri</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ceviz, Antrasit, Doğal Meşe"
                        value={form.colorOptions}
                        onChange={(e) => setForm({ ...form, colorOptions: e.target.value })}
                      />
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Ek Teknik Özellikler (Özellik - Değer)</h4>
                  {form.specKeys.map((k, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Özellik Adı (Örn: Garanti)"
                        className="form-control"
                        value={k}
                        onChange={(e) => {
                          const newKeys = [...form.specKeys];
                          newKeys[idx] = e.target.value;
                          setForm({ ...form, specKeys: newKeys });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Değeri (Örn: 2 Yıl)"
                        className="form-control"
                        value={form.specVals[idx] || ''}
                        onChange={(e) => {
                          const newVals = [...form.specVals];
                          newVals[idx] = e.target.value;
                          setForm({ ...form, specVals: newVals });
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, specKeys: [...form.specKeys, ''], specVals: [...form.specVals, ''] })}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    + Satır Ekle
                  </button>
                </div>
              )}

              {/* Sekme 3: SEO */}
              {activeTab === 'seo' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Sayfa Başlığı (Meta Title)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Boş bırakılırsa ürün adı kullanılır"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sayfa Açıklaması (Meta Description)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Arama motorlarında görünecek 150-160 karakterlik özet..."
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
