'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Wifi, Database, Clock, Zap } from 'lucide-react';
import { SystemStatus } from '@/data/mockSensorData';
import { cn } from '@/lib/utils';

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}
function fmtUptime(h: number) {
  const days = Math.floor(h / 24);
  const hrs  = Math.floor(h % 24);
  return `${days}d ${hrs}h`;
}

const items = (s: SystemStatus) => [
  { icon: Zap,      label: 'ESP32 WROOM-32',   ok: s.esp32_connected, sub: 'Sensor edge controller' },
  { icon: Cpu,      label: 'Raspberry Pi 5',    ok: s.pi_connected,    sub: 'ML brain + MQTT broker' },
  { icon: Wifi,     label: 'MQTT Broker',       ok: s.mqtt_broker,     sub: 'Mosquitto · Port 1883' },
  { icon: Database, label: 'SQLite Database',   ok: true,              sub: '/home/pi/flood.db' },
];

export function SystemHealth({ status }: { status: SystemStatus }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
      <Card className="border-border/50 bg-card h-full">
        <CardHeader className="pb-3">
          <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">SYSTEM STATUS</p>
          <CardTitle className="text-base">Hardware Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items(status).map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  item.ok ? 'bg-fg-green/10' : 'bg-fg-red/10')}>
                  <Icon size={15} className={item.ok ? 'text-fg-green' : 'text-fg-red'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
                  <p className="text-[10px] font-mono text-muted-foreground truncate">{item.sub}</p>
                </div>
                <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold',
                  item.ok ? 'bg-fg-green/10 text-fg-green' : 'bg-fg-red/10 text-fg-red')}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', item.ok
                    ? 'bg-fg-green animate-[pulseDot_2s_ease-in-out_infinite] shadow-[0_0_5px_#00E676]'
                    : 'bg-fg-red')} />
                  {item.ok ? 'ON' : 'OFF'}
                </div>
              </motion.div>
            );
          })}

          {/* Uptime row */}
          <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={13} />
              <span className="text-xs">System uptime</span>
            </div>
            <span className="font-mono text-xs font-bold text-fg-cyan">{fmtUptime(status.uptime_hours)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last data received</span>
            <span className="font-mono text-xs text-fg-amber">{timeAgo(status.last_data_received)}</span>
          </div>

          {/* Gate status */}
          <div className={cn('flex items-center justify-between rounded-xl p-3 mt-1',
            status.gate_open ? 'bg-fg-green/8 border border-fg-green/20' : 'bg-fg-red/8 border border-fg-red/20')}>
            <span className="text-xs font-semibold">Drain Gate</span>
            <span className={cn('font-mono text-xs font-bold', status.gate_open ? 'text-fg-green' : 'text-fg-red')}>
              {status.gate_open ? '⚙️ OPEN' : '🔒 CLOSED'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
