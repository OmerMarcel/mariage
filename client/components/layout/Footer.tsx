import Link from 'next/link';
import { Heart, Mail } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Logo & tagline */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Heart size={14} fill="currentColor" />
            <span>Amara & Théo</span>
            <Heart size={14} fill="currentColor" />
          </div>
          <p className={styles.tagline}>14 Juin 2026 · Versailles, France</p>
          <p className={styles.quote}>
            &ldquo;Deux âmes, une histoire d&apos;amour éternelle.&rdquo;
          </p>
        </div>

        {/* Divider */}
        <div className={styles.goldDivider} />

        {/* Links */}
        <div className={styles.links}>
          <Link href="/">Accueil</Link>
          <Link href="/notre-histoire">Notre Histoire</Link>
          <Link href="/galerie/photos">Galerie</Link>
          <Link href="/invitation">Invitation</Link>
          <Link href="/espace-invite">Espace Invité</Link>
        </div>

        {/* Social */}
        <div className={styles.social}>
          <a href="#" aria-label="Instagram" className={styles.socialIcon}>
            <FaInstagram size={18} />
          </a>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <FaFacebook size={18} />
          </a>
          <a href="mailto:contact@amara-theo.fr" aria-label="Email" className={styles.socialIcon}>
            <Mail size={18} />
          </a>
        </div>

        <p className={styles.copyright}>
          © 2026 Amara & Théo · Fait avec{' '}
          <Heart size={12} fill="var(--gold)" color="var(--gold)" className={styles.heartInline} />{' '}
          pour l&apos;éternité
        </p>
      </div>
    </footer>
  );
}
