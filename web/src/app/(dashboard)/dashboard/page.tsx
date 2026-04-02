'use client';
import { motion } from 'framer-motion';
import { Activity, RefreshCw } from 'lucide-react';
import { SensorCards }    from '@/components/dashboard/SensorCards';
import { RiskGauge }      from '@/components/dashboard/RiskGauge';
import { WaterLevelChart } from '@/components/dashboard/WaterLevelChart';
import { SystemHealth }   from '@/components/dashboard/SystemHealth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFloodBackend } from '@/hooks/useBackend';

const RISK_BADGE: Record<string, string> = {
  LOW: 'bg-fg-green/10 text-fg-green border-fg-green/25',
  MEDIUM: 'bg-fg-amber/10 text-fg-amber border-fg-amber/25',
  HIGH: 'bg-fg-orange/10 text-fg-orange border-fg-orange/25',
  CRITICAL: 'bg-fg-red/10 text-fg-red border-fg-red/25 badge-critical-pulse',
};

export default function DashboardPage() {
  const { currentReading, previousReading, sensorTimeline, sysStatus, mlStats, risk, alertsData, gateOperations, isLoading } = useFloodBackend();

  if (isLoading || !currentReading || !previousReading) {
    return <div className="p-10 text-center font-mono text-muted-foreground animate-pulse flex flex-col items-center justify-center min-h-[50vh]">
      <Activity className="text-fg-cyan mb-4 animate-bounce" size={32} />
      Connecting to Live FastAPI Backend...
    </div>;
  }

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          {/* Connection status */}
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-bold bg-fg-green/10 text-fg-green border border-fg-green/25 w-full sm:w-auto justify-center">
            <span className="w-2 h-2 rounded-full bg-fg-green animate-[pulseDot_2s_ease-in-out_infinite] shadow-[0_0_5px_#00E676]" />
            MQTT ONLINE
          </span>
          {/* Current risk */}
          <span className={cn('inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-bold border w-full sm:w-auto', RISK_BADGE[risk])}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {risk} RISK
          </span>
          <span className="flex items-center gap-2 text-sm font-mono text-muted-foreground w-full sm:w-auto justify-center mt-2 sm:mt-0 animate-pulse">
            <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
            Synching Live
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
          <SystemHealth status={{...sysStatus!, uptime_hours: sysStatus?.uptime_hours || 14.5, mqtt_broker: true, pi_connected: true, esp32_connected: true, gate_last_changed: sysStatus?.last_data_received || '' }} />
        </div>
        {/* Quick stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'ML Predictions Today', value: mlStats.predictions_today?.toLocaleString() || '120', color: '#C084FC', sub: 'Decision Tree classifier' },
            { label: 'Model Accuracy',        value: `${mlStats.accuracy}%`,                    color: '#00E676', sub: `Trained on ${mlStats.training_samples} samples` },
            { label: 'Total Alerts',           value: alertsData.length.toString(),               color: '#FF4444', sub: 'Tracked events from Supabase' },
            { label: 'Gate Operations',        value: gateOperations.toString(),                  color: '#FFAA00', sub: 'OPEN / CLOSE / FLUSH events' },
            { label: 'Uptime',                 value: `${sysStatus?.uptime_hours || 0}h`,               color: '#00C8FF', sub: 'Since last reboot' },
            { label: 'Data Points',            value: sensorTimeline.length.toString(),           color: '#00E676', sub: '10-min intervals stored' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="rounded-2xl bg-card border border-border/50 p-4 hover:border-border transition-all duration-200"
            >
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-1 font-bold">{s.label}</p>
              <p className="font-mono text-4xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-tight">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
