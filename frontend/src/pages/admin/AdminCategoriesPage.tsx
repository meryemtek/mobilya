import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Layers, ExternalLink } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parentCategoryId: null as number | null,
    sortOrder: 0,
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
  });

  const loadData = () => {
    setLoading(true);
    adminApi.getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

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
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentCategoryId: null,
      sortOrder: 0,
      isPublished: true,
      metaTitle: '',
      metaDescription: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      imageUrl: c.imageUrl || '',
      parentCategoryId: c.parentCategoryId || null,
      sortOrder: c.sortOrder,
      isPublished: c.isPublished ?? true,
      metaTitle: c.metaTitle || '',
      metaDescription: c.metaDescription || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      alert('Kategori adı ve slug zorunludur.');
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      parentCategoryId: form.parentCategoryId ? Number(form.parentCategoryId) : null,
    };

    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, payload);
      } else {
        await adminApi.createCategory(payload);
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
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteCategory(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Kategoriye bağlı ürün veya alt kategori olduğu için silinemedi.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Kategori Yönetimi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Ürün kategorilerini ve hiyerarşik alt kategorileri yönetin.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Yeni Kategori Ekle
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Kayıtlı kategori bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Kategori Adı</th>
                  <th>Slug</th>
                  <th>Üst Kategori</th>
                  <th>Sıralama</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => {
                  const parent = categories.find((p) => p.id === c.parentCategoryId);
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--color-bg-subtle)' }}>
                            {c.imageUrl ? (
                              <img src={c.imageUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a49e98' }}><Layers size={18} /></div>
                            )}
                          </div>
                          <strong>{c.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>/{c.slug}</td>
                      <td>{parent ? parent.name : '-'}</td>
                      <td>{c.sortOrder}</td>
                      <td>
                        <span className={`badge ${c.isPublished ? 'badge-success' : 'badge-warning'}`}>
                          {c.isPublished ? 'Yayında' : 'Gizli'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button onClick={() => openEditModal(c)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                            <Edit2 size={14} /> Düzenle
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Kategori Adı *</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => {
                    const n = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name: n,
                      slug: editingCategory ? prev.slug : handleSlugify(n),
                    }));
                  }}
                  required
                />
              </div>

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
                <label className="form-label">Kapak Görseli URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://... veya /uploads/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Sıralama No</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isPublished" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                    Yayında
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
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
