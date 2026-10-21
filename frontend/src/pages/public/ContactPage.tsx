import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import { SeoHead } from '../../components/common/SeoHead';
import type { SiteSettings } from '../../types';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { productInterest?: string; productCode?: string } | null;

  const [settings, setSettings] = useState<SiteSettings>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: state?.productInterest ? `Teklif/Bilgi Talebi: ${state.productInterest} (Kod: ${state.productCode || '-'})` : '',
    message: state?.productInterest ? `Merhaba, "${state.productInterest}" ürünü için detaylı bilgi ve fiyat teklifi almak istiyorum.` : '',
    kvkkConsent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    publicApi.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Lütfen ad ve soyadınızı giriniz.');
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage('Lütfen sizinle iletişime geçebilmemiz için e-posta veya telefon bilgilerinizden en az birini belirtiniz.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Lütfen mesajınızı yazınız.');
      return;
    }

    if (!formData.kvkkConsent) {
      setErrorMessage('Lütfen KVKK Aydınlatma Metni bilgilendirmesini onaylayınız.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await publicApi.sendContactMessage({
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
      });

      setSuccessMessage(res.message || 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        kvkkConsent: false,
      });
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.response?.data?.title || 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.';
      setErrorMessage(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const phone = settings.PhoneNumber || '+90 555 000 0000';
  const email = settings.Email || 'info@bozkurtmobilya.com';
  const address = settings.Address || 'Örnek Mah. Mobilya Sanayi Cad. No:12, İstanbul';
  const workingHours = settings.WorkingHours || 'Pazartesi - Cumartesi: 09:00 - 18:00';
  const whatsapp = settings.WhatsApp || '905550000000';

  return (
    <>
      <SeoHead
        title="İletişim & Konum"
        description="Bozkurt Mobilya iletişim bilgileri, fabrika ve showroom adresi, teklif formu ve hızlı WhatsApp destek hattı."
      />

      <div className="container section contact-section">
        <div className="contact-layout">
          {/* Sol: İletişim Bilgileri Kartları */}
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>İletişim Kanallarımız</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Müşteri danışmanlarımız çalışma saatleri içerisinde tüm sorularınızı yanıtlamaktan memnuniyet duyacaktır.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Telefon */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Doğrudan Arama</span>
                  <a href={`tel:${phone}`} style={{ display: 'block', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Hızlı WhatsApp Hattı</span>
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '1.125rem', fontWeight: 700, color: '#25d366' }}>
                    Mesaj Gönderin →
                  </a>
                </div>
              </div>

              {/* E-posta */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>E-Posta Adresimiz</span>
                  <a href={`mailto:${email}`} style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {email}
                  </a>
                </div>
              </div>

              {/* Adres & Çalışma Saatleri */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <MapPin size={22} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Fabrika & Showroom</strong>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>{address}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <Clock size={22} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Çalışma Saatleri</strong>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>{workingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: İletişim Formu */}
          <div className="card contact-form-card">
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>İletişim & Teklif Formu</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Aşağıdaki formu doldurduğunuzda danışmanlarımız en geç 24 saat içinde size dönüş sağlayacaktır.
            </p>

            {successMessage && (
              <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', color: '#2e7d32', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={24} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div style={{ backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={24} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Adınız Soyadınız <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="form-control"
                  required
                />
              </div>

              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">E-Posta Adresiniz</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@alanadi.com"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Telefon Numaranız</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="form-control"
                  />
                </div>
              </div>

              <p className="contact-form-hint">Size dönüş yapabilmemiz için e-posta adresinizi veya telefon numaranızı belirtmeniz yeterlidir.</p>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Konu / İlgilendiğiniz Ürün</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Örn: Ofis mobilyası toplu fiyat teklifi"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Mesajınız <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="İhtiyaçlarınızı, ölçüleri veya sormak istediklerinizi belirtiniz..."
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  id="kvkkConsent"
                  name="kvkkConsent"
                  checked={formData.kvkkConsent}
                  onChange={handleChange}
                  style={{ marginTop: '0.25rem', width: '16px', height: '16px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="kvkkConsent" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Link to="/kvkk" target="_blank" style={{ color: 'var(--primary-hover)', textDecoration: 'underline' }}>
                    KVKK Aydınlatma Metni
                  </Link>'ni okudum, kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum. <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }}
              >
                {submitting ? (
                  'Gönderiliyor...'
                ) : (
                  <>
                    <Send size={18} />
                    Mesajı Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};
