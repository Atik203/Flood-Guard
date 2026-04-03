// Architecture-specific structured data matching the HTML spec

export interface ComponentSpec {
  id: string;
  name: string;
  model: string;
  icon: string;
  color: string;
  pins: string[];
  description: string;
}

export interface BOMItem {
  id: number;
  category: string;
  name: string;
  model: string;
  qty: number;
  voltage: string;
  current: string;
  specs: string;
  purpose: string;
  icon: string;
  color: string;
}

export interface PowerEntry {
  component: string;
  voltage: string;
  currentTypical: string;
  currentPeak: string;
  notes: string;
  color: string;
}

export interface PinMapping {
  gpio: string;
  component: string;
  type: string;
  typeClass: string;
  voltage: string;
  notes: string;
}

export interface SoftwarePort {
  service: string;
  port: string;
  protocol: string;
  purpose: string;
}

export interface BuildStep {
  number: string;
  phase: string;
  phaseColor: string;
  title: string;
  description: string;
  tasks: string[];
  code?: { language: string; content: string };
}

// ─── Sensors ──────────────────────────────────────────────────────────────────
export const sensors: ComponentSpec[] = [
  {
    id: 'hc-sr04',
    name: 'HC-SR04',
    model: 'Ultrasonic Water Level',
    icon: '📡',
    color: '#00C8FF',
    pins: ['GPIO 5 (TRIG)', 'GPIO 18 (ECHO)'],
    description: 'Measures water depth in cm using ultrasonic pulses. Mounted facing down above water channel.',
  },
  {
    id: 'yl-83',
    name: 'YL-83',
    model: 'Rain Sensor',
    icon: '🌧️',
    color: '#00C8FF',
    pins: ['GPIO 34 (ADC)', 'GPIO 35 (Digital)'],
    description: 'Detects rain intensity. Mounted on top lid angled toward sky.',
  },
  {
    id: 'yfs-401',
    name: 'YFS-401',
    model: 'Mini Flow Sensor (Sea)',
    icon: '💧',
    color: '#00C8FF',
    pins: ['GPIO 19 (IRQ)'],
    description: 'Compact hall-effect flow sensor. 0.3–6 L/min range, 3.5mm nozzle. Perfect for small tabletop drain channel in classroom prototype.',
  },
  {
    id: 'dht22',
    name: 'DHT22',
    model: 'Humidity + Temperature',
    icon: '🌡️',
    color: '#00C8FF',
    pins: ['GPIO 23'],
    description: 'Environmental sensor for temperature (°C) and humidity (%).',
  },
];

// ─── Output devices ────────────────────────────────────────────────────────────
export const outputs = [
  { icon: '📊', name: 'Web Dashboard', sub: 'Next.js · Port 3000\nCharts + Live feed', color: '#C084FC' },
  { icon: '📱', name: 'Telegram Alert', sub: 'Bot API\nInstant push notify', color: '#FF4444' },
  { icon: '🗄️', name: 'Data Log',       sub: 'SQLite DB\nCSV export',        color: '#FFAA00' },
  { icon: '🤖', name: 'ML Output',      sub: '4-class prediction\nRetrain from log', color: '#00E676' },
];

// ─── ESP32 capabilities ────────────────────────────────────────────────────────
export const esp32Chips = [
  'Wi-Fi MQTT', 'I2C OLED', 'Proportional PWM', 'ADC Rain',
  'GPIO Buzzer', 'Blockage Timer', 'UART Backup', '500ms Poll Loop',
];

export const esp32LocalOutputs = [
  { icon: '⚙️', label: 'Proportional Gate', sub: 'PWM · angle ∝ water%', color: '#00E676' },
  { icon: '🖥️', label: 'OLED Display', sub: 'I2C · 0x3C', color: '#00C8FF' },
  { icon: '🔔', label: 'Buzzer', sub: 'GPIO Active (CRITICAL)', color: '#FF4444' },
];

// ─── Raspberry Pi capabilities ─────────────────────────────────────────────────
export const piChips = [
  'Python 3.11', 'scikit-learn ML', 'Mosquitto MQTT', 'Next.js Dashboard',
  'SQLite Logging', 'Telegram Alerts', 'Trend Analyser', 'Preventive Logic',
  'Wi-Fi + Ethernet', 'PCIe 2.0 Slot',
];

