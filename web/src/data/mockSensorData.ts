// =====================================================
// MOCK DATA — FloodGuard Flood Monitoring System
// Simulates 24 hours of sensor readings + events
// =====================================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SensorReading {
  id: string;
  timestamp: string;
  water_cm: number;
  rain_adc: number;
  rain_intensity: number; // 0-100 %
  flow_lpm: number;
  temperature: number;
  humidity: number;
  rate_of_change: number; // cm per minute
  risk_level: RiskLevel;
  gate_open: boolean;
}

export interface Alert {
  id: string;
  timestamp: string;
  risk_level: RiskLevel;
  water_cm: number;
  rain_intensity: number;
  flow_lpm: number;
  action: string;
  telegram_sent: boolean;
  message: string;
}

export interface SystemStatus {
  esp32_connected: boolean;
  pi_connected: boolean;
  mqtt_broker: boolean;
  uptime_hours: number;
  last_data_received: string;
  gate_open: boolean;
  gate_last_changed: string;
}

export interface MLStats {
  accuracy: number;
  model_type: string;
  features: string[];
  training_samples: number;
  last_trained: string;
  predictions_today: number;
  confusion_matrix: number[][];
  feature_importance: { feature: string; importance: number }[];
}

// ─── Generate 24h sensor timeline ─────────────────────────────────────────────
function generateTimeline(): SensorReading[] {
  const now = new Date('2026-03-30T21:00:00+06:00');
  const readings: SensorReading[] = [];

  // 144 data points = every 10 min over 24h
  for (let i = 143; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 10 * 60 * 1000);
    const hoursAgo = i / 6;

    // Scenario: normal → rain starts ~8h ago → flood peaks ~4h ago → draining now
    let water_cm: number;
    let rain_intensity: number;
    let flow_lpm: number;
    let temperature: number;
    let humidity: number;

    if (hoursAgo > 20) {
      // Very early — normal low water
      water_cm = 8 + Math.random() * 5;
      rain_intensity = 2 + Math.random() * 5;
      flow_lpm = 0.2 + Math.random() * 0.3;
      temperature = 28 + Math.random() * 2;
      humidity = 65 + Math.random() * 8;
    } else if (hoursAgo > 12) {
      // Light drizzle starts
      water_cm = 12 + (20 - hoursAgo) * 0.8 + Math.random() * 3;
      rain_intensity = 15 + (20 - hoursAgo) * 2 + Math.random() * 5;
      flow_lpm = 0.5 + Math.random() * 0.5;
      temperature = 26 + Math.random() * 2;
      humidity = 75 + Math.random() * 8;
    } else if (hoursAgo > 8) {
      // Heavy rain — water rising fast
      const progress = (12 - hoursAgo) / 4;
      water_cm = 20 + progress * 45 + Math.random() * 4;
      rain_intensity = 55 + progress * 30 + Math.random() * 8;
      flow_lpm = 3 + progress * 5 + Math.random() * 0.8;
      temperature = 24 + Math.random() * 2;
      humidity = 88 + Math.random() * 6;
    } else if (hoursAgo > 5) {
      // Peak flood
      const settle = (8 - hoursAgo) / 3;
      water_cm = 75 - settle * 10 + Math.random() * 5;
      rain_intensity = 88 - settle * 15 + Math.random() * 6;
      flow_lpm = 8 - settle * 2 + Math.random() * 0.8;
      temperature = 23 + Math.random() * 1.5;
      humidity = 95 + Math.random() * 3;
    } else if (hoursAgo > 2) {
      // Drain gate opened — water receding
      const drain = (5 - hoursAgo) / 3;
      water_cm = 65 - drain * 40 + Math.random() * 4;
      rain_intensity = 60 - drain * 40 + Math.random() * 8;
      flow_lpm = 6 - drain * 3 + Math.random() * 0.6;
      temperature = 24 + Math.random() * 2;
      humidity = 90 - drain * 8 + Math.random() * 4;
    } else {
      // Recent — back to normal
      water_cm = 18 - hoursAgo * 4 + Math.random() * 3;
      rain_intensity = 10 + Math.random() * 8;
      flow_lpm = 0.5 + Math.random() * 0.4;
      temperature = 26 + Math.random() * 2;
      humidity = 72 + Math.random() * 6;
    }

    water_cm = Math.max(3, Math.min(100, water_cm));
    rain_intensity = Math.max(0, Math.min(100, rain_intensity));
    flow_lpm = Math.max(0, Math.min(15, flow_lpm));
    temperature = Math.max(20, Math.min(38, temperature));
    humidity = Math.max(50, Math.min(100, humidity));

    const prev = readings[readings.length - 1];
    const rate_of_change = prev ? (water_cm - prev.water_cm) / 10 : 0;

    // Risk classification
    let risk_level: RiskLevel;
    if (water_cm < 20 && rain_intensity < 30) risk_level = 'LOW';
    else if (water_cm < 50 && rain_intensity < 60) risk_level = 'MEDIUM';
    else if (water_cm < 80) risk_level = 'HIGH';
    else risk_level = 'CRITICAL';

    readings.push({
      id: `r-${i}`,
      timestamp: t.toISOString(),
      water_cm: Math.round(water_cm * 10) / 10,
      rain_adc: Math.round((rain_intensity / 100) * 4095),
      rain_intensity: Math.round(rain_intensity),
      flow_lpm: Math.round(flow_lpm * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      rate_of_change: Math.round(rate_of_change * 100) / 100,
      risk_level,
      gate_open: water_cm > 50,
    });
  }

  return readings;
}

