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
    id: 'yf-s201',
    name: 'YF-S201',
    model: 'Flow Rate Sensor',
    icon: '💧',
    color: '#00C8FF',
    pins: ['GPIO 19 (IRQ)'],
    description: 'Measures water flow rate in L/min. Inline on drain pipe.',
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
  'Wi-Fi MQTT', 'I2C OLED', 'PWM Motor', 'ADC Rain', 'GPIO Buzzer', 'UART Backup',
];

export const esp32LocalOutputs = [
  { icon: '⚙️', label: 'Motor Gate', sub: 'PWM via L298N', color: '#00E676' },
  { icon: '🖥️', label: 'OLED Display', sub: 'I2C · 0x3C', color: '#00C8FF' },
  { icon: '🔔', label: 'Buzzer', sub: 'GPIO Active', color: '#FF4444' },
];

// ─── Raspberry Pi capabilities ─────────────────────────────────────────────────
export const piChips = [
  'Python 3.11', 'scikit-learn ML', 'Mosquitto MQTT', 'Next.js Dashboard',
  'SQLite Logging', 'Telegram Alerts', 'Wi-Fi + Ethernet', 'PCIe 2.0 Slot',
];

// ─── GPIO Pin Map ──────────────────────────────────────────────────────────────
export const pinMappings: PinMapping[] = [
  { gpio: 'GPIO 5',      component: 'HC-SR04 TRIG',       type: 'OUT',        typeClass: 'gpio',  voltage: '3.3V',     notes: 'Send 10µs HIGH pulse to trigger' },
  { gpio: 'GPIO 18',     component: 'HC-SR04 ECHO',       type: 'IN',         typeClass: 'gpio',  voltage: '3.3V',     notes: 'Use voltage divider! HC-SR04 ECHO = 5V, ESP32 max = 3.3V' },
  { gpio: 'GPIO 34',     component: 'YL-83 Analog',       type: 'ADC1-CH6',   typeClass: 'adc',   voltage: '3.3V',     notes: '0–4095 = dry–wet. Input only pin, no pull-up' },
  { gpio: 'GPIO 35',     component: 'YL-83 Digital',      type: 'IN',         typeClass: 'gpio',  voltage: '3.3V',     notes: 'HIGH = no rain, LOW = rain detected (threshold pot on module)' },
  { gpio: 'GPIO 19',     component: 'YF-S201 Signal',     type: 'IRQ IN',     typeClass: 'gpio',  voltage: '5V→3.3V',  notes: 'Use interrupt (attachInterrupt). Pulses per second → L/min formula' },
  { gpio: 'GPIO 23',     component: 'DHT22 Data',         type: 'IN/OUT',     typeClass: 'gpio',  voltage: '3.3V',     notes: '1-wire protocol. Use 4.7kΩ pull-up to 3.3V' },
  { gpio: 'GPIO 21',     component: 'OLED SDA',           type: 'I2C SDA',    typeClass: 'i2c',   voltage: '3.3V',     notes: 'Default I2C SDA on ESP32. Address 0x3C' },
  { gpio: 'GPIO 22',     component: 'OLED SCL',           type: 'I2C SCL',    typeClass: 'i2c',   voltage: '3.3V',     notes: 'Default I2C SCL. 400kHz fast mode' },
  { gpio: 'GPIO 25',     component: 'L298N IN1 (Motor)',  type: 'PWM OUT',    typeClass: 'pwm',   voltage: '3.3V',     notes: 'PWM signal to L298N. L298N uses separate 5V/12V for motor power' },
  { gpio: 'GPIO 26',     component: 'Buzzer +',           type: 'OUT',        typeClass: 'gpio',  voltage: '3.3V',     notes: 'Active buzzer (has internal oscillator). HIGH = buzz ON' },
  { gpio: 'GPIO 1 (TX0)', component: 'USB Serial TX',    type: 'UART0',      typeClass: 'uart',  voltage: '3.3V',     notes: 'Used for flashing + debug Serial.print()' },
  { gpio: 'GPIO 3 (RX0)', component: 'USB Serial RX',    type: 'UART0',      typeClass: 'uart',  voltage: '3.3V',     notes: 'Backup serial to Pi if Wi-Fi fails' },
  { gpio: '3.3V pin',    component: 'Sensor VCC (most)',  type: 'POWER',      typeClass: 'pwr',   voltage: '3.3V',     notes: 'Max 600mA total. HC-SR04, OLED, rain sensor use this' },
  { gpio: 'VIN (5V)',    component: 'YF-S201 + L298N',   type: 'POWER',      typeClass: 'pwr',   voltage: '5V',       notes: 'Flow sensor needs 5V. Comes from USB input of ESP32' },
  { gpio: 'GND',         component: 'All components GND', type: 'GND',        typeClass: 'pwr',   voltage: '0V',       notes: 'Connect all component grounds together (common ground)' },
];

// ─── Software Port Map ──────────────────────────────────────────────────────────
export const softwarePorts: SoftwarePort[] = [
  { service: 'Mosquitto MQTT Broker', port: '1883',                     protocol: 'MQTT TCP',   purpose: 'Receives sensor data from ESP32' },
  { service: 'Next.js Web Dashboard', port: '3000',                     protocol: 'HTTP',        purpose: 'Browser access: phone, PC on same Wi-Fi' },
  { service: 'SQLite Database',       port: '/home/pi/flood.db',        protocol: 'FILE',        purpose: 'Stores all sensor readings + predictions' },
  { service: 'ML Model File',         port: '/home/pi/flood_model.pkl', protocol: 'FILE',        purpose: 'Trained Decision Tree, loaded by MQTT scripts' },
  { service: 'Telegram Bot API',      port: 'api.telegram.org',         protocol: 'HTTPS POST',  purpose: 'Outbound alerts when risk = HIGH or CRITICAL' },
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
    phase: 'Final Phase',
    phaseColor: '#00E676',
    title: 'Mount in enclosure + demo prep',
    description: 'Transfer from breadboard to perf board, mount in project box, prepare demo scenario for lab presentation.',
    tasks: [
      'Solder all connections on perf board — use color-coded wires (red=VCC, black=GND, blue=data)',
      'Mount Pi 5 and ESP32 inside box using M2.5 standoffs, OLED on front panel',
      'Waterproof external sensors with silicone sealant around sensor edges (not sensor face)',
      'Demo setup: Small tray of water, HC-SR04 mounted above, YL-83 with spray bottle for rain sim',
      'Viva answer: "Our system is predictive — the ML model acts before water reaches critical level."',
    ],
  },
];