// ─── GPIO Pin Map ──────────────────────────────────────────────────────────────
export const pinMappings: PinMapping[] = [
  { gpio: 'GPIO 5',      component: 'HC-SR04 TRIG',        type: 'OUT',        typeClass: 'gpio',  voltage: '3.3V',     notes: 'Send 10µs HIGH pulse to trigger' },
  { gpio: 'GPIO 18',     component: 'HC-SR04 ECHO',        type: 'IN',         typeClass: 'gpio',  voltage: '3.3V',     notes: 'Use voltage divider! HC-SR04 ECHO = 5V, ESP32 max = 3.3V' },
  { gpio: 'GPIO 34',     component: 'YL-83 Analog',        type: 'ADC1-CH6',   typeClass: 'adc',   voltage: '3.3V',     notes: '0–4095 = dry–wet. Input only pin, no pull-up' },
  { gpio: 'GPIO 35',     component: 'YL-83 Digital',       type: 'IN',         typeClass: 'gpio',  voltage: '3.3V',     notes: 'HIGH = no rain, LOW = rain detected (threshold pot on module)' },
  { gpio: 'GPIO 19',     component: 'YFS-401 Signal',      type: 'IRQ IN',     typeClass: 'gpio',  voltage: '3.5–5V',   notes: 'Interrupt pin. 5.5 pulses/mL. Pulses/sec → L/min via formula' },
  { gpio: 'GPIO 23',     component: 'DHT22 Data',          type: 'IN/OUT',     typeClass: 'gpio',  voltage: '3.3V',     notes: '1-wire protocol. Use 4.7kΩ pull-up to 3.3V' },
  { gpio: 'GPIO 21',     component: 'OLED SDA',            type: 'I2C SDA',    typeClass: 'i2c',   voltage: '3.3V',     notes: 'Default I2C SDA on ESP32. Address 0x3C' },
  { gpio: 'GPIO 22',     component: 'OLED SCL',            type: 'I2C SCL',    typeClass: 'i2c',   voltage: '3.3V',     notes: 'Default I2C SCL. 400kHz fast mode' },
  { gpio: 'GPIO 25',     component: 'L298N IN1 (Gate)',    type: 'PWM OUT',    typeClass: 'pwm',   voltage: '3.3V',     notes: 'PWM signal to L298N for SG90 servo gate control' },
  { gpio: 'GPIO 27',     component: '5V Pump Relay IN',    type: 'OUT',        typeClass: 'gpio',  voltage: '3.3V',     notes: 'Drives relay module IN pin. HIGH = pump ON (via relay)' },
  { gpio: 'GPIO 26',     component: 'Buzzer +',            type: 'OUT',        typeClass: 'gpio',  voltage: '3.3V',     notes: 'Active buzzer (has internal oscillator). HIGH = buzz ON' },
  { gpio: 'GPIO 1 (TX0)', component: 'USB Serial TX',     type: 'UART0',      typeClass: 'uart',  voltage: '3.3V',     notes: 'Used for flashing + debug Serial.print()' },
  { gpio: 'GPIO 3 (RX0)', component: 'USB Serial RX',     type: 'UART0',      typeClass: 'uart',  voltage: '3.3V',     notes: 'Backup serial to Pi if Wi-Fi fails' },
  { gpio: '3.3V pin',    component: 'Sensor VCC (most)',   type: 'POWER',      typeClass: 'pwr',   voltage: '3.3V',     notes: 'Max 600mA total. HC-SR04, OLED, rain sensor use this' },
  { gpio: 'VIN (5V)',    component: 'YFS-401 + L298N',    type: 'POWER',      typeClass: 'pwr',   voltage: '5V',       notes: 'YFS-401 operates 3.5–24V. Connect to 5V for reliable pulses' },
  { gpio: 'GND',         component: 'All components GND', type: 'GND',        typeClass: 'pwr',   voltage: '0V',       notes: 'Connect all component grounds together (common ground)' },
];