export const sensorTimeline: SensorReading[] = generateTimeline();

// Current reading = most recent
export const currentReading: SensorReading = {
  ...sensorTimeline[sensorTimeline.length - 1],
  water_cm: 15.4,
  rain_intensity: 12,
  flow_lpm: 0.8,
  temperature: 26.5,
  humidity: 72.3,
  risk_level: 'LOW',
  gate_open: false,
  timestamp: new Date().toISOString(),
};

// Previous reading for trend arrows
export const previousReading: SensorReading = {
  ...sensorTimeline[sensorTimeline.length - 7],
  water_cm: 18.2,
  rain_intensity: 18,
  flow_lpm: 1.1,
  temperature: 25.8,
  humidity: 75.1,
  risk_level: 'LOW',
};

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const alerts: Alert[] = [
  {
    id: 'a-001',
    timestamp: '2026-03-30T17:15:00.000Z',
    risk_level: 'CRITICAL',
    water_cm: 87.3,
    rain_intensity: 95,
    flow_lpm: 9.2,
    action: 'Gate OPENED automatically',
    telegram_sent: true,
    message: '🚨 FLOOD CRITICAL: Water at 87.3cm. Gate opened automatically. Immediate action required.',
  },
  {
    id: 'a-002',
    timestamp: '2026-03-30T16:40:00.000Z',
    risk_level: 'HIGH',
    water_cm: 73.5,
    rain_intensity: 88,
    flow_lpm: 7.8,
    action: 'Gate OPENED automatically',
    telegram_sent: true,
    message: '⚠️ FLOOD HIGH: Water at 73.5cm. Gate opened. Rain intensity 88%.',
  },
  {
    id: 'a-003',
    timestamp: '2026-03-30T15:50:00.000Z',
    risk_level: 'HIGH',
    water_cm: 61.2,
    rain_intensity: 79,
    flow_lpm: 6.5,
    action: 'Gate OPENED automatically',
    telegram_sent: true,
    message: '⚠️ FLOOD HIGH: Water rising rapidly at 61.2cm.',
  },
  {
    id: 'a-004',
    timestamp: '2026-03-30T14:20:00.000Z',
    risk_level: 'MEDIUM',
    water_cm: 42.8,
    rain_intensity: 62,
    flow_lpm: 4.1,
    action: 'Alert sent — monitoring',
    telegram_sent: true,
    message: '⚡ FLOOD MEDIUM: Water at 42.8cm and rising. Monitor closely.',
  },
  {
    id: 'a-004-block',
    timestamp: '2026-03-30T13:45:00.000Z',
    risk_level: 'HIGH',
    water_cm: 55.0,
    rain_intensity: 45,
    flow_lpm: 0.1,
    action: 'Auto-flush sequence initiated',
    telegram_sent: true,
    message: '⚠️ BLOCKAGE DETECTED: Water high but flow is near zero. Initiating active mechanical flush.',
  },
  {
    id: 'a-004-clear',
    timestamp: '2026-03-30T13:48:00.000Z',
    risk_level: 'MEDIUM',
    water_cm: 45.0,
    rain_intensity: 45,
    flow_lpm: 12.0,
    action: 'Auto-flush successful',
    telegram_sent: true,
    message: '✅ BLOCKAGE CLEARED: Flow restored to 12.0 L/min. Gate returning to normal operation.',
  },
  {
    id: 'a-005',
    timestamp: '2026-03-30T13:10:00.000Z',
    risk_level: 'MEDIUM',
    water_cm: 28.4,
    rain_intensity: 48,
    flow_lpm: 2.3,
    action: 'Alert sent — monitoring',
    telegram_sent: false,
    message: '⚡ FLOOD MEDIUM: Rain detected, water rising slowly.',
  },
  {
    id: 'a-006',
    timestamp: '2026-03-30T19:30:00.000Z',
    risk_level: 'LOW',
    water_cm: 19.1,
    rain_intensity: 14,
    flow_lpm: 0.9,
    action: 'Gate CLOSED — water receded',
    telegram_sent: true,
    message: '✅ FLOOD RESOLVED: Water back to 19.1cm. Gate closed.',
  },
  {
    id: 'a-007',
    timestamp: '2026-03-29T09:30:00.000Z',
    risk_level: 'MEDIUM',
    water_cm: 35.6,
    rain_intensity: 52,
    flow_lpm: 3.2,
    action: 'Alert sent — monitoring',
    telegram_sent: true,
    message: '⚡ FLOOD MEDIUM: Yesterday moderate rain event.',
  },
  {
    id: 'a-008',
    timestamp: '2026-03-28T22:15:00.000Z',
    risk_level: 'LOW',
    water_cm: 10.2,
    rain_intensity: 5,
    flow_lpm: 0.3,
    action: 'System check OK',
    telegram_sent: false,
    message: '✅ System nominal. No flood risk.',
  },
];

