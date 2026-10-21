import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Eye } from 'lucide-react';

interface StoryItemData {
  id: string;
  title: string;
  badge?: string;
  imageUrl?: string;
  isSpecialBadge?: boolean;
  specialIcon?: React.ReactNode;
  specialColor?: string;
  link: string;
}

const STORY_ITEMS: StoryItemData[] = [
  {
    id: 'japandi',
    title: 'Yeni Japandi Legno',
    badge: 'Yeni',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80',
    link: '/urunler?search=Japandi',
  },
  {
    id: 'victoria',
    title: 'Yeni Ürün Victoria',
    badge: 'Yeni Ürün',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80',
    link: '/urunler?search=Victoria',
  },
  {
    id: 'olivia',
    title: 'Yeni Olivia',
    badge: 'Trend',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=300&q=80',
    link: '/urunler?search=Olivia',
  },
  {
    id: 'bohem',
    title: 'Bohem Şıklığı',
    badge: 'Özel',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80',
    link: '/urunler?search=Bohem',
  },
  {
    id: 'taksit',
    title: '36 Aya Varan Taksit',
    isSpecialBadge: true,
    specialColor: 'linear-gradient(135deg, #4a3328, #1f140e)',
    specialIcon: <CreditCard size={20} color="#ffb703" />,
    link: '/kampanyalar',
  },
  {
    id: 'deneme',
    title: '120 Gün Deneme',
    isSpecialBadge: true,
    specialColor: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
    specialIcon: <ShieldCheck size={22} color="#60a5fa" />,
    link: '/hakkimizda',
  },
  {
    id: 'rahat',
    title: 'Ekstra Rahat Koleksiyon',
    badge: 'Konfor',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=300&q=80',
    link: '/urunler?search=Koltuk',
  },
  {
    id: 'evlilik',
    title: 'Düğün & Evlilik Paketi',
    badge: '%25 İndirim',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=300&q=80',
    link: '/urunler?search=Paket',
  },
  {
    id: 'evindegor',
    title: 'Evinde 3D Gör',
    isSpecialBadge: true,
    specialColor: 'linear-gradient(135deg, #e65c00, #c2410c)',
    specialIcon: <Eye size={22} color="#ffffff" />,
    link: '/hizmetler',
  },
];

export const StoryBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="story-bar-wrapper">
      <div className="container">
        <div className="story-bar-scroll">
          {STORY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="story-item"
              onClick={() => navigate(item.link)}
              title={item.title}
            >
              <div className="story-avatar-wrap">
                {item.isSpecialBadge ? (
                  <div
                    className="story-badge-special"
                    style={{ background: item.specialColor || '#333' }}
                  >
                    <div style={{ marginBottom: '2px' }}>{item.specialIcon}</div>
                    <span style={{ fontSize: '0.62rem', textAlign: 'center', lineHeight: 1.1 }}>
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="story-avatar"
                    loading="lazy"
                  />
                )}
              </div>
              <span className="story-title">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
