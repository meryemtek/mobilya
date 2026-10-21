import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { publicApi } from '../../api/endpoints';

export const WhatsAppButton: React.FC = () => {
  const [whatsapp, setWhatsapp] = useState('905550000000');

  useEffect(() => {
    publicApi.getSiteSettings()
      .then((settings) => {
        if (settings.WhatsApp) {
          setWhatsapp(settings.WhatsApp.replace(/\D/g, ''));
        }
      })
      .catch(() => {});
  }, []);

  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Merhaba, Bozkurt Mobilya ürünleri hakkında bilgi almak istiyorum.')}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="WhatsApp üzerinden mesaj gönderin"
      title="WhatsApp ile Bilgi Alın"
    >
      <MessageCircle size={32} />
    </a>
  );
};
