'use client';

import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import styles from './PageHeader.module.css';
import { RiskLevel } from '@/data/mockSensorData';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  riskLevel?: RiskLevel;
  isConnected?: boolean;
  lastUpdated?: string;
}

const riskConfig = {
  LOW:      { class: styles.riskLow,      label: 'LOW RISK' },
  MEDIUM:   { class: styles.riskMedium,   label: 'MEDIUM RISK' },
  HIGH:     { class: styles.riskHigh,     label: 'HIGH RISK' },
  CRITICAL: { class: styles.riskCritical, label: 'CRITICAL' },
};

export function PageHeader({
  title,
  subtitle,
  riskLevel,
  isConnected = true,
  lastUpdated,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.right}>
        {/* Connection status */}
        <div className={styles.connBadge}>
          {isConnected ? (
            <>
              <Wifi size={13} />
              <span className={styles.connOnline}>MQTT Online</span>
            </>
          ) : (
            <>
              <WifiOff size={13} />
              <span className={styles.connOffline}>Disconnected</span>
            </>
          )}
        </div>

        {/* Risk badge */}
        {riskLevel && (
          <div className={`${styles.riskBadge} ${riskConfig[riskLevel].class}`}>
            <span className={styles.riskDot} />
            {riskConfig[riskLevel].label}
          </div>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <div className={styles.lastUpdated}>
            <RefreshCw size={11} />
            <span>Updated {lastUpdated}</span>
          </div>
        )}
      </div>
    </header>
  );
}
