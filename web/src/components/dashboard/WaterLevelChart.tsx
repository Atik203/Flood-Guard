'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';
import { SensorReading } from '@/data/mockSensorData';

interface Props { data: SensorReading[]; }

const THRESHOLDS = [
  { value: 20, label: 'MEDIUM', stroke: '#FFAA00' },
  { value: 50, label: 'HIGH',   stroke: '#FF7A00' },
  { value: 80, label: 'CRITICAL', stroke: '#FF4444' },
];

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs font-mono border border-border/50 shadow-xl">
      <p className="text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex gap-2">
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-bold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
          <span className="text-muted-foreground">{p.dataKey === 'water_cm' ? 'cm' : p.dataKey === 'flow_lpm' ? 'L/min' : '%'}</span>
        </p>
      ))}
    </div>
  );
}

export function WaterLevelChart({ data }: Props) {
  const chartData = data.slice(-48).map(r => ({
    time: fmt(r.timestamp),
    water_cm: r.water_cm,
    rain_intensity: r.rain_intensity,
    flow_lpm: r.flow_lpm,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">SENSOR TIMELINE</p>
              <CardTitle className="text-base">Water Level — Last 8 Hours</CardTitle>
            </div>
            <div className="flex gap-2 text-[10px] font-mono">
              {THRESHOLDS.map(t => (
                <span key={t.label} className="flex items-center gap-1">
                  <span className="w-3 h-0.5 rounded" style={{ background: t.stroke }} />
                  <span className="text-muted-foreground">{t.label}</span>
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="gradWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00C8FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00C8FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C084FC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C084FC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,200,255,0.15)', strokeWidth: 1 }} />
              {THRESHOLDS.map(t => (
                <ReferenceLine key={t.label} y={t.value} stroke={t.stroke} strokeDasharray="4 3" strokeOpacity={0.6}
                  label={{ value: t.label, position: 'insideTopRight', fontSize: 9, fill: t.stroke, fontFamily: 'JetBrains Mono' }} />
              ))}
              <Area type="monotone" dataKey="water_cm" stroke="#00C8FF" strokeWidth={2} fill="url(#gradWater)" dot={false} name="Water (cm)" />
              <Area type="monotone" dataKey="rain_intensity" stroke="#C084FC" strokeWidth={1.5} fill="url(#gradRain)" dot={false} name="Rain (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
