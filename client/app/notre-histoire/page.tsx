import Image from 'next/image';
import { Heart } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { coupleStory, weddingData } from '@/lib/data/mockData';
import styles from './page.module.css';

export default function NotreHistoirePage() {
  return (
    <PublicLayout>
      <div className={styles.page}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroOverlay} />
          <Image
            src={weddingData.coverPhotoUrl}
            alt="Notre histoire"
            fill
            className={styles.heroImg}
            priority
            sizes="100vw"
          />
          <div className={styles.heroContent}>
            <span className="subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>Amara & Théo</span>
            <h1 className={styles.heroTitle}>Notre Histoire</h1>
            <div className={styles.heroDivider}>
              <span />
              <Heart size={16} fill="var(--gold)" color="var(--gold)" />
              <span />
            </div>
            <p className={styles.heroSub}>
              De notre rencontre à notre union, découvrez les chapitres de notre histoire d&apos;amour.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <section className="section">
          <div className="container-sm">
            <div className={styles.timeline}>
              {coupleStory.map((event, index) => (
                <div
                  key={event.year}
                  className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
                >
                  {/* Year Node */}
                  <div className={styles.timelineNode}>
                    <span className={styles.timelineYear}>{event.year}</span>
                    <div className={styles.timelineDot}>
                      <span className={styles.timelineEmoji}>{event.emoji}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineCard}>
                      <div className={styles.timelineImgWrap}>
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className={styles.timelineImg}
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                      <div className={styles.timelineText}>
                        <h2 className={styles.timelineTitle}>{event.title}</h2>
                        <div className="gold-divider-left" />
                        <p className={styles.timelineDesc}>{event.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Timeline line */}
              <div className={styles.timelineLine} />
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className={`section bg-champagne-gradient ${styles.closing}`}>
          <div className="container-sm text-center">
            <span className={styles.closingScript}>Et maintenant...</span>
            <h2 className="section-title">Nous disons OUI !</h2>
            <div className="gold-divider" />
            <p className={styles.closingText}>
              Le 14 juin 2026, entourés de ceux que nous aimons, nous scellons notre union pour l&apos;éternité.
              Cette plateforme est notre façon de partager avec vous chaque souvenir précieux de ce jour unique.
            </p>
            <div className={styles.closingSignature}>
              <span className={styles.closingName}>Amara</span>
              <Heart size={20} fill="var(--gold)" color="var(--gold)" className="animate-heartbeat" />
              <span className={styles.closingName}>Théo</span>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
