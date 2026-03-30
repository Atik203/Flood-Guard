'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Droplets, CloudRain, Wind, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SensorReading } from '@/data/mockSensorData';

const METRICS = [
  { key: 'water',  icon: Droplets,     label: 'Water Level',    unit: 'cm',    color: '#00C8FF', shadow: 'shadow-[0_0_20px_rgba(0,200,255,0.18)]', border: 'border-fg-cyan/25', bar: 'bg-fg-cyan' },
  { key: 'rain',   icon: CloudRain,    label: 'Rain Intensity', unit: '%',     color: '#C084FC', shadow: 'shadow-[0_0_20px_rgba(192,132,252,0.18)]', border: 'border-fg-purple/25', bar: 'bg-fg-purple' },
  { key: 'flow',   icon: Wind,         label: 'Flow Rate',      unit: 'L/min', color: '#00E676', shadow: 'shadow-[0_0_20px_rgba(0,230,118,0.18)]', border: 'border-fg-green/25', bar: 'bg-fg-green' },
  { key: 'temp',   icon: Thermometer,  label: 'Temperature',    unit: '°C',    color: '#FFAA00', shadow: 'shadow-[0_0_20px_rgba(255,170,0,0.18)]', border: 'border-fg-amber/25', bar: 'bg-fg-amber' },
] as const;

function getValue(m: typeof METRICS[number], r: SensorReading) {
  if (m.key === 'water') return r.water_cm;
  if (m.key === 'rain')  return r.rain_intensity;
  if (m.key === 'flow')  return r.flow_lpm;
  return r.temperature;
}

export function SensorCards({ current, previous }: { current: SensorReading; previous: SensorReading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((m, i) => {
        const Icon = m.icon;
        const val  = getValue(m, current);
        const prev = getValue(m, previous);
        const delta = val - prev;
        const pct   = prev ? Math.abs(delta / prev * 100) : 0;
        const up    = delta > 0.5;
        const dn    = delta < -0.5;

        return (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: 'easeOut' }}
          >
            <Card className={cn('relative overflow-hidden border transition-all duration-300 hover:-translate-y-1', m.border, m.shadow, 'bg-card')}>
              {/* Top accent glow bar */}
              <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-xl" style={{ background: m.color, boxShadow: `0 0 12px ${m.color}` }} />
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${m.color}18` }}>
                    <Icon size={18} style={{ color: m.color }} />
                  </div>
                  {/* Trend chip */}
                  <span className={cn(
                    'flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md',
                    up ? 'bg-fg-red/10 text-fg-red' : dn ? 'bg-fg-green/10 text-fg-green' : 'bg-muted text-muted-foreground'
                  )}>
                    {up ? <TrendingUp size={11}/> : dn ? <TrendingDown size={11}/> : <Minus size={11}/>}
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase mb-1">{m.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[32px] font-bold leading-none" style={{ color: m.color }}>
                    {m.key === 'flow' ? val.toFixed(1) : val.toFixed(m.key === 'temp' ? 1 : 0)}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">{m.unit}</span>
                </div>
                {m.key === 'temp' && (
                  <p className="text-xs text-muted-foreground mt-1">Humidity: <span className="text-fg-amber font-semibold">{current.humidity}%</span></p>
                )}
                {/* Progress bar */}
                <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', m.bar)}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (val / (m.key === 'water' ? 100 : m.key === 'temp' ? 50 : 100)) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: i * 0.07 + 0.3 }}
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
