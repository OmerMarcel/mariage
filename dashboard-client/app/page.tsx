import Link from 'next/link';
import { Camera, Video, Clock, Users, FolderOpen, Tag, HardDrive, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';
import { dashboardStats, pendingMediasData } from '@/lib/data/mockData';
import { formatFileSize } from '@/lib/utils';
import styles from './page.module.css';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const stats = dashboardStats;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.subtitle}>Bonjour ! Voici un aperçu de votre mariage.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/medias" className="btn btn-primary btn-sm">
            <Clock size={14} />
            Voir les médias en attente ({stats.pendingMedias})
          </Link>
        </div>
      </div>

      {/* Alert if pending */}
      {stats.pendingMedias > 0 && (
        <div className={styles.alertBanner}>
          <AlertTriangle size={18} color="var(--status-pending)" />
          <span>
            <strong>{stats.pendingMedias} média{stats.pendingMedias > 1 ? 's' : ''}</strong> en attente de modération.
          </span>
          <Link href="/medias" className={styles.alertLink}>
            Modérer maintenant <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {[
          {
            icon: Camera,
            value: stats.totalPhotos.toLocaleString(),
            label: 'Photos',
            color: '#C9A84C',
            bg: 'rgba(201,168,76,0.1)',
            href: '/medias?type=photo',
          },
          {
            icon: Video,
            value: stats.totalVideos.toString(),
            label: 'Vidéos',
            color: '#7B61D8',
            bg: 'rgba(123,97,216,0.1)',
            href: '/medias?type=video',
          },
          {
            icon: Clock,
            value: stats.pendingMedias.toString(),
            label: 'En attente',
            color: '#E8A020',
            bg: 'rgba(232,160,32,0.1)',
            href: '/medias?status=en_attente',
          },
          {
            icon: Users,
            value: stats.totalGuests.toString(),
            label: 'Invités',
            color: '#4A9B6F',
            bg: 'rgba(74,155,111,0.1)',
            href: '/invites',
          },
          {
            icon: FolderOpen,
            value: stats.totalAlbums.toString(),
            label: 'Albums',
            color: '#E06B5A',
            bg: 'rgba(224,107,90,0.1)',
            href: '/albums',
          },
          {
            icon: Tag,
            value: stats.totalCategories.toString(),
            label: 'Catégories',
            color: '#2196F3',
            bg: 'rgba(33,150,243,0.1)',
            href: '/categories',
          },
          {
            icon: HardDrive,
            value: `${(stats.storageUsed / 1024).toFixed(1)} Go`,
            label: 'Stockage utilisé',
            color: '#9C27B0',
            bg: 'rgba(156,39,176,0.1)',
            href: '/parametres',
          },
          {
            icon: TrendingUp,
            value: '127',
            label: 'Consultations',
            color: '#FF5722',
            bg: 'rgba(255,87,34,0.1)',
            href: '/',
          },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ background: stat.bg }}>
              <stat.icon size={22} color={stat.color} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <ArrowRight size={16} className={styles.statArrow} />
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className={styles.twoCol}>
        {/* Pending Medias */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Clock size={18} />
              Médias en attente
            </h2>
            <Link href="/medias?status=en_attente" className={styles.seeAll}>
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.pendingList}>
            {pendingMediasData.map(media => (
              <div key={media.id} className={styles.pendingItem}>
                <div className={styles.pendingThumb}>
                  <Image
                    src={media.thumbnailUrl}
                    alt={media.title || 'Média'}
                    fill
                    className={styles.pendingImg}
                    sizes="60px"
                  />
                  {media.type === 'video' && (
                    <div className={styles.videoOverlay}>
                      <Video size={14} />
                    </div>
                  )}
                </div>
                <div className={styles.pendingInfo}>
                  <span className={styles.pendingTitle}>{media.title || 'Sans titre'}</span>
                  <span className={styles.pendingMeta}>
                    {media.uploadedBy || 'Invité anonyme'} · {formatFileSize(media.size)}
                  </span>
                  {media.guestMessage && (
                    <span className={styles.pendingMessage}>&ldquo;{media.guestMessage}&rdquo;</span>
                  )}
                </div>
                <div className={styles.pendingActions}>
                  <button className="btn btn-success btn-sm">✓</button>
                  <button className="btn btn-danger btn-sm">✗</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <TrendingUp size={18} />
              Actions rapides
            </h2>
          </div>
          <div className={styles.quickActions}>
            {[
              { href: '/medias', label: 'Gérer les médias', icon: Camera, desc: 'Approuver, refuser, organiser' },
              { href: '/categories', label: 'Gérer les catégories', icon: Tag, desc: 'Créer, modifier, réordonner' },
              { href: '/invites', label: 'Gérer les invités', icon: Users, desc: 'Ajouter, permissions, accès' },
              { href: '/invitations', label: 'Créer une invitation', icon: Camera, desc: 'Carte digitale, lien unique' },
              { href: '/albums', label: 'Gérer les albums', icon: FolderOpen, desc: 'Créer et organiser les albums' },
              { href: '/parametres', label: 'Paramètres', icon: Tag, desc: 'Configuration du site' },
            ].map(action => (
              <Link key={action.href} href={action.href} className={styles.quickAction}>
                <action.icon size={18} color="var(--gold)" />
                <div>
                  <span className={styles.quickLabel}>{action.label}</span>
                  <span className={styles.quickDesc}>{action.desc}</span>
                </div>
                <ArrowRight size={14} className={styles.quickArrow} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
