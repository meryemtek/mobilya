import React, { useEffect, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Copy,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Search,
  ExternalLink,
  Eye,
  Filter,
  RefreshCw,
  X
} from 'lucide-react';
import { adminApi } from '../../api/endpoints';

interface MediaItem {
  fileName: string;
  url: string;
  size: number;
  createdAt: string;
  source: string;
}

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'uploads' | 'catalog'>('all');
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getMediaFiles();
      setMediaList(data);
    } catch (err: any) {
      console.error('Medya listesi alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setError("Dosya boyutu 5 MB'dan büyük olamaz.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      const res = await adminApi.uploadMedia(file);
      setUploadedUrl(res.url);
      setFile(null);
      await fetchMedia();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.title || 'Yükleme sırasında hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`"${item.fileName}" dosyasını sunucudan silmek istediğinize emin misiniz?`)) return;
    try {
      await adminApi.deleteMediaFile(item.fileName);
      await fetchMedia();
    } catch {
      alert('Dosya silinirken bir hata oluştu.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Dış Bağlantı';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.fileName.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'uploads') return m.source === 'Yüklenen Dosya';
    if (filterType === 'catalog') return m.source !== 'Yüklenen Dosya';
    return true;
  });

  return (
    <div>
      {/* Sayfa Başlığı */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Medya & Görsel Kütüphanesi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Sunucuya yüklenen tüm dosyaları ve katalog görsellerini görüntüleyin, URL kopyalayın veya yeni görseller yükleyin.
          </p>
        </div>

        <button
          onClick={fetchMedia}
          className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Yenile
        </button>
      </div>

      {/* Yükleme Bölümü */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UploadCloud size={22} color="var(--color-accent)" /> Yeni Görsel Yükle
        </h3>

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {uploadedUrl && (
          <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Görsel başarıyla sunucuya yüklendi ve kütüphaneye eklendi!</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(uploadedUrl)}
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#2e7d32', color: '#2e7d32', padding: '0.25rem 0.65rem' }}
            >
              {copiedUrl === uploadedUrl ? 'Kopyalandı!' : 'URL Kopyala'}
            </button>
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.25rem', alignItems: 'center' }}>
          <div
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <ImageIcon size={32} color="var(--color-accent)" />
            <div style={{ textAlign: 'left' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                {file ? file.name : 'Görsel Seçmek İçin Tıklayın veya Sürükleyin'}
              </strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB seçildi` : 'Maksimum 5 MB (JPG, PNG, WebP)'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="btn btn-primary"
            style={{ padding: '0.9rem 1.75rem', height: '100%', whiteSpace: 'nowrap' }}
          >
            {uploading ? 'Yükleniyor...' : 'Sunucuya Yükle'}
          </button>
        </form>
      </div>

      {/* Görseller Filtreleme ve Arama Çubuğu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Filtre Butonları */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterType('all')}
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            Tüm Görseller ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterType('uploads')}
            className={`btn btn-sm ${filterType === 'uploads' ? 'btn-primary' : 'btn-outline'}`}
          >
            Sunucuya Yüklenenler ({mediaList.filter((m) => m.source === 'Yüklenen Dosya').length})
          </button>
          <button
            onClick={() => setFilterType('catalog')}
            className={`btn btn-sm ${filterType === 'catalog' ? 'btn-primary' : 'btn-outline'}`}
          >
            Katalog Görselleri ({mediaList.filter((m) => m.source !== 'Yüklenen Dosya').length})
          </button>
        </div>

        {/* Arama */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Görsel veya URL ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Medya Listesi / Galeri Izgarası */}
      {loading ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <RefreshCw size={32} className="spin" style={{ margin: '0 auto 1rem auto', display: 'block', color: 'var(--color-accent)' }} />
          <span>Görseller yükleniyor...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
          <h3>Görsel Bulunamadı</h3>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {search ? 'Aramanıza uygun görsel bulunamadı.' : 'Henüz sunucuya yüklenmiş bir görsel yok. Yukarıdaki formdan ilk görselinizi yükleyebilirsiniz.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {filteredMedia.map((item, idx) => {
            const isCopied = copiedUrl === item.url;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  border: isCopied ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                }}
              >
                {/* Görsel Kutusu */}
                <div
                  style={{
                    position: 'relative',
                    height: '160px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => setPreviewImage(item)}
                >
                  <img
                    src={item.url}
                    alt={item.fileName}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Kaynak Rozeti */}
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: item.source === 'Yüklenen Dosya' ? '#008779' : '#334155',
                      color: '#fff',
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.source}
                  </span>

                  {/* Büyüteç Overlay İkonu */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Eye size={14} />
                  </div>
                </div>

                {/* Alt Detaylar */}
                <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <h4
                      title={item.fileName}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        margin: '0 0 0.35rem 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.fileName}
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <span>{formatFileSize(item.size)}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  {/* Eylemler */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.url)}
                      className={`btn btn-sm ${isCopied ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
                      title="URL'yi panoya kopyala"
                    >
                      <Copy size={13} />
                      {isCopied ? 'Kopyalandı!' : 'URL Kopyala'}
                    </button>

                    {item.source === 'Yüklenen Dosya' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.4rem 0.5rem' }}
                        title="Sunucudan Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Büyük Boy Önizleme Modalı */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--color-bg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>{previewImage.fileName}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {formatFileSize(previewImage.size)} • {previewImage.source}
                </span>
              </div>
              <button onClick={() => setPreviewImage(null)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', minHeight: '300px', maxHeight: '550px' }}>
              <img
                src={previewImage.url}
                alt={previewImage.fileName}
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '4px' }}
              />
            </div>

            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
              <code style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-bg)', padding: '0.35rem 0.65rem', borderRadius: '4px', border: '1px solid var(--color-border)', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {previewImage.url}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(previewImage.url)}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Copy size={14} />
                {copiedUrl === previewImage.url ? 'Kopyalandı!' : 'URL Kopyala'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
