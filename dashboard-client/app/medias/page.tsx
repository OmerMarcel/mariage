'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Eye, Trash2, Filter, Search, MoreHorizontal, Video, Image as ImageIcon } from 'lucide-react';
import { getAdminMedia, updateMediaStatus } from '@/lib/api';
import { categoriesData } from '@/lib/data/mockData';
import { formatFileSize, formatDate, getStatusLabel } from '@/lib/utils';
import { Media, MediaStatus } from '@/lib/types';
import styles from './page.module.css';

function AdminMediasPageInner() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  const initialType = searchParams.get('type') || 'all';

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [allMedias, setAllMedias] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    getAdminMedia()
      .then(setAllMedias)
      .catch(error => setLoadError(error instanceof Error ? error.message : 'Impossible de charger les médias.'))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter medias
  const filteredMedias = allMedias.filter(media => {
    if (statusFilter !== 'all' && media.status !== statusFilter) return false;
    if (typeFilter !== 'all' && media.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && media.categoryId !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return !!(
        media.title?.toLowerCase().includes(q) ||
        media.uploadedBy?.toLowerCase().includes(q) ||
        media.guestMessage?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === filteredMedias.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredMedias.map(m => m.id)));
    }
  };

  const changeStatus = async (id: string, status: MediaStatus) => {
    setActionError(null);
    try {
      const updatedMedia = await updateMediaStatus(id, status);
      setAllMedias(prev => prev.map(media => media.id === id ? updatedMedia : media));
      setSelectedItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action impossible.');
    }
  };

  const changeSelectedStatus = async (status: MediaStatus) => {
    setActionError(null);
    try {
      const updatedMedias = await Promise.all(
        [...selectedItems].map(id => updateMediaStatus(id, status)),
      );
      const updates = new Map(updatedMedias.map(media => [media.id, media]));
      setAllMedias(prev => prev.map(media => updates.get(media.id) || media));
      setSelectedItems(new Set());
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action impossible.');
    }
  };

  if (isLoading || loadError) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <p>{isLoading ? 'Chargement des médias...' : loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestion des Médias</h1>
          <p className={styles.subtitle}>{filteredMedias.length} médias trouvés</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-primary btn-sm">
            <ImageIcon size={14} />
            Ajouter un média
          </button>
        </div>
      </div>

      {/* Filters & Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="approuve">Approuvés</option>
            <option value="refuse">Refusés</option>
            <option value="masque">Masqués</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="photo">Photos</option>
            <option value="video">Vidéos</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            {categoriesData.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.bulkCount}>{selectedItems.size} média(s) sélectionné(s)</span>
          <div className={styles.bulkButtons}>
            <button className="btn btn-success btn-sm" onClick={() => changeSelectedStatus('approuve')}>
              <CheckCircle size={14} /> Approuver
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => changeSelectedStatus('masque')}>
              <Eye size={14} /> Masquer
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => changeSelectedStatus('refuse')}>
              <Trash2 size={14} /> Supprimer
            </button>
          </div>
        </div>
      )}

      {actionError && <div className={styles.errorBanner}>{actionError}</div>}

      {/* Media Grid */}
      <div className={styles.mediaGrid}>
        {filteredMedias.map((media) => (
          <div key={media.id} className={`${styles.mediaCard} ${selectedItems.has(media.id) ? styles.selected : ''}`}>
            
            <div className={styles.mediaThumb}>
              <Image 
                src={media.thumbnailUrl} 
                alt={media.title || 'Média'} 
                fill 
                className={styles.thumbImg} 
                sizes="250px"
              />
              
              {/* Type Badge */}
              <div className={styles.typeBadge}>
                {media.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
              </div>

              {/* Status Badge overlay */}
              <div className={`${styles.statusOverlay} ${styles[media.status]}`}>
                {getStatusLabel(media.status)}
              </div>

              {/* Selection Overlay */}
              <div className={styles.selectOverlay} onClick={() => toggleSelect(media.id)}>
                <div className={`${styles.checkbox} ${selectedItems.has(media.id) ? styles.checked : ''}`} />
              </div>
            </div>

            <div className={styles.mediaInfo}>
              <div className={styles.mediaHeader}>
                <h3 className={styles.mediaTitle}>{media.title || 'Sans titre'}</h3>
                <button className={styles.moreBtn}>
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className={styles.mediaDetails}>
                <span>{categoriesData.find(c => c.id === media.categoryId)?.name || 'Non classé'}</span>
                <span>·</span>
                <span>{formatDate(media.createdAt)}</span>
              </div>

              {media.uploadedBy && (
                <div className={styles.mediaAuthor}>
                  <span className={styles.authorLabel}>Par:</span> {media.uploadedBy}
                </div>
              )}

              {/* Quick Actions for pending */}
              {media.status === 'en_attente' && (
                <div className={styles.quickActions}>
                  <button className={`${styles.actionBtn} ${styles.approveBtn}`} title="Approuver" onClick={() => changeStatus(media.id, 'approuve')}>
                    <CheckCircle size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.rejectBtn}`} title="Refuser" onClick={() => changeStatus(media.id, 'refuse')}>
                    <XCircle size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredMedias.length === 0 && (
        <div className={styles.emptyState}>
          <Filter size={40} className={styles.emptyIcon} />
          <p>Aucun média ne correspond à vos filtres.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            setStatusFilter('all');
            setTypeFilter('all');
            setCategoryFilter('all');
            setSearchQuery('');
          }}>
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminMediasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>}>
      <AdminMediasPageInner />
    </Suspense>
  );
}
