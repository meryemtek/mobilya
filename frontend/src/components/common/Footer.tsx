import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Armchair,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import type { Category, SiteSettings } from '../../types';

export const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    publicApi.getCategories().then((data) => setCategories(data.slice(0, 6))).catch(() => {});
    publicApi.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const phone = settings.PhoneNumber || '+90 555 000 0000';
  const email = settings.Email || 'info@bozkurtmobilya.com';
  const address = settings.Address || 'Örnek Mah. Mobilya Sanayi Cad. No:12, İstanbul';
  const workingHours = settings.WorkingHours || 'Pazartesi - Cumartesi: 09:00 - 18:00';

  return (
    <footer style={{ backgroundColor: 'var(--color-bg-darker)', color: 'var(--color-text-inverse)', paddingTop: '4.5rem' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid var(--color-border-dark)',
          }}
        >
          {/* Marka & Tanıtım */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Bozkurt Mobilya"
                  style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
            <p style={{ color: '#a49e98', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Yaşam alanlarınıza ve kurumsal mekanlarınıza değer katan, estetik, kaliteli ve ergonomik mobilya tasarımları üretmekteyiz.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {settings.InstagramUrl && (
                <a href={settings.InstagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', padding: '0.5rem', backgroundColor: 'var(--color-border-dark)', borderRadius: '50%' }}>
                  <Instagram size={18} />
                </a>
              )}
              {settings.FacebookUrl && (
                <a href={settings.FacebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', padding: '0.5rem', backgroundColor: 'var(--color-border-dark)', borderRadius: '50%' }}>
                  <Facebook size={18} />
                </a>
              )}
              {settings.LinkedInUrl && (
                <a href={settings.LinkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', padding: '0.5rem', backgroundColor: 'var(--color-border-dark)', borderRadius: '50%' }}>
                  <Linkedin size={18} />
                </a>
              )}
              {settings.YoutubeUrl && (
                <a href={settings.YoutubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', padding: '0.5rem', backgroundColor: 'var(--color-border-dark)', borderRadius: '50%' }}>
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.125rem', marginBottom: '1.25rem', borderLeft: '3px solid var(--color-accent)', paddingLeft: '0.6rem' }}>
              Kurumsal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem' }}>
              <li>
                <Link to="/" style={{ color: '#a49e98', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="var(--color-accent)" /> Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" style={{ color: '#a49e98', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="var(--color-accent)" /> Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/kurumsal" style={{ color: '#a49e98', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="var(--color-accent)" /> Kurumsal Kimlik & Vizyon
                </Link>
              </li>
              <li>
                <Link to="/hizmetlerimiz" style={{ color: '#a49e98', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="var(--color-accent)" /> Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link to="/iletisim" style={{ color: '#a49e98', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowRight size={14} color="var(--color-accent)" /> İletişim & Harita
                </Link>
              </li>
            </ul>
          </div>

          {/* Popüler Kategoriler */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.125rem', marginBottom: '1.25rem', borderLeft: '3px solid var(--color-accent)', paddingLeft: '0.6rem' }}>
              Ürün Koleksiyonu
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem' }}>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/urunler/${c.slug}`} style={{ color: '#a49e98', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ArrowRight size={14} color="var(--color-accent)" /> {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/urunler" style={{ color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                  Tüm Kataloğu Gör →
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim & Konum */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.125rem', marginBottom: '1.25rem', borderLeft: '3px solid var(--color-accent)', paddingLeft: '0.6rem' }}>
              İletişim & Fabrika
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.9375rem', color: '#a49e98' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <a href={`tel:${phone}`} style={{ color: 'inherit' }}>{phone}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span>{workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Telif & Yasal Bilgilendirme */}
        <div
          style={{
            padding: '1.8rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#7a736c',
          }}
        >
          <div>
            © {new Date().getFullYear()} Bozkurt Mobilya. Tüm hakları saklıdır.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/gizlilik-politikasi" style={{ color: 'inherit' }}>Gizlilik Politikası</Link>
            <Link to="/kvkk" style={{ color: 'inherit' }}>KVKK Aydınlatma Metni</Link>
            <Link to="/cerez-politikasi" style={{ color: 'inherit' }}>Çerez Politikası</Link>
            <Link to="/admin/giris" style={{ color: '#9e9790', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} /> Yönetici Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
