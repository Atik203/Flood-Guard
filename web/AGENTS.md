# FloodGuard — AI Agent Rules & Project Context

## What This Project Is
FloodGuard is a **classroom IoT prototype** for a Microprocessor Systems Lab course. It is a real-time flood detection and prevention system with a full-stack web dashboard.

### Architecture (CRITICAL — read before writing code)
- **ESP32 WROOM-32** — Edge controller. Arduino C++. Reads 4 sensors, drives servo gate + buzz + pump relay. Publishes JSON to MQTT.
- **Raspberry Pi 5 (8GB)** — Central brain. Python 3.12 + FastAPI. Runs MQTT subscriber, ML model, Telegram bot. Hosts this Next.js app.
- **Next.js 16 (App Router)** — Web dashboard at `web/`. Uses Tailwind CSS v4, shadcn/ui, Framer Motion, SWR.

### Communication
```
ESP32 → MQTT (topic: flood/sensors) → Raspberry Pi → FastAPI → Supabase → Next.js SWR
                                    ↓
                               Telegram Bot (on CRITICAL/BLOCKAGE events)
                                    ↓
                            flood/command → ESP32 (gate angle)
```

### Sensors (ESP32 GPIO)
| Sensor | Model | GPIO | Notes |
|---|---|---|---|
| Water Level | HC-SR04 | TRIG=5, ECHO=18 | Voltage divider on ECHO (1kΩ+2kΩ) — HC-SR04 is 5V, ESP32 is 3.3V |
| Rain | YL-83 | A0=GPIO34, D0=GPIO35 | ADC1 on GPIO 34 only |
| Flow | YFS-401 (Sea) 3.5mm | GPIO 19 IRQ | ~5.5 pulses/mL, 0.3–6 L/min range |
| Temp/Humidity | DHT22 | GPIO 23 | 4.7kΩ pull-up to 3.3V |
| Servo gate | SG90 + L298N | GPIO 25 PWM | 0°–180° |
| Water pump | 5V Mini (SJ-0180) | GPIO 27 (relay) | Via relay module — never direct to GPIO |
| Buzzer | Active piezo | GPIO 26 | HIGH = ON |
| OLED | SSD1306 0.96" | SDA=21, SCL=22 | I2C address 0x3C |

### ML System (Raspberry Pi)
- **Algorithm**: Decision Tree Classifier (scikit-learn)
- **Features**: `water_cm`, `rain_adc`, `flow_lpm`, `temp_c`, `humidity_pct`
- **Output classes**: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **Gate angle mapping**: LOW=0°, MEDIUM=40°, HIGH=100°, CRITICAL=180°
- **Accuracy**: 96.5% on test set

---

## Next.js App (web/) — Key Facts

### Framework Versions
- **Next.js 16** (App Router, NOT Pages Router)
- **Tailwind CSS v4** — uses `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
- **shadcn/ui** components in `src/components/ui/`
- **Framer Motion** for all animations

### File Structure
```
web/src/
  app/
    page.tsx              ← Home landing page
    layout.tsx            ← Root layout with ThemeProvider
    (dashboard)/
      dashboard/page.tsx  ← Live sensor dashboard
      architecture/
        page.tsx          ← Architecture tabs (main file)
        FeaturesTab.tsx   ← Features (Prototype) tab component
      analytics/page.tsx  ← ML analytics
      alerts/page.tsx     ← Alert history
      settings/page.tsx   ← Threshold settings
  data/
    mockArchitectureData.ts  ← ALL architecture tab data (sensors, pins, BOM, etc.)
  components/
    ui/                   ← shadcn components (DO NOT edit directly)
    AppSidebar.tsx
  context/
    ThemeProvider.tsx     ← Dark/light mode context
  lib/utils.ts            ← cn() helper
```

### Important CSS Custom Properties (from globals.css / Tailwind config)
```
text-fg-cyan      → #00C8FF  (primary accent, water/sensor color)
text-fg-amber     → #FFAA00  (Pi/warning color)
text-fg-purple    → #C084FC  (ML/analytics color)
text-fg-green     → #00E676  (success/low-risk color)
text-fg-red       → #FF4444  (critical/danger color)
bg-dark-base      → dark background base
```
Always use these tokens rather than raw hex in className. Use `style={{ color: '#hex' }}` only when value is dynamic (from data array).

### Gradient Syntax (Tailwind v4)
Use `bg-linear-to-r` NOT `bg-gradient-to-r`. The old `bg-gradient-*` classes are deprecated.

### Architecture Page Tabs (architecture/page.tsx)
The Architecture page has 6 tabs. All data comes from `mockArchitectureData.ts`.
| Tab value | Component | Data source |
|---|---|---|
| `features` | `FeaturesTab` | `FeaturesTab.tsx` |
| `prototype` | `PrototypeBuildTab` | `bomItems`, `powerBudget` from data file |
| `flow` | `ArchFlowTab` | inline |
| `physical` | `PhysicalTab` | `sensors`, `outputs` |
| `steps` | `BuildStepsTab` | `buildSteps` |
| `pins` | `PinMapTab` | `pinMappings` |

---

## Coding Rules

### DO
- Use **TypeScript**. Add types for all new data structures.
- Use **Framer Motion** for animations (`motion.div`, `whileInView`, `animate`).
- Use **shadcn/ui** Card, Table, Tabs, Badge components — do not write raw HTML tables.
- Use **`cn()` from `@/lib/utils`** for conditional className merging.
- Export new data arrays/interfaces from `mockArchitectureData.ts`.
- Keep component functions at the top of `page.tsx`, before the default export.
- Use `'use client'` directive on any file with hooks or event handlers.

### DON'T
- Do NOT use `bg-gradient-to-*` (deprecated in Tailwind v4 — use `bg-linear-to-*`).
- Do NOT hardcode sensor names like `YF-S201` anywhere — the correct sensor is **YFS-401**.
- Do NOT import from `@/data/mockData` — the correct file is `@/data/mockArchitectureData`.
- Do NOT edit files in `src/components/ui/` directly — use shadcn CLI to add components.
- Do NOT use `Flask` — the backend is **FastAPI**.
- Do NOT use `SQLite` — storage is **Supabase** (PostgreSQL).

---

## Physical Prototype Context (for Demo)
- The prototype uses **two plastic containers**: main flood basin (~30×20×15cm) + water reservoir (~15×10×10cm).
- The 5V mini pump is **submerged in the reservoir**. Its tube splits to: (1) drip nozzle over YL-83 sensor (rain sim), (2) fill the basin (flood sim).
- The pump is switched by GPIO 27 via relay. **Never wire pump directly to GPIO pins.**
- The demo runs ~15 minutes and covers: idle → rain sim → rising water → HIGH/CRITICAL → blockage → preventive gate → dashboard deep-dive.

---

## Common Mistakes to Avoid
1. **HC-SR04 ECHO is 5V** — always use 1kΩ/2kΩ voltage divider before GPIO 18.
2. **YFS-401 needs 5V** — connect to VIN (5V), not 3.3V pin.
3. **DHT22 needs pull-up** — 4.7kΩ from Data pin to 3.3V.
4. **SWR hook** (`useSWR`) polls FastAPI every 2 seconds for live data — patch the API endpoint, not the hook.
5. **MQTT topic** for sensor data is `flood/sensors`; command topic is `flood/command`.
