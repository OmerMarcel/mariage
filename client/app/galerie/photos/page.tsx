'use client';

import { useState, useCallback, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Download, ZoomIn, X, ChevronLeft, ChevronRight, Filter, LayoutGrid, Grid3X3 } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getPublicCategories, getPublicMedia } from '@/lib/api';
import { Category, Media } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';
import styles from './page.module.css';

function PhotoGalleryPageInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [photos, setPhotos] = useState<Media[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layout, setLayout] = useState<'masonry' | 'grid'>('masonry');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    Promise.all([getPublicCategories(), getPublicMedia({ type: 'photo' })])
      .then(([loadedCategories, loadedPhotos]) => {
        if (!active) return;
        setCategories(loadedCategories);
        setPhotos(loadedPhotos);
      })
      .catch(error => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Impossible de charger la galerie.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter(p => {
        const cat = categories.find(c => c.slug === selectedCategory);
        return cat && p.categoryId === cat.id;
      });

  const openViewer = useCallback((index: number) => {
    setCurrentIndex(index);
    setViewerOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    document.body.style.overflow = '';
  }, []);

  const navigate = useCallback((dir: 'prev' | 'next') => {
    setCurrentIndex(prev => {
      if (dir === 'prev') return prev === 0 ? filteredPhotos.length - 1 : prev - 1;
      return prev === filteredPhotos.length - 1 ? 0 : prev + 1;
    });
  }, [filteredPhotos.length]);

  const toggleSelect = (id: string) => {
    setSelectedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentPhoto = filteredPhotos[currentIndex];

  if (isLoading || loadError) {
    return (
      <PublicLayout>
        <div className={styles.page}>
          <div className={styles.empty}>
            {isLoading ? <p>Chargement de la galerie...</p> : (
              <>
                <Filter size={40} />
                <p>{loadError}</p>
              </>
            )}
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className={styles.page}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <span className="subtitle">Nos moments capturés</span>
          <h1 className="section-title">Galerie Photos</h1>
          <div className="gold-divider" />
          <p className={styles.pageDesc}>
            {filteredPhotos.length} photo{filteredPhotos.length > 1 ? 's' : ''} dans notre collection
          </p>
        </div>

        {/* Controls Bar */}
        <div className={styles.controls}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
              onClick={() => setSelectedCategory('all')}
              id="filter-all"
            >
              Toutes (              {photos.length})
            </button>
            {categories.filter(c => c.visible).map(cat => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${selectedCategory === cat.slug ? styles.filterActive : ''}`}
                onClick={() => setSelectedCategory(cat.slug)}
                id={`filter-${cat.slug}`}
              >
                {cat.name} ({cat.mediaCount})
              </button>
            ))}
          </div>

          <div className={styles.viewControls}>
            {selectedPhotos.size > 0 && (
              <button className="btn btn-secondary btn-sm">
                <Download size={14} />
                Télécharger ({selectedPhotos.size})
              </button>
            )}
            <button
              className={`${styles.layoutBtn} ${layout === 'masonry' ? styles.layoutActive : ''}`}
              onClick={() => setLayout('masonry')}
              title="Vue masonry"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`${styles.layoutBtn} ${layout === 'grid' ? styles.layoutActive : ''}`}
              onClick={() => setLayout('grid')}
              title="Vue grille"
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <div className={`container ${styles.galleryContainer}`}>
          <div className={`${styles.gallery} ${layout === 'masonry' ? styles.masonry : styles.gridLayout}`}>
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className={`${styles.photoItem} ${selectedPhotos.has(photo.id) ? styles.selected : ''}`}
                style={layout === 'masonry' ? {
                  gridRowEnd: `span ${Math.floor((photo.height || 600) / (photo.width || 800) * 10) + 10}`,
                } : {}}
              >
                <div className={styles.photoInner}>
                  <Image
                    src={photo.webUrl}
                    alt={photo.title || `Photo ${index + 1}`}
                    width={photo.width || 800}
                    height={photo.height || 600}
                    className={styles.photoImg}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className={styles.photoOverlay}>
                    <button
                      className={styles.photoZoom}
                      onClick={() => openViewer(index)}
                      aria-label="Agrandir"
                    >
                      <ZoomIn size={20} />
                    </button>
                    <button
                      className={styles.photoSelect}
                      onClick={() => toggleSelect(photo.id)}
                      aria-label="Sélectionner"
                    >
                      <div className={`${styles.checkbox} ${selectedPhotos.has(photo.id) ? styles.checked : ''}`} />
                    </button>
                    {photo.downloadAllowed && (
                      <a
                        href={photo.originalUrl}
                        download
                        className={styles.photoDownload}
                        onClick={e => e.stopPropagation()}
                        aria-label="Télécharger"
                      >
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                  <div className={styles.photoCategory}>
                    {categories.find(c => c.id === photo.categoryId)?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className={styles.empty}>
              <Filter size={40} />
              <p>Aucune photo dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== LIGHTBOX VIEWER ===== */}
      {viewerOpen && currentPhoto && (
        <div className={styles.viewer} onClick={closeViewer}>
          <div className={styles.viewerContent} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button className={styles.viewerClose} onClick={closeViewer} aria-label="Fermer">
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              className={`${styles.viewerNav} ${styles.viewerPrev}`}
              onClick={() => navigate('prev')}
              aria-label="Précédent"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Image */}
            <div className={styles.viewerImg}>
              <Image
                src={currentPhoto.webUrl}
                alt={currentPhoto.title || 'Photo'}
                width={currentPhoto.width || 1200}
                height={currentPhoto.height || 800}
                className={styles.viewerPhoto}
                sizes="100vw"
                priority
              />
            </div>

            {/* Next */}
            <button
              className={`${styles.viewerNav} ${styles.viewerNext}`}
              onClick={() => navigate('next')}
              aria-label="Suivant"
            >
              <ChevronRight size={28} />
            </button>

            {/* Info bar */}
            <div className={styles.viewerInfo}>
              <div className={styles.viewerMeta}>
                <span className={styles.viewerCategory}>
                  {categories.find(c => c.id === currentPhoto.categoryId)?.name}
                </span>
                <span className={styles.viewerCounter}>
                  {currentIndex + 1} / {filteredPhotos.length}
                </span>
                <span className={styles.viewerSize}>
                  {formatFileSize(currentPhoto.size)}
                </span>
              </div>
              {currentPhoto.downloadAllowed && (
                <a href={currentPhoto.originalUrl} download className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  Télécharger (original)
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

export default function PhotoGalleryPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>}>
      <PhotoGalleryPageInner />
    </Suspense>
  );
}
