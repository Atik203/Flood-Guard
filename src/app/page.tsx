'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  Waves, Cpu, Brain, Bell, Shield, Activity,
  ArrowRight, ChevronDown, Wifi, Database, Zap,
  BarChart3, MessageCircle, Droplets, CloudRain, Wind, Thermometer,
  CheckCircle, Globe, BookOpen, Sun, Moon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeProvider';

/* ─── Animated background ─────────────────────────────── */
function HeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial cyan glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.12) 0%, transparent 70%)' }} />
      {/* Floating grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00C8FF" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full bg-fg-cyan/40"
          style={{ left: `${8 + i * 8}%`, top: `${20 + (i % 4) * 20}%` }}
          animate={{ y: [0, -24, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
      {/* Wave SVG at bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <motion.path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="rgba(0,200,255,0.06)"
          animate={{ d: [
            'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
            'M0,40 C240,80 480,40 720,40 C960,40 1200,80 1440,40 L1440,120 L0,120 Z',
            'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
          ]}}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

/* ─── Section label ───────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-fg-cyan/50" />
      <span className="text-base font-mono tracking-[6px] text-fg-cyan/90 uppercase font-bold">{children}</span>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-fg-cyan/50" />
    </div>
  );
}

/* ─── Feature card ────────────────────────────────────── */
const FEATURES = [
  {
    icon: Activity,
    color: '#00C8FF',
    title: 'Real-Time Monitoring',
    desc: 'All 4 sensors (water level, rain, flow rate, temperature) stream live data every second via MQTT protocol from ESP32 to Raspberry Pi 5.',
    tags: ['HC-SR04', 'YL-83', 'YF-S201', 'DHT22'],
  },
  {
    icon: Brain,
    color: '#C084FC',
    title: 'ML Flood Prediction',
    desc: 'A Decision Tree classifier (scikit-learn) trained on 2,000+ samples predicts flood risk into 4 levels — LOW, MEDIUM, HIGH, CRITICAL — in under 2ms.',
    tags: ['Decision Tree', '96.5% Accuracy', '4 Classes'],
  },
  {
    icon: Shield,
    color: '#00E676',
    title: 'Auto Gate Control',
    desc: 'When flood risk reaches HIGH or CRITICAL, the Pi publishes an OPEN command via MQTT. The ESP32 drives the L298N motor driver to open the drain gate.',
    tags: ['Servo Motor', 'L298N Driver', 'Auto + Manual'],
  },
  {
    icon: Bell,
    color: '#FF4444',
    title: 'Telegram Alerts',
    desc: 'Instant push notifications sent to your phone via Telegram Bot API when critical conditions are detected. Includes water level, risk label, and gate status.',
    tags: ['Telegram Bot', 'Push Notify', 'HTTPS API'],
  },
  {
    icon: BarChart3,
    color: '#FFAA00',
    title: 'Web Dashboard',
    desc: 'A Next.js 16 dashboard accessible from any device on the local network. Features live charts, 24-hour history, ML stats, and full alert log.',
    tags: ['Next.js 16', 'Recharts', 'Responsive'],
  },
  {
    icon: Database,
    color: '#C084FC',
    title: 'Data Logging & CSV Export',
    desc: 'Every sensor reading and ML prediction is persisted to SQLite on the Pi. Export full CSV for research, reporting, or model retraining.',
    tags: ['SQLite', 'CSV Export', '10-min intervals'],
  },
];

/* ─── Tech stack pills ────────────────────────────────── */
const STACK = [
  { label: 'ESP32 WROOM-32', icon: '🔲', color: '#00C8FF' },
  { label: 'Raspberry Pi 5', icon: '🍓', color: '#FFAA00' },
  { label: 'Arduino C++',    icon: '⚡', color: '#00C8FF' },
  { label: 'Python 3.11',    icon: '🐍', color: '#00E676' },
  { label: 'scikit-learn',   icon: '🤖', color: '#C084FC' },
  { label: 'Mosquitto MQTT', icon: '📡', color: '#FFAA00' },
  { label: 'Next.js 16',     icon: '▲',  color: '#00C8FF' },
  { label: 'SQLite',         icon: '🗄️', color: '#00E676' },
  { label: 'Telegram API',   icon: '✈️', color: '#00C8FF' },
  { label: 'Tailwind CSS',   icon: '🎨', color: '#C084FC' },
];

/* ─── System flow steps ───────────────────────────────── */
const FLOW = [
  { step: '01', icon: Droplets,     color: '#00C8FF', title: 'Sensors Sample',   desc: 'HC-SR04 fires ultrasonic pulse, YL-83 reads rain analog, YF-S201 counts flow pulses, DHT22 reads temp — all wired to ESP32 GPIO pins.' },
  { step: '02', icon: Wifi,         color: '#FFAA00', title: 'MQTT Publish',      desc: 'ESP32 formats JSON payload and publishes to topic flood/sensors on Mosquitto broker running on Raspberry Pi 5 every second.' },
  { step: '03', icon: Brain,        color: '#C084FC', title: 'ML Prediction',     desc: 'Pi\'s Python subscriber receives data, feeds 4 features into Decision Tree model, gets risk class (0-3) in microseconds.' },
  { step: '04', icon: Shield,       color: '#00E676', title: 'Auto Response',     desc: 'If risk ≥ HIGH, Pi publishes OPEN to flood/command. ESP32 receives command, drives servo via L298N to open drain gate.' },
  { step: '05', icon: MessageCircle,color: '#FF4444', title: 'Alert & Log',       desc: 'CRITICAL triggers Telegram Bot alert to operator\'s phone. All readings + predictions are saved to SQLite with timestamp.' },
  { step: '06', icon: BarChart3,    color: '#C084FC', title: 'Dashboard Update',  desc: 'Next.js dashboard polls Flask API every 5s. Charts update live — you see water level trend, risk gauge, and full alert history.' },
];

/* ─── Hardware specs ──────────────────────────────────── */
const HARDWARE = [
  { name: 'HC-SR04 Ultrasonic',  role: 'Water Level Sensor',  detail: 'Measures distance from sensor to water surface (cm). Range: 2–400cm. Accuracy ±3mm.',       icon: '📡', color: '#00C8FF' },
  { name: 'YL-83 Rain Module',   role: 'Rain Intensity',       detail: 'Analog + digital output. Detects rain and measures intensity (0–100%). Mounted on top lid.', icon: '🌧️', color: '#00C8FF' },
  { name: 'YF-S201 Flow Meter',  role: 'Flow Rate Sensor',     detail: 'Hall-effect pulse counter. Measures water flow through drain pipe in L/min.',                icon: '💧', color: '#00C8FF' },
  { name: 'DHT22',               role: 'Temp + Humidity',      detail: 'High-precision digital sensor. ±0.5°C temperature, ±2% humidity — used as model feature.',  icon: '🌡️', color: '#FFAA00' },
  { name: 'ESP32 WROOM-32',      role: 'Edge Controller',      detail: 'Dual-core 240MHz MCU. Handles all sensor reads, OLED display, buzzer, servo, and Wi-Fi.',    icon: '🔲', color: '#00E676' },
  { name: 'Raspberry Pi 5 (8GB)',role: 'Central Brain',        detail: 'BCM2712 @ 2.4GHz. Runs ML inference, MQTT broker, Flask API, Next.js dashboard 24/7.',       icon: '🍓', color: '#FFAA00' },
  { name: 'SG90 Servo + L298N',  role: 'Automated Gate',       detail: 'Servo drives drain gate flap. L298N handles power amplification for reliable operation.',     icon: '⚙️', color: '#FF7A00' },
  { name: 'OLED SSD1306 0.96"',  role: 'Local LCD Display',   detail: 'I2C display on ESP32 shows live water level, rain status, and current risk class locally.',   icon: '🖥️', color: '#C084FC' },
];

/* ─── Stats ───────────────────────────────────────────── */
const STATS = [
  { value: '96.5%',  label: 'ML Accuracy',      color: '#00E676' },
  { value: '<2ms',   label: 'Prediction Speed',  color: '#00C8FF' },
  { value: '4',      label: 'Sensor Modules',    color: '#C084FC' },
  { value: '1s',     label: 'Data Interval',     color: '#FFAA00' },
];

/* ─── Main Home Page ──────────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative">
      
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-border/50 bg-background/80 backdrop-blur-md shadow-lg text-foreground hover:bg-accent hover:scale-110 transition-all duration-300"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} className="text-fg-amber" /> : <Moon size={20} className="text-fg-purple" />}
        </button>
      </div>

      {/* ─ HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-20 text-center overflow-hidden">
        <HeroBg />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-fg-cyan/40 bg-fg-cyan/10 text-fg-cyan text-base font-mono font-bold tracking-widest uppercase mb-10 shadow-[0_0_15px_rgba(0,200,255,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-fg-cyan animate-pulse-dot shadow-[0_0_8px_#00C8FF]" />
            Microprocessor Lab Project
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="text-foreground">Real-Time</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #00C8FF 0%, #C084FC 50%, #00E676 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Flood Guard System
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            An IoT-based flood detection and prevention system using{' '}
            <span className="text-fg-cyan font-semibold">ESP32</span>,{' '}
            <span className="text-fg-amber font-semibold">Raspberry Pi 5</span>,{' '}
            <span className="text-fg-purple font-semibold">Machine Learning</span>, and automated gate control —
            built for the <strong className="text-foreground">Microprocessor Lab</strong> course.
          </motion.p>

          {/* CTA buttons */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-fg-cyan text-dark-base font-bold text-lg hover:bg-fg-cyan/90 hover:scale-105 transition-all duration-200 shadow-[0_0_32px_rgba(0,200,255,0.4)]">
              <Activity size={20} /> Open Live Dashboard <ArrowRight size={18} />
            </Link>
            <Link href="/architecture"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-border/80 text-foreground font-bold text-lg hover:bg-accent hover:border-fg-cyan/50 transition-all duration-200">
              <Cpu size={20} /> View Architecture
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-16">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.7 + i*0.08 }}
                className="text-center">
                <p className="font-mono text-5xl font-extrabold mb-2" style={{ color: s.color }}>{s.value}</p>
                <p className="text-base text-muted-foreground mt-1 font-mono font-medium tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown size={24} className="text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* ─ TECH STACK ───────────────────────────────────── */}
      <section className="py-20 border-y border-border/30 overflow-hidden bg-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionLabel>Technology Stack</SectionLabel>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {STACK.map((t, i) => (
              <motion.div key={t.label}
                initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.05 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-border/50 bg-background hover:border-fg-cyan/40 hover:scale-[1.03] transition-all duration-200 cursor-default shadow-sm"
              >
                <span className="text-2xl leading-none">{t.icon}</span>
                <span className="text-base font-bold text-foreground tracking-wide">{t.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─ FEATURES ─────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <SectionLabel>Core Features</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            4 Major Features + More
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Everything working together as a complete embedded system — from sensor to dashboard.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-border/50 bg-card hover:border-border transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: f.color, opacity: 0, transition: 'opacity 0.3s' }} />
                  <CardContent className="pt-6 pb-5 px-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                      <Icon size={22} style={{ color: f.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed mb-6">{f.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {f.tags.map(tag => (
                        <span key={tag} className="text-sm font-mono font-bold px-3 py-1.5 rounded-lg border-2 shadow-sm"
                          style={{ color: f.color, background: `${f.color}10`, borderColor: `${f.color}25` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─ SYSTEM FLOW ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-muted/20 border-y border-border/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">End-to-End Data Flow</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">From physical water detection to phone notification — every millisecond counts.</p>
          </motion.div>

          <div className="space-y-0">
            {FLOW.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === FLOW.length - 1;
              return (
                <motion.div key={step.step}
                  initial={{ opacity:0, x: i%2===0 ? -24 : 24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08 }}
                  className="flex gap-4 sm:gap-6"
                >
                  {/* Left: number + line */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-mono font-extrabold text-xl border-4 shrink-0 shadow-md"
                      style={{ borderColor: step.color, color: step.color, background: `${step.color}12` }}>
                      {step.step}
                    </div>
                    {!isLast && <div className="w-1 flex-1 my-3" style={{ background: `linear-gradient(to bottom, ${step.color}40, transparent)` }} />}
                  </div>

                  {/* Right: content */}
                  <div className={cn('pb-12 flex-1', isLast ? 'pb-0' : '')}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${step.color}15` }}>
                        <Icon size={22} style={{ color: step.color }} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed pl-14">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─ HARDWARE COMPONENTS ──────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <SectionLabel>Hardware</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Physical Components</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">8 carefully chosen hardware modules working as a unified sensing, computing, and actuation platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HARDWARE.map((h, i) => (
            <motion.div key={h.name}
              initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ delay: i*0.06 }}
              className="rounded-2xl border border-border/50 bg-card p-5 hover:border-border hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl opacity-60" style={{ background: h.color }} />
              <div className="text-4xl mb-4">{h.icon}</div>
              <p className="text-sm font-mono font-bold tracking-[3px] uppercase mb-2" style={{ color: h.color }}>{h.role}</p>
              <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">{h.name}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{h.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─ ARCHITECTURE PREVIEW ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-muted/20 border-y border-border/20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
            <SectionLabel>System Architecture</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">4-Layer Design</h2>
          </motion.div>

          <div className="flex flex-col items-center gap-0 max-w-lg mx-auto">
            {[
              { layer: '① Sensor Layer',    bg: 'border-fg-cyan/40',   text: 'text-fg-cyan',   items: ['HC-SR04 • Ultrasonic', 'YL-83 • Rain', 'YF-S201 • Flow', 'DHT22 • Temp/Humidity'], arrow: 'GPIO/ADC Direct Wire' },
              { layer: '② ESP32 Edge',      bg: 'border-fg-amber/40',  text: 'text-fg-amber',  items: ['240MHz Dual-Core · 520KB SRAM', 'Wi-Fi MQTT Publisher', 'OLED Display · Buzzer'], arrow: 'Wi-Fi · MQTT Protocol' },
              { layer: '③ Raspberry Pi 5',  bg: 'border-fg-purple/40', text: 'text-fg-purple', items: ['BCM2712 @ 2.4GHz · 8GB RAM', 'ML Decision Tree Model', 'Flask API · SQLite · Telegram'], arrow: 'HTTP · Telegram · CSV' },
              { layer: '④ Output Layer',    bg: 'border-fg-green/40',  text: 'text-fg-green',  items: ['Web Dashboard (Next.js)', 'Telegram Phone Alerts', 'SQLite Data Archive'], arrow: null },
            ].map((layer, i) => (
              <div key={layer.layer} className="w-full">
                <motion.div initial={{ opacity:0, x: i%2===0?-20:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  className={`rounded-3xl border-2 ${layer.bg} bg-card p-6 shadow-sm`}>
                  <p className={`text-base font-mono font-bold tracking-[4px] uppercase mb-5 ${layer.text}`}>{layer.layer}</p>
                  <div className="flex flex-wrap gap-3">
                    {layer.items.map(item => (
                      <span key={item} className={`text-base px-4 py-2 rounded-xl font-semibold border-2 bg-background text-foreground border-border/60`}>{item}</span>
                    ))}
                  </div>
                </motion.div>
                {layer.arrow && (
                  <div className="flex flex-col items-center py-3 gap-2">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-border to-transparent" />
                    <span className="text-sm font-mono px-5 py-1.5 rounded-full border-2 border-border/50 text-muted-foreground bg-background font-bold animate-blink tracking-widest">{layer.arrow}</span>
                    <div className="w-0.5 h-6 bg-gradient-to-t from-border to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/architecture"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-fg-cyan/30 text-fg-cyan font-semibold text-sm hover:bg-fg-cyan/8 transition-all duration-200">
              <Cpu size={16} /> View Full Architecture Details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─ PROJECT INFO ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <SectionLabel>About The Project</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
              Built for the<br />Microprocessor Course Lab
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This system integrates <strong className="text-foreground">4 sensor inputs</strong>, a <strong className="text-foreground">dual-microcontroller architecture</strong>, and a{' '}
              <strong className="text-foreground">machine learning prediction model</strong> into a single, cohesive embedded system.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Unlike simple threshold-based alarms, our system <strong className="text-foreground">predicts</strong> floods before they peak — giving critical lead time for automated and manual intervention.
            </p>
            <div className="space-y-2">
              {['Sensor-to-Cloud pipeline in under 1 second', 'ML prediction with 96.5% accuracy on 2000 samples', 'Auto gate control with manual override via dashboard', 'Full data log — exportable to CSV for research'].map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-fg-green mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="space-y-4">
            {[
              { label: 'Course', value: 'Microprocessor Systems Lab', icon: BookOpen, color: '#00C8FF' },
              { label: 'Architecture',  value: 'ESP32 ↔ MQTT ↔ Raspberry Pi 5', icon: Cpu, color: '#FFAA00' },
              { label: 'ML Framework', value: 'scikit-learn · Decision Tree', icon: Brain, color: '#C084FC' },
              { label: 'Dashboard', value: 'Next.js 16 · Tailwind CSS · Recharts', icon: Globe, color: '#00E676' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.1 }}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${item.color}15` }}>
                    <Icon size={24} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-[3px] font-bold mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─ CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 text-center relative overflow-hidden border-t border-border/20">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,200,255,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="max-w-2xl mx-auto relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fg-cyan to-fg-cyan/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_32px_rgba(0,200,255,0.35)]">
            <Waves size={30} className="text-dark-base" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ready to Explore?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Open the live dashboard to see real-time sensor data, ML predictions, and system health.
            Or explore the architecture to understand the full hardware design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-fg-cyan text-dark-base font-bold text-lg hover:bg-fg-cyan/90 hover:scale-[1.03] transition-all duration-200 shadow-[0_0_32px_rgba(0,200,255,0.4)]">
              <Activity size={20} /> Open Dashboard
            </Link>
            <Link href="/architecture"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-border/80 text-foreground font-bold text-lg hover:bg-accent hover:border-fg-cyan/50 transition-all duration-200">
              <Cpu size={20} /> Architecture Overview
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─ FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-border/20 py-10 px-4 sm:px-8 bg-card/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-base text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fg-cyan to-fg-cyan/40 flex items-center justify-center shadow-sm">
              <Waves size={16} className="text-dark-base" />
            </div>
            <span className="font-bold text-foreground tracking-wide">FloodGuard</span>
            <span>·</span>
            <span className="font-medium">Microprocessor Lab Project</span>
          </div>
          <div className="flex items-center gap-5 text-sm font-mono bg-muted/30 px-5 py-2 rounded-xl border border-border/40">
            <span className="tracking-wide">ESP32 + RPi5 + ML</span>
            <span className="text-border">·</span>
            <span className="text-fg-green font-bold tracking-widest">● SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
