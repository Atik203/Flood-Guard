'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sensors, outputs, esp32Chips, esp32LocalOutputs, piChips, pinMappings, softwarePorts, buildSteps } from '@/data/mockArchitectureData';
import { cn } from '@/lib/utils';

// ─── Architecture Flow ────────────────────────────────────────────────────────
function ArchFlowTab() {
  return (
    <div className="flex flex-col items-center gap-0 py-4 max-w-2xl mx-auto">

      {/* Layer 1: Sensors */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} className="w-full">
        <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-3">① Sensor Layer</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sensors.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.06 }}
              className="relative rounded-xl border border-fg-cyan/25 bg-card p-3 text-center hover:border-fg-cyan/40 hover:shadow-[0_0_16px_rgba(0,200,255,0.15)] transition-all cursor-pointer group">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-fg-cyan rounded-t-xl shadow-[0_0_8px_#00C8FF]" />
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-[10px] font-mono font-bold text-fg-cyan">{s.name}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{s.model}</p>
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {s.pins.map(p => <span key={p} className="text-[8px] font-mono bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/20 px-1 rounded">{p}</span>)}
              </div>
              {/* Hover tooltip */}
              <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-popover border border-border/50 shadow-xl text-[10px] font-mono text-muted-foreground w-40 text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {s.description}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Arrow 1 */}
      <div className="flex flex-col items-center py-3 gap-1">
        <div className="w-px h-5 bg-gradient-to-b from-fg-cyan to-transparent" />
        <span className="text-[9px] font-mono px-3 py-0.5 rounded-full bg-fg-cyan/8 text-fg-cyan border border-fg-cyan/20 tracking-wider animate-[blink_1.5s_ease-in-out_infinite]">DIRECT WIRE · GPIO/ADC</span>
        <div className="w-px h-5 bg-gradient-to-b from-transparent to-fg-cyan/30" />
      </div>

      {/* ESP32 */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="w-full">
        <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-3">② ESP32 — Edge Controller</p>
        <div className="relative rounded-xl border-2 border-fg-cyan/45 bg-card p-4 shadow-[0_0_24px_rgba(0,200,255,0.08)]">
          <p className="absolute -top-[10px] left-4 text-[8px] font-mono tracking-[2px] text-fg-cyan bg-background px-2">EDGE MICROCONTROLLER</p>
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">🔲</div>
            <div>
              <p className="font-mono font-bold text-lg text-fg-cyan tracking-wide">ESP32 WROOM-32</p>
              <p className="text-[11px] font-mono text-muted-foreground mb-2">Dual-core 240MHz · 520KB SRAM · 18× ADC · 34 GPIO</p>
              <div className="flex flex-wrap gap-1.5">
                {esp32Chips.map(c => <span key={c} className="text-[10px] font-mono bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/25 px-2 py-0.5 rounded-full">{c}</span>)}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-fg-cyan/12">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Controls directly (no Pi needed)</p>
            <div className="grid grid-cols-3 gap-2">
              {esp32LocalOutputs.map(o => (
                <div key={o.label} className="rounded-lg p-2 text-center" style={{ background: `${o.color}08`, border: `1px solid ${o.color}25` }}>
                  <div className="text-lg">{o.icon}</div>
                  <p className="text-[8px] font-mono font-bold mt-0.5" style={{ color: o.color }}>{o.label}</p>
                  <p className="text-[8px] font-mono text-muted-foreground">{o.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Arrow 2 */}
      <div className="flex flex-col items-center py-3 gap-1">
        <div className="w-px h-5 bg-gradient-to-b from-fg-amber to-transparent" />
        <span className="text-[9px] font-mono px-3 py-0.5 rounded-full bg-fg-amber/8 text-fg-amber border border-fg-amber/20 tracking-wider animate-[blink_1.5s_ease-in-out_infinite]">Wi-Fi · MQTT PROTOCOL · BIDIRECTIONAL</span>
        <div className="w-px h-5 bg-gradient-to-b from-transparent to-fg-amber/30" />
      </div>

      {/* Raspberry Pi 5 */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} className="w-full">
        <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-3">③ Raspberry Pi 5 — Brain</p>
        <div className="relative rounded-xl border-2 border-fg-amber/45 bg-gradient-to-br from-[#150F00]/30 to-card p-4 shadow-[0_0_24px_rgba(255,170,0,0.08)]">
          <p className="absolute -top-[10px] left-4 text-[8px] font-mono tracking-[2px] text-fg-amber bg-background px-2">CENTRAL BRAIN — ML + DASHBOARD</p>
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">🍓</div>
            <div className="flex-1">
              <p className="font-mono font-bold text-lg text-fg-amber tracking-wide">RASPBERRY PI 5</p>
              <p className="text-[11px] font-mono text-muted-foreground mb-2">BCM2712 · 4× Cortex-A76 @ 2.4GHz · 8GB LPDDR4X</p>
              <div className="flex flex-wrap gap-1.5">
                {piChips.map(c => <span key={c} className="text-[10px] font-mono bg-fg-amber/10 text-fg-amber border border-fg-amber/25 px-2 py-0.5 rounded-full">{c}</span>)}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-fg-amber/15 grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5 bg-fg-purple/6 border border-fg-purple/20">
              <p className="text-[9px] font-mono font-bold text-fg-purple mb-1">ML PREDICTION ENGINE</p>
              <p className="text-[10px] text-muted-foreground">Decision Tree on 4 features → LOW/MED/HIGH/CRITICAL in &lt;2ms</p>
            </div>
            <div className="rounded-lg p-2.5 bg-fg-green/4 border border-fg-green/15">
              <p className="text-[9px] font-mono font-bold text-fg-green mb-1">COMMAND SENDER</p>
              <p className="text-[10px] text-muted-foreground">Publishes OPEN/CLOSE back to ESP32 via MQTT after prediction</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Arrow 3 */}
      <div className="flex flex-col items-center py-3 gap-1">
        <div className="w-px h-5 bg-gradient-to-b from-fg-green to-transparent" />
        <span className="text-[9px] font-mono px-3 py-0.5 rounded-full bg-fg-green/8 text-fg-green border border-fg-green/20 tracking-wider animate-[blink_1.5s_ease-in-out_infinite]">HTTP · TELEGRAM · SQLITE</span>
        <div className="w-px h-5 bg-gradient-to-b from-transparent to-fg-green/30" />
      </div>

      {/* Output layer */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} className="w-full">
        <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase mb-3">④ Output Layer</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {outputs.map((o, i) => (
            <motion.div key={o.name} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.55+i*0.06 }}
              className="rounded-xl border bg-card p-3 text-center" style={{ borderColor: `${o.color}25` }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-xl" style={{ background: o.color }} />
              <div className="text-2xl mb-1">{o.icon}</div>
              <p className="text-[10px] font-mono font-bold" style={{ color: o.color }}>{o.name}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 whitespace-pre-line leading-tight">{o.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Physical View ────────────────────────────────────────────────────────────
function PhysicalTab() {
  return (
    <div className="space-y-6">
      <div className="relative rounded-xl border-2 border-dashed border-fg-cyan/20 bg-card p-4">
        <p className="absolute -top-[10px] left-4 text-[8px] font-mono tracking-[2px] text-fg-cyan bg-background px-2">PROJECT BOX — TOP VIEW (500mm × 350mm)</p>
        <svg viewBox="0 0 660 420" className="w-full max-h-96">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
          </defs>
          {/* Outer box */}
          <rect x="20" y="20" width="620" height="380" rx="16" fill="none" stroke="rgba(0,200,255,0.25)" strokeWidth="1.5" strokeDasharray="8 4"/>
          {/* Water channel */}
          <rect x="20" y="140" width="80" height="140" rx="6" fill="rgba(0,60,100,0.4)" stroke="rgba(0,200,255,0.4)" strokeWidth="1.5" strokeDasharray="5 3"/>
          <text x="60" y="202" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#00C8FF">WATER</text>
          <text x="60" y="216" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#00C8FF">CHANNEL</text>
          {/* HC-SR04 */}
          <rect x="76" y="155" width="70" height="48" rx="5" fill="rgba(0,200,255,0.08)" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5"/>
          <text x="111" y="175" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#00C8FF">HC-SR04</text>
          <text x="111" y="193" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,200,255,0.6)">Ultrasonic</text>
          {/* YF-S201 */}
          <rect x="76" y="218" width="70" height="48" rx="5" fill="rgba(0,200,255,0.08)" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5"/>
          <text x="111" y="238" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#00C8FF">YF-S201</text>
          <text x="111" y="256" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,200,255,0.6)">Flow Sensor</text>
          {/* Rain sensor */}
          <rect x="250" y="22" width="80" height="44" rx="5" fill="rgba(0,200,255,0.08)" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5"/>
          <text x="290" y="41" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#00C8FF">YL-83</text>
          <text x="290" y="56" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,200,255,0.6)">Rain Sensor</text>
          {/* Motor */}
          <rect x="200" y="340" width="100" height="50" rx="5" fill="rgba(0,230,118,0.07)" stroke="rgba(0,230,118,0.4)" strokeWidth="1.5"/>
          <text x="250" y="360" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#00E676">SERVO MOTOR</text>
          <text x="250" y="380" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,230,118,0.6)">Drain Gate</text>
          {/* L298N */}
          <rect x="170" y="250" width="120" height="70" rx="5" fill="rgba(255,170,0,0.05)" stroke="rgba(255,170,0,0.35)" strokeWidth="1.5"/>
          <text x="230" y="278" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#FFAA00">L298N DRIVER</text>
          <text x="230" y="308" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,170,0,0.6)">+ Breadboard</text>
          {/* ESP32 */}
          <rect x="320" y="240" width="120" height="80" rx="6" fill="rgba(0,200,255,0.08)" stroke="rgba(0,200,255,0.6)" strokeWidth="2"/>
          <text x="380" y="268" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" fill="#00C8FF">ESP32</text>
          <text x="380" y="284" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,200,255,0.7)">WROOM-32</text>
          <text x="380" y="308" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,200,255,0.5)">Wi-Fi MQTT</text>
          {/* OLED */}
          <rect x="460" y="260" width="75" height="50" rx="5" fill="rgba(0,200,255,0.06)" stroke="rgba(0,200,255,0.3)" strokeWidth="1"/>
          <text x="497" y="281" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#00C8FF">OLED</text>
          <text x="497" y="300" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(0,200,255,0.5)">I2C SSD1306</text>
          {/* Buzzer */}
          <rect x="460" y="200" width="60" height="45" rx="5" fill="rgba(255,68,68,0.06)" stroke="rgba(255,68,68,0.3)" strokeWidth="1"/>
          <text x="490" y="220" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#FF4444">BUZZER</text>
          <text x="490" y="238" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,68,68,0.5)">Active Alert</text>
          {/* Raspberry Pi 5 */}
          <rect x="310" y="60" width="170" height="140" rx="8" fill="rgba(255,170,0,0.07)" stroke="rgba(255,170,0,0.6)" strokeWidth="2"/>
          <text x="395" y="90" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" fill="#FFAA00">RASPBERRY PI 5</text>
          <text x="395" y="108" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,170,0,0.7)">BCM2712 · 8GB LPDDR4X</text>
          <text x="395" y="128" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,170,0,0.6)">Python ML + Flask</text>
          <text x="395" y="148" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,170,0,0.6)">MQTT Broker</text>
          <text x="395" y="168" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,170,0,0.5)">SQLite + Telegram</text>
          {/* Power supply */}
          <rect x="530" y="60" width="90" height="60" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <text x="575" y="84" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.7)">POWER</text>
          <text x="575" y="100" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,255,255,0.4)">5V/3A + 5V/5A</text>
          {/* MicroSD */}
          <rect x="530" y="140" width="90" height="45" rx="5" fill="rgba(192,132,252,0.06)" stroke="rgba(192,132,252,0.25)" strokeWidth="1"/>
          <text x="575" y="158" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#C084FC">microSD</text>
          <text x="575" y="174" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(192,132,252,0.5)">32GB OS + data</text>
          {/* Connection lines */}
          <line x1="146" y1="179" x2="320" y2="280" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)"/>
          <line x1="146" y1="242" x2="285" y2="278" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)"/>
          <line x1="290" y1="66" x2="350" y2="240" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)"/>
          <line x1="320" y1="290" x2="290" y2="285" stroke="rgba(0,230,118,0.6)" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <line x1="230" y1="320" x2="240" y2="340" stroke="rgba(0,230,118,0.6)" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <line x1="440" y1="270" x2="460" y2="275" stroke="rgba(192,132,252,0.6)" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <line x1="440" y1="252" x2="460" y2="230" stroke="rgba(255,68,68,0.6)" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <path d="M380 240 Q380 200 395 200" fill="none" stroke="rgba(255,170,0,0.7)" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr)"/>
          <text x="342" y="218" fontFamily="JetBrains Mono" fontSize="8" fill="rgba(255,170,0,0.6)">Wi-Fi MQTT</text>
        </svg>
      </div>

      {/* Mounting guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-fg-cyan/25 bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-fg-cyan">🌧️ Outside Box (Exposed)</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {['HC-SR04 — mount facing down into water channel, seal with silicone', 'YL-83 Rain — mount on slanted bracket on box top lid, facing sky', 'YF-S201 — inline on drain pipe fitting, use pipe thread adapter', 'Servo motor — attach to drain gate flap with mechanical arm bracket'].map(t => (
              <div key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-fg-cyan mt-0.5">▸</span>{t}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-fg-amber/25 bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-fg-amber">🔒 Inside Box (Protected)</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {['Raspberry Pi 5 — M2.5 standoff screws, top-left area, near Wi-Fi antenna', 'ESP32 — on breadboard, center, all wire runs short', 'L298N driver — right of breadboard, close to servo power', 'OLED display — panel-mounted on box front face, I2C wires inside', 'Buzzer — panel-mounted hole, front face, one wire pair to ESP32'].map(t => (
              <div key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-fg-amber mt-0.5">▸</span>{t}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Build Steps ──────────────────────────────────────────────────────────────
function BuildStepsTab() {
  const [open, setOpen] = useState<string | null>('01');
  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      {buildSteps.map((step, i) => {
        const isOpen = open === step.number;
        return (
          <motion.div key={step.number} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
            className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : step.number)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm border-2"
                style={{ borderColor: step.phaseColor, color: step.phaseColor, background: `${step.phaseColor}12` }}>
                {step.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground">{step.phase}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{step.title}</p>
              </div>
              {isOpen ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }}
                  className="overflow-hidden border-t border-border/40">
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <div className="space-y-1.5">
                      {step.tasks.map((t, ti) => (
                        <div key={ti} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: step.phaseColor }}>▸</span>{t}
                        </div>
                      ))}
                    </div>
                    {step.code && (
                      <div className="code-block text-[11px] mt-2">
                        <pre className="whitespace-pre-wrap">{step.code.content}</pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Pin Map ──────────────────────────────────────────────────────────────────
const PIN_CLASSES: Record<string, string> = {
  gpio: 'bg-fg-cyan/10 text-fg-cyan',
  adc:  'bg-fg-green/10 text-fg-green',
  i2c:  'bg-fg-purple/10 text-fg-purple',
  pwm:  'bg-fg-red/10 text-fg-red',
  uart: 'bg-fg-amber/10 text-fg-amber',
  pwr:  'bg-muted text-muted-foreground',
};

function PinMapTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase">ESP32 WROOM-32</p>
          <CardTitle className="text-base">GPIO Pin Mapping</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40"><TableHead className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">GPIO</TableHead><TableHead className="font-mono text-[10px]">Component</TableHead><TableHead className="font-mono text-[10px]">Type</TableHead><TableHead className="font-mono text-[10px]">Voltage</TableHead><TableHead className="font-mono text-[10px]">Notes</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {pinMappings.map(p => (
                <TableRow key={p.gpio} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-fg-amber text-sm">{p.gpio}</TableCell>
                  <TableCell className="text-sm text-foreground">{p.component}</TableCell>
                  <TableCell><span className={cn('text-[10px] font-mono font-bold px-2 py-0.5 rounded', PIN_CLASSES[p.typeClass] || 'bg-muted text-muted-foreground')}>{p.type}</span></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.voltage}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <p className="text-[9px] font-mono tracking-[3px] text-muted-foreground uppercase">RASPBERRY PI 5</p>
          <CardTitle className="text-base">Software Port Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40"><TableHead className="font-mono text-[10px]">Service</TableHead><TableHead className="font-mono text-[10px]">Port / Path</TableHead><TableHead className="font-mono text-[10px]">Protocol</TableHead><TableHead className="font-mono text-[10px]">Purpose</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {softwarePorts.map(p => (
                <TableRow key={p.service} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="text-sm font-medium text-foreground">{p.service}</TableCell>
                  <TableCell className="font-mono text-sm font-bold text-fg-amber">{p.port}</TableCell>
                  <TableCell><span className="text-[10px] font-mono bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/20 px-2 py-0.5 rounded">{p.protocol}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Wiring warnings */}
      <div className="rounded-xl border border-fg-amber/25 bg-fg-amber/5 p-4 space-y-2">
        <p className="text-[10px] font-mono font-bold text-fg-amber tracking-widest uppercase">⚠️ Critical Wiring Warnings</p>
        {[
          { color: '#FF4444', text: 'NEVER connect HC-SR04 ECHO directly to ESP32 GPIO — it outputs 5V which WILL damage ESP32. Always use a voltage divider (1kΩ + 2kΩ).' },
          { color: '#FF4444', text: 'NEVER power the servo from ESP32 3.3V pin — it draws 500mA+ and will brownout the ESP32. Use a separate 5V supply.' },
          { color: '#FFAA00', text: 'GPIO 34, 35, 36, 39 are INPUT-ONLY on ESP32. Do not connect output devices to these pins.' },
          { color: '#FFAA00', text: 'Common ground is essential — all power supplies (ESP32, servo, Pi 5) must share a common GND connection.' },
        ].map((w, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="flex-shrink-0 mt-0.5" style={{ color: w.color }}>▸</span>
            <span className="text-muted-foreground">{w.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Architecture Page ───────────────────────────────────────────────────
export default function ArchitecturePage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Cpu className="text-fg-cyan" size={22}/> Hardware Architecture
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Complete system design — components, wiring, build steps, and pin mapping</p>
      </motion.div>

      <Tabs defaultValue="flow">
        <TabsList className="bg-muted/50 border border-border/50 h-auto p-1 flex-wrap gap-1">
          {[
            { value:'flow',     label:'Architecture Flow' },
            { value:'physical', label:'Top-Down View'      },
            { value:'steps',    label:'Build Steps'        },
            { value:'pins',     label:'Pin Map'            },
          ].map(t => (
            <TabsTrigger key={t.value} value={t.value}
              className="data-[state=active]:bg-card data-[state=active]:text-fg-cyan data-[state=active]:border-fg-cyan/30 data-[state=active]:shadow-sm font-mono text-xs tracking-wide border border-transparent">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="flow"     className="mt-4"><ArchFlowTab /></TabsContent>
        <TabsContent value="physical" className="mt-4"><PhysicalTab /></TabsContent>
        <TabsContent value="steps"    className="mt-4"><BuildStepsTab /></TabsContent>
        <TabsContent value="pins"     className="mt-4"><PinMapTab /></TabsContent>
      </Tabs>
    </div>
  );
}
