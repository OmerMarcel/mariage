'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { albumsData, categoriesData } from '@/lib/data/mockData';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

export default function AdminAlbumsPage() {
  const [albums] = useState(albumsData);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Albums</h1>
          <p className={styles.subtitle}>Gérez les albums photos et vidéos</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          Nouvel album
        </button>
      </div>

      <div className={styles.albumGrid}>
        {albums.map((album) => {
          const category = categoriesData.find(c => c.id === album.categoryId);
          return (
            <div key={album.id} className={styles.albumCard}>
              <div className={styles.albumCover}>
                <Image
                  src={album.coverPhotoUrl || '/images/hero.jpg'}
                  alt={album.name}
                  fill
                  className={styles.coverImg}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.albumOverlay}>
                  <div className={styles.albumActions}>
                    <button className={styles.actionBtn} title="Modifier l'album">
                      <Edit2 size={16} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.dangerBtn}`} title="Supprimer l'album">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.albumInfo}>
                <div className={styles.albumHeader}>
                  <FolderOpen size={18} className={styles.folderIcon} />
                  <h3 className={styles.albumName}>{album.name}</h3>
                </div>
                
                {album.description && (
                  <p className={styles.albumDesc}>{album.description}</p>
                )}
                
                <div className={styles.albumMeta}>
                  <div className={styles.metaItem}>
                    <ImageIcon size={14} />
                    <span>{album.mediaCount} médias</span>
                  </div>
                  {category && (
                    <div className={styles.metaItem}>
                      <span className={styles.catDot} />
                      <span>{category.name}</span>
                    </div>
                  )}
                </div>
                <div className={styles.albumDate}>
                  Créé le {formatDate(album.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
