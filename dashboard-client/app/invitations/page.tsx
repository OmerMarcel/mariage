'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Send, Copy, Eye, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { invitationData } from '@/lib/data/mockData';
import { getStatusLabel, formatDate } from '@/lib/utils';
import styles from './page.module.css';
import Link from 'next/link';

export default function AdminInvitationsPage() {
  // For MVP, we use an array with the single mock invitation
  const [invitations] = useState([invitationData]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'envoyee': return <Send size={14} className={styles.statusEnvoyee} />;
      case 'consultee': return <Eye size={14} className={styles.statusConsultee} />;
      case 'creee': return <Clock size={14} className={styles.statusCreee} />;
      default: return <CheckCircle size={14} className={styles.statusDefault} />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Invitations Virtuelles</h1>
          <p className={styles.subtitle}>Gérez et partagez vos cartes d&apos;invitation digitales</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          Nouvelle invitation
        </button>
      </div>

      <div className={styles.grid}>
        {invitations.map(invitation => (
          <div key={invitation.id} className={styles.card}>
            {/* Card Header Image */}
            <div className={styles.cardCover}>
              <Image 
                src={invitation.coverPhotoUrl || '/images/hero.jpg'}
                alt={invitation.title}
                fill
                className={styles.coverImg}
              />
              <div className={styles.coverOverlay} />
              <div className={styles.statusBadge}>
                {getStatusIcon(invitation.status)}
                {getStatusLabel(invitation.status)}
              </div>
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{invitation.title}</h3>
              
              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Date:</span>
                  <span className={styles.metaValue}>{invitation.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Lieu:</span>
                  <span className={styles.metaValue}>{invitation.venue}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Vues:</span>
                  <span className={styles.metaValue}>{invitation.viewCount} fois</span>
                </div>
              </div>

              {/* Link Box */}
              <div className={styles.linkBox}>
                <span className={styles.linkLabel}>Lien de partage</span>
                <div className={styles.linkRow}>
                  <code className={styles.linkValue}>{invitation.uniqueLink}</code>
                  <button 
                    className={styles.copyBtn} 
                    onClick={() => navigator.clipboard.writeText(invitation.uniqueLink)}
                    title="Copier le lien"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.cardActions}>
                <Link href="/invitation" className="btn btn-secondary btn-sm" style={{flex: 1, justifyContent: 'center'}}>
                  <ExternalLink size={14} /> Aperçu
                </Link>
                <button className="btn btn-primary btn-sm" style={{flex: 1, justifyContent: 'center'}}>
                  <Edit2 size={14} /> Modifier
                </button>
                <button className={`btn btn-sm ${styles.dangerBtn}`} title="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
