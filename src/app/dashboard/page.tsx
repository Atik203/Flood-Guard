'use client';
import { motion } from 'framer-motion';
import { Activity, RefreshCw } from 'lucide-react';
import { SensorCards }    from '@/components/dashboard/SensorCards';
import { RiskGauge }      from '@/components/dashboard/RiskGauge';
import { WaterLevelChart } from '@/components/dashboard/WaterLevelChart';
import { SystemHealth }   from '@/components/dashboard/SystemHealth';
import { currentReading, previousReading, sensorTimeline, systemStatus, mlStats } from '@/data/mockSensorData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RISK_BADGE: Record<string, string> = {
  LOW: 'bg-fg-green/10 text-fg-green border-fg-green/25',
  MEDIUM: 'bg-fg-amber/10 text-fg-amber border-fg-amber/25',
  HIGH: 'bg-fg-orange/10 text-fg-orange border-fg-orange/25',
  CRITICAL: 'bg-fg-red/10 text-fg-red border-fg-red/25 badge-critical-pulse',
};

export default function DashboardPage() {
  const risk = currentReading.risk_level;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="text-fg-cyan" size={22} />
            Live Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">ESP32 + Raspberry Pi 5 · Real-time sensor monitoring</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Connection status */}
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold bg-fg-green/10 text-fg-green border border-fg-green/25">
            <span className="w-1.5 h-1.5 rounded-full bg-fg-green animate-[pulseDot_2s_ease-in-out_infinite] shadow-[0_0_5px_#00E676]" />
            MQTT ONLINE
          </span>
          {/* Current risk */}
          <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold border', RISK_BADGE[risk])}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {risk} RISK
          </span>
          {/* Last update */}
          <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            <RefreshCw size={10} />
            Updated 8s ago
          </span>
        </div>
      </motion.div>

      {/* Sensor overview cards */}
      <SensorCards current={currentReading} previous={previousReading} />

      {/* Middle row: Gauge + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RiskGauge riskLevel={risk} waterCm={currentReading.water_cm} confidence={mlStats.accuracy} />
        </div>
        <div className="lg:col-span-2">
          <WaterLevelChart data={sensorTimeline} />
        </div>
      </div>

      {/* Bottom row: System health + Alert count */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <SystemHealth status={systemStatus} />
        </div>
        {/* Quick stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'ML Predictions Today', value: mlStats.predictions_today.toLocaleString(), color: '#C084FC', sub: 'Decision Tree classifier' },
            { label: 'Model Accuracy',        value: `${mlStats.accuracy}%`,                    color: '#00E676', sub: 'Trained on 2,000 samples' },
            { label: 'Alerts (24h)',           value: '6',                                        color: '#FF4444', sub: '2 CRITICAL, 3 HIGH, 1 MED' },
            { label: 'Gate Operations',        value: '4',                                        color: '#FFAA00', sub: 'OPEN 2× · CLOSE 2×' },
            { label: 'Uptime',                 value: '127.4h',                                   color: '#00C8FF', sub: 'Since last reboot' },
            { label: 'Data Points',            value: sensorTimeline.length.toString(),           color: '#00E676', sub: '10-min intervals stored' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="rounded-2xl bg-card border border-border/50 p-4 hover:border-border transition-all duration-200"
            >
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <p className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
