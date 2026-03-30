'use client';

import styles from './RiskGauge.module.css';
import { RiskLevel, riskColors } from '@/data/mockSensorData';

interface Props {
  riskLevel: RiskLevel;
  waterCm: number;
  confidence?: number;
}

const RISK_VALUES: Record<RiskLevel, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
const RISK_DESCS: Record<RiskLevel, string> = {
  LOW:      'No immediate flood threat. Water levels within safe range.',
  MEDIUM:   'Elevated water levels. Monitoring closely.',
  HIGH:     'Flood risk detected! Drain gate opened automatically.',
  CRITICAL: 'CRITICAL FLOOD! Emergency mode active. Telegram alert sent.',
};

export function RiskGauge({ riskLevel, waterCm, confidence = 96.5 }: Props) {
  const val = RISK_VALUES[riskLevel];
  const angle = ((val - 1) / 3) * 240 - 120; // -120° to +120°
  const color = riskColors[riskLevel];

  // SVG arc helper
  const r = 80;
  const cx = 110;
  const cy = 110;
  const startAngle = -210;
  const sweepAngle = (val - 1) / 3 * 240;

  function polarToXY(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(start: number, end: number, r: number) {
    const s = polarToXY(start, r);
    const e = polarToXY(end, r);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackPath = describeArc(-210, 60, r);
  const fillPath  = describeArc(-210, -210 + sweepAngle, r);

  const needle = polarToXY(-210 + sweepAngle, 68);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.cardAccent} style={{ background: color }} />
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.sectionLabel}>ML PREDICTION</span>
            <h2 className={styles.title}>Flood Risk Level</h2>
          </div>
          <div className={styles.confidence}>
            <span className={styles.confVal}>{confidence}%</span>
            <span className={styles.confLabel}>accuracy</span>
          </div>
        </div>

        <div className={styles.gaugeWrap}>
          <svg viewBox="0 0 220 160" className={styles.svg}>
            {/* Track */}
            <path
              d={trackPath}
              fill="none"
              stroke="var(--bg-elevated)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Fill arc */}
            <path
              d={fillPath}
              fill="none"
              stroke={color}
              strokeWidth="14"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${color}80)`,
                transition: 'all 1s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            {/* Needle dot */}
            <circle
              cx={needle.x}
              cy={needle.y}
              r="7"
              fill={color}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
            {/* Center label */}
            <text
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              fill="var(--text-muted)"
              letterSpacing="2"
            >
              RISK
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="20"
              fontWeight="700"
              fill={color}
            >
              {riskLevel}
            </text>

            {/* Threshold markers */}
            {(['LOW','MEDIUM','HIGH','CRITICAL'] as RiskLevel[]).map((lvl, i) => {
              const markerAngle = -210 + (i / 3) * 240;
              const mp = polarToXY(markerAngle, r + 16);
              return (
                <text
                  key={lvl}
                  x={mp.x}
                  y={mp.y}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="7"
                  fill={i <= val - 1 ? riskColors[lvl] : 'var(--text-muted)'}
                  opacity={0.7}
                >
                  {lvl[0]}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Water level sub info */}
        <div className={styles.sub}>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Water Level</span>
            <span className={styles.subValue} style={{ color: '#00C8FF' }}>{waterCm} cm</span>
          </div>
          <div className={styles.subDivider} />
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Model</span>
            <span className={styles.subValue} style={{ color: '#C084FC' }}>Decision Tree</span>
          </div>
          <div className={styles.subDivider} />
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Gate</span>
            <span className={styles.subValue} style={{ color: riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? '#00E676' : '#FF4444' }}>
              {riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? '⚙️ OPEN' : '🔒 CLOSED'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.desc}>{RISK_DESCS[riskLevel]}</p>
      </div>
    </div>
  );
}
