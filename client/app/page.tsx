'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Camera, Video, MapPin, Calendar, ArrowDown, ChevronRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import Countdown from '@/components/ui/Countdown';
import { weddingData, categoriesData } from '@/lib/data/mockData';
import styles from './page.module.css';

export default function HomePage() {
  const visibleCategories = categoriesData.filter(c => c.visible).slice(0, 6);

  return (
    <PublicLayout>
      {/* ========== HERO SECTION ========== */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroOverlay} />
        <Image
          src={weddingData.coverPhotoUrl}
          alt="Amara & Théo — Photo de mariage"
          fill
          className={styles.heroBg}
          priority
          sizes="100vw"
        />

        <div className={styles.heroContent}>
          {/* Decorative */}
          <div className={styles.heroDecor}>
            <span className={styles.heroOrnament}>✦</span>
          </div>

          <p className={styles.heroSubtitle}>Nous vous annonçons notre union</p>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroName}>Amara</span>
            <span className={styles.heroAmpersand}>&amp;</span>
            <span className={styles.heroName}>Théo</span>
          </h1>

          <div className={styles.heroDivider}>
            <span className={styles.heroDividerLine} />
            <Heart size={16} fill="var(--gold)" color="var(--gold)" className="animate-heartbeat" />
            <span className={styles.heroDividerLine} />
          </div>

          {/* Wedding info */}
          <div className={styles.heroInfo}>
            <div className={styles.heroInfoItem}>
              <Calendar size={15} />
              <span>14 Juin 2026</span>
            </div>
            <span className={styles.heroDot}>·</span>
            <div className={styles.heroInfoItem}>
              <MapPin size={15} />
              <span>Château de Versailles, France</span>
            </div>
          </div>

          {/* Countdown */}
          <div className={styles.heroCountdown}>
            <Countdown weddingDate={weddingData.weddingDate} />
          </div>

          {/* CTA Buttons */}
          <div className={styles.heroCtas}>
            <Link href="/galerie/photos" className="btn btn-primary">
              <Camera size={16} />
              Voir la Galerie
            </Link>
            <Link href="/espace-invite" className="btn btn-ghost">
              <Heart size={16} />
              Partager vos photos
            </Link>
          </div>
        </div>

        {/* Scroll down */}
        <a href="#love-message" className={styles.scrollDown} aria-label="Défiler">
          <ArrowDown size={20} />
        </a>
      </section>

      {/* ========== LOVE MESSAGE ========== */}
      <section className={`${styles.loveMessage} bg-pattern`} id="love-message">
        <div className="container-sm text-center">
          <span className="subtitle">Notre histoire d&apos;amour</span>
          <div className="gold-divider" />
          <blockquote className={styles.quote}>
            &ldquo;{weddingData.loveMessage}&rdquo;
          </blockquote>
          <p className={styles.quoteSignature}>— Amara & Théo</p>
          <Link href="/notre-histoire" className="btn btn-secondary" style={{ marginTop: '2rem' }}>
            Découvrir notre histoire
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ========== QUICK STATS ========== */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { icon: Camera, value: '428+', label: 'Photos', color: 'var(--gold)' },
              { icon: Video, value: '24', label: 'Vidéos', color: 'var(--gold-dark)' },
              { icon: Heart, value: '156', label: 'Souvenirs invités', color: 'var(--gold)' },
              { icon: MapPin, value: '11', label: 'Catégories', color: 'var(--gold-dark)' },
            ].map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <stat.icon size={28} color={stat.color} />
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SHOWCASE ========== */}
      <section className={`section ${styles.categoriesSection}`} id="categories">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Albums & Moments</span>
            <h2 className="section-title">Nos souvenirs par catégorie</h2>
            <div className="gold-divider" />
          </div>

          <div className={styles.categoriesGrid}>
            {visibleCategories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/galerie/photos?category=${cat.slug}`}
                className={`${styles.categoryCard} ${i === 0 ? styles.categoryCardFeatured : ''}`}
              >
                <Image
                  src={cat.coverPhotoUrl || weddingData.coverPhotoUrl}
                  alt={cat.name}
                  fill
                  className={styles.categoryImg}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.categoryOverlay} />
                <div className={styles.categoryContent}>
                  <span className={styles.categoryCount}>{cat.mediaCount} médias</span>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/galerie/photos" className="btn btn-primary">
              <Camera size={16} />
              Voir toutes les photos
            </Link>
          </div>
        </div>
      </section>

      {/* ========== VIDEOS TEASER ========== */}
      <section className={`section bg-champagne-gradient ${styles.videoSection}`}>
        <div className="container-sm text-center">
          <span className="subtitle">Moments en mouvement</span>
          <h2 className="section-title">Nos vidéos du mariage</h2>
          <div className="gold-divider" />
          <p className={styles.videoDescription}>
            Revivez chaque instant magique de notre journée à travers nos vidéos haute définition.
            De la cérémonie à la soirée, chaque moment est capturé avec amour.
          </p>
          <Link href="/galerie/videos" className="btn btn-primary">
            <Video size={16} />
            Voir les vidéos
          </Link>
        </div>
      </section>

      {/* ========== INVITATION CTA ========== */}
      <section className={styles.invitationCta}>
        <div className={styles.invitationBg}>
          <Image
            src={weddingData.coverPhotoUrl}
            alt="Invitation mariage"
            fill
            className={styles.invitationBgImg}
            sizes="100vw"
          />
          <div className={styles.invitationBgOverlay} />
        </div>
        <div className="container-sm text-center" style={{ position: 'relative', zIndex: 1 }}>
          <p className={styles.invitationPre}>Vous êtes cordialement invités</p>
          <h2 className={styles.invitationTitle}>Voir notre Invitation</h2>
          <div className={styles.invitationDivider} />
          <p className={styles.invitationSub}>
            Accédez à notre carte d&apos;invitation digitale et partagez-la avec vos proches
          </p>
          <Link href="/invitation" className={`btn btn-primary ${styles.invitationBtn}`}>
            <Heart size={16} />
            Ouvrir l&apos;invitation
          </Link>
        </div>
      </section>

      {/* ========== UPLOAD CTA ========== */}
      <section className={`section ${styles.uploadCta}`}>
        <div className="container-sm text-center">
          <span className="subtitle">Vous étiez là</span>
          <h2 className="section-title">Partagez vos souvenirs</h2>
          <div className="gold-divider" />
          <p className={styles.uploadDescription}>
            Vous avez des photos ou vidéos de notre mariage ? Partagez-les avec nous !
            Chaque souvenir compte et nous serons touchés de les découvrir.
          </p>
          <div className={styles.uploadFeatures}>
            {[
              'Photos & vidéos acceptées',
              'Toutes qualités bienvenues',
              'Validation avant publication',
            ].map((feature) => (
              <div key={feature} className={styles.uploadFeature}>
                <Heart size={12} fill="var(--gold)" color="var(--gold)" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Link href="/espace-invite" className="btn btn-primary">
            <Camera size={16} />
            Envoyer mes photos
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