// ─── Software Port Map ──────────────────────────────────────────────────────────
export const softwarePorts: SoftwarePort[] = [
  { service: 'Mosquitto MQTT Broker',   port: '1883',                       protocol: 'MQTT TCP',   purpose: 'Receives sensor data from ESP32 every 500ms' },
  { service: 'Next.js Web Dashboard',   port: '3000',                       protocol: 'HTTP',        purpose: 'Browser access: phone, PC on same Wi-Fi' },
  { service: 'SQLite Database',         port: '/home/pi/flood.db',          protocol: 'FILE',        purpose: 'Stores all readings, predictions, blockage events' },
  { service: 'ML Model File',           port: '/home/pi/flood_model.pkl',   protocol: 'FILE',        purpose: 'Decision Tree — classifies risk + sends gate angle command' },
  { service: 'Trend Buffer (RAM)',       port: '/home/pi/trend_buffer.json', protocol: 'FILE/MEM',   purpose: 'Rolling window of last 10 readings for preventive logic' },
  { service: 'Telegram Bot API',        port: 'api.telegram.org',           protocol: 'HTTPS POST',  purpose: 'Alerts on CRITICAL risk and BLOCKAGE events' },
];

// ─── Build Steps ──────────────────────────────────────────────────────────────
export const buildSteps: BuildStep[] = [
  {
    number: '01',
    phase: 'Hardware Phase',
    phaseColor: '#00C8FF',
    title: 'Gather all components & test each one',
    description: 'Before building anything, verify every component works individually. This prevents debugging hell later.',
    tasks: [
      'Buy: ESP32 WROOM-32, HC-SR04, YL-83, YF-S201, DHT22, SG90 servo, L298N driver, 0.96" OLED SSD1306, active buzzer, breadboard, jumper wires',
      'Test HC-SR04 alone with Arduino code — confirm it reads distance in cm correctly',
      'Test rain sensor — dip in water, confirm analog output changes on ADC',
      'Test servo — confirm it sweeps 0°→90°→180° with PWM signal from ESP32',
    ],
    code: {
      language: 'cpp',
      content: `// Quick HC-SR04 test on ESP32
#define TRIG 5  // GPIO 5
#define ECHO 18 // GPIO 18
digitalWrite(TRIG, HIGH); delayMicroseconds(10);
digitalWrite(TRIG, LOW);
duration = pulseIn(ECHO, HIGH);
distance_cm = duration * 0.034 / 2;`,
    },
  },
  {
    number: '02',
    phase: 'Hardware Phase',
    phaseColor: '#00C8FF',
    title: 'Wire everything on breadboard first',
    description: 'Never solder first. Wire on breadboard, test fully, then solder on perf board for final build.',
    tasks: [
      'HC-SR04: VCC→3.3V, GND→GND, TRIG→GPIO5, ECHO→GPIO18 (use voltage divider on ECHO: 1kΩ + 2kΩ)',
      'YL-83 Rain: VCC→3.3V, GND→GND, A0→GPIO34 (analog), D0→GPIO35 (digital threshold)',
      'YF-S201 Flow: VCC→5V (needs 5V), GND→GND, Signal→GPIO19 (configure interrupt)',
      'OLED SSD1306: VCC→3.3V, GND→GND, SDA→GPIO21, SCL→GPIO22',
      'Servo + L298N: L298N IN1→GPIO25 (PWM), L298N 5V separate power supply',
      'Buzzer: + →GPIO26, − →GND',
    ],
  },
  {
    number: '03',
    phase: 'Firmware Phase',
    phaseColor: '#00C8FF',
    title: 'Flash ESP32 — Sensor reading + MQTT publisher',
    description: 'Program ESP32 in Arduino IDE. Reads all sensors every 1 second and publishes JSON to Raspberry Pi via MQTT.',
    tasks: [
      'Install Arduino IDE → Add ESP32 board package from Espressif',
      'Install libraries: WiFi.h, PubSubClient (MQTT), Adafruit_SSD1306, DHT',
      'Write main loop: read sensors → format JSON → MQTT publish to topic flood/sensors',
      'Subscribe to topic flood/command — listen for OPEN/CLOSE from Pi, then control servo',
      'Display current values on OLED — water level, rain status, risk level received from Pi',
    ],
    code: {
      language: 'cpp',
      content: `// ESP32 MQTT publish (Arduino)
String payload = "{";
payload += "\\"water_cm\\":" + String(distance_cm) + ",";
payload += "\\"rain_adc\\":" + String(rain_val) + ",";
payload += "\\"flow_lpm\\":" + String(flow_rate);
payload += "}";
client.publish("flood/sensors", payload.c_str());`,
    },
  },
  {
    number: '04',
    phase: 'Pi 5 Software Phase',
    phaseColor: '#FFAA00',
    title: 'Set up Raspberry Pi 5 — OS + MQTT broker',
    description: 'Flash Raspberry Pi OS (64-bit, Bookworm) on microSD. Install all required software.',
    tasks: [
      'Flash Raspberry Pi OS 64-bit using Raspberry Pi Imager — enable SSH during flash setup',
      'Boot Pi 5, connect to same Wi-Fi as ESP32, note Pi\'s IP address (e.g. 192.168.1.100)',
      'Install Mosquitto MQTT broker: sudo apt install mosquitto mosquitto-clients',
      'Install Python packages: pip install paho-mqtt scikit-learn flask pandas',
      'Configure Mosquitto to listen on port 1883, allow anonymous connections (for local LAN only)',
      'Test: mosquitto_sub -h 192.168.1.100 -t flood/sensors — confirm ESP32 JSON data appears',
    ],
    code: {
      language: 'bash',
      content: `# Install all Python requirements at once
pip install paho-mqtt scikit-learn flask pandas joblib numpy

# mosquitto.conf — allow local connections
listener 1883
allow_anonymous true`,
    },
  },
  {
    number: '05',
    phase: 'Pi 5 Software Phase',
    phaseColor: '#FFAA00',
    title: 'Build the ML model (Decision Tree)',
    description: 'Create synthetic training data, train a Decision Tree classifier using scikit-learn. Save with joblib so the Pi can load it.',
    tasks: [
      'Create training CSV with 4 features: water_cm, rain_adc, flow_lpm, rate_of_change — label: 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL',
      'Rules: water <20cm=LOW, 20-50cm=MEDIUM, 50-80cm=HIGH, >80cm=CRITICAL — also factor in rain intensity',
      'Train sklearn DecisionTreeClassifier, test with 20% holdout, aim for >95% accuracy',
      'Save: joblib.dump(model, \'flood_model.pkl\')',
    ],
    code: {
      language: 'python',
      content: `from sklearn.tree import DecisionTreeClassifier
import joblib, pandas as pd

df = pd.read_csv('training_data.csv')
X = df[['water_cm', 'rain_adc', 'flow_lpm', 'rate']]
y = df['label']  # 0=LOW 1=MED 2=HIGH 3=CRIT
model = DecisionTreeClassifier(max_depth=6)
model.fit(X, y)
joblib.dump(model, 'flood_model.pkl')`,
    },
  },
  {
    number: '06',
    phase: 'Pi 5 Software Phase',
    phaseColor: '#FFAA00',
    title: 'Pi MQTT subscriber — receive, predict, command',
    description: 'Core Python script on Pi 5: subscribes to sensor data, runs ML prediction, stores to SQLite, sends command back to ESP32.',
    tasks: [
      'Subscribe to MQTT topic flood/sensors, parse incoming JSON',
      'Run ml_model.predict() on received data — get risk level 0-3',
      'Store every reading + prediction to SQLite database with timestamp',
      'If prediction ≥ HIGH → publish "OPEN" to flood/command (ESP32 opens gate)',
      'If prediction = LOW → publish "CLOSE" (gate closes)',
      'If prediction = CRITICAL → also call Telegram Bot API to send alert',
    ],
    code: {
      language: 'python',
      content: `def on_message(client, userdata, msg):
  data = json.loads(msg.payload)
  features = [[data['water_cm'], data['rain_adc'],
               data['flow_lpm'], rate_of_change]]
  risk = model.predict(features)[0]
  if risk >= 2:  # HIGH or CRITICAL
    client.publish("flood/command", "OPEN")
  if risk == 3:
    send_telegram_alert(risk, data)`,
    },
  },
  {
    number: '07',
    phase: 'Software Phase',
    phaseColor: '#C084FC',
    title: 'Next.js web dashboard on Pi 5',
    description: 'The Next.js dashboard runs on Pi 5 port 3000, connected to a Flask/Python API backend. Accessible from any device on the same network.',
    tasks: [
      'Run the Next.js app: npm run start — accessible at http://192.168.1.100:3000',
      'Dashboard polls /api/data every 5 seconds for live sensor updates',
      'Connect Python Flask API on port 5000 serving SQLite data as JSON',
      'Shows: water level gauge, rain status, flood risk badge, gate status, 24h chart',
    ],
  },
  {
    number: '08',
    phase: 'Integration Phase',
    phaseColor: '#FF4444',
    title: 'Telegram alert system + end-to-end test',
    description: 'Connect Pi to Telegram Bot API for real mobile alerts. Do full end-to-end integration test.',
    tasks: [
      'Create Telegram bot via @BotFather → get Bot Token and your Chat ID',
      'Add function to Python: send POST to api.telegram.org/bot[TOKEN]/sendMessage with risk data',
      'Full test: Simulate HIGH water (cover HC-SR04 with hand) → ESP32 sends MQTT → Pi predicts HIGH → gate opens + Telegram arrives',
      'Test edge case: flood then drain (water recedes) → confirm gate closes at LOW prediction',
    ],
    code: {
      language: 'python',
      content: `import requests
def send_telegram_alert(risk, data):
  labels = ['LOW','MEDIUM','HIGH','CRITICAL']
  msg = f"⚠️ FLOOD ALERT: {labels[risk]}\\n"
        f"Water: {data['water_cm']}cm\\n"
        f"Gate: OPENED automatically"
  requests.post(TELEGRAM_URL, json={"text": msg})`,
    },
  },
  {
    number: '09',
    phase: 'ESP32 Firmware Phase',
    phaseColor: '#00C8FF',
    title: 'Proportional drain control firmware',
    description: 'Implement proportional servo control on ESP32. Gate angle is directly proportional to water level — not a simple binary open/close.',
    tasks: [
      'Read water level every 500ms using HC-SR04 (non-blocking, interrupt-based)',
      'Convert raw distance_cm to water_percent: (max_distance - distance_cm) / max_distance × 100',
      'Calculate gate angle: angle = (water_percent / 100) × 180° — clamp to 0°–180°',
      'Move servo to calculated angle: servo.write(angle) — smooth, proportional actuation',
      'Also accept ML override from Pi via MQTT (Pi can force specific angles per risk class)',
    ],
    code: {
      language: 'cpp',
      content: `// ESP32 Proportional Gate Control (500ms loop)
float water_pct = (MAX_DIST - distance_cm) / MAX_DIST * 100.0;
int gate_angle  = (int)(water_pct / 100.0 * 180.0);
gate_angle = constrain(gate_angle, 0, 180);
servo.write(gate_angle);
// water at 60% → 108° automatically`,
    },
  },
  {
    number: '10',
    phase: 'ESP32 Firmware Phase',
    phaseColor: '#00C8FF',
    title: 'Blockage detection logic on ESP32',
    description: 'When gate is open but flow sensor reads near-zero, wait 5 seconds, then confirm blockage and attempt mechanical flush.',
    tasks: [
      'Track gate state (open/closed) and flow_lpm reading simultaneously',
      'If gate_open AND flow_lpm < 0.5 for > 5000ms → set blockage_confirmed = true',
      'Mechanical flush: pulse servo 3× (open → close → open) to dislodge debris',
      'Activate buzzer + display "BLOCKAGE DETECTED" on OLED',
      'Publish blockage event to MQTT topic flood/blockage so Pi sends Telegram alert',
    ],
    code: {
      language: 'cpp',
      content: `// Blockage detection (runs in loop every 500ms)
if (gate_open && flow_lpm < 0.5) {
  if (millis() - low_flow_start > 5000) {
    for (int i = 0; i < 3; i++) {  // 3× pulse flush
      servo.write(0);  delay(300);
      servo.write(180); delay(300);
    }
    buzzer_on(); oled_show("BLOCKAGE DETECTED");
    mqtt_publish("flood/blockage", "CONFIRMED");
  }
} else { low_flow_start = millis(); }`,
    },
  },
  {
    number: '11',
    phase: 'Pi 5 Software Phase',
    phaseColor: '#FFAA00',
    title: 'Early preventive action — trend analysis on Pi',
    description: 'Pi tracks last 10 readings and acts pre-emptively when both rain and water level are simultaneously rising — before any threshold is crossed.',
    tasks: [
      'Maintain a rolling buffer of last 10 sensor readings (deque in Python)',
      'After each reading, compute linear regression slope for rain_adc and water_cm',
      'If both slopes > 0 (both rising simultaneously) → trigger PREVENTIVE mode',
      'Publish gate_angle=90 to flood/command — opens gate to 50% before threshold hit',
      'If trend reverses (slope ≤ 0 for either) → revert to proportional control or ML prediction',
    ],
    code: {
      language: 'python',
      content: `from collections import deque
import numpy as np

buffer = deque(maxlen=10)

def check_trend(data):
    buffer.append(data)
    if len(buffer) < 10: return
    rain  = np.array([r['rain_adc']  for r in buffer])
    water = np.array([r['water_cm']  for r in buffer])
    # Linear regression slope via numpy polyfit
    rain_slope  = np.polyfit(range(10), rain,  1)[0]
    water_slope = np.polyfit(range(10), water, 1)[0]
    if rain_slope > 0 and water_slope > 0:
        mqtt_publish("flood/command", "ANGLE:90")  # 50% open`,
    },
  },
  {
    number: '12',
    phase: 'Final Phase',
    phaseColor: '#00E676',
    title: 'Mount in enclosure + demo prep',
    description: 'Transfer from breadboard to perf board, mount in project box, prepare demo scenario for lab presentation.',
    tasks: [
      'Solder all connections on perf board — use color-coded wires (red=VCC, black=GND, blue=data)',
      'Mount Pi 5 and ESP32 inside box using M2.5 standoffs, OLED on front panel',
      'Waterproof external sensors with silicone sealant around sensor edges (not sensor face)',
      'Demo setup: Small tray of water, HC-SR04 mounted above, YL-83 with spray bottle for rain sim',
      'Demo blockage: cover drain outlet with finger — confirm blockage detection triggers in 5s',
      'Demo preventive: slowly add water + rain — confirm gate pre-opens before reaching HIGH threshold',
    ],
  },
];

