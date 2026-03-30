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

// ─── Component Map ────────────────────────────────────────────────────────────
function PhysicalTab() {
  const COMPS_INSIDE = [
    { name: 'Raspberry Pi 5', icon: '🍓', color: 'text-fg-amber', bg: 'bg-fg-amber/10', border: 'border-fg-amber/30', desc: 'Central Brain (ML + API + Web)' },
    { name: 'ESP32 WROOM-32', icon: '🔲', color: 'text-fg-cyan', bg: 'bg-fg-cyan/10', border: 'border-fg-cyan/30', desc: 'Edge Node (Sensors & MQTT)' },
    { name: 'L298N Driver', icon: '⚡', color: 'text-fg-purple', bg: 'bg-fg-purple/10', border: 'border-fg-purple/30', desc: 'Motor Power Controller' },
    { name: 'Power Supply', icon: '🔌', color: 'text-foreground', bg: 'bg-muted/50', border: 'border-border/60', desc: '5V/3A & 5V/5A step-downs' },
    { name: 'OLED SSD1306', icon: '🖥️', color: 'text-fg-cyan', bg: 'bg-fg-cyan/10', border: 'border-fg-cyan/30', desc: 'Dashboard inside lid' },
    { name: 'Active Buzzer', icon: '🔔', color: 'text-fg-red', bg: 'bg-fg-red/10', border: 'border-fg-red/30', desc: 'Local alarm sound' },
  ];
  
  const COMPS_OUTSIDE = [
    { name: 'HC-SR04', icon: '📡', color: 'text-fg-cyan', bg: 'bg-fg-cyan/10', border: 'border-fg-cyan/30', desc: 'Ultrasonic distance' },
    { name: 'YL-83 Rain', icon: '🌧️', color: 'text-fg-cyan', bg: 'bg-fg-cyan/10', border: 'border-fg-cyan/30', desc: 'Rain drop detection' },
    { name: 'YF-S201 Flow', icon: '💧', color: 'text-fg-cyan', bg: 'bg-fg-cyan/10', border: 'border-fg-cyan/30', desc: 'Flow rate counter' },
    { name: 'DHT22', icon: '🌡️', color: 'text-fg-amber', bg: 'bg-fg-amber/10', border: 'border-fg-amber/30', desc: 'Temperature & Humidity' },
    { name: 'Servo Motor', icon: '⚙️', color: 'text-fg-green', bg: 'bg-fg-green/10', border: 'border-fg-green/30', desc: 'Drain gate actuation' },
  ];

  return (
    <div className="space-y-8">
      {/* Component Map */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Enclosure */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-fg-amber" /> Protected Enclosure
            </h3>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase hidden sm:block">Project Box</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl border-2 border-dashed border-border/50 bg-muted/20 relative">
            <div className="absolute inset-0 bg-fg-amber/[0.01] pointer-events-none rounded-3xl" />
            {COMPS_INSIDE.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                className={`flex items-start gap-4 p-4 rounded-xl border ${c.border} bg-card hover:-translate-y-1 transition-transform shadow-sm relative z-10`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${c.bg}`}>{c.icon}</div>
                <div>
                  <p className={`font-mono font-bold text-sm ${c.color}`}>{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* External */}
        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-fg-cyan" /> Exposed Environment
            </h3>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase hidden sm:block">External</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
             {COMPS_OUTSIDE.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${c.border} bg-card hover:-translate-y-1 transition-transform shadow-sm`}>
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 ${c.bg}`}>{c.icon}</div>
                <div>
                  <p className={`font-mono font-bold text-[13px] ${c.color}`}>{c.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mounting guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <Card className="border-fg-cyan/25 bg-card/60">
          <CardHeader className="pb-3 border-b border-border/40 mb-3"><CardTitle className="text-sm text-fg-cyan font-bold flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-fg-cyan" /> Outside Box Guidelines</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              'Mount HC-SR04 facing down into channel, seal edges with silicone.',
              'YL-83 Rain sensor on slanted bracket facing sky on lid.',
              'YF-S201 flow meter inline on drain pipe fitting.',
              'Servo attached to drain gate flap via mechanical arm.'
            ].map(t => (
              <div key={t} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="text-fg-cyan mt-0.5 shrink-0">▸</span><span className="leading-relaxed">{t}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-fg-amber/25 bg-card/60">
          <CardHeader className="pb-3 border-b border-border/40 mb-3"><CardTitle className="text-sm text-fg-amber font-bold flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-fg-amber" /> Inside Box Guidelines</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              'Raspberry Pi 5 on M2.5 standoffs near Wi-Fi antenna zone.',
              'ESP32 centered on breadboard, bridging local sensors.',
              'L298N driver isolated from logic circuits to reduce EMI.',
              'OLED display and active buzzer panel-mounted on front face.'
            ].map(t => (
              <div key={t} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="text-fg-amber mt-0.5 shrink-0">▸</span><span className="leading-relaxed">{t}</span>
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
            { value:'physical', label:'Component Map'      },
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
