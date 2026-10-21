import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  MessageSquare,
  Image,
  ArrowRight,
  TrendingUp,
  Clock,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { adminApi } from '../../api/endpoints';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalProducts: number;
    publishedProducts: number;
    totalCategories: number;
    totalMessages: number;
    newMessages: number;
    totalBanners: number;
    totalServices: number;
    recentMessages: Array<{ id: number; fullName: string; email?: string; subject?: string; status: string; createdAt: string }>;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Veriler yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Genel Bakış & İstatistikler</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Site içerik ve talep göstergelerinin anlık durumu.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/urunler" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Yeni Ürün Ekle
          </Link>
          <Link to="/admin/ayarlar" className="btn btn-outline btn-sm">
            <Settings size={16} /> Site Ayarları
          </Link>
        </div>
      </div>

      {/* KPI Kartları */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Ürünler */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Toplam Ürün
            </span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-subtle)', borderRadius: '8px', color: 'var(--color-accent)' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {stats?.totalProducts || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-success)', marginTop: '0.25rem', fontWeight: 600 }}>
            {stats?.publishedProducts || 0} adet yayında
          </div>
        </div>

        {/* Kategoriler */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Kategoriler
            </span>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(2, 136, 209, 0.12)', borderRadius: '8px', color: 'var(--color-info)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {stats?.totalCategories || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Aktif koleksiyon sayısı
          </div>
        </div>

        {/* Mesajlar & Talepler */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Gelen Mesajlar
            </span>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(237, 108, 2, 0.12)', borderRadius: '8px', color: 'var(--color-warning)' }}>
              <MessageSquare size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {stats?.totalMessages || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-warning)', marginTop: '0.25rem', fontWeight: 700 }}>
            {stats?.newMessages || 0} yeni yanıt bekliyor
          </div>
        </div>

        {/* Slider & Banner */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Aktif Banner
            </span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-subtle)', borderRadius: '8px', color: 'var(--color-accent)' }}>
              <Image size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {stats?.totalBanners || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Anasayfa vitrin slaytı
          </div>
        </div>
      </div>

      {/* Son İletişim Mesajları */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Son Gelen Teklif & İletişim Mesajları</h3>
          <Link to="/admin/mesajlar" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentMessages && stats.recentMessages.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Gönderen</th>
                  <th>E-Posta</th>
                  <th>Konu</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMessages.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{m.email || '-'}</td>
                    <td>{m.subject || 'Genel Bilgi Talebi'}</td>
                    <td>
                      <span className={`badge ${m.status === 'New' ? 'badge-warning' : m.status === 'InReview' ? 'badge-info' : 'badge-success'}`}>
                        {m.status === 'New' ? 'Yeni' : m.status === 'InReview' ? 'İnceleniyor' : 'Yanıtlandı'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', padding: '1rem 0' }}>Henüz gelen bir iletişim mesajı bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};
