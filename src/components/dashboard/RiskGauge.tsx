'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskLevel, riskColors } from '@/data/mockSensorData';
import { cn } from '@/lib/utils';

const LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const LEVEL_IDX: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

const DESCS: Record<RiskLevel, string> = {
  LOW:      'No immediate flood threat. Water within safe limits.',
  MEDIUM:   'Elevated levels detected. Monitoring closely.',
  HIGH:     'Flood risk! Drain gate opened automatically.',
  CRITICAL: '🚨 Emergency! Telegram alert dispatched.',
};

const BADGE_CLASSES: Record<RiskLevel, string> = {
  LOW:      'bg-fg-green/10 text-fg-green border-fg-green/25',
  MEDIUM:   'bg-fg-amber/10 text-fg-amber border-fg-amber/25',
  HIGH:     'bg-fg-orange/10 text-fg-orange border-fg-orange/25',
  CRITICAL: 'bg-fg-red/10 text-fg-red border-fg-red/25 badge-critical-pulse',
};

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = { x: cx + r * Math.cos((startDeg * Math.PI) / 180), y: cy + r * Math.sin((startDeg * Math.PI) / 180) };
  const end   = { x: cx + r * Math.cos((endDeg   * Math.PI) / 180), y: cy + r * Math.sin((endDeg   * Math.PI) / 180) };
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function RiskGauge({ riskLevel, waterCm, confidence = 96.5 }: { riskLevel: RiskLevel; waterCm: number; confidence?: number }) {
  const idx    = LEVEL_IDX[riskLevel];
  const color  = riskColors[riskLevel];
  const fill   = (idx / 3) * 240; // degrees
  const cx = 100; const cy = 105; const r = 72;
  const START_DEG = 150; // start at bottom-left
  const END_DEG   = START_DEG + fill;
  const trackPath = describeArc(cx, cy, r, 150, 390);
  const fillPath  = fill > 0 ? describeArc(cx, cy, r, 150, START_DEG + fill) : null;
  // needle tip
  const needleDeg = START_DEG + fill;
  const nx = cx + r * Math.cos((needleDeg * Math.PI) / 180);
  const ny = cy + r * Math.sin((needleDeg * Math.PI) / 180);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="border-border/50 bg-card h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-1">ML PREDICTION</p>
              <CardTitle className="text-base">Flood Risk Level</CardTitle>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-fg-green">{confidence}%</p>
              <p className="text-[10px] font-mono text-muted-foreground">accuracy</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          {/* SVG Gauge */}
          <div className="flex justify-center mb-2">
            <svg viewBox="0 0 200 160" className="w-52">
              {/* Track */}
              <path d={trackPath} fill="none" stroke="var(--muted)" strokeWidth="14" strokeLinecap="round" />
              {/* Colored fill */}
              {fillPath && (
                <motion.path
                  d={fillPath}
                  fill="none"
                  stroke={color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
                />
              )}
              {/* Needle dot */}
              {fillPath && (
                <motion.circle
                  cx={nx} cy={ny} r="7"
                  fill={color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                />
              )}
              {/* Center text */}
              <text x={cx} y={cy - 8} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--muted-foreground)" letterSpacing="2">LEVEL</text>
              <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="20" fontWeight="700" fill={color}>{riskLevel}</text>
              {/* Threshold markers */}
              {LEVELS.map((lvl, i) => {
                const deg = 150 + (i / 3) * 240;
                const mx = cx + (r + 16) * Math.cos((deg * Math.PI) / 180);
                const my = cy + (r + 16) * Math.sin((deg * Math.PI) / 180);
                return (
                  <text key={lvl} x={mx} y={my + 3} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8"
                    fill={i <= idx ? riskColors[lvl] : 'var(--muted-foreground)'} opacity="0.7">
                    {lvl[0]}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-3">
            <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border', BADGE_CLASSES[riskLevel])}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              {riskLevel} RISK
            </span>
          </div>

          {/* Sub stats */}
          <div className="flex items-center justify-around text-center bg-muted/50 rounded-xl p-3 mb-3">
            <div><p className="text-[10px] font-mono text-muted-foreground">Water</p><p className="font-mono font-bold text-fg-cyan text-sm">{waterCm} cm</p></div>
            <div className="w-px h-8 bg-border" />
            <div><p className="text-[10px] font-mono text-muted-foreground">Model</p><p className="font-mono font-bold text-fg-purple text-sm">Dec. Tree</p></div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-[10px] font-mono text-muted-foreground">Gate</p>
              <p className="font-mono font-bold text-sm" style={{ color: idx >= 2 ? '#00E676' : '#FF4444' }}>
                {idx >= 2 ? '⚙️ OPEN' : '🔒 CLOSED'}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">{DESCS[riskLevel]}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
