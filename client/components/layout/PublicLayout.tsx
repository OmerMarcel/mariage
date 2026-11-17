import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './PublicLayout.module.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
