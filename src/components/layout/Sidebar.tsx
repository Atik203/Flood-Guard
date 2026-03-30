'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Bell,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Waves,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/',              icon: LayoutDashboard, label: 'Dashboard',    badge: null },
  { href: '/analytics',    icon: TrendingUp,      label: 'Analytics',    badge: null },
  { href: '/alerts',       icon: Bell,            label: 'Alerts',       badge: '8' },
  { href: '/architecture', icon: Cpu,             label: 'Architecture', badge: null },
  { href: '/settings',     icon: Settings,        label: 'Settings',     badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={styles.mobileOverlay}
        onClick={() => setCollapsed(false)}
      />

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Waves size={20} />
          </div>
          {!collapsed && (
            <div className={styles.logoText}>
              <span className={styles.logoName}>FloodGuard</span>
              <span className={styles.logoSub}>IoT Monitor</span>
            </div>
          )}
        </div>

        {/* System status pill */}
        {!collapsed && (
          <div className={styles.statusPill}>
            <span className={`${styles.statusDot} ${styles.online}`} />
            <span className={styles.statusText}>System Online</span>
          </div>
        )}

        {/* Nav */}
        <nav className={styles.nav}>
          {!collapsed && (
            <span className={styles.navSection}>Navigation</span>
          )}
          {navItems.map(({ href, icon: Icon, label, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className={styles.navIcon} />
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
                {!collapsed && badge && (
                  <span className={styles.navBadge}>{badge}</span>
                )}
                {active && <span className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className={styles.bottom}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={styles.themeBtn}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && (
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={styles.collapseBtn}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}
