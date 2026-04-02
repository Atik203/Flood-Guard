'use client';
import { motion } from 'framer-motion';
import { Bell, Download, MessageCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { riskColors } from '@/data/mockSensorData';
import { cn } from '@/lib/utils';
import { useFloodBackend } from '@/hooks/useBackend';

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function riskBadge(level: string) {
  const map = { LOW: 'bg-fg-green/10 text-fg-green', MEDIUM: 'bg-fg-amber/10 text-fg-amber', HIGH: 'bg-fg-orange/10 text-fg-orange', CRITICAL: 'bg-fg-red/10 text-fg-red badge-critical-pulse' } as any;
  return `inline-flex items-center px-3 py-1 rounded-xl text-sm font-mono font-bold border shadow-sm ${map[level]}`;
}

export default function AlertsPage() {
  const { sensorTimeline, alertsData, isLoading } = useFloodBackend();

  if (isLoading) {
    return <div className="p-10 text-center font-mono text-muted-foreground animate-pulse">Loading live alerts...</div>;
  }

  const recentReadings = [...sensorTimeline].slice(-20);

  const exportToCSV = () => {
    if (!sensorTimeline.length) return;
    
    const headers = ['Timestamp', 'Water_cm', 'Rain_intensity', 'Flow_lpm', 'Temperature', 'Humidity', 'Risk_Level', 'Gate_Open'];
    const csvRows = [headers.join(',')];
    
    sensorTimeline.forEach(r => {
      const row = [
        r.timestamp, // Keep ISO for raw data
        r.water_cm,
        r.rain_intensity,
        r.flow_lpm,
        r.temperature,
        r.humidity,
        r.risk_level,
        r.gate_open ? 'OPEN' : 'CLOSED'
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood_sensor_log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="text-fg-red" size={22} /> Alert System & Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Flood events, Telegram notifications, and full sensor data log</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: alertsData.length.toString(),                                      color: '#FF4444' },
          { label: 'CRITICAL',     value: alertsData.filter(a => a.risk_level === 'CRITICAL').length.toString(), color: '#FF4444' },
          { label: 'Telegram Sent', value: alertsData.filter(a => a.telegram_sent).length.toString(),        color: '#C084FC' },
          { label: 'Resolved/Logs', value: alertsData.filter(a => a.risk_level === 'LOW').length.toString(),  color: '#00E676' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl bg-card border border-border/50 p-5">
            <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase font-bold">{s.label}</p>
            <p className="font-mono text-4xl font-extrabold mt-2" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Alert feed + Telegram log side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alert Feed */}
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50 bg-card h-full">
            <CardHeader className="pb-4">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold mb-1">EVENT LOG</p>
              <CardTitle className="text-xl">Alert Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {alertsData.slice(0, 50).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                >
                  <div className="w-1 rounded-full shrink-0 mt-1" style={{ background: riskColors[a.risk_level as keyof typeof riskColors] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={riskBadge(a.risk_level)}>{a.risk_level}</span>
                      <span className="text-sm font-mono text-muted-foreground">{fmtTime(a.timestamp)}</span>
                      {a.telegram_sent && <MessageCircle size={14} className="text-fg-purple" />}
                    </div>
                    <p className="text-base text-foreground font-semibold truncate">{a.action}</p>
                    <p className="text-sm font-mono text-muted-foreground mt-1">
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
            <CardHeader className="pb-4">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold mb-1">NOTIFICATIONS</p>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageCircle size={20} className="text-fg-purple" /> Telegram Bot Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {alertsData.filter(a => a.telegram_sent).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="bg-[#17212b] border border-[#2b5278]/40 rounded-2xl p-4 max-w-[85%]"
                >
                  <p className="text-sm text-[#e0e0e0] leading-relaxed whitespace-pre-line">{a.message}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 justify-end">
                    <span className="text-xs text-[#54708c]">{fmtTime(a.timestamp)}</span>
                    <CheckCircle size={12} className="text-[#5b9bd5] ml-1" />
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
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold mb-1">SENSOR READINGS</p>
                <CardTitle className="text-xl">Recent Data Log</CardTitle>
              </div>
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 text-sm text-foreground bg-muted/50 border border-border/50 px-4 py-2 rounded-xl hover:bg-muted font-bold transition-colors w-full sm:w-auto shadow-sm active:scale-95"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  {['Timestamp','Water (cm)','Rain (%)','Flow (L/min)','Temp (°C)','Humidity (%)','Risk','Gate'].map(h => (
                    <TableHead key={h} className="font-mono text-sm tracking-wider font-bold uppercase text-muted-foreground whitespace-nowrap px-4 py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReadings.map((r, i) => (
                  <TableRow key={r.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm text-muted-foreground whitespace-nowrap px-4 py-3">{fmtTime(r.timestamp)}</TableCell>
                    <TableCell className="font-mono text-base font-bold text-fg-cyan px-4 py-3">{r.water_cm}</TableCell>
                    <TableCell className="font-mono text-base font-medium text-fg-purple px-4 py-3">{r.rain_intensity}%</TableCell>
                    <TableCell className="font-mono text-base font-medium text-fg-green px-4 py-3">{r.flow_lpm}</TableCell>
                    <TableCell className="font-mono text-base font-medium text-fg-amber px-4 py-3">{r.temperature}°</TableCell>
                    <TableCell className="font-mono text-base font-medium text-muted-foreground px-4 py-3">{r.humidity}%</TableCell>
                    <TableCell className="px-4 py-3">
                      <span className={riskBadge(r.risk_level)}>{r.risk_level}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className={`text-sm font-mono font-bold ${r.gate_open ? 'text-fg-green' : 'text-fg-red'}`}>
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
