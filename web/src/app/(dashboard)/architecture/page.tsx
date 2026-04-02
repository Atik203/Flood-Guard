'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sensors, outputs, esp32Chips, esp32LocalOutputs, piChips, pinMappings, softwarePorts, buildSteps } from '@/data/mockArchitectureData';
import { cn } from '@/lib/utils';
import { FeaturesTab } from './FeaturesTab';


// ─── Architecture Flow ────────────────────────────────────────────────────────
function ArchFlowTab() {
  return (
    <div className="flex flex-col items-center gap-0 py-8 max-w-4xl mx-auto">

      {/* Layer 1: Sensors */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} className="w-full">
        <p className="text-base font-mono tracking-[4px] text-muted-foreground uppercase mb-6">① Sensor Layer</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sensors.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.06 }}
              className="relative rounded-2xl border border-fg-cyan/25 bg-card p-6 text-center hover:border-fg-cyan/40 hover:shadow-[0_0_16px_rgba(0,200,255,0.15)] transition-all cursor-pointer group">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-fg-cyan rounded-t-2xl shadow-[0_0_8px_#00C8FF]" />
              <div className="text-5xl mb-3">{s.icon}</div>
              <p className="text-lg font-mono font-bold text-fg-cyan leading-tight mb-1">{s.name}</p>
              <p className="text-base text-muted-foreground">{s.model}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {s.pins.map(p => <span key={p} className="text-sm font-mono bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/20 px-2 py-0.5 rounded-lg">{p}</span>)}
              </div>
              {/* Hover tooltip */}
              <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-4 px-5 py-4 rounded-xl bg-popover border border-border/50 shadow-xl text-base font-mono text-muted-foreground w-64 text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {s.description}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Arrow 1 */}
      <div className="flex flex-col items-center py-6 gap-2">
        <div className="w-0.5 h-8 bg-gradient-to-b from-fg-cyan to-transparent" />
        <span className="text-sm font-mono px-5 py-2 rounded-full bg-fg-cyan/8 text-fg-cyan border border-fg-cyan/20 tracking-widest animate-[blink_1.5s_ease-in-out_infinite]">DIRECT WIRE · GPIO/ADC</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-fg-cyan/30" />
      </div>

      {/* ESP32 */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="w-full">
        <p className="text-base font-mono tracking-[4px] text-muted-foreground uppercase mb-6">② ESP32 — Edge Controller</p>
        <div className="relative rounded-3xl border-2 border-fg-cyan/45 bg-card p-8 shadow-[0_0_24px_rgba(0,200,255,0.08)]">
          <p className="absolute -top-[14px] left-6 text-sm font-mono tracking-[3px] text-fg-cyan bg-background px-3 font-bold">EDGE MICROCONTROLLER</p>
          <div className="flex items-start gap-6">
            <div className="text-7xl shrink-0">🔲</div>
            <div>
              <p className="font-mono font-bold text-2xl text-fg-cyan tracking-wide mb-2">ESP32 WROOM-32</p>
              <p className="text-base font-mono text-muted-foreground mb-4 leading-relaxed">Dual-core 240MHz · 520KB SRAM · 18× ADC · 34 GPIO</p>
              <div className="flex flex-wrap gap-2.5">
                {esp32Chips.map(c => <span key={c} className="text-sm font-mono bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/25 px-3 py-1 rounded-full">{c}</span>)}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-fg-cyan/12">
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">Controls directly (no Pi needed)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {esp32LocalOutputs.map(o => (
                <div key={o.label} className="rounded-xl p-4 text-center border transition-colors hover:bg-muted/10" style={{ background: `${o.color}05`, borderColor: `${o.color}25` }}>
                  <div className="text-3xl mb-2">{o.icon}</div>
                  <p className="text-base font-mono font-bold mb-1" style={{ color: o.color }}>{o.label}</p>
                  <p className="text-sm font-mono text-muted-foreground">{o.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Arrow 2 */}
      <div className="flex flex-col items-center py-6 gap-2">
        <div className="w-0.5 h-8 bg-gradient-to-b from-fg-amber to-transparent" />
        <span className="text-sm font-mono px-5 py-2 rounded-full bg-fg-amber/8 text-fg-amber border border-fg-amber/20 tracking-widest animate-[blink_1.5s_ease-in-out_infinite]">Wi-Fi · MQTT PROTOCOL · BIDIRECTIONAL</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-fg-amber/30" />
      </div>

      {/* Raspberry Pi 5 */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} className="w-full">
        <p className="text-base font-mono tracking-[4px] text-muted-foreground uppercase mb-6">③ Raspberry Pi 5 — Brain</p>
        <div className="relative rounded-3xl border-2 border-fg-amber/45 bg-gradient-to-br from-fg-amber/5 to-card p-8 shadow-[0_0_24px_rgba(255,170,0,0.08)]">
          <p className="absolute -top-[14px] left-6 text-sm font-mono tracking-[3px] text-fg-amber bg-background px-3 font-bold">CENTRAL BRAIN — ML + DASHBOARD</p>
          <div className="flex items-start gap-6">
            <div className="text-7xl shrink-0">🍓</div>
            <div className="flex-1">
              <p className="font-mono font-bold text-2xl text-fg-amber tracking-wide mb-2">RASPBERRY PI 5</p>
              <p className="text-base font-mono text-muted-foreground mb-4 leading-relaxed">BCM2712 · 4× Cortex-A76 @ 2.4GHz · 8GB LPDDR4X</p>
              <div className="flex flex-wrap gap-2.5">
                {piChips.map(c => <span key={c} className="text-sm font-mono bg-fg-amber/10 text-fg-amber border border-fg-amber/25 px-3 py-1 rounded-full">{c}</span>)}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-fg-amber/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5 bg-fg-purple/5 border border-fg-purple/20">
              <p className="text-base font-mono font-bold text-fg-purple mb-2">ML PREDICTION ENGINE</p>
              <p className="text-base text-muted-foreground leading-relaxed">Decision Tree on 4 features → LOW/MED/HIGH/CRITICAL in &lt;2ms</p>
            </div>
            <div className="rounded-xl p-5 bg-fg-green/5 border border-fg-green/20">
              <p className="text-base font-mono font-bold text-fg-green mb-2">COMMAND SENDER</p>
              <p className="text-base text-muted-foreground leading-relaxed">Publishes OPEN/CLOSE back to ESP32 via MQTT after prediction</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Arrow 3 */}
      <div className="flex flex-col items-center py-6 gap-2">
        <div className="w-0.5 h-8 bg-gradient-to-b from-fg-green to-transparent" />
        <span className="text-sm font-mono px-5 py-2 rounded-full bg-fg-green/8 text-fg-green border border-fg-green/20 tracking-widest animate-[blink_1.5s_ease-in-out_infinite]">HTTP · TELEGRAM · SQLITE</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-fg-green/30" />
      </div>

      {/* Output layer */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} className="w-full">
        <p className="text-base font-mono tracking-[4px] text-muted-foreground uppercase mb-6">④ Output Layer</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {outputs.map((o, i) => (
            <motion.div key={o.name} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.55+i*0.06 }}
              className="rounded-2xl border-2 bg-card p-6 text-center shadow-sm" style={{ borderColor: `${o.color}35` }}>
              <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl" style={{ background: o.color }} />
              <div className="text-5xl mb-3">{o.icon}</div>
              <p className="text-lg font-mono font-bold mb-2" style={{ color: o.color }}>{o.name}</p>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">{o.sub}</p>
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
    <div className="space-y-10">
      {/* Component Map */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Enclosure */}
        <div className="xl:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-fg-amber" /> Protected Enclosure
            </h3>
            <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase hidden sm:block">Project Box</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 rounded-3xl border-2 border-dashed border-border/50 bg-muted/20 relative">
            <div className="absolute inset-0 bg-fg-amber/5 pointer-events-none rounded-3xl" />
            {COMPS_INSIDE.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                className={`flex items-start gap-5 p-5 rounded-2xl border ${c.border} bg-card hover:-translate-y-1 transition-transform shadow-sm relative z-10`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${c.bg}`}>{c.icon}</div>
                <div>
                  <p className={`font-mono font-bold text-lg mb-1 ${c.color}`}>{c.name}</p>
                  <p className="text-base text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* External */}
        <div className="xl:col-span-4 space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-fg-cyan" /> Exposed Environment
            </h3>
            <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase hidden sm:block">External</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
             {COMPS_OUTSIDE.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${c.border} bg-card hover:-translate-y-1 transition-transform shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${c.bg}`}>{c.icon}</div>
                <div>
                  <p className={`font-mono font-bold text-lg leading-none mb-1.5 ${c.color}`}>{c.name}</p>
                  <p className="text-base text-muted-foreground leading-tight">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mounting guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        <Card className="border-fg-cyan/25 bg-card/60">
          <CardHeader className="pb-4 border-b border-border/40 mb-4"><CardTitle className="text-lg text-fg-cyan font-bold flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-fg-cyan" /> Outside Box Guidelines</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              'Mount HC-SR04 facing down into channel, seal edges with silicone.',
              'YL-83 Rain sensor on slanted bracket facing sky on lid.',
              'YF-S201 flow meter inline on drain pipe fitting.',
              'Servo attached to drain gate flap via mechanical arm.'
            ].map(t => (
              <div key={t} className="flex items-start gap-4 text-base text-muted-foreground">
                <span className="text-fg-cyan mt-1 text-xl shrink-0">▸</span><span className="leading-relaxed">{t}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-fg-amber/25 bg-card/60">
          <CardHeader className="pb-4 border-b border-border/40 mb-4"><CardTitle className="text-lg text-fg-amber font-bold flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-fg-amber" /> Inside Box Guidelines</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              'Raspberry Pi 5 on M2.5 standoffs near Wi-Fi antenna zone.',
              'ESP32 centered on breadboard, bridging local sensors.',
              'L298N driver isolated from logic circuits to reduce EMI.',
              'OLED display and active buzzer panel-mounted on front face.'
            ].map(t => (
              <div key={t} className="flex items-start gap-4 text-base text-muted-foreground">
                <span className="text-fg-amber mt-1 text-xl shrink-0">▸</span><span className="leading-relaxed">{t}</span>
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
    <div className="space-y-4 max-w-4xl mx-auto">
      {buildSteps.map((step, i) => {
        const isOpen = open === step.number;
        return (
          <motion.div key={step.number} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
            className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : step.number)}
              className="w-full flex items-center gap-5 p-6 text-left hover:bg-muted/30 transition-colors">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-mono font-bold text-xl border-[3px]"
                style={{ borderColor: step.phaseColor, color: step.phaseColor, background: `${step.phaseColor}12` }}>
                {step.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-1">{step.phase}</p>
                <p className="text-xl font-semibold text-foreground">{step.title}</p>
              </div>
              {isOpen ? <ChevronUp size={24} className="text-muted-foreground shrink-0" /> : <ChevronDown size={24} className="text-muted-foreground shrink-0" />}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }}
                  className="overflow-hidden border-t border-border/40">
                  <div className="p-6 space-y-5">
                    <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
                    <div className="space-y-3">
                      {step.tasks.map((t, ti) => (
                        <div key={ti} className="flex items-start gap-3 text-base text-foreground">
                          <span className="mt-1 shrink-0 text-xl font-bold" style={{ color: step.phaseColor }}>▸</span>{t}
                        </div>
                      ))}
                    </div>
                    {step.code && (
                      <div className="code-block text-base p-4 mt-4 bg-muted/30 rounded-xl overflow-x-auto border border-border/40">
                        <pre className="whitespace-pre-wrap font-mono">{step.code.content}</pre>
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
  gpio: 'bg-fg-cyan/10 text-fg-cyan border-fg-cyan/30',
  adc:  'bg-fg-green/10 text-fg-green border-fg-green/30',
  i2c:  'bg-fg-purple/10 text-fg-purple border-fg-purple/30',
  pwm:  'bg-fg-red/10 text-fg-red border-fg-red/30',
  uart: 'bg-fg-amber/10 text-fg-amber border-fg-amber/30',
  pwr:  'bg-muted text-muted-foreground border-border/50',
};

function PinMapTab() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <Card className="border-border/50 bg-card overflow-hidden rounded-2xl">
        <CardHeader className="p-6 pb-4 border-b border-border/30 bg-muted/10">
          <p className="text-base font-mono tracking-[4px] text-muted-foreground uppercase mb-1">ESP32 WROOM-32</p>
          <CardTitle className="text-2xl font-bold">GPIO Pin Mapping</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/15">
              <TableRow className="border-border/40">
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">GPIO</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Component</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Type</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Voltage</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pinMappings.map(p => (
                <TableRow key={p.gpio} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-fg-amber text-lg py-5 px-6">{p.gpio}</TableCell>
                  <TableCell className="text-lg font-semibold text-foreground py-5 px-6">{p.component}</TableCell>
                  <TableCell className="py-5 px-6"><span className={cn('text-sm font-mono font-bold px-3 py-1.5 rounded-lg border', PIN_CLASSES[p.typeClass] || 'bg-muted text-muted-foreground')}>{p.type}</span></TableCell>
                  <TableCell className="font-mono text-base text-muted-foreground py-5 px-6">{p.voltage}</TableCell>
                  <TableCell className="text-base text-muted-foreground leading-relaxed py-5 px-6">{p.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card overflow-hidden rounded-2xl">
        <CardHeader className="p-6 pb-4 border-b border-border/30 bg-muted/10">
          <p className="text-base font-mono tracking-[4px] text-muted-foreground uppercase mb-1">RASPBERRY PI 5</p>
          <CardTitle className="text-2xl font-bold">Software Port Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/15">
              <TableRow className="border-border/40">
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Service</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Port / Path</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Protocol</TableHead>
                <TableHead className="font-mono text-xs tracking-widest uppercase text-muted-foreground py-4 px-6">Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {softwarePorts.map(p => (
                <TableRow key={p.service} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="text-lg font-bold text-foreground py-5 px-6">{p.service}</TableCell>
                  <TableCell className="font-mono text-lg font-bold text-fg-amber py-5 px-6">{p.port}</TableCell>
                  <TableCell className="py-5 px-6"><span className="text-sm font-mono bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/25 px-3 py-1.5 rounded-lg">{p.protocol}</span></TableCell>
                  <TableCell className="text-base text-muted-foreground py-5 px-6 leading-relaxed">{p.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Wiring warnings */}
      <div className="rounded-2xl border-2 border-fg-amber/30 bg-fg-amber/5 p-6 space-y-4 shadow-xl">
        <p className="text-lg font-mono font-bold text-fg-amber tracking-widest uppercase flex items-center gap-3"><span className="text-2xl">⚠️</span> Critical Wiring Warnings</p>
        <div className="space-y-4">
          {[
            { color: '#FF4444', text: 'NEVER connect HC-SR04 ECHO directly to ESP32 GPIO — it outputs 5V which WILL damage ESP32. Always use a voltage divider (1kΩ + 2kΩ).' },
            { color: '#FF4444', text: 'NEVER power the servo from ESP32 3.3V pin — it draws 500mA+ and will brownout the ESP32. Use a separate 5V supply.' },
            { color: '#FFAA00', text: 'GPIO 34, 35, 36, 39 are INPUT-ONLY on ESP32. Do not connect output devices to these pins.' },
            { color: '#FFAA00', text: 'Common ground is essential — all power supplies (ESP32, servo, Pi 5) must share a common GND connection.' },
          ].map((w, i) => (
            <div key={i} className="flex items-start gap-4 text-base font-medium">
              <span className="shrink-0 mt-0.5 text-2xl" style={{ color: w.color }}>▸</span>
              <span className="text-foreground leading-relaxed">{w.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Architecture Page ───────────────────────────────────────────────────
export default function ArchitecturePage() {
  return (
    <div className="p-6 md:p-10 space-y-10 min-h-screen">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }} className="border-b border-border/40 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
          <Cpu className="text-fg-cyan" size={36}/> Hardware Architecture
        </h1>
        <p className="text-lg text-muted-foreground mt-3 leading-relaxed">Complete system design — components, wiring, build steps, and pin mapping</p>
      </motion.div>

      <Tabs defaultValue="features">
        <TabsList className="bg-muted/50 border border-border/50 h-auto p-1.5 flex-wrap gap-2 rounded-xl">
          {[
            { value:'features', label:'Features (Prototype)' },
            { value:'flow',     label:'Architecture Flow' },
            { value:'physical', label:'Component Map'      },
            { value:'steps',    label:'Build Steps'        },
            { value:'pins',     label:'Pin Map'            },
          ].map(t => (
            <TabsTrigger key={t.value} value={t.value}
              className="data-[state=active]:bg-card data-[state=active]:text-fg-cyan data-[state=active]:border-fg-cyan/30 data-[state=active]:shadow-md font-mono text-base tracking-wide border border-transparent rounded-lg px-6 py-3 transition-all">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-8">
          <TabsContent value="features" className="m-0"><FeaturesTab /></TabsContent>
          <TabsContent value="flow"     className="m-0"><ArchFlowTab /></TabsContent>
          <TabsContent value="physical" className="m-0"><PhysicalTab /></TabsContent>
          <TabsContent value="steps"    className="m-0"><BuildStepsTab /></TabsContent>
          <TabsContent value="pins"     className="m-0"><PinMapTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
