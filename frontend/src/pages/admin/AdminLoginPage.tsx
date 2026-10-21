import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Armchair, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import { useAuth } from '../../contexts/AuthContext';
import { SeoHead } from '../../components/common/SeoHead';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminApi.login({ email, password });
      login(res.token, res.email);
      navigate('/admin/urunler');
    } catch (err: any) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.title ||
        'Giriş yapılamadı. E-posta veya şifrenizi kontrol ediniz.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead title="Yetkili Girişi | Bozkurt Mobilya" />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #181d24 0%, #0d1117 100%)',
          padding: '2rem 1rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '2.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo & Başlık */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <img
                src="/logo.png"
                alt="Bozkurt Mobilya"
                style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Yetkili Yönetim Portalı
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Bozkurt Mobilya Ürün & Katalog Yönetimi
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#b91c1c',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="admin-email"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
              >
                Yetkili E-Posta
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bozkurtmobilya.local"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="admin-password"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
              >
                Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: '#008779',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 135, 121, 0.25)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                'Yetki Doğrulanıyor...'
              ) : (
                <>
                  <span>Giriş Yap ve Panele Git</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '1.75rem',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '1.25rem',
            }}
          >
            <a
              href="/"
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              ← Web Sitesi Ana Sayfasına Dön
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
