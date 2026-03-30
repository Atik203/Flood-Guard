'use client';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { sensorTimeline, mlStats, riskColors } from '@/data/mockSensorData';

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs font-mono border border-border/50 shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong></p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const chart = sensorTimeline.slice(-72).map(r => ({
    time:      fmt(r.timestamp),
    water:     r.water_cm,
    rain:      r.rain_intensity,
    flow:      r.flow_lpm,
    temp:      r.temperature,
    humidity:  r.humidity,
  }));

  const riskDist = [
    { name: 'LOW',      count: sensorTimeline.filter(r => r.risk_level === 'LOW').length,      fill: riskColors.LOW },
    { name: 'MEDIUM',   count: sensorTimeline.filter(r => r.risk_level === 'MEDIUM').length,   fill: riskColors.MEDIUM },
    { name: 'HIGH',     count: sensorTimeline.filter(r => r.risk_level === 'HIGH').length,     fill: riskColors.HIGH },
    { name: 'CRITICAL', count: sensorTimeline.filter(r => r.risk_level === 'CRITICAL').length, fill: riskColors.CRITICAL },
  ];

  const cm = mlStats.confusion_matrix;
  const labels = ['LOW','MED','HIGH','CRIT'];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="text-fg-purple" size={22} /> ML Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Decision Tree · scikit-learn · Predictions over time</p>
      </motion.div>

      {/* Model KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy',          value: `${mlStats.accuracy}%`,               color: '#00E676' },
          { label: 'Training Samples',  value: mlStats.training_samples.toLocaleString(), color: '#00C8FF' },
          { label: 'Predictions Today', value: mlStats.predictions_today.toLocaleString(), color: '#C084FC' },
          { label: 'Features Used',     value: mlStats.features.length.toString(),    color: '#FFAA00' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl bg-card border border-border/50 p-5">
            <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase font-bold">{s.label}</p>
            <p className="font-mono text-4xl font-extrabold mt-2" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Multi-sensor chart */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-4">
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-1 font-bold">SENSOR CORRELATION — LAST 12H</p>
            <CardTitle className="text-xl">All Sensors Overlaid</CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chart} margin={{ top: 8, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.06)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} interval={8} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Line type="monotone" dataKey="water"    stroke="#00C8FF" strokeWidth={2} dot={false} name="Water cm" />
                <Line type="monotone" dataKey="rain"     stroke="#C084FC" strokeWidth={1.5} dot={false} name="Rain %" />
                <Line type="monotone" dataKey="flow"     stroke="#00E676" strokeWidth={1.5} dot={false} name="Flow L/min" />
                <Line type="monotone" dataKey="humidity" stroke="#FFAA00" strokeWidth={1} dot={false} name="Humidity %" strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom: Risk distribution + Feature importance + Confusion matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk distribution bar */}
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 bg-card h-full">
            <CardHeader className="pb-4">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold mb-1">RISK DISTRIBUTION</p>
              <CardTitle className="text-xl">Prediction Counts (24h)</CardTitle>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskDist} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,200,255,0.04)' }} />
                  <Bar dataKey="count" radius={[6,6,0,0]} name="Readings">
                    {riskDist.map((d, i) => (
                      <rect key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature importance */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="border-border/50 bg-card h-full">
            <CardHeader className="pb-4">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold mb-1">MODEL INTERNALS</p>
              <CardTitle className="text-xl">Feature Importance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {mlStats.feature_importance.map((f, i) => (
                <div key={f.feature}>
                  <div className="flex justify-between text-base mb-2">
                    <span className="font-mono text-muted-foreground font-medium">{f.feature}</span>
                    <span className="font-mono font-bold text-foreground">{(f.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: ['#00C8FF','#C084FC','#FFAA00','#00E676'][i] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${f.importance * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-border/40 space-y-1">
                <p className="text-sm font-mono text-muted-foreground">Model: <span className="text-foreground">{mlStats.model_type}</span></p>
                <p className="text-sm font-mono text-muted-foreground">Last trained: <span className="text-foreground">{new Date(mlStats.last_trained).toLocaleDateString()}</span></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Confusion matrix */}
        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50 bg-card h-full">
            <CardHeader className="pb-4">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold mb-1">ACCURACY BREAKDOWN</p>
              <CardTitle className="text-xl">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto pb-2">
                <table className="text-sm font-mono w-full min-w-[300px]">
                  <thead>
                    <tr>
                      <th className="text-left text-muted-foreground pb-2 pr-2">Pred →</th>
                      {labels.map(l => <th key={l} className="text-center px-2 pb-2 text-muted-foreground">{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {cm.map((row, ri) => (
                      <tr key={ri}>
                        <td className="text-muted-foreground pr-2 py-1">{labels[ri]}</td>
                        {row.map((val, ci) => (
                          <td key={ci} className="text-center px-3 py-2 rounded">
                            <span className={`inline-block px-2.5 py-1 rounded text-sm font-bold ${ri === ci
                              ? 'bg-fg-green/15 text-fg-green' : val > 0 ? 'bg-fg-red/10 text-fg-red' : 'text-muted-foreground'}`}>
                              {val}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 font-mono font-medium tracking-wide">Overall accuracy: <span className="text-fg-green font-bold text-base">{mlStats.accuracy}%</span></p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