// ─── System Status ─────────────────────────────────────────────────────────────
export const systemStatus: SystemStatus = {
  esp32_connected: true,
  pi_connected: true,
  mqtt_broker: true,
  uptime_hours: 127.4,
  last_data_received: new Date(Date.now() - 8000).toISOString(),
  gate_open: false,
  gate_last_changed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

// ─── ML Stats ──────────────────────────────────────────────────────────────────
export const mlStats: MLStats = {
  accuracy: 96.5,
  model_type: 'Decision Tree (max_depth=6)',
  features: ['water_cm', 'rain_intensity', 'flow_lpm', 'rate_of_change'],
  training_samples: 2000,
  last_trained: '2026-03-30T06:00:00.000Z',
  predictions_today: 847,
  confusion_matrix: [
    [245, 3,  0,  0],
    [5,  198, 4,  1],
    [0,   6, 167, 3],
    [0,   0,  4, 164],
  ],
  feature_importance: [
    { feature: 'water_cm',       importance: 0.48 },
    { feature: 'rain_intensity', importance: 0.27 },
    { feature: 'rate_of_change', importance: 0.16 },
    { feature: 'flow_lpm',       importance: 0.09 },
  ],
};

// ─── Risk color helpers ─────────────────────────────────────────────────────────
export const riskColors: Record<RiskLevel, string> = {
  LOW:      '#00E676',
  MEDIUM:   '#FFAA00',
  HIGH:     '#FF7A00',
  CRITICAL: '#FF4444',
};

export const riskBg: Record<RiskLevel, string> = {
  LOW:      'rgba(0, 230, 118, 0.1)',
  MEDIUM:   'rgba(255, 170, 0, 0.1)',
  HIGH:     'rgba(255, 122, 0, 0.1)',
  CRITICAL: 'rgba(255, 68, 68, 0.1)',
};

export const riskLabels: Record<RiskLevel, string> = {
  LOW:      '🟢 LOW',
  MEDIUM:   '🟡 MEDIUM',
  HIGH:     '🟠 HIGH',
  CRITICAL: '🔴 CRITICAL',
};
