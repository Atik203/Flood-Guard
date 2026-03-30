'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Bell, Cpu, Settings,
  ChevronLeft, ChevronRight, Waves, Moon, Sun, Wifi, Home
} from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const NAV = [
  { href: '/',              icon: Home,           label: 'Home',         badge: null },
  { href: '/dashboard',     icon: LayoutDashboard,label: 'Dashboard',    badge: null },
  { href: '/analytics',     icon: TrendingUp,     label: 'Analytics',    badge: null },
  { href: '/alerts',        icon: Bell,           label: 'Alerts',       badge: '8'  },
  { href: '/architecture',  icon: Cpu,            label: 'Architecture', badge: null },
  { href: '/settings',      icon: Settings,       label: 'Settings',     badge: null },
];

export function AppSidebar() {
  const path = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 'w-16' : 'w-60';

  return (
    <aside
      style={{ background: 'var(--sidebar, #080F1A)' }}
      className={cn(
        'sticky top-0 h-screen flex flex-col shrink-0 transition-all duration-300',
        'border-r border-border/50',
        w,
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fg-cyan to-fg-cyan/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,200,255,0.35)]">
          <Waves size={18} className="text-white dark:text-dark-base" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-bold text-foreground leading-none">FloodGuard</p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest mt-0.5">IoT MONITOR</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status pill */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-3 mt-3 mb-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fg-green/10 border border-fg-green/20"
          >
            <span className="w-2 h-2 rounded-full bg-fg-green animate-[pulseDot_2s_ease-in-out_infinite] shadow-[0_0_6px_#00E676]" />
            <span className="text-[10px] font-mono font-bold text-fg-green tracking-wider">SYSTEM ONLINE</span>
            <Wifi size={11} className="text-fg-green ml-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase px-3 py-2">
            Navigation
          </p>
        )}
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-fg-cyan/10 text-fg-cyan'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-fg-cyan rounded-r-full shadow-[0_0_8px_#00C8FF]" />
              )}
              <Icon size={17} className={cn('flex-shrink-0 transition-transform duration-200', 'group-hover:scale-110')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && badge && (
                <Badge className="bg-fg-cyan text-dark-base text-[10px] font-bold px-1.5 py-0 h-4 rounded-full">
                  {badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 pt-2 border-t border-border/40 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground border border-border/50 hover:bg-accent hover:text-foreground transition-all duration-150"
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14}/><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
