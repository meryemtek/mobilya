import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, MapPin } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { StoreItem } from '../../types';

type StoreForm = {
  name: string;
  address: string;
  phone: string;
  whatsApp: string;
  email: string;
  workingHours: string;
  mapEmbedUrl: string;
  sortOrder: number;
  isPublished: boolean;
};

const emptyForm: StoreForm = {
  name: '',
  address: '',
  phone: '',
  whatsApp: '',
  email: '',
  workingHours: '',
  mapEmbedUrl: '',
  sortOrder: 0,
  isPublished: true,
};

// Google Maps'ten kopyalanan tam <iframe> kodu yapıştırılırsa içindeki src adresini ayıklar
const extractEmbedUrl = (raw: string): string => {
  const match = raw.match(/src="([^"]+)"/);
  return (match ? match[1] : raw).trim();
};

export const AdminStoresPage: React.FC = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoreForm>(emptyForm);

  const loadData = () => {
    setLoading(true);
    adminApi.getStores()
      .then(setStores)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingStore(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (s: StoreItem) => {
    setEditingStore(s);
    setForm({
      name: s.name,
      address: s.address,
      phone: s.phone || '',
      whatsApp: s.whatsApp || '',
      email: s.email || '',
      workingHours: s.workingHours || '',
      mapEmbedUrl: s.mapEmbedUrl || '',
      sortOrder: s.sortOrder,
      isPublished: s.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      alert('Mağaza adı ve adres zorunludur.');
      return;
    }

    const payload = { ...form, mapEmbedUrl: extractEmbedUrl(form.mapEmbedUrl) };

    setSaving(true);
    try {
      if (editingStore) {
        await adminApi.updateStore(editingStore.id, payload);
      } else {
        await adminApi.createStore(payload);
      }
      setModalOpen(false);
      loadData();
    } catch {
      alert('Kaydedilirken hata oluştu. E-posta adresinin doğru olduğundan emin olun.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu mağazayı silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteStore(id);
      loadData();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Mağazalar & Showroomlar</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            İletişim sayfasında listelenecek mağaza adreslerini, telefonlarını ve harita konumlarını yönetin.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Yeni Mağaza Ekle
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
        ) : stores.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Kayıtlı mağaza bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mağaza</th>
                  <th>Adres</th>
                  <th>Telefon</th>
                  <th>Harita</th>
                  <th>Sıralama</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: 'var(--color-text-muted)', maxWidth: '300px' }}>{s.address}</td>
                    <td>{s.phone || '-'}</td>
                    <td>
                      {s.mapEmbedUrl ? (
                        <span className="badge badge-success">Var</span>
                      ) : (
                        <span className="badge badge-warning">Eksik</span>
                      )}
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
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} /> {editingStore ? 'Mağazayı Düzenle' : 'Yeni Mağaza Ekle'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Mağaza Adı *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: Bozkurt Mobilya Merkez Showroom"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Adres *</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+90 555 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp (ülke kodlu)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="905550000000"
                    value={form.whatsApp}
                    onChange={(e) => setForm({ ...form, whatsApp: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-posta</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Çalışma Saatleri</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pzt-Cts: 09:00-18:00"
                    value={form.workingHours}
                    onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Google Maps Harita Kodu</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder={"Google Maps > Paylaş > Yerleştirme HTML'i kopyalayıp buraya yapıştırın (iframe kodunun tamamı olabilir)"}
                    value={form.mapEmbedUrl}
                    onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                  />
                  <small style={{ color: 'var(--color-text-muted)' }}>
                    Tam iframe kodunu yapıştırabilirsiniz, adres otomatik ayıklanır.
                  </small>
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

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
                  <input
                    type="checkbox"
                    id="storeIsPublished"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="storeIsPublished" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
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