// ─── Bill of Materials ──────────────────────────────────────────────────────────
export const bomItems: BOMItem[] = [
  {
    id: 1, category: 'Sensors',
    name: 'Ultrasonic Sensor', model: 'HC-SR04',
    qty: 1, voltage: '5V', current: '15mA',
    specs: 'Range: 2–400 cm | Accuracy: ±3mm | Frequency: 40kHz',
    purpose: 'Measures water depth inside the prototype basin from above the water surface',
    icon: '📡', color: '#00C8FF',
  },
  {
    id: 2, category: 'Sensors',
    name: 'Rain Sensor Module', model: 'YL-83',
    qty: 1, voltage: '3.3–5V', current: '20mA',
    specs: 'Analog + Digital output | Onboard sensitivity pot | PCB size: 3.2×1.4cm',
    purpose: 'Detects simulated rain from the water pump drip nozzle — measures rain intensity 0–100%',
    icon: '🌧️', color: '#00C8FF',
  },
  {
    id: 3, category: 'Sensors',
    name: 'Mini Flow Sensor', model: 'YFS-401 (Sea)',
    qty: 1, voltage: '3.5–24V', current: '15mA',
    specs: 'Flow: 0.3–6 L/min | Nozzle: 3.5mm (1/8") | Hall-effect pulse | ~5.5 pulses/mL',
    purpose: 'Measures actual water flow rate through the prototype drain tube — used for blockage detection',
    icon: '💧', color: '#00C8FF',
  },
  {
    id: 4, category: 'Sensors',
    name: 'Temp & Humidity Sensor', model: 'DHT22',
    qty: 1, voltage: '3.3–5V', current: '2.5mA',
    specs: 'Temp: −40 to +80°C (±0.5°C) | Humidity: 0–100% RH (±2%) | 1-wire protocol',
    purpose: 'Ambient environment monitoring — used as an ML input feature alongside water data',
    icon: '🌡️', color: '#FFAA00',
  },
  {
    id: 5, category: 'Controllers',
    name: 'ESP32 Dev Board', model: 'ESP32 WROOM-32',
    qty: 1, voltage: '3.3V (onboard LDO)', current: '240mA peak',
    specs: '240MHz Dual-Core | 520KB SRAM | Wi-Fi 802.11 b/g/n | BLE 4.2 | 34 GPIO',
    purpose: 'Edge microcontroller — reads all sensors, drives actuators, publishes MQTT data',
    icon: '🔲', color: '#00C8FF',
  },
  {
    id: 6, category: 'Controllers',
    name: 'Single-Board Computer', model: 'Raspberry Pi 5 (8GB)',
    qty: 1, voltage: '5V', current: '1000–1600mA',
    specs: 'BCM2712 @ 2.4GHz | 4× Cortex-A76 | 8GB LPDDR4X | USB-C power | PCIe 2.0',
    purpose: 'Central brain — runs ML inference, MQTT broker, FastAPI server, and Telegram bot',
    icon: '🍓', color: '#FFAA00',
  },
  {
    id: 7, category: 'Actuators',
    name: 'Servo Motor', model: 'SG90 (9g Micro)',
    qty: 1, voltage: '5V', current: '100–500mA',
    specs: 'Torque: 1.8 kg·cm | Speed: 0.1 sec/60° | Angle: 0°–180° | PWM control',
    purpose: 'Physically opens and closes the drain gate proportionally (0°–180°) based on ML risk level',
    icon: '⚙️', color: '#00E676',
  },
  {
    id: 8, category: 'Actuators',
    name: '5V Mini Submersible Pump', model: 'SJ-0180 / Generic 5V DC',
    qty: 1, voltage: '3–6V DC', current: '200–300mA',
    specs: 'Flow: ~80–120 L/hr | Head: up to 40cm | 65mm × 32mm body | Submersible',
    purpose: 'Simulates rain (via drip nozzle) and fills the flood basin during classroom demonstrations',
    icon: '🚰', color: '#00C8FF',
  },
  {
    id: 9, category: 'Drivers & Modules',
    name: 'Motor Driver', model: 'L298N Dual H-Bridge',
    qty: 1, voltage: '5–35V motor side', current: '2A per channel',
    specs: 'Dual H-Bridge | Motor: 5–35V | Logic: 5V | PWM compatible | Onboard 5V regulator',
    purpose: 'Controls SG90 servo gate power — isolates ESP32 from high-current servo draw',
    icon: '⚡', color: '#C084FC',
  },
  {
    id: 10, category: 'Drivers & Modules',
    name: '5V Relay Module', model: 'Single Channel Relay',
    qty: 1, voltage: '5V coil', current: '70–90mA coil',
    specs: 'Contact: 250V/10A AC or 30V/10A DC | Active LOW trigger | LED indicator',
    purpose: 'Switches the 5V pump ON/OFF under ESP32 GPIO control (safely isolates logic from pump)',
    icon: '🔌', color: '#FF4444',
  },
  {
    id: 11, category: 'Display & Feedback',
    name: 'OLED Display', model: 'SSD1306 0.96"',
    qty: 1, voltage: '3.3–5V', current: '20mA',
    specs: '128×64 pixels | I2C 0x3C | Viewing angle: ~160° | White or blue pixels',
    purpose: 'Shows live water level, risk level, and gate status locally on the prototype box',
    icon: '🖥️', color: '#00C8FF',
  },
  {
    id: 12, category: 'Display & Feedback',
    name: 'Active Buzzer', model: 'Piezo Buzzer 5V',
    qty: 1, voltage: '3.3–5V', current: '30mA',
    specs: 'Frequency: ~2400Hz | Built-in oscillator | Sound level: ~85 dB | GPIO direct-drive',
    purpose: 'Audible alarm on CRITICAL flood risk and blockage detection events',
    icon: '🔔', color: '#FF4444',
  },
  {
    id: 13, category: 'Passives & Wiring',
    name: 'Breadboard + Jumper Wires', model: 'Full-size + M-M/M-F/F-F sets',
    qty: 1, voltage: 'N/A', current: 'N/A',
    specs: '830 tie-point breadboard | 40× M-M, 40× M-F, 40× F-F wires | Various lengths',
    purpose: 'Prototyping all connections without soldering — essential for classroom build',
    icon: '🔗', color: '#888888',
  },
  {
    id: 14, category: 'Passives & Wiring',
    name: 'Resistor Kit', model: '1kΩ + 2kΩ + 4.7kΩ (at min)',
    qty: 5, voltage: '0.25W', current: 'N/A',
    specs: '1kΩ for voltage divider R1 | 2kΩ for divider R2 | 4.7kΩ pull-up for DHT22',
    purpose: 'Voltage divider on HC-SR04 ECHO pin (5V→3.3V) + DHT22 pull-up resistor',
    icon: '🧩', color: '#888888',
  },
  {
    id: 15, category: 'Power',
    name: 'USB Power Bank', model: '10,000 mAh 5V/2A',
    qty: 1, voltage: '5V', current: '2A output',
    specs: '10,000 mAh | Dual USB output | 5V/2A per port | Passthrough charging',
    purpose: 'Powers ESP32 + all sensors + relay + buzzer during wireless classroom demo (~4–6hr runtime)',
    icon: '🔋', color: '#00E676',
  },
  {
    id: 16, category: 'Power',
    name: 'USB-C Power Adapter', model: '5V / 3A (15W)',
    qty: 1, voltage: '5V', current: '3A',
    specs: 'USB-C PD | Min 5V/3A required for Raspberry Pi 5 | Official Pi 5 adapter recommended',
    purpose: 'Powers Raspberry Pi 5 — requires dedicated adapter, cannot share with ESP32 power bank',
    icon: '🔌', color: '#FFAA00',
  },
  {
    id: 17, category: 'Physical Structure',
    name: 'Transparent Plastic Tray / Basin', model: 'Acrylic or Polypropylene',
    qty: 2, voltage: 'N/A', current: 'N/A',
    specs: 'Main basin: ~30cm × 20cm × 15cm | Reservoir: ~15cm × 10cm × 10cm | Transparent preferred',
    purpose: 'Main flood basin (sensor mounting, water fill) + separate water reservoir for pump',
    icon: '📦', color: '#888888',
  },
  {
    id: 18, category: 'Physical Structure',
    name: 'Silicone Tube / PVC Pipe', model: '6mm OD flexible tube',
    qty: 1, voltage: 'N/A', current: 'N/A',
    specs: '6mm OD matching YFS-401 nozzle | ~50cm length | Flexible | Water-tight connections',
    purpose: 'Routes water from pump → drip nozzle (rain sim) and through drain → YFS-401 → out',
    icon: '🪤', color: '#888888',
  },
];

