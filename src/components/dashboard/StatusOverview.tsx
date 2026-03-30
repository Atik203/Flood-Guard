'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatusOverview.module.css';
import { SensorReading, riskColors } from '@/data/mockSensorData';

interface Props {
  current: SensorReading;
  previous: SensorReading;
}

export function StatusOverview({ current, previous }: Props) {
  const metrics = [
    {
      id: 'water',
      label: 'Water Level',
      icon: '💧',
      value: current.water_cm,
      unit: 'cm',
      prev: previous.water_cm,
      color: '#00C8FF',
      description: 'Distance from sensor to water surface',
      thresholds: [20, 50, 80],
      thresholdLabels: ['Safe', 'Watch', 'Danger'],
    },
    {
      id: 'rain',
      label: 'Rain Intensity',
      icon: '🌧️',
      value: current.rain_intensity,
      unit: '%',
      prev: previous.rain_intensity,
      color: '#C084FC',
      description: 'YL-83 analog reading normalized 0–100%',
      thresholds: [30, 60, 85],
      thresholdLabels: ['Light', 'Moderate', 'Heavy'],
    },
    {
      id: 'flow',
      label: 'Flow Rate',
      icon: '🌀',
      value: current.flow_lpm,
      unit: 'L/min',
      prev: previous.flow_lpm,
      color: '#00E676',
      description: 'YF-S201 pulse-counted flow through drain',
      thresholds: [2, 6, 10],
      thresholdLabels: ['Low', 'Normal', 'High'],
    },
    {
      id: 'temp',
      label: 'Temperature',
      icon: '🌡️',
      value: current.temperature,
      unit: '°C',
      prev: previous.temperature,
      color: '#FFAA00',
      description: 'DHT22 ambient temperature reading',
      subValue: `${current.humidity}%`,
      subLabel: 'Humidity',
      thresholds: [],
      thresholdLabels: [],
    },
  ];

  return (
    <div className={styles.grid}>
      {metrics.map((m, i) => {
        const delta = m.value - m.prev;
        const pct = m.prev !== 0 ? (delta / m.prev) * 100 : 0;
        const rising  = delta > 0.5;
        const falling = delta < -0.5;

        return (
          <div
            key={m.id}
            className={styles.card}
            style={{
              '--accent': m.color,
              animationDelay: `${i * 60}ms`,
            } as React.CSSProperties}
          >
            <div className={styles.accentBar} style={{ background: m.color }} />

            <div className={styles.top}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{m.icon}</span>
              </div>
              <div className={`styles.trend ${rising ? styles.trendUp : falling ? styles.trendDown : styles.trendFlat}`}>
                {rising  ? <TrendingUp size={13}  /> : null}
                {falling ? <TrendingDown size={13} /> : null}
                {!rising && !falling ? <Minus size={13} /> : null}
                <span>{Math.abs(pct).toFixed(1)}%</span>
              </div>
            </div>

            <div className={styles.label}>{m.label}</div>

            <div className={styles.valueRow}>
              <span
                className={styles.value}
                style={{ color: m.color }}
              >
                {typeof m.value === 'number' && m.unit === 'L/min'
                  ? m.value.toFixed(1)
                  : m.value.toFixed(m.unit === '°C' ? 1 : 0)}
              </span>
              <span className={styles.unit}>{m.unit}</span>
            </div>

            {m.subValue && (
              <div className={styles.subRow}>
                <span className={styles.subLabel}>{m.subLabel}:</span>
                <span className={styles.subValue}>{m.subValue}</span>
              </div>
            )}

            <div className={styles.desc}>{m.description}</div>

            {/* Mini bar indicator */}
            {m.thresholds.length > 0 && (
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(100, (m.value / (m.thresholds[m.thresholds.length - 1] * 1.3)) * 100)}%`,
                    background: m.color,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
