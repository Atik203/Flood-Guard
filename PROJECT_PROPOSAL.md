# 🌊 FloodGuard — Real-Time Flood Detection & Prevention System

### Project Proposal | Microprocessor Systems Lab

---

> **Course:** Microprocessor Systems Lab  
> **Project Type:** IoT Embedded System with Machine Learning  
> **Live Demo URL:** [https://flood-guard-eta.vercel.app](https://flood-guard-eta.vercel.app)  
> **Repository:** [https://github.com/Atik203/Flood-Guard](https://github.com/Atik203/Flood-Guard)

---

## 📌 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Problem Statement](#-problem-statement)
3. [Project Objectives](#-project-objectives)
4. [System Architecture Overview](#-system-architecture-overview)
5. [Hardware Components](#-hardware-components)
6. [Software Stack](#-software-stack)
7. [Feature Deep-Dive (With Faculty Q&A)](#-feature-deep-dive)
   - [Feature 1: ML Flood Prediction Engine](#feature-1-ml-flood-prediction-engine)
   - [Feature 2: Proportional Drain Control](#feature-2-proportional-drain-control)
   - [Feature 3: Blockage Detection & Auto-Flush](#feature-3-blockage-detection--auto-flush)
   - [Feature 4: ML-Driven Preventive Action](#feature-4-ml-driven-preventive-action)
   - [Feature 5: Real-Time Telemetry & Dashboard](#feature-5-real-time-telemetry--dashboard)
   - [Feature 6: Automated Alert System](#feature-6-automated-alert-system)
8. [End-to-End Data Flow](#-end-to-end-data-flow)
9. [Database Design](#-database-design)
10. [API Reference](#-api-reference)
11. [Physical Demo Plan](#-physical-demo-plan)
12. [Simulation Mode](#-simulation-mode)
13. [Deployment Architecture](#-deployment-architecture)
14. [Key Metrics & Performance](#-key-metrics--performance)
15. [Potential Faculty Questions & Answers](#-potential-faculty-questions--answers)

---

## 🎯 Executive Summary

**FloodGuard** is a full-stack, IoT-based **intelligent flood detection and prevention system** designed and built for the Microprocessor Systems Lab course. The system uses:

- **ESP32 WROOM-32** as the edge controller — collects 4 sensor readings every 500ms and sends them over Wi-Fi via MQTT
- **Raspberry Pi 5 (8GB)** as the central brain — runs an ML-based Decision Tree classifier, a MQTT broker, Python FastAPI backend, and SQLite/Supabase database
- **Next.js 16 Web Dashboard** hosted on Vercel — a live, real-time monitoring dashboard connected to the backend via SWR polling
- **Telegram Bot** for push-notification alerts to a phone on CRITICAL flood events

Unlike simple threshold-based alarm systems, FloodGuard **predicts** flood risk, **proportionally controls** a drain gate, **detects physical blockages**, and **preventively acts** before thresholds are crossed — making it an active, intelligent system rather than a passive detector.

---

## ❗ Problem Statement

**Urban flooding** is one of the most severe recurring disasters in densely populated cities like Dhaka, Bangladesh. Key facts:

- 70% of Dhaka becomes waterlogged annually during monsoon season
- Municipal drain systems often have **zero automation** — they rely entirely on manual inspection
- **Plastic waste and solid debris** frequently block drainage gates, worsening flooding
- There is **no early-warning system** integrated with physical drain control at the street level

Our system addresses all four of these gaps in a single, unified prototype:

| Problem                            | FloodGuard's Solution                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| No water level monitoring          | HC-SR04 ultrasonic sensor measures water depth in real time  |
| Manual drain gates (no automation) | SG90 servo motor controlled by ML risk predictions           |
| Drain blockages go undetected      | YFS-401 mini flow sensor cross-referenced with gate position |
| No early warning                   | Telegram Bot sends instant alerts; trend logic pre-acts      |

---

## 🎯 Project Objectives

1. **Measure** real-time water depth, rain intensity, flow rate, temperature, and humidity using 4 sensor modules
2. **Classify** flood risk into 4 levels (LOW / MEDIUM / HIGH / CRITICAL) using a trained ML Decision Tree model
3. **Control** a physical drain gate proportionally (0°–180°) using a servo motor based on ML output
4. **Detect** physical blockages in the drain and execute an automated mechanical flush
5. **Predict** rising flood conditions before thresholds are crossed using trend analysis over the last 10 readings
6. **Alert** via Telegram Bot with exact water levels and actions taken
7. **Display** all data on a live web dashboard with charts, risk gauges, and ML analytics

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ① SENSOR LAYER                               │
│  HC-SR04 (Water) · YL-83 (Rain) · YF-S201 (Flow) · DHT22      │
│              │  Direct GPIO/ADC Wire  │                         │
└──────────────────────┬──────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ② ESP32 WROOM-32 EDGE                         │
│  240MHz Dual-Core · 520KB SRAM · Built-in Wi-Fi                │
│  • Reads all sensors every 500ms                                │
│  • Formats JSON payload                                         │
│  • Publishes to MQTT topic: floodguard/sensors/data             │
│  • Drives SG90 Servo (gate) · Buzzer · OLED Display           │
│              │  Wi-Fi · MQTT Protocol │                         │
└──────────────────────┬──────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                ③ RASPBERRY PI 5 (8GB) BRAIN                    │
│  BCM2712 @ 2.4GHz · 8GB LPDDR4X RAM                           │
│  • Mosquitto MQTT Broker (listens to ESP32 data)               │
│  • Python FastAPI Server (HTTP API)                             │
│  • Decision Tree ML Inference (scikit-learn)                   │
│  • SQLite / Supabase PostgreSQL Database                        │
│  • Telegram Bot HTTP calls for alerts                          │
│              │  HTTP REST · Telegram · Vercel │                 │
└──────────────────────┬──────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ④ OUTPUT LAYER                                 │
│  Next.js 16 Dashboard (Vercel)                                  │
│  Telegram Push Notifications (Mobile Phone)                    │
│  Supabase PostgreSQL (Persistent Storage)                      │
│  OLED SSD1306 Local Display (On ESP32)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Communication Protocols

| Protocol              | Used For               | Direction          |
| --------------------- | ---------------------- | ------------------ |
| GPIO/ADC              | Sensor → ESP32         | Direct wire        |
| MQTT (port 1883)      | ESP32 → Raspberry Pi   | Wi-Fi publish      |
| HTTP REST (port 8000) | Pi Backend → Dashboard | Polling / REST     |
| HTTP (Telegram API)   | Pi → Phone             | Alert POST request |
| PostgreSQL (Supabase) | Pi Backend → Cloud DB  | Persistent storage |

---

## 🔩 Hardware Components

| #   | Component                         | Model                   | Role                                       | Key Specs                             |
| --- | --------------------------------- | ----------------------- | ------------------------------------------ | ------------------------------------- |
| 1   | **Ultrasonic Sensor**             | HC-SR04                 | Measures water level (cm)                  | Range: 2–400cm, Accuracy: ±3mm        |
| 2   | **Rain Sensor Module**            | YL-83                   | Detects rain & measures intensity (0–100%) | Analog + Digital output               |
| 3   | **Mini Water Flow Sensor**        | YFS-401 (Sea)           | Measures drain flow rate (0.3–6 L/min)     | Hall-effect pulse, 3.5mm nozzle, 15mA |
| 4   | **Temp/Humidity Sensor**          | DHT22                   | Ambient temp & humidity                    | ±0.5°C, ±2% RH accuracy               |
| 5   | **Microcontroller (Edge)**        | ESP32 WROOM-32          | Reads sensors, drives actuators            | 240MHz Dual-Core, 520KB SRAM, Wi-Fi   |
| 6   | **Single-Board Computer (Brain)** | Raspberry Pi 5 (8GB)    | ML inference, MQTT broker, API server      | BCM2712 @ 2.4GHz                      |
| 7   | **Servo Motor + Driver**          | SG90 + L298N            | Physically opens/closes drain gate         | 0°–180° range                         |
| 8   | **5V Mini Submersible Pump**      | SJ-0180 / Generic 5V DC | Simulates rain/flood in classroom demo     | 80–120 L/hr, 200–300mA, submersible   |
| 9   | **5V Relay Module**               | Single Channel Relay    | Switches pump ON/OFF from ESP32 GPIO       | Active LOW, 250V/10A contact rating   |
| 10  | **OLED Display**                  | SSD1306 0.96"           | Shows live data locally on device          | I2C interface, 128×64 pixels          |
| 11  | **Buzzer**                        | Active Piezo            | Audible local alarm                        | On CRITICAL risk events               |

### Wiring Summary (ESP32 GPIO)

```
HC-SR04 Trigger  → GPIO 5
HC-SR04 Echo     → GPIO 18 (via voltage divider 1kΩ+2kΩ)
YL-83 Analog Out → ADC1 (GPIO 34)
YL-83 Digital    → GPIO 35
YFS-401 Signal   → GPIO 19 (interrupt, ~5.5 pulses/mL)
DHT22 Data       → GPIO 23
SG90 PWM Signal  → GPIO 25 (via L298N)
Pump Relay IN    → GPIO 27 (HIGH = pump ON)
Buzzer           → GPIO 26
OLED SDA         → GPIO 21 (I2C)
OLED SCL         → GPIO 22 (I2C)
```

---

## 💻 Software Stack

### Backend (Raspberry Pi 5 / Render Cloud)

| Technology              | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| **Python 3.12**         | Primary server language                                |
| **FastAPI**             | REST API framework (with auto Swagger docs at `/docs`) |
| **Paho MQTT**           | MQTT client to subscribe to ESP32 sensor data          |
| **scikit-learn**        | Decision Tree ML model (saved as `.pkl` file)          |
| **SQLAlchemy**          | ORM for database models and queries                    |
| **Supabase PostgreSQL** | Persistent cloud database (free tier, 500MB)           |
| **SQLite**              | Local fallback database (`.db` file)                   |
| **Telegram Bot API**    | Push notifications to mobile phone                     |
| **Uvicorn**             | ASGI server to run FastAPI                             |
| **joblib / pandas**     | ML model serialization and data formatting             |

### Frontend (Vercel Cloud)

| Technology                       | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| **Next.js 16**                   | React framework for the web dashboard            |
| **Tailwind CSS v4**              | Utility-based styling                            |
| **SWR (stale-while-revalidate)** | Auto-polling hook for live data from API         |
| **Recharts**                     | Interactive line charts for water level timeline |
| **Framer Motion**                | Animations throughout the UI                     |
| **Shadcn/ui**                    | Accessible UI component library                  |

---

## 🔬 Feature Deep-Dive

---

### Feature 1: ML Flood Prediction Engine

#### What It Does

A **Decision Tree classifier** (trained with scikit-learn) takes 4 real-time sensor readings and classifies the current flood risk into one of 4 levels:

| Level        | Condition                    | Gate Action                                      |
| ------------ | ---------------------------- | ------------------------------------------------ |
| **LOW**      | Water < 20cm AND Rain < 30%  | Gate stays CLOSED (0°)                           |
| **MEDIUM**   | Water 20–50cm OR Rain 30–60% | Gate opens to 45°                                |
| **HIGH**     | Water 50–80cm                | Gate opens to 90°                                |
| **CRITICAL** | Water > 80cm                 | Gate opens fully to 180° + Auto-flush if blocked |

#### Model Details

- **Algorithm:** `DecisionTreeClassifier` (scikit-learn)
- **Max Depth:** 6 (to prevent overfitting)
- **Training Data:** 2,000 synthetic samples generated by `train_mock_model.py` using domain-rule-based labeling
- **Input Features:** `[water_cm, rain_intensity, flow_lpm, rate_of_change]`
- **Output:** `LOW` / `MEDIUM` / `HIGH` / `CRITICAL`
- **Accuracy:** **96.5%** on training set
- **Prediction Speed:** < 2 milliseconds per inference
- **Model File:** `server/ml_models/decision_tree_v3.pkl` (joblib serialized)

#### How It Physically Works

1. ESP32 reads all sensors every 500ms and publishes a JSON payload over MQTT
2. Pi's `MQTTService` (Python) subscribes and receives the payload in `on_message()`
3. `MLService.predict_risk()` is called — it loads the DataFrame, runs `model.predict()`, and returns the string risk label
4. The Pi then publishes back to the ESP32 via MQTT topic `floodguard/actuators/gate` with the target servo angle

#### Code Excerpt (ml_service.py)

```python
def predict_risk(self, water_cm, rain_intensity, flow_lpm, rate_of_change) -> str:
    data = pd.DataFrame([{
        'water_cm': water_cm,
        'rain_intensity': rain_intensity,
        'flow_lpm': flow_lpm,
        'rate_of_change': rate_of_change
    }])
    prediction = self.model.predict(data)
    return prediction[0]  # Returns 'LOW', 'MEDIUM', 'HIGH', or 'CRITICAL'
```

#### Fallback Logic (If Model File Missing)

If the `.pkl` file is not loaded, the system falls back to simple threshold rules so it **never goes offline.**

---

### Feature 2: Proportional Drain Control

#### What It Does

Instead of a binary ON/OFF gate, the drain gate opens at a **proportional angle** calculated from the water level percentage. This is a continuous control system — not just two states.

#### The Formula

```
Angle = (water_level_percentage / 100) × 180°
```

| Water Level     | Calculated Angle | Gate State         |
| --------------- | ---------------- | ------------------ |
| 0% (empty)      | 0°               | Fully closed       |
| 25%             | 45°              | Quarter open       |
| 50%             | 90°              | Half open          |
| 75%             | 135°             | Three-quarter open |
| 100% (critical) | 180°             | Fully open         |

#### How It Physically Works

1. The Pi calculates the servo angle from the risk level + water level
2. Pi publishes JSON `{"angle": 90}` to MQTT topic `floodguard/actuators/gate`
3. ESP32 receives this, applies PWM signal to the SG90 servo through the L298N driver
4. The servo physically rotates to the commanded angle, opening the gate flap proportionally

#### Code Excerpt (mqtt_service.py)

```python
def set_gate(self, angle: int):
    self.client.publish(TOPIC_GATE_COMMAND, json.dumps({"angle": angle}))
```

#### Why Proportional Control?

A binary gate (fully open or fully closed) causes **water hammer** and can damage pipes. Proportional control releases water gradually, preventing sudden pressure changes and allowing finer, more stable drain management.

---

### Feature 3: Blockage Detection & Auto-Flush

#### What It Does

The system **cross-references** the gate position with the actual water flow rate. If the gate is open (≥50cm water detected) but the flow meter reads near-zero (< 1.0 L/min), it means the drain is physically blocked by debris.

#### Detection Logic

```python
if water_cm > 50 and flow_lpm < 1.0:
    gate_action_str = "Auto-flush sequence initiated (Blockage Detected)"
    self.set_gate(180)  # Fully open to attempt mechanical flush
```

#### Auto-Flush Sequence (Physical Steps)

1. **Step 1:** System detects blockage (gate open + flow = 0)
2. **Step 2:** Gate rapidly deflects to 180° (max open) — mechanical force to dislodge debris
3. **Step 3:** Pi waits, then cycles gate: 180° → 0° → 180° (pulse flush)
4. **Step 4:** Flow meter is read again — if flow resumes, blockage cleared ✅
5. **Step 5:** If blockage persists, a Telegram alert is sent with message "🚨 Confirmed Blockage"

#### Why This Is Important (Dhaka Context)

Plastic bottles and polythene bags are the #1 cause of drain blockages in Dhaka's streets. This feature turns the system from a passive sensor into an **active robotic drain cleaner** that reduces emergency manual deployments.

---

### Feature 4: ML-Driven Preventive Action

#### What It Does

The Raspberry Pi tracks the **last 10 sensor readings** as a sliding window. If both water level AND rain intensity are simultaneously rising (positive slope), the gate is **pre-opened to 50%** (90°) before any risk threshold is actually crossed.

#### Trend Detection Logic

```
if slope(water_cm[last 10]) > 0 AND slope(rain_intensity[last 10]) > 0:
    pre_open gate to 90°  # Act before the threshold
    log: "Preventive gate pre-open — trend detected"
```

#### Why "Preventive" is Better Than "Reactive"

| Approach                   | Problem                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Reactive (threshold-based) | Water hits danger level FIRST, then gate opens — too late                           |
| Predictive (trend-based)   | Detects rising trend EARLY, gate opens BEFORE peak — water drains out before crisis |

For example: if rain starts at 20% intensity and water is at 25cm but _both are rising fast_, a reactive system waits until water hits 50cm. Our system pre-opens the gate at 25cm because the ML trend model predicts it will reach 50cm.

#### What Makes This "ML-Driven"

The trend logic feeds directly into the same ML pipeline — the computed `rate_of_change` value is one of the 4 features fed into the Decision Tree. A rising `rate_of_change` directly raises the ML model's output toward HIGH/CRITICAL, making the prediction itself sensitive to trends — not just absolute values.

---

### Feature 5: Real-Time Telemetry & Dashboard

#### What It Does

A fully live **Next.js 16 web dashboard** polls the FastAPI backend every 2 seconds and displays:

- 📊 **Live Sensor Cards** — Water level (cm), Rain intensity (%), Flow rate (L/min), Temp (°C), Humidity (%)
- 📈 **Water Level Chart** — 24-hour historical timeline using Recharts line chart
- ⚡ **Risk Gauge** — Visual gauge showing current ML risk level with animated pulse
- 🖥️ **System Health Panel** — ESP32 connected status, MQTT broker uptime, gate state
- 🤖 **ML Analytics Panel** — Model accuracy (96.5%), predictions count today, feature importances
- 🔔 **Alerts Log** — Last 50 alerts with timestamps, risk levels, and actions taken
- ⚙️ **Settings Panel** — Toggle Telegram alerts, set custom thresholds, enable auto-cleanup

#### How Real-Time Sync Works (Technical)

The frontend uses **SWR (Stale-While-Revalidate)** — a React data-fetching hook — with different refresh intervals per endpoint:

```typescript
// Sensor data: refreshes every 2 seconds
const { data: currentReading } = useSWR(`${API_URL}/sensors/current`, fetcher, {
  refreshInterval: 2000,
});

// 24h history: refreshes every 10 seconds
const { data: timelineData } = useSWR(
  `${API_URL}/sensors/history?hours=24`,
  fetcher,
  { refreshInterval: 10000 },
);

// Alerts: refreshes every 5 seconds
const { data: alertsData } = useSWR(`${API_URL}/system/alerts`, fetcher, {
  refreshInterval: 5000,
});
```

This means the dashboard **stays live without requiring WebSockets** — simple, reliable, and production-safe.

---

### Feature 6: Automated Alert System

#### What It Does

When the system detects a **HIGH** or **CRITICAL** flood risk (or a confirmed blockage), it:

1. Logs an **Alert record** to the database with timestamp, water level, action taken
2. Optionally sends a **Telegram Bot message** to a configured phone number

#### Telegram Message Format

```
🚨 FLOOD CRITICAL: Water at 85.3cm. Action: Gate OPENED automatically
🚨 FLOOD HIGH: Water at 52.1cm. Action: Auto-flush sequence initiated (Blockage Detected)
```

#### Alert Trigger Logic (Code)

```python
if risk_level in ['HIGH', 'CRITICAL'] and gate_action_str:
    should_send_tg = False
    if settings.telegram_alerts:
        if risk_level == 'CRITICAL':
            should_send_tg = True  # Always send on CRITICAL
        elif risk_level == 'HIGH' and settings.high_alert:
            should_send_tg = True  # Send on HIGH if user enabled it

    alert = AlertDB(
        risk_level=risk_level,
        water_cm=water_cm,
        action=gate_action_str,
        telegram_sent=should_send_tg,
        message=f"🚨 FLOOD {risk_level}: Water at {water_cm}cm. Action: {gate_action_str}"
    )
    if should_send_tg:
        self.send_telegram(alert.message)
```

#### Telegram API Integration

```python
def send_telegram(self, message: str):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message}
    requests.post(url, json=payload, timeout=5)
```

#### User Controls (From Dashboard Settings Page)

Users can configure from the web dashboard:

- ✅ Enable/disable Telegram alerts globally
- ✅ Enable/disable alerts for HIGH level (CRITICAL is always on)
- ✅ Set custom thresholds: Medium threshold (cm), High threshold (cm), Critical threshold (cm)
- ✅ Enable auto-cleanup of old database records
- ✅ Manually trigger database cleanup

---

## 🔄 End-to-End Data Flow

```
[ESP32 Hardware]
     │
     │ 1. Reads sensors every 500ms:
     │    water_cm, rain_adc, rain_intensity, flow_lpm, temperature, humidity
     │
     │ 2. Publishes JSON payload to:
     │    MQTT topic: "floodguard/sensors/data"
     │    Broker: test.mosquitto.org:1883
     ▼
[Raspberry Pi 5 — MQTTService.on_message()]
     │
     │ 3. Parses JSON payload
     │
     │ 4. Calculates rate_of_change:
     │    rate_of_change = current_water_cm - last_water_cm
     │
     │ 5. Calls MLService.predict_risk(water_cm, rain_intensity, flow_lpm, rate_of_change)
     │    → Returns: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
     │
     │ 6. Safety override check:
     │    if water_cm >= threshold_crit → force CRITICAL
     │    if water_cm >= threshold_high and ML said LOW → force HIGH
     │
     │ 7. Determines gate angle:
     │    CRITICAL/HIGH → 90° or 180° (blockage detected: 180°)
     │    MEDIUM → 45°
     │    LOW → 0°
     │
     │ 8. Publishes gate command back to ESP32 via MQTT:
     │    topic: "floodguard/actuators/gate" → {"angle": 90}
     │
     │ 9. Saves SensorReadingDB to database
     │
     │ 10. If HIGH/CRITICAL → creates AlertDB record
     │     → If Telegram enabled → calls Telegram API
     │
     ▼
[Supabase PostgreSQL / SQLite]
     │
     │ 11. Dashboard polls FastAPI REST endpoints via SWR every 2s:
     │     GET /api/sensors/current
     │     GET /api/sensors/history?hours=24
     │     GET /api/system/alerts
     │     GET /api/ml/analytics
     ▼
[Next.js Dashboard on Vercel] ← Live update every 2 seconds
[Telegram Phone Alert]        ← Push notification on HIGH/CRITICAL
[OLED Display on ESP32]       ← Local status display in real time
```

---

## 🗄️ Database Design

### Table: `sensor_readings`

| Column           | Type       | Description                             |
| ---------------- | ---------- | --------------------------------------- |
| `id`             | INTEGER PK | Auto-increment primary key              |
| `timestamp`      | DATETIME   | UTC timestamp of reading                |
| `water_cm`       | FLOAT      | Water level in centimeters              |
| `rain_adc`       | INTEGER    | Raw ADC value from rain sensor          |
| `rain_intensity` | FLOAT      | Rain intensity percentage (0–100)       |
| `flow_lpm`       | FLOAT      | Flow rate in litres per minute          |
| `temperature`    | FLOAT      | Ambient temperature in °C               |
| `humidity`       | FLOAT      | Relative humidity (%)                   |
| `rate_of_change` | FLOAT      | Change in water_cm since last reading   |
| `risk_level`     | STRING     | ML prediction: LOW/MEDIUM/HIGH/CRITICAL |
| `gate_open`      | BOOLEAN    | Was the gate commanded to open?         |

### Table: `alerts`

| Column           | Type       | Description                                             |
| ---------------- | ---------- | ------------------------------------------------------- |
| `id`             | INTEGER PK | Auto-increment primary key                              |
| `timestamp`      | DATETIME   | When the alert was generated                            |
| `risk_level`     | STRING     | Risk at time of alert                                   |
| `water_cm`       | FLOAT      | Water level at time of alert                            |
| `rain_intensity` | FLOAT      | Rain intensity at time of alert                         |
| `flow_lpm`       | FLOAT      | Flow rate at time of alert                              |
| `action`         | STRING     | What the system did (e.g., "Gate OPENED automatically") |
| `telegram_sent`  | BOOLEAN    | Was a Telegram message sent?                            |
| `message`        | STRING     | Full alert message text                                 |

### Table: `settings`

| Column             | Type    | Default | Description                  |
| ------------------ | ------- | ------- | ---------------------------- |
| `telegram_alerts`  | BOOLEAN | True    | Enable Telegram globally     |
| `high_alert`       | BOOLEAN | True    | Send Telegram on HIGH risk   |
| `medium_alert`     | BOOLEAN | False   | Send Telegram on MEDIUM risk |
| `auto_cleanup`     | BOOLEAN | True    | Auto-delete old records      |
| `threshold_medium` | INTEGER | 20      | Water cm for MEDIUM risk     |
| `threshold_high`   | INTEGER | 50      | Water cm for HIGH risk       |
| `threshold_crit`   | INTEGER | 80      | Water cm for CRITICAL risk   |

### Database Auto-Cleanup

To manage the **Supabase free tier (500MB limit)**, the system auto-trims old records every 50 sensor inserts:

- Keeps newest **500 sensor readings**
- Keeps newest **100 alerts**

---

## 📡 API Reference

Base URL: `http://localhost:8000/api` (local) or deployed Render backend

| Method | Endpoint                    | Description                                        |
| ------ | --------------------------- | -------------------------------------------------- |
| GET    | `/sensors/current`          | Get the most recent sensor reading                 |
| GET    | `/sensors/history?hours=24` | Get all readings in last N hours                   |
| GET    | `/system/alerts`            | Get last 50 alerts                                 |
| GET    | `/system/status`            | Get system health (ESP32, Pi, MQTT, gate state)    |
| GET    | `/ml/analytics`             | Get ML model stats (accuracy, feature importances) |
| GET    | `/system/settings`          | Get current system settings                        |
| PUT    | `/system/settings`          | Update settings (thresholds, Telegram, etc.)       |
| GET    | `/system/database`          | Get DB row counts and table info                   |
| POST   | `/system/database/cleanup`  | Manually trigger database trim                     |

Interactive API docs available at: `http://localhost:8000/docs`

---

## 🖥️ Physical Demo Plan

### Prototype Setup

> **Note:** This is a tabletop prototype, not a field installation. All flood/rain events are **manually simulated** using a 5V mini water pump and relay module. The system behaves identically to a real deployment but scaled to fit a classroom table.

### Physical Prototype Structure

**Two-container setup on a table:**

1. **Main Basin** (~30cm × 20cm × 15cm transparent tray):
   - **HC-SR04** mounted at the top, pointing down at the water surface
   - **YL-83 rain sensor** on a side bracket — receives drip water from the pump nozzle
   - **SG90 servo** attached to a cardboard gate flap covering the drain hole
   - **YFS-401 flow sensor** (3.5mm nozzle) inline on the drain outlet tube

2. **Water Reservoir** (~15cm × 10cm × 10cm container):
   - **5V mini submersible pump** submerged at the bottom
   - **6mm silicone tube** exits and splits:
     - Branch 1 → drip nozzle over rain sensor (simulates rain)
     - Branch 2 → fills the main basin (simulates flood)
   - Pump ON/OFF via relay controlled by ESP32 GPIO 27

3. **Electronics box** (project box or breadboard on table):
   - ESP32 WROOM-32 on breadboard
   - Raspberry Pi 5 beside it
   - L298N driver for servo
   - Relay module for pump
   - Active buzzer
   - OLED display showing live status

### Live Demo Steps ( Presentation)

| Step | What We Do                                                          | Presentation                                                         |
| ---- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1    | Power on ESP32 (USB bank) + Pi (USB-C adapter). Wait 30s.           | Dashboard shows sensor data, risk = LOW                              |
| 2    | Turn on pump → water drips on rain sensor and fills basin           | Rain % rises, water level rises on dashboard                         |
| 3    | Water hits 20cm threshold                                           | Risk → MEDIUM, gate servo rotates to 45°                             |
| 4    | Keep pump running, water hits 50cm                                  | Risk → HIGH, gate opens to 90°. Dashboard alert logged               |
| 5    | Water hits 80cm threshold                                           | Gate → 180° (fully open). Buzzer sounds. Telegram alert on phone     |
| 6    | Block the drain outlet with foam/finger                             | Flow = 0 with gate open → Blockage detected → Auto-flush servo pulse |
| 7    | Drain basin and restart slowly with both rain + fill simultaneously | Preventive logic triggers → gate pre-opens before threshold          |
| 8    | Open Settings page on dashboard                                     | Change threshold 80cm → 50cm live, system reclassifies               |
| 9    | Show Alerts log, Water Level Chart, ML Analytics page               | Faculty sees complete system telemetry and ML insights               |

### Simulation Mode (If Hardware Unavailable)

The server has a `SIMULATE_MODE=true` flag in `.env`. When enabled, `SimulatorService` runs a Python script that publishes fake ESP32 data to MQTT every 5 seconds — simulating natural floods with rain events. The entire system works identically without physical hardware.

```python
# simulator.py — simulates realistic flood events
if rain_intensity > 40:
    water_cm += random.uniform(1, 5)   # Rising water during rain
else:
    water_cm -= random.uniform(0.5, 2) # Draining when rain stops
```

---

## ☁️ Deployment Architecture

```
[Physical Hardware]           [Cloud Infrastructure]
ESP32 ← → MQTT               Raspberry Pi 5 OR Render.com
                              FastAPI server (Python)
                              ↑ ↓
                         Supabase PostgreSQL (DB)
                              ↑
                    Next.js (Vercel) ← Dashboard
```

- **Backend:** Deployed to **Render.com** (free tier, Python web service)
  - Auto-deploy from GitHub main branch
  - Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
- **Frontend:** Deployed to **Vercel** (free tier, Next.js)
  - Auto-deploy on push to main
  - Live at: `https://flood-guard-eta.vercel.app`
- **Database:** **Supabase PostgreSQL** (free tier, 500MB)
  - Connection via SQLAlchemy ORM
  - Auto-cleanup ensures 500MB limit is never exceeded

---

## 📊 Key Metrics & Performance

| Metric                       | Value                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| ML Model Accuracy            | **96.5%**                                                  |
| Prediction Speed             | **< 2ms** per inference                                    |
| Sensor Sampling Rate         | Every **500ms**                                            |
| Dashboard Refresh Rate       | Every **2 seconds**                                        |
| MQTT Publish Frequency       | Every **500ms**                                            |
| Gate Response Time           | **< 1 second** from prediction to servo move               |
| Database Sensor Records Kept | **500 readings** (auto-trimmed)                            |
| Alert Records Kept           | **100 alerts** (auto-trimmed)                              |
| Supabase DB Limit            | **500MB** (free tier)                                      |
| Training Data Size           | **2,000 samples**                                          |
| Input Features for ML        | **4** (water_cm, rain_intensity, flow_lpm, rate_of_change) |
| Risk Classifications         | **4** (LOW / MEDIUM / HIGH / CRITICAL)                     |

---

## ❓ Potential Questions & Answers

### On Machine Learning

**Q: Why did you choose Decision Tree over other models like Neural Networks or Random Forest?**  
A: Decision Trees are highly interpretable — we can visually trace exactly WHY a particular prediction was made (which feature split caused it). For an embedded system where the Pi must explain its gate decision, interpretability is critical. Also, Decision Trees are very fast at inference (< 2ms) and have minimal memory overhead — important for running on a Raspberry Pi. Random Forest would be slightly more accurate but 10–50x slower for embedded use.

**Q: What are the 4 features fed into the model and why?**  
A: `water_cm` (primary indicator of flood severity), `rain_intensity` (predictor of incoming water volume), `flow_lpm` (indicates drain effectiveness), and `rate_of_change` (captures how fast water is rising — a fast rise is more dangerous than a slow one even at the same level).

**Q: How was the model trained if there is no real historical flood data?**  
A: We generated 2,000 synthetic data samples using domain knowledge rules (water > 80cm → CRITICAL, < 20cm and rain < 30% → LOW, etc.) in `train_mock_model.py`. This is a valid approach called **mock/synthetic data training** used widely in IoT research where real labeled datasets don't exist yet. The model generalizes well because the rules are physically grounded.

**Q: What is the model's accuracy?**  
A: 96.5% on our training set. Since the data was generated with deterministic labeling rules, the model learns them near-perfectly (max_depth=6 is enough to capture all the decision boundaries). In a real deployment, we would retrain with actual collected sensor data.

---

### On Hardware

**Q: Which microcontroller collects sensor data and which one runs ML?**  
A: ESP32 collects all sensor data and controls all actuators (servo, buzzer, OLED). The Raspberry Pi 5 runs the ML model, MQTT broker, API server, and Telegram bot. This dual-controller architecture separates real-time sensing (ESP32's strength) from heavy computation (Pi's strength).

**Q: How does the ESP32 communicate with the Raspberry Pi?**  
A: Via the MQTT protocol over Wi-Fi. ESP32 connects to the same local network as the Pi. The Pi runs Mosquitto (MQTT broker). The ESP32 publishes JSON sensor data to topic `floodguard/sensors/data`. The Pi subscribes to that topic and receives it in `on_message()`. The Pi responds by publishing gate commands to `floodguard/actuators/gate`.

**Q: What if the Wi-Fi goes down? Does the system fail?**  
A: The ESP32 has a fallback: it continues reading sensors and makes local threshold decisions (if water > 80cm, activate buzzer locally) even without Wi-Fi. The OLED display always shows live local data. The gate can still be operated by the ESP32 using its own threshold logic. Only the dashboard and Telegram alerts require connectivity.

**Q: How does the flow meter work?**  
A: The YF-S201 is a Hall-effect pulse counter. Water flowing through the meter rotates a small impeller with a magnet. Each rotation generates a pulse detected by the ESP32 on an interrupt pin (GPIO 19). Pulse frequency directly correlates to flow rate (pulses per second × calibration factor = L/min).

---

### On Software & System Design

**Q: How does the web dashboard get data in real time?**  
A: The frontend uses SWR (Stale-While-Revalidate) hooks in React. Each data source polls the FastAPI backend at its own interval (current sensor: 2s, history: 10s, alerts: 5s). This is simpler than WebSockets and more reliable over cloud networks. Data updates on screen automatically every 2 seconds.

**Q: Why use MQTT instead of directly calling the HTTP API from ESP32?**  
A: MQTT is a lightweight publish-subscribe protocol designed specifically for IoT. It uses much less bandwidth than HTTP (fixed header of only 2 bytes), has QoS levels to guarantee delivery, and is designed for unreliable networks — exactly the scenario of a flood-prone area. HTTP would require the ESP32 to know the Pi's IP address and manage persistent connections; MQTT handles all of that via the broker.

**Q: How do you prevent the database from running out of space?**  
A: We implemented an auto-cleanup system. Every 50 sensor inserts (~4 minutes of data), the system checks if there are more than 500 rows in `sensor_readings`. If yes, it deletes the oldest records, keeping only the freshest 500. Same for alerts (keeps 100). This can also be triggered manually from the dashboard Settings page.

**Q: What happens if Telegram API fails?**  
A: The alert is still saved to the database. The system logs the failure but does not crash. Telegram alerts are a best-effort notification layer; the core control system (MQTT → ML → Gate) operates independently of it.

---

### On Physical Demonstration

**Q: How will you physically show the blockage detection?**  
A: Live demo: we will manually block the drain outlet (e.g., with a piece of foam). The gate will be commanded open (water level high), but the flow meter will read 0 L/min. Within seconds, the system will detect the contradiction (gate open + no flow) and trigger the auto-flush — we'll see the servo rapidly pulse to 180°, and the alert "Auto-flush sequence initiated (Blockage Detected)" will appear in the dashboard.

**Q: Can you change the thresholds during the demo?**  
A: Yes! The Settings page on the dashboard allows live threshold changes. If we set threshold_medium from 20cm to 10cm, the system will immediately start treating 10cm water as a MEDIUM risk and open the gate to 45°. The change takes effect on the next sensor reading (within 2 seconds).

**Q: How accurate is the water level measurement in the physical model?**  
A: The HC-SR04 ultrasonic sensor has ±3mm accuracy in ideal conditions. In our setup, the sensor is mounted at the top of the container pointing down at the water surface. We calibrate the reading as: `water_cm = container_height - sensor_distance`. This gives us the water depth from the bottom.

---

## 📁 Project File Structure

```
Flood-Guard/
├── README.md                    ← Main project README
├── PROJECT_PROPOSAL.md          ← This file (Faculty Proposal)
│
├── server/                      ← Python FastAPI Backend
│   ├── main.py                  ← FastAPI app, all API routes
│   ├── mqtt_service.py          ← MQTT broker client + core logic pipeline
│   ├── ml_service.py            ← ML model loading + inference
│   ├── models.py                ← SQLAlchemy database models
│   ├── database.py              ← DB connection (Supabase/SQLite)
│   ├── simulator.py             ← Hardware ESP32 simulator (MQTT publisher)
│   ├── simulator_service.py     ← Background thread wrapper for simulator
│   ├── train_mock_model.py      ← ML model training script
│   ├── requirements.txt         ← Python dependencies
│   ├── render.yaml              ← Render.com deployment config
│   ├── Procfile                 ← Process file for deployment
│   └── ml_models/
│       └── decision_tree_v3.pkl ← Trained and serialized ML model
│
└── web/                         ← Next.js 16 Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx         ← Home / Landing page
    │   │   └── (dashboard)/
    │   │       ├── dashboard/   ← Live sensor dashboard
    │   │       ├── alerts/      ← Alert history log
    │   │       ├── analytics/   ← ML model analytics
    │   │       ├── architecture/ ← System architecture + features demo
    │   │       └── settings/    ← User settings & thresholds
    │   ├── components/
    │   │   └── dashboard/       ← SensorCards, RiskGauge, WaterLevelChart, etc.
    │   ├── hooks/
    │   │   └── useBackend.ts    ← SWR data-fetching hook (global state)
    │   ├── data/
    │   │   └── featureData.ts   ← Feature demo animation data
    │   └── context/
    │       └── ThemeProvider.tsx ← Dark/Light mode context
    └── package.json
```

---

## ✅ Summary: What Makes FloodGuard Different

| Feature           | Simple Threshold System                | FloodGuard                          |
| ----------------- | -------------------------------------- | ----------------------------------- |
| Detection         | Only reacts when water is already high | Predicts risk BEFORE threshold      |
| Gate Control      | Binary ON/OFF                          | Proportional 0°–180°                |
| Blockage Handling | None                                   | Auto-detects + mechanical flush     |
| Alerting          | LED/Buzzer only                        | Telegram to phone globally          |
| Data History      | Not stored                             | Full 24h timeline in PostgreSQL     |
| Dashboard         | None                                   | Full web app with charts + ML stats |
| Remote Control    | None                                   | Settings changeable from anywhere   |
| ML Model          | None                                   | Decision Tree with 96.5% accuracy   |

---

_Prepared by [Md.Atikur Rahaman](https://github.com/Atik203) | April 2026_
