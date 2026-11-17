'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getPublicCategories, getPublicMedia } from '@/lib/api';
import { Category, Media } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import styles from './page.module.css';

export default function VideoGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState<Media[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([getPublicCategories(), getPublicMedia({ type: 'video' })])
      .then(([loadedCategories, loadedVideos]) => {
        if (!active) return;
        setCategories(loadedCategories);
        setVideos(loadedVideos);
      })
      .catch(error => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Impossible de charger les vidéos.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => {
        const cat = categories.find(c => c.slug === selectedCategory);
        return cat && v.categoryId === cat.id;
      });

  const openPlayer = (index: number) => {
    setCurrentIndex(index);
    setPlayerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePlayer = () => {
    setPlayerOpen(false);
    document.body.style.overflow = '';
  };

  const navigate = (dir: 'prev' | 'next') => {
    setCurrentIndex(prev => {
      if (dir === 'prev') return prev === 0 ? filteredVideos.length - 1 : prev - 1;
      return prev === filteredVideos.length - 1 ? 0 : prev + 1;
    });
  };

  const currentVideo = filteredVideos[currentIndex];
  const videoCategoryIds = [...new Set(videos.map(v => v.categoryId))];
  const videoCategories = categories.filter(c => videoCategoryIds.includes(c.id));

  if (isLoading || loadError) {
    return (
      <PublicLayout>
        <div className={styles.page}>
          <div className={styles.empty}>
            <p>{isLoading ? 'Chargement des vidéos...' : loadError}</p>
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
          <span className="subtitle">Moments en mouvement</span>
          <h1 className="section-title">Galerie Vidéos</h1>
          <div className="gold-divider" />
          <p className={styles.pageDesc}>
            {videos.length} vidéo{videos.length > 1 ? 's' : ''} de notre journée de mariage
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Toutes ({videos.length})
          </button>
          {videoCategories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${selectedCategory === cat.slug ? styles.filterActive : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="container" style={{ paddingBottom: '4rem' }}>
          <div className={styles.videoGrid}>
            {filteredVideos.map((video, index) => (
              <div key={video.id} className={styles.videoCard}>
                <div className={styles.videoThumbnail} onClick={() => openPlayer(index)}>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title || 'Vidéo'}
                    fill
                    className={styles.thumbImg}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className={styles.thumbOverlay}>
                    <button className={styles.playBtn} aria-label="Lire la vidéo">
                      <Play size={24} fill="white" />
                    </button>
                  </div>
                  {video.duration && (
                    <span className={styles.duration}>{formatDuration(video.duration)}</span>
                  )}
                </div>
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <div className={styles.videoMeta}>
                    <span className={styles.videoCategory}>
                      {categories.find(c => c.id === video.categoryId)?.name}
                    </span>
                    {video.downloadAllowed && (
                      <a
                        href={video.originalUrl}
                        download
                        className={styles.downloadLink}
                        aria-label="Télécharger"
                      >
                        <Download size={14} />
                        Télécharger
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== VIDEO PLAYER MODAL ===== */}
      {playerOpen && currentVideo && (
        <div className={styles.player} onClick={closePlayer}>
          <div className={styles.playerContent} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button className={styles.playerClose} onClick={closePlayer} aria-label="Fermer">
              <X size={22} />
            </button>

            {/* Prev/Next */}
            {filteredVideos.length > 1 && (
              <>
                <button className={`${styles.playerNav} ${styles.playerPrev}`} onClick={() => navigate('prev')}>
                  <ChevronLeft size={24} />
                </button>
                <button className={`${styles.playerNav} ${styles.playerNext}`} onClick={() => navigate('next')}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Video */}
            <video
              key={currentVideo.id}
              src={currentVideo.webUrl}
              controls
              autoPlay
              className={styles.playerVideo}
              poster={currentVideo.thumbnailUrl}
            />

            {/* Info */}
            <div className={styles.playerInfo}>
              <div>
                <h3 className={styles.playerTitle}>{currentVideo.title}</h3>
                <span className={styles.playerCategory}>
                  {categories.find(c => c.id === currentVideo.categoryId)?.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem' }}>
                  {currentIndex + 1} / {filteredVideos.length}
                </span>
                {currentVideo.downloadAllowed && (
                  <a href={currentVideo.originalUrl} download className="btn btn-secondary btn-sm">
                    <Download size={14} />
                    Télécharger
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