// ─── Power Budget ────────────────────────────────────────────────────────────────────────────
export const powerBudget: PowerEntry[] = [
  { component: 'ESP32 WROOM-32',         voltage: '5V (USB)',   currentTypical: '80 mA',   currentPeak: '240 mA',  notes: 'Peak during Wi-Fi TX bursts. Average ~80mA with sensors polling', color: '#00C8FF' },
  { component: 'HC-SR04',                voltage: '5V',         currentTypical: '15 mA',   currentPeak: '15 mA',   notes: 'Low current — steady 15mA when active', color: '#00C8FF' },
  { component: 'YL-83 Rain Sensor',      voltage: '3.3V',       currentTypical: '20 mA',   currentPeak: '20 mA',   notes: 'Resistive PCB sensor — constant draw', color: '#00C8FF' },
  { component: 'YFS-401 Flow Sensor',    voltage: '5V',         currentTypical: '15 mA',   currentPeak: '15 mA',   notes: 'Hall-effect — very low power, 15mA max', color: '#00C8FF' },
  { component: 'DHT22',                  voltage: '3.3V',       currentTypical: '2.5 mA',  currentPeak: '2.5 mA',  notes: 'Very low draw — mostly idle between readings', color: '#FFAA00' },
  { component: 'SSD1306 OLED',           voltage: '3.3V',       currentTypical: '20 mA',   currentPeak: '30 mA',   notes: 'Current varies with pixels lit. ~20mA typical', color: '#00C8FF' },
  { component: 'Active Buzzer',          voltage: '3.3V',       currentTypical: '0 mA',    currentPeak: '30 mA',   notes: 'Only active during CRITICAL/BLOCKAGE events', color: '#FF4444' },
  { component: 'SG90 Servo Motor',       voltage: '5V',         currentTypical: '100 mA',  currentPeak: '500 mA',  notes: 'Peak during rotation. Use L298N for isolation from ESP32', color: '#00E676' },
  { component: 'Relay Module Coil',      voltage: '5V',         currentTypical: '70 mA',   currentPeak: '90 mA',   notes: 'Only active when pump is running', color: '#FF4444' },
  { component: '5V Mini Water Pump',     voltage: '5V',         currentTypical: '200 mA',  currentPeak: '300 mA',  notes: 'Via relay — NOT through ESP32. Separate power rail recommended', color: '#00C8FF' },
  { component: 'Raspberry Pi 5 (8GB)',   voltage: '5V (USB-C)', currentTypical: '1000 mA', currentPeak: '1600 mA', notes: 'Requires dedicated 5V/3A USB-C adapter. Cannot share with ESP32 bank', color: '#FFAA00' },
];
