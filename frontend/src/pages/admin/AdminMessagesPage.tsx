import React, { useEffect, useState } from 'react';
import { Mail, Phone, Clock, MessageSquare, Trash2, CheckCircle2, Eye, X } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { ContactMessage } from '../../types';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const loadData = () => {
    setLoading(true);
    adminApi.getMessages({ status: statusFilter || undefined, pageSize: 50 })
      .then((res) => setMessages(res.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const openDetail = (m: ContactMessage) => {
    setSelectedMessage(m);
    setAdminNote(m.adminNote || '');
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedMessage) return;
    setSavingStatus(true);
    try {
      await adminApi.updateMessageStatus(selectedMessage.id, status, adminNote);
      setSelectedMessage((prev) => (prev ? { ...prev, status: status as any, adminNote } : null));
      loadData();
    } catch {
      alert('Durum güncellenirken hata oluştu.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    try {
      await adminApi.deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      loadData();
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>İletişim & Teklif Mesajları</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Ziyaretçilerden ve potansiyel müşterilerden gelen talepleri inceleyin, durumlarını yönetin.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="">Tüm Mesajlar</option>
          <option value="New">Yeni Mesajlar</option>
          <option value="InReview">İnceleniyor</option>
          <option value="Replied">Yanıtlandı</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Gelen mesaj bulunamadı.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Gönderen</th>
                  <th>İletişim</th>
                  <th>Konu</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong style={{ display: 'block' }}>{m.fullName}</strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {m.email && <div>{m.email}</div>}
                        {m.phone && <div>{m.phone}</div>}
                      </div>
                    </td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.subject || 'Genel Teklif / Bilgi'}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      {new Date(m.createdAt).toLocaleDateString('tr-TR')} {new Date(m.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'New' ? 'badge-warning' : m.status === 'InReview' ? 'badge-info' : 'badge-success'}`}>
                        {m.status === 'New' ? 'Yeni' : m.status === 'InReview' ? 'İnceleniyor' : 'Yanıtlandı'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button onClick={() => openDetail(m)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                          <Eye size={14} /> İncele
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
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

      {/* Mesaj İnceleme Modal */}
      {selectedMessage && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '650px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Mesaj Detayı</h3>
              <button onClick={() => setSelectedMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Ad Soyad</span>
                  <strong>{selectedMessage.fullName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Tarih</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>E-Posta</span>
                  {selectedMessage.email ? (
                    <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--color-primary)' }}>{selectedMessage.email}</a>
                  ) : '-'}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Telefon</span>
                  {selectedMessage.phone ? (
                    <a href={`tel:${selectedMessage.phone}`} style={{ color: 'var(--color-primary)' }}>{selectedMessage.phone}</a>
                  ) : '-'}
                </div>
              </div>

              {selectedMessage.subject && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block' }}>Konu</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>{selectedMessage.subject}</div>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>İletilen Mesaj</span>
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {selectedMessage.message}
                </div>
              </div>

              {/* Durum & Not */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
                <label className="form-label">Yönetici Notu</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Müşteriyle görüşüldü, teklif iletildi..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      disabled={savingStatus}
                      onClick={() => handleUpdateStatus('InReview')}
                      className="btn btn-outline btn-sm"
                      style={{ borderColor: 'var(--color-info)', color: 'var(--color-info)' }}
                    >
                      İnceleniyor Olarak İşaretle
                    </button>
                    <button
                      type="button"
                      disabled={savingStatus}
                      onClick={() => handleUpdateStatus('Replied')}
                      className="btn btn-primary btn-sm"
                    >
                      Yanıtlandı Olarak İşaretle
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                  >
                    Mesajı Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
