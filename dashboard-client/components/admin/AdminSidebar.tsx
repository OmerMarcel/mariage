'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Image, Video, Users, Mail, Tag, BookOpen,
  Settings, ChevronLeft, ChevronRight, Heart, AlertCircle, LogOut
} from 'lucide-react';
import styles from './AdminLayout.module.css';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/medias', label: 'Médias', icon: Image, badge: 3 },
  { href: '/categories', label: 'Catégories', icon: Tag },
  { href: '/albums', label: 'Albums', icon: BookOpen },
  { href: '/invites', label: 'Invités', icon: Users },
  { href: '/invitations', label: 'Invitations', icon: Mail },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === '/' || pathname === '/admin';
    return pathname === item.href || pathname.startsWith(item.href + '/') ||
           pathname === `/admin${item.href}` || pathname.startsWith(`/admin${item.href}/`);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        {/* Brand */}
        <Link href="/" className={styles.brand} style={{ textDecoration: 'none' }}>
          <Heart size={18} fill="var(--gold)" color="var(--gold)" />
          {!collapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandName}>Amara & Théo</span>
              <span className={styles.brandSub}>Administration</span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle */}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Pending Alert */}
        {!collapsed && (
          <Link href="/medias?status=en_attente" className={styles.alert} style={{ textDecoration: 'none' }}>
            <AlertCircle size={14} color="var(--status-pending)" />
            <span>3 médias en attente</span>
          </Link>
        )}

        {/* Nav */}
        <nav className={styles.nav}>
          {navItems.map(item => {
            const active = isActive(item);
            const navId = item.href === '/' ? 'admin-nav-dashboard' : `admin-nav-${item.href.replace('/', '')}`;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navActive : ''}`}
                title={collapsed ? item.label : undefined}
                id={navId}
              >
                <div className={styles.navIcon}>
                  <item.icon size={19} />
                  {item.badge && (
                    <span className={styles.navBadge}>{item.badge}</span>
                  )}
                </div>
                {!collapsed && (
                  <span className={styles.navLabel}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <a
            href={clientUrl}
            className={`${styles.navItem} ${styles.navFooterItem}`}
            title={collapsed ? 'Voir le site' : undefined}
            id="admin-to-client-link"
          >
            <div className={styles.navIcon}>
              <LogOut size={18} />
            </div>
            {!collapsed && <span className={styles.navLabel}>Voir le site</span>}
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
