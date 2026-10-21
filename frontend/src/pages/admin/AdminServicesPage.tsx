import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { ServiceItem } from '../../types';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    iconOrImageUrl: '',
    sortOrder: 0,
    isPublished: true,
  });

  const loadData = () => {
    setLoading(true);
    adminApi.getServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      title: '',
      description: '',
      iconOrImageUrl: '',
      sortOrder: 0,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setForm({
      title: s.title,
      description: s.description || '',
      iconOrImageUrl: s.iconOrImageUrl || '',
      sortOrder: s.sortOrder,
      isPublished: s.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('Hizmet başlığı zorunludur.');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await adminApi.updateService(editingService.id, form);
      } else {
        await adminApi.createService(form);
      }
      setModalOpen(false);
      loadData();
    } catch {
      alert('Kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteService(id);
      loadData();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Hizmetlerimiz Yönetimi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Kurumsal projelendirme, özel mimari tasarım ve donatı hizmetlerini yönetin.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Yeni Hizmet Ekle
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
        ) : services.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Kayıtlı hizmet bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Hizmet Başlığı</th>
                  <th>Açıklama</th>
                  <th>Sıralama</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td style={{ color: 'var(--color-text-muted)', maxWidth: '350px' }}>
                      {s.description || '-'}
                    </td>
                    <td>{s.sortOrder}</td>
                    <td>
                      <span className={`badge ${s.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {s.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button onClick={() => openEditModal(s)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                          <Edit2 size={14} /> Düzenle
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
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

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Hizmet Başlığı *</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
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
