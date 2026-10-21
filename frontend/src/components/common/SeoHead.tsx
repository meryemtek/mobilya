import React, { useEffect } from 'react';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = 'Bozkurt Mobilya — Yaşam alanlarınıza ve kurumsal mekanlarınıza değer katan estetik, kaliteli ve ergonomik mobilya çözümleri.',
  ogImage = '/logo.png',
  ogType = 'website',
}) => {
  const fullTitle = title 
    ? `${title} | Bozkurt Mobilya` 
    : 'Bozkurt Mobilya | Kurumsal ve Özel Tasarım Mobilya';

  useEffect(() => {
    document.title = fullTitle;

    // Meta Description güncelle
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // OpenGraph Tagleri
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'ABC Mobilya | Demo');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', 'Mobilya web sitesi demo projesi.');

    let ogTypeEl = document.querySelector('meta[property="og:type"]');
    if (!ogTypeEl) {
      ogTypeEl = document.createElement('meta');
      ogTypeEl.setAttribute('property', 'og:type');
      document.head.appendChild(ogTypeEl);
    }
    ogTypeEl.setAttribute('content', ogType);

    let ogImgEl = document.querySelector('meta[property="og:image"]');
    if (!ogImgEl) {
      ogImgEl = document.createElement('meta');
      ogImgEl.setAttribute('property', 'og:image');
      document.head.appendChild(ogImgEl);
    }
    ogImgEl.setAttribute('content', new URL('/demo-preview.png', window.location.origin).href);
  }, [fullTitle, description, ogImage, ogType]);

  return null;
};
