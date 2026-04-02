"use client";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Home,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  TrendingUp,
  Waves,
  Wifi,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", icon: Home, label: "Home", badge: null },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    badge: null,
  },
  { href: "/analytics", icon: TrendingUp, label: "Analytics", badge: null },
  { href: "/alerts", icon: Bell, label: "Alerts", badge: "8" },
  { href: "/architecture", icon: Cpu, label: "Architecture", badge: null },
  { href: "/settings", icon: Settings, label: "Settings", badge: null },
];

export function AppSidebar() {
  const path = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const sidebarWidth = collapsed ? "w-20" : "w-72";

  // Desktop Sidebar Content
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-4 px-5 py-6 border-b border-border/40 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-fg-cyan to-fg-cyan/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,200,255,0.35)]">
            <Waves size={20} className="text-white dark:text-dark-base" />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-lg font-bold text-foreground leading-none tracking-wide">
                  FloodGuard
                </p>
                <p className="text-xs font-mono text-muted-foreground tracking-[3px] mt-1">
                  IoT MONITOR
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Status pill */}
      <AnimatePresence>
        {(!collapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-4 mb-2 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-fg-green/10 border border-fg-green/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-fg-green animate-pulse-dot shadow-[0_0_6px_#00E676] shrink-0" />
            <span className="text-xs font-mono font-bold text-fg-green tracking-wider">
              SYSTEM ONLINE
            </span>
            <Wifi size={14} className="text-fg-green ml-auto shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {(!collapsed || isMobile) && (
          <p className="text-[11px] font-mono tracking-[4px] text-muted-foreground uppercase px-4 py-2 mb-2 font-semibold">
            Navigation
          </p>
        )}
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed && !isMobile ? label : undefined}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 group",
                active
                  ? "bg-fg-cyan/15 text-fg-cyan shadow-sm border border-fg-cyan/10"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-fg-cyan rounded-r-full shadow-[0_0_8px_#00C8FF]" />
              )}
              <Icon
                size={20}
                className={cn(
                  "flex-shrink-0 transition-transform duration-200",
                  "group-hover:scale-110",
                )}
              />
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 truncate tracking-wide"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {(!collapsed || isMobile) && badge && (
                <Badge className="bg-fg-cyan text-dark-base text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm ml-auto">
                  {badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-6 pt-4 border-t border-border/40 space-y-3 shrink-0">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-4 px-4 py-3 rounded-xl border border-border/50 text-base font-medium text-foreground bg-card hover:bg-accent hover:border-fg-cyan/40 hover:text-fg-cyan transition-all duration-200"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {(!collapsed || isMobile) && (
            <span className="tracking-wide">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground bg-muted/40 hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ────────────────────────────── */}
      <aside
        style={{ background: "var(--sidebar, #080F1A)" }}
        className={cn(
          "hidden md:flex sticky top-0 h-screen flex-col shrink-0 transition-all duration-300 z-40",
          "border-r border-border/50 shadow-xl",
          sidebarWidth,
        )}
      >
        <SidebarContent />
      </aside>

      {/* ─── MOBILE HEADER ────────────────────────────── */}
      <header
        style={{ background: "var(--sidebar, #080F1A)" }}
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-4 border-b border-border/50 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-fg-cyan to-fg-cyan/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,200,255,0.3)]">
            <Waves size={18} className="text-white dark:text-dark-base" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground leading-none tracking-wide">
              FloodGuard
            </p>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest mt-1">
              IoT MONITOR
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2.5 rounded-xl bg-muted/50 border border-border text-foreground hover:bg-accent transition-colors"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ─── MOBILE FULLSCREEN MENU ───────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            {/* Sliding Menu */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ background: "var(--sidebar, #080F1A)" }}
              className="md:hidden fixed inset-y-0 left-0 w-[85vw] max-w-sm flex flex-col z-50 border-r border-border/50 shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
