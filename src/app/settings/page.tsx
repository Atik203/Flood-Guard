'use client';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Bell, Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeProvider';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const thresholds = [
    { label: 'MEDIUM Threshold', key: 'medium', value: 20, unit: 'cm', color: '#FFAA00' },
    { label: 'HIGH Threshold',   key: 'high',   value: 50, unit: 'cm', color: '#FF7A00' },
    { label: 'CRITICAL Threshold', key: 'crit', value: 80, unit: 'cm', color: '#FF4444' },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="text-muted-foreground" size={22}/> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure thresholds, notifications, and appearance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2"><p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">APPEARANCE</p><CardTitle className="text-base flex items-center gap-2"><Sun size={16}/> Theme</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {(['dark','light'] as const).map(t => (
                  <button key={t} onClick={() => { if (theme !== t) toggleTheme(); }}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${theme === t ? 'border-fg-cyan bg-fg-cyan/8 text-fg-cyan' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
                    {t === 'dark' ? <Moon size={20}/> : <Sun size={20}/>}
                    <span className="text-sm font-semibold capitalize">{t}</span>
                    {theme === t && <span className="text-[10px] font-mono">Active</span>}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2"><p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">ALERTS</p><CardTitle className="text-base flex items-center gap-2"><Bell size={16}/> Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Telegram Alerts', sub: 'Send to bot when CRITICAL', on: true },
                { label: 'HIGH level alert', sub: 'Also send telegram for HIGH', on: true },
                { label: 'MEDIUM warning',  sub: 'Dashboard only, no Telegram',  on: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.sub}</p></div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.on ? 'bg-fg-cyan' : 'bg-muted'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${item.on ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sensor thresholds */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="lg:col-span-2">
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2"><p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">ML MODEL</p><CardTitle className="text-base flex items-center gap-2"><Sliders size={16}/> Water Level Thresholds</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {thresholds.map(t => (
                  <div key={t.key} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-mono font-bold" style={{ color: t.color }}>{t.label}</label>
                      <span className="text-xs font-mono text-muted-foreground">{t.value} {t.unit}</span>
                    </div>
                    <input type="range" min={0} max={100} defaultValue={t.value}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: t.color }} />
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground"><span>0 cm</span><span>100 cm</span></div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-mono">⚠️ Threshold changes require ML model retraining on Raspberry Pi 5</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* System info */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }} className="lg:col-span-2">
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">System Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                {[
                  { label: 'ESP32 Firmware',   value: 'v2.1.0' },
                  { label: 'Pi OS',             value: 'Bookworm 64-bit' },
                  { label: 'ML Model',          value: 'DecisionTree v3' },
                  { label: 'Dashboard',         value: 'Next.js 16.2.1' },
                  { label: 'MQTT Broker',       value: 'Mosquitto 2.0' },
                  { label: 'Python',            value: '3.11.x' },
                  { label: 'Scikit-learn',      value: '1.4.x' },
                  { label: 'DB Size',           value: '~2.4 MB' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-muted-foreground">{s.label}</p>
                    <p className="text-fg-cyan font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
