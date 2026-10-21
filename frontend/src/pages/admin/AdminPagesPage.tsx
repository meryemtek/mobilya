import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, FileText, ExternalLink, Scale, Building2 } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { PageContent } from '../../types';

export const AdminPagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tur = searchParams.get('tur');
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    title: '',
    content: '',
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
  });

  const loadData = () => {
    setLoading(true);
    adminApi.getPages()
      .then(setPages)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const legalSlugs = ['gizlilik-politikasi', 'kvkk', 'cerez-politikasi', 'kullanim-kosullari'];
  const filteredPages = pages.filter((p) => {
    if (tur === 'yasal') return legalSlugs.includes(p.slug.toLowerCase());
    if (tur === 'kurumsal') return !legalSlugs.includes(p.slug.toLowerCase());
    return true;
  });

  const pageHeading = tur === 'yasal'
    ? 'Sözleşmeler, KVKK & Çerez Metinleri'
    : 'Kurumsal Sayfa İçerikleri';
  const pageSubheading = tur === 'yasal'
    ? 'Gizlilik Politikası, KVKK Aydınlatma Metni ve Çerez Politikası yasal belgelerini yönetin.'
    : 'Hakkımızda, Kurumsal ve tanıtım sayfalarının metinlerini ve SEO ayarlarını düzenleyin.';

  const openCreateModal = () => {
    setEditingPage(null);
    setForm({
      slug: '',
      title: '',
      content: '',
      isPublished: true,
      metaTitle: '',
      metaDescription: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (p: PageContent) => {
    setEditingPage(p);
    setForm({
      slug: p.slug,
      title: p.title,
      content: p.content || '',
      isPublished: p.isPublished,
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      alert('Sayfa başlığı ve slug zorunludur.');
      return;
    }

    setSaving(true);
    try {
      if (editingPage) {
        await adminApi.updatePage(editingPage.id, form);
      } else {
        await adminApi.createPage(form);
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
    if (!window.confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deletePage(id);
      loadData();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{pageHeading}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            {pageSubheading}
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Yeni Sayfa Ekle
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
        ) : filteredPages.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Bu kategoride kayıtlı sayfa bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Sayfa Başlığı</th>
                  <th>URL (Slug)</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="var(--color-accent)" />
                        <strong>{p.title}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>/{p.slug}</td>
                    <td>
                      <span className={`badge ${p.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {p.isPublished ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <a
                          href={`/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Sitede Gör"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button onClick={() => openEditModal(p)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                          <Edit2 size={14} /> Düzenle
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
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
          <div className="modal-card" style={{ maxWidth: '700px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{editingPage ? 'Sayfayı Düzenle' : 'Yeni Sayfa Ekle'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Sayfa Başlığı *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL Parçası (Slug) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="hakkimizda, kurumsal, kvkk..."
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().trim() })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sayfa İçeriği (Metin / Paragraflar)</label>
                <textarea
                  className="form-control"
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">SEO Başlığı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SEO Açıklaması</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
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
