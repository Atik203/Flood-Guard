'use client';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Bell, Sliders, Database, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeProvider';
import { useState, useEffect } from 'react';
import { useFloodBackend } from '@/hooks/useBackend';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { appSettings, updateSettings, dbStatus, runDbCleanup, isLoading } = useFloodBackend();

  const [toggles, setToggles] = useState({
    telegram: true,
    high: true,
    medium: false,
    auto_clean: true,
  });
  
  const [thresholdsState, setThresholdsState] = useState({
    medium: 20, high: 50, crit: 80
  });

  useEffect(() => {
    if (appSettings) {
      setToggles({
        telegram: appSettings.telegram_alerts,
        high: appSettings.high_alert,
        medium: appSettings.medium_alert,
        auto_clean: appSettings.auto_cleanup,
      });
      setThresholdsState({
        medium: appSettings.threshold_medium,
        high: appSettings.threshold_high,
        crit: appSettings.threshold_crit,
      });
    }
  }, [appSettings]);

  const handleToggle = (key: keyof typeof toggles) => {
    const newVal = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: newVal }));
    
    // sync to backend
    if (key === 'telegram') updateSettings({ telegram_alerts: newVal });
    if (key === 'high') updateSettings({ high_alert: newVal });
    if (key === 'medium') updateSettings({ medium_alert: newVal });
    if (key === 'auto_clean') updateSettings({ auto_cleanup: newVal });
  };

  const thresholds = [
    { label: 'MEDIUM Threshold', key: 'medium', value: thresholdsState.medium, unit: 'cm', color: '#FFAA00' },
    { label: 'HIGH Threshold',   key: 'high',   value: thresholdsState.high, unit: 'cm', color: '#FF7A00' },
    { label: 'CRITICAL Threshold', key: 'crit', value: thresholdsState.crit, unit: 'cm', color: '#FF4444' },
  ];

  if (isLoading) {
    return <div className="p-10 text-center font-mono text-muted-foreground animate-pulse">Loading live settings...</div>;
  }

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
                { key: 'telegram', label: 'Telegram Alerts', sub: 'Send to bot when CRITICAL', on: toggles.telegram },
                { key: 'high',     label: 'HIGH level alert', sub: 'Also send telegram for HIGH', on: toggles.high },
                { key: 'medium',   label: 'MEDIUM warning',  sub: 'Dashboard only, no Telegram',  on: toggles.medium },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.sub}</p></div>
                  <div 
                    onClick={() => handleToggle(item.key as keyof typeof toggles)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.on ? 'bg-fg-cyan' : 'bg-muted'}`}
                  >
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
                    <input type="range" min={0} max={100} value={t.value}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setThresholdsState(prev => ({ ...prev, [t.key]: val }));
                      }}
                      onPointerUp={(e) => {
                        const val = parseInt((e.target as HTMLInputElement).value);
                        const mapping: Record<string, string> = { medium: 'threshold_medium', high: 'threshold_high', crit: 'threshold_crit' };
                        updateSettings({ [mapping[t.key]]: val });
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: t.color, background: 'var(--border)' }} />
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground"><span>0 cm</span><span>100 cm</span></div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-mono">⚠️ Threshold changes require ML model retraining on Raspberry Pi 5</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Database Status */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} className="lg:col-span-2">
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-2"><p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">STORAGE</p><CardTitle className="text-base flex items-center gap-2"><Database size={16}/> Database Usage & Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6 pb-6 border-b border-border/40">
                <div className="space-y-1 w-full flex-1">
                  <p className="text-sm font-medium">Automatic Size Cleanup</p>
                  <p className="text-xs text-muted-foreground max-w-sm">When enabled, the backend drops old simulated data to ensure the free tier Supabase quota (500MB) isn't exhausted. Automatically keeps only the newest 500 rows.</p>
                </div>
                <div 
                    onClick={() => handleToggle('auto_clean')}
                    className={`w-12 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${toggles.auto_clean ? 'bg-fg-cyan' : 'bg-muted'}`}
                  >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${toggles.auto_clean ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <div><p className="text-muted-foreground">Provider</p><p className="text-foreground font-bold">{dbStatus?.provider || 'Unknown'}</p></div>
                    <div><p className="text-muted-foreground">Tier</p><p className="text-foreground font-bold">{dbStatus?.tier || 'Free'}</p></div>
                    <div><p className="text-muted-foreground">Sensor Rows</p><p className="text-fg-cyan font-bold text-lg">{dbStatus?.sensor_rows?.toLocaleString() || 0} / 500</p></div>
                    <div><p className="text-muted-foreground">Alert Rows</p><p className="text-fg-orange font-bold text-lg">{dbStatus?.alert_rows?.toLocaleString() || 0} / 100</p></div>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-mono text-xs mb-1">Active SQL Tables</p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      {dbStatus?.tables?.map((table: string) => <span key={table} className="px-2 py-1 bg-muted border border-border/50 rounded-md text-foreground">{table}</span>)}
                    </div>
                  </div>
                </div>

                <div className="h-full flex flex-col justify-end mt-4 sm:mt-0">
                  <button 
                    onClick={() => {
                        const btn = document.getElementById('wipe-btn');
                        if (btn) btn.innerHTML = 'Cleaning Supabase...';
                        runDbCleanup().then(() => {
                           if (btn) btn.innerHTML = 'Database Optimised ✓';
                           setTimeout(() => { if (btn) btn.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4"></svg> Manually Optimize Store to 500 Rows</span>'; }, 2000);
                        });
                    }}
                    id="wipe-btn"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={16} /> Manually Optimize Store to 500 Rows
                  </button>
                  <p className="text-center text-[10px] font-mono text-muted-foreground mt-2">DANGER: Drops all excess historical data entries</p>
                </div>
              </div>
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
