import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Search,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import type { ProductListItem } from '../../types';

export const AdminShowcasePage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([]);
  const [newProductIds, setNewProductIds] = useState<number[]>([]);
  const [bestSellerIds, setBestSellerIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'yeni' | 'cok-satan'>('yeni');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ürün Ekleme Seçim Alanı Arama & Filtre
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsRes, showcaseRes] = await Promise.all([
        adminApi.getProducts({ page: 1, pageSize: 100 }),
        adminApi.getShowcaseSettings(),
      ]);

      setAllProducts(prodsRes.items);
      setNewProductIds(showcaseRes.newProductIds || []);
      setBestSellerIds(showcaseRes.bestSellerIds || []);
    } catch (err: any) {
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await adminApi.updateShowcaseSettings({
        newProductIds,
        bestSellerIds,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Vitrin ayarları kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const currentIds = activeTab === 'yeni' ? newProductIds : bestSellerIds;
  const setCurrentIds = (updater: (prev: number[]) => number[]) => {
    if (activeTab === 'yeni') {
      setNewProductIds(updater);
    } else {
      setBestSellerIds(updater);
    }
  };

  const addProductToCurrent = (id: number) => {
    if (currentIds.includes(id)) return;
    setCurrentIds((prev) => [...prev, id]);
    setSelectedProductId('');
  };

  const removeProductFromCurrent = (id: number) => {
    setCurrentIds((prev) => prev.filter((item) => item !== id));
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentIds.length) return;

    setCurrentIds((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const productMap = new Map<number, ProductListItem>();
  allProducts.forEach((p) => productMap.set(p.id, p));

  const availableProducts = allProducts.filter(
    (p) =>
      !currentIds.includes(p.id) &&
      (searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.productCode && p.productCode.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div>
      {/* Üst Başlık ve Kaydet Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={26} color="var(--color-accent)" />
            Ana Sayfa Vitrin Yönetimi
          </h1>
          
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
        >
          <Save size={18} />
          {saving ? 'Kaydediliyor...' : 'Vitrin Ayarlarını Kaydet'}
        </button>
      </div>

      {/* Başarı / Hata Bildirimleri */}
      {saveSuccess && (
        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid #c8e6c9' }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600 }}>Vitrin ürünleri başarıyla kaydedildi! Değişiklikler anında ana sayfada yayına alındı.</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid #ffcdd2' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

    

      {/* Sekmeler: Yeni Ürünler vs En Çok Satanlar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('yeni')}
          style={{
            padding: '0.85rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'yeni' ? '3px solid var(--color-accent)' : '3px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'yeni' ? 'var(--color-accent)' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={18} />
          <span>Yeni Ürünler Sekmesi</span>
          <span className="badge badge-teal" style={{ marginLeft: '0.25rem' }}>{newProductIds.length} Ürün</span>
        </button>

        <button
          onClick={() => setActiveTab('cok-satan')}
          style={{
            padding: '0.85rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'cok-satan' ? '3px solid #d97706' : '3px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'cok-satan' ? '#d97706' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Flame size={18} />
          <span>En Çok Satanlar Sekmesi</span>
          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', marginLeft: '0.25rem' }}>{bestSellerIds.length} Ürün</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(300px, 1fr)', gap: '2rem' }}>
        {/* Sol Kolon: Seçili Vitrin Ürünleri Listesi & Sıralaması */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
              {activeTab === 'yeni' ? '🌟 Yeni Ürünler Vitrini' : '🔥 En Çok Satanlar Vitrini'} ({currentIds.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Sıralamak için okları kullanın
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
          ) : currentIds.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
              <Layers size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Bu sekmede henüz ürün seçilmemiş.</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                Sağdaki listeden bu vitrinde görünmesini istediğiniz ürünleri seçip ekleyin.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentIds.map((id, index) => {
                const prod = productMap.get(id);
                if (!prod) return null;

                const coverImg = prod.coverImageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';

                return (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Sıra Numarası ve Görsel */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, overflow: 'hidden' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: activeTab === 'yeni' ? 'var(--color-accent)' : '#d97706',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </span>

                      <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--color-bg-subtle)' }}>
                        <img src={coverImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prod.name}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {prod.categoryName} {prod.productCode ? `• Kod: ${prod.productCode}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Sıralama ve Silme Butonları */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => moveProduct(index, 'up')}
                        disabled={index === 0}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem', opacity: index === 0 ? 0.3 : 1 }}
                        title="Yukarı Taşı"
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveProduct(index, 'down')}
                        disabled={index === currentIds.length - 1}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem', opacity: index === currentIds.length - 1 ? 0.3 : 1 }}
                        title="Aşağı Taşı"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeProductFromCurrent(id)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem', color: '#ef4444', borderColor: '#ef4444', marginLeft: '0.25rem' }}
                        title="Vitrinden Çıkar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sağ Kolon: Kataloğundaki Ürünlerden Seçip Ekleme */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Ürün Ekle
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Aşağıdaki arama çubuğundan ürün bulun veya listeden tek tıkla <strong>"{activeTab === 'yeni' ? 'Yeni Ürünler' : 'En Çok Satanlar'}"</strong> sekmesine ekleyin.
          </p>

          {/* Arama Alanı */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Ürün adı veya kodu ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem', width: '100%' }}
            />
          </div>

          {/* Eklenebilecek Ürünler Listesi */}
          <div style={{ maxHeight: '480px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.3rem' }}>
            {availableProducts.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
                {searchTerm ? 'Aramaya uygun ürün bulunamadı.' : 'Tüm ürünler vitrine eklenmiş durumda.'}
              </p>
            ) : (
              availableProducts.map((p) => {
                const prodId = p.id;
                const coverImg = p.coverImageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';

                return (
                  <div
                    key={prodId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={coverImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <strong style={{ fontSize: '0.85rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {p.categoryName}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addProductToCurrent(prodId)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}
                    >
                      <Plus size={14} /> Ekle
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
