// ─── Feature Data for Visual Prototype ────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskClass {
  level: RiskLevel;
  label: string;
  gateAngle: number;
  color: string;
  bgColor: string;
  borderColor: string;
  actions: string[];
  telegram: boolean;
  buzzer: boolean;
  description: string;
  waterRange: string;
}

export interface ProportionalPoint {
  waterPercent: number;
  gateAngle: number;
  label: string;
}

export interface BlockageState {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  duration?: string;
  isAlarm?: boolean;
}

export interface TrendReading {
  index: number;
  rain: number;   // 0-100 ADC %
  water: number;  // 0-100 water level %
  label: string;
}

// ─── Feature 1: ML Flood Prediction ──────────────────────────────────────────
export const riskClasses: RiskClass[] = [
  {
    level: 'LOW',
    label: 'LOW',
    gateAngle: 0,
    color: '#00E676',
    bgColor: 'rgba(0,230,118,0.08)',
    borderColor: 'rgba(0,230,118,0.30)',
    actions: ['Gate: CLOSED (0°)', 'OLED: "SAFE"', 'No alert sent'],
    telegram: false,
    buzzer: false,
    description: 'Water level normal. No rain or minimal rain. System in standby.',
    waterRange: '< 20cm',
  },
  {
    level: 'MEDIUM',
    label: 'MEDIUM',
    gateAngle: 40,
    color: '#FFAA00',
    bgColor: 'rgba(255,170,0,0.08)',
    borderColor: 'rgba(255,170,0,0.30)',
    actions: ['Gate: 40° open', 'OLED: "CAUTION"', 'Dashboard: amber badge'],
    telegram: false,
    buzzer: false,
    description: 'Rising water or moderate rain. Gate opens partially to begin drainage.',
    waterRange: '20–50cm',
  },
  {
    level: 'HIGH',
    label: 'HIGH',
    gateAngle: 100,
    color: '#FF7A00',
    bgColor: 'rgba(255,122,0,0.08)',
    borderColor: 'rgba(255,122,0,0.30)',
    actions: ['Gate: FULLY OPEN (100°)', 'OLED: "HIGH RISK"', 'Dashboard: orange alert'],
    telegram: false,
    buzzer: false,
    description: 'High water level. Gate fully opens. System actively draining.',
    waterRange: '50–80cm',
  },
  {
    level: 'CRITICAL',
    label: 'CRITICAL',
    gateAngle: 100,
    color: '#FF4444',
    bgColor: 'rgba(255,68,68,0.08)',
    borderColor: 'rgba(255,68,68,0.30)',
    actions: ['Gate: FULLY OPEN (100°)', '🔔 Buzzer ON', '📱 Telegram alert sent'],
    telegram: true,
    buzzer: true,
    description: 'Flood imminent. Gate fully open + buzzer alarm + Telegram push notification.',
    waterRange: '> 80cm',
  },
];

// ─── Feature 2: Proportional Control Sample Points ────────────────────────────
export const proportionalPoints: ProportionalPoint[] = [
  { waterPercent: 0,   gateAngle: 0,   label: 'Empty'    },
  { waterPercent: 20,  gateAngle: 36,  label: 'Low'      },
  { waterPercent: 40,  gateAngle: 72,  label: 'Rising'   },
  { waterPercent: 60,  gateAngle: 108, label: '60% → 108°' },
  { waterPercent: 80,  gateAngle: 144, label: 'High'     },
  { waterPercent: 100, gateAngle: 180, label: 'Full'     },
];

// ─── Feature 3: Blockage Detection State Machine ──────────────────────────────
export const blockageStates: BlockageState[] = [
  {
    id: 'monitoring',
    label: 'MONITORING',
    icon: '👁️',
    color: '#00C8FF',
    description: 'Gate is open. Checking flow sensor every 500ms.',
  },
  {
    id: 'suspect',
    label: 'FLOW ≈ 0 DETECTED',
    icon: '⚠️',
    color: '#FFAA00',
    description: 'Gate open but flow sensor reads near-zero. Starting 5s timer.',
    duration: '0–5s timer',
  },
  {
    id: 'confirmed',
    label: 'BLOCKAGE CONFIRMED',
    icon: '🚫',
    color: '#FF4444',
    description: 'Flow remained zero for 5 seconds. Blockage confirmed.',
    isAlarm: true,
  },
  {
    id: 'flush',
    label: 'MECHANICAL FLUSH',
    icon: '⚙️',
    color: '#C084FC',
    description: 'Motor pulses 3× to dislodge blockage mechanically.',
    duration: '3× pulses',
  },
  {
    id: 'alert',
    label: 'ALERT SENT',
    icon: '📱',
    color: '#FF4444',
    description: 'Buzzer ON + OLED "BLOCKAGE DETECTED" + Telegram alert.',
    isAlarm: true,
  },
];

// ─── Feature 4: Trend-Based Preventive Action ─────────────────────────────────
export const trendReadings: TrendReading[] = [
  { index: 1,  rain: 12, water: 18, label: 'T-10' },
  { index: 2,  rain: 15, water: 21, label: 'T-9'  },
  { index: 3,  rain: 18, water: 25, label: 'T-8'  },
  { index: 4,  rain: 22, water: 29, label: 'T-7'  },
  { index: 5,  rain: 28, water: 34, label: 'T-6'  },
  { index: 6,  rain: 33, water: 38, label: 'T-5'  },
  { index: 7,  rain: 40, water: 43, label: 'T-4'  },
  { index: 8,  rain: 48, water: 49, label: 'T-3'  },
  { index: 9,  rain: 55, water: 54, label: 'T-2'  },
  { index: 10, rain: 62, water: 61, label: 'NOW'  },
];

export const preventiveStates = [
  {
    id: 'monitoring',
    label: 'MONITORING',
    icon: '📊',
    color: '#00C8FF',
    desc: 'Pi tracks last 10 sensor readings continuously',
    active: true,
  },
  {
    id: 'trend_rising',
    label: 'TREND RISING',
    icon: '📈',
    color: '#FFAA00',
    desc: 'Both rain + water level rising simultaneously detected',
    active: true,
  },
  {
    id: 'pre_open',
    label: 'PRE-OPEN 50%',
    icon: '🔓',
    color: '#00E676',
    desc: 'Gate opens to 50% capacity early — before any threshold is crossed',
    active: true,
  },
  {
    id: 'watch',
    label: 'WATCHING',
    icon: '🎯',
    color: '#C084FC',
    desc: 'If trend reverses → gate closes back. No human needed.',
    active: false,
  },
];
