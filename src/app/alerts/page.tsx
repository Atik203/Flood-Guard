'use client';
import { motion } from 'framer-motion';
import { Bell, Download, MessageCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { alerts, sensorTimeline, riskColors } from '@/data/mockSensorData';
import { cn } from '@/lib/utils';

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function riskBadge(level: string) {
  const map = { LOW: 'bg-fg-green/10 text-fg-green', MEDIUM: 'bg-fg-amber/10 text-fg-amber', HIGH: 'bg-fg-orange/10 text-fg-orange', CRITICAL: 'bg-fg-red/10 text-fg-red badge-critical-pulse' } as any;
  return `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${map[level]}`;
}

export default function AlertsPage() {
  const recentReadings = sensorTimeline.slice(-20);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="text-fg-red" size={22} /> Alert System & Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Flood events, Telegram notifications, and full sensor data log</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: alerts.length.toString(),                                      color: '#FF4444' },
          { label: 'CRITICAL',     value: alerts.filter(a => a.risk_level === 'CRITICAL').length.toString(), color: '#FF4444' },
          { label: 'Telegram Sent', value: alerts.filter(a => a.telegram_sent).length.toString(),        color: '#C084FC' },
          { label: 'Resolved',     value: alerts.filter(a => a.risk_level === 'LOW').length.toString(),  color: '#00E676' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl bg-card border border-border/50 p-4">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">{s.label}</p>
            <p className="font-mono text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Alert feed + Telegram log side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alert Feed */}
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50 bg-card h-full">
            <CardHeader className="pb-2">
              <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase">EVENT LOG</p>
              <CardTitle className="text-base">Alert Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {alerts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                >
                  <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: riskColors[a.risk_level as keyof typeof riskColors] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={riskBadge(a.risk_level)}>{a.risk_level}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{fmtTime(a.timestamp)}</span>
                      {a.telegram_sent && <MessageCircle size={11} className="text-fg-purple" />}
                    </div>
                    <p className="text-xs text-foreground font-medium truncate">{a.action}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      💧{a.water_cm}cm · 🌧️{a.rain_intensity}% · 💨{a.flow_lpm}L/min
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Telegram preview */}
        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-border/50 bg-card h-full">
            <CardHeader className="pb-2">
              <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase">NOTIFICATIONS</p>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle size={16} className="text-fg-purple" /> Telegram Bot Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.filter(a => a.telegram_sent).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="bg-[#17212b] border border-[#2b5278]/40 rounded-2xl p-3 max-w-xs"
                >
                  <p className="text-xs text-[#e0e0e0] leading-relaxed whitespace-pre-line">{a.message}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle size={10} className="text-[#5b9bd5]" />
                    <span className="text-[9px] text-[#54708c]">{fmtTime(a.timestamp)} · Delivered</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Full data log table */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase">SENSOR READINGS</p>
                <CardTitle className="text-base">Recent Data Log</CardTitle>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors font-mono">
                <Download size={12} /> Export CSV
              </button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  {['Timestamp','Water (cm)','Rain (%)','Flow (L/min)','Temp (°C)','Humidity (%)','Risk','Gate'].map(h => (
                    <TableHead key={h} className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReadings.reverse().map((r, i) => (
                  <TableRow key={r.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{fmtTime(r.timestamp)}</TableCell>
                    <TableCell className="font-mono text-sm font-bold text-fg-cyan">{r.water_cm}</TableCell>
                    <TableCell className="font-mono text-sm text-fg-purple">{r.rain_intensity}%</TableCell>
                    <TableCell className="font-mono text-sm text-fg-green">{r.flow_lpm}</TableCell>
                    <TableCell className="font-mono text-sm text-fg-amber">{r.temperature}°</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{r.humidity}%</TableCell>
                    <TableCell>
                      <span className={riskBadge(r.risk_level)}>{r.risk_level}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-mono font-bold ${r.gate_open ? 'text-fg-green' : 'text-fg-red'}`}>
                        {r.gate_open ? '⚙️ OPEN' : '🔒 CLOSED'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
