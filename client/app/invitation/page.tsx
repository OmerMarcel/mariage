'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Calendar, Heart, MessageSquare, Share2, Smartphone } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { invitationData } from '@/lib/data/mockData';
import { getWhatsAppShareUrl, getEmailShareUrl } from '@/lib/utils';
import styles from './page.module.css';

export default function InvitationPage() {
  const shareText = `Invitation au mariage d'Amara & Théo — ${invitationData.date}`;

  return (
    <PublicLayout>
      <div className={styles.page}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <span className="subtitle">Nous vous invitons</span>
          <h1 className="section-title">Invitation Virtuelle</h1>
          <div className="gold-divider" />
        </div>

        <div className="container" style={{ paddingBottom: '5rem' }}>
          <div className={styles.layout}>

            {/* ===== INVITATION CARD ===== */}
            <div className={styles.cardWrap}>
              <div className={styles.card}>
                {/* Card Top Image */}
                <div className={styles.cardImage}>
                  <Image
                    src={invitationData.coverPhotoUrl || '/images/hero.jpg'}
                    alt="Photo du couple"
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                  <div className={styles.cardImgOverlay} />
                  <div className={styles.cardImageContent}>
                    <span className={styles.cardPre}>Mariage de</span>
                    <h2 className={styles.cardNames}>
                      <span>{invitationData.brideName}</span>
                      <span className={styles.cardAmpersand}>&amp;</span>
                      <span>{invitationData.groomName}</span>
                    </h2>
                  </div>
                </div>

                {/* Decorative border */}
                <div className={styles.cardBorderTop}>
                  <span>✦ ✦ ✦</span>
                </div>

                {/* Invitation Text */}
                <div className={styles.cardBody}>
                  <p className={styles.inviteText}>{invitationData.invitationText}</p>

                  {/* Details */}
                  <div className={styles.details}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <span className={styles.detailLabel}>Date</span>
                        <span className={styles.detailValue}>{invitationData.date}</span>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <Clock size={18} />
                      </div>
                      <div>
                        <span className={styles.detailLabel}>Heure</span>
                        <span className={styles.detailValue}>{invitationData.time}</span>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className={styles.detailLabel}>Lieu</span>
                        <span className={styles.detailValue}>{invitationData.venue}</span>
                        <span className={styles.detailSub}>{invitationData.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dress Code */}
                  {invitationData.dressCode && (
                    <div className={styles.dressCode}>
                      <Heart size={14} fill="var(--gold)" color="var(--gold)" />
                      <div>
                        <span className={styles.dresCodeLabel}>Dress Code</span>
                        <p className={styles.dresCodeText}>{invitationData.dressCode}</p>
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className={styles.cardDivider}>
                    <span className="ornament">❦</span>
                  </div>

                  {/* Program */}
                  {invitationData.program && (
                    <div className={styles.program}>
                      <h3 className={styles.programTitle}>Programme de la journée</h3>
                      <div className={styles.programItems}>
                        {invitationData.program.split('\n').map((line, i) => (
                          <div key={i} className={styles.programItem}>
                            <span className={styles.programDot} />
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practical Info */}
                  {invitationData.practicalInfo && (
                    <div className={styles.practicalInfo}>
                      <h3 className={styles.practicalTitle}>Informations pratiques</h3>
                      <p className={styles.practicalText}>{invitationData.practicalInfo}</p>
                    </div>
                  )}

                  {/* Signature */}
                  <div className={styles.signature}>
                    <span className={styles.signatureText}>
                      Avec tout notre amour,
                    </span>
                    <span className={styles.signatureNames}>
                      {invitationData.brideName} & {invitationData.groomName}
                    </span>
                    <Heart size={18} fill="var(--gold)" color="var(--gold)" className="animate-heartbeat" />
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className={styles.sidebar}>
              {/* Share */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <Share2 size={18} />
                  <h3>Partager l&apos;invitation</h3>
                </div>
                <p className={styles.sideCardDesc}>
                  Partagez cette invitation avec vos proches via votre réseau préféré.
                </p>
                <div className={styles.shareButtons}>
                  <a
                    href={getWhatsAppShareUrl(shareText, invitationData.uniqueLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.shareBtn} ${styles.whatsapp}`}
                    id="share-whatsapp"
                  >
                    <Smartphone size={16} />
                    WhatsApp
                  </a>
                  <a
                    href={getEmailShareUrl(shareText, `${shareText}\n\n${invitationData.uniqueLink}`)}
                    className={`${styles.shareBtn} ${styles.email}`}
                    id="share-email"
                  >
                    <MessageSquare size={16} />
                    Email
                  </a>
                </div>
                <div className={styles.linkBox}>
                  <span className={styles.linkLabel}>Lien unique</span>
                  <code className={styles.linkValue}>{invitationData.uniqueLink}</code>
                  <button
                    className={styles.copyBtn}
                    onClick={() => navigator.clipboard.writeText(invitationData.uniqueLink)}
                    id="copy-link-btn"
                  >
                    Copier
                  </button>
                </div>
              </div>

              {/* Map */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <MapPin size={18} />
                  <h3>Localisation</h3>
                </div>
                <div className={styles.mapPreview}>
                  <Image
                    src="https://picsum.photos/seed/map/400/200"
                    alt="Carte du lieu"
                    fill
                    className={styles.mapImg}
                    sizes="400px"
                  />
                  <div className={styles.mapOverlay}>
                    <MapPin size={24} color="var(--gold)" fill="rgba(201,168,76,0.3)" />
                  </div>
                </div>
                <div className={styles.mapInfo}>
                  <strong>{invitationData.venue}</strong>
                  <span>{invitationData.address}</span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(invitationData.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  id="open-maps-btn"
                >
                  <MapPin size={14} />
                  Ouvrir dans Google Maps
                </a>
              </div>

              {/* Stats */}
              <div className={styles.statsCard}>
                <div className={styles.statRow}>
                  <span>Consultations</span>
                  <strong>{invitationData.viewCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
