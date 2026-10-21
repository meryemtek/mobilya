import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { Banner } from '../../types';

export const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Kataloğu İncele',
    buttonLink: '/urunler',
    imageUrl: '',
    imageAlt: '',
    sortOrder: 0,
    isPublished: true,
  });

  const loadData = () => {
    setLoading(true);
    adminApi.getBanners()
      .then(setBanners)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setForm({
      title: '',
      subtitle: '',
      buttonText: 'Kataloğu İncele',
      buttonLink: '/urunler',
      imageUrl: '',
      imageAlt: '',
      sortOrder: 0,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      buttonText: b.buttonText || '',
      buttonLink: b.buttonLink || '',
      imageUrl: b.imageUrl,
      imageAlt: b.imageAlt || '',
      sortOrder: b.sortOrder,
      isPublished: b.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      alert('Başlık ve Görsel URL alanları zorunludur.');
      return;
    }

    setSaving(true);
    try {
      if (editingBanner) {
        await adminApi.updateBanner(editingBanner.id, form);
      } else {
        await adminApi.createBanner(form);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert('Kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu bannerı silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteBanner(id);
      loadData();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Banner & Slider Yönetimi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Ana sayfadaki vitrin slider görsellerini, başlık ve buton yönlendirmelerini yönetin.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Yeni Banner Ekle
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
        ) : banners.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Kayıtlı banner bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Önizleme</th>
                  <th>Başlık</th>
                  <th>Alt Başlık</th>
                  <th>Buton</th>
                  <th>Sıralama</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ width: '80px', height: '45px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--color-bg-subtle)' }}>
                        <img src={b.imageUrl} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{b.title}</td>
                    <td style={{ color: 'var(--color-text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.subtitle || '-'}
                    </td>
                    <td>{b.buttonText ? `${b.buttonText} → ${b.buttonLink}` : '-'}</td>
                    <td>{b.sortOrder}</td>
                    <td>
                      <span className={`badge ${b.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {b.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button onClick={() => openEditModal(b)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                          <Edit2 size={14} /> Düzenle
                        </button>
                        <button onClick={() => handleDelete(b.id)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                          <Trash2 size={14} />
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingBanner ? 'Bannerı Düzenle' : 'Yeni Banner Ekle'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Banner Başlığı *</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alt Başlık / Açıklama</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Görsel URL *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://... veya /uploads/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Buton Metni</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Buton Yönlendirme Linki</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="/urunler veya https://..."
                    value={form.buttonLink}
                    onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                  />
                </div>
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
