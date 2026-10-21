import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, Phone, Mail, MessageCircle, MapPin, Globe, Clock, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { adminApi } from '../../api/endpoints';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    adminApi.getSettings()
      .then((data) => {
        const dict: Record<string, string> = {};
        data.forEach((s) => {
          dict[s.key] = s.value || '';
        });
        setSettings(dict);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await adminApi.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert('Ayarlar kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Ayarlar yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Site ve İletişim Ayarları</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Telefon, WhatsApp, adres, çalışma saatleri, sosyal medya ve Google Harita bağlantılarını yönetin.
          </p>
        </div>

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }}>
            <CheckCircle2 size={18} /> Ayarlar kaydedildi!
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* İletişim Bilgileri */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={20} color="var(--color-accent)" /> Temel İletişim & WhatsApp
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Firma / Site Adı</label>
              <input
                type="text"
                className="form-control"
                value={settings.SiteName || 'Bozkurt Mobilya'}
                onChange={(e) => handleChange('SiteName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sabit / Mobil Telefon</label>
              <input
                type="text"
                className="form-control"
                value={settings.PhoneNumber || ''}
                onChange={(e) => handleChange('PhoneNumber', e.target.value)}
                placeholder="+90 555 000 0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Numarası (Ülke kodu ile)</label>
              <input
                type="text"
                className="form-control"
                value={settings.WhatsApp || ''}
                onChange={(e) => handleChange('WhatsApp', e.target.value)}
                placeholder="905550000000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-Posta Adresi</label>
              <input
                type="email"
                className="form-control"
                value={settings.Email || ''}
                onChange={(e) => handleChange('Email', e.target.value)}
                placeholder="info@bozkurtmobilya.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Adres Bilgisi</label>
              <input
                type="text"
                className="form-control"
                value={settings.Address || ''}
                onChange={(e) => handleChange('Address', e.target.value)}
                placeholder="Örnek Mah. Mobilya Sanayi Cad. No:12, İstanbul"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Çalışma Saatleri</label>
              <input
                type="text"
                className="form-control"
                value={settings.WorkingHours || ''}
                onChange={(e) => handleChange('WorkingHours', e.target.value)}
                placeholder="Pzt-Cts: 09:00 - 18:00"
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="var(--color-accent)" /> Sosyal Medya Bağlantıları
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Instagram Profil URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.InstagramUrl || ''}
                onChange={(e) => handleChange('InstagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Sayfa URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.FacebookUrl || ''}
                onChange={(e) => handleChange('FacebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Profil URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.LinkedInUrl || ''}
                onChange={(e) => handleChange('LinkedInUrl', e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">YouTube Kanal URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.YoutubeUrl || ''}
                onChange={(e) => handleChange('YoutubeUrl', e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Harita / Konum */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--color-accent)" /> Harita & Konum Ayarları
          </h3>

          <div className="form-group">
            <label className="form-label">Google Maps Gömme (Embed) iframe URL</label>
            <input
              type="text"
              className="form-control"
              value={settings.MapEmbedUrl || ''}
              onChange={(e) => handleChange('MapEmbedUrl', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
              Google Haritalar'dan "Haritayı Yerleştir" seçeneğinde verilen iframe içindeki src adresidir.
            </span>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          <Save size={18} />
          {saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
        </button>
      </form>
    </div>
  );
};
