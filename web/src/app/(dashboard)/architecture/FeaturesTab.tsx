"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  blockageStates,
  preventiveStates,
  riskClasses,
  trendReadings,
} from "@/data/featureData";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Brain,
  Lightbulb,
  Play,
  RotateCcw,
  Settings,
  Smartphone,
  TrendingUp,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";

function FeasibilityNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 p-4 rounded-xl border border-fg-amber/30 bg-fg-amber/5 flex gap-3 text-left">
      <Lightbulb className="text-fg-amber shrink-0 mt-0.5" size={18} />
      <div>
        <h4 className="text-[11px] font-bold font-mono tracking-widest text-fg-amber mb-1 uppercase">
          {title}
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export function FeaturesTab() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6">
      {/* ─── 1. ML Prediction Engine ─── */}
      <MLPredictionFeature />

      {/* ─── 2. Proportional Drain Control ─── */}
      <ProportionalFeature />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* ─── 3. Blockage Detection ─── */}
        <BlockageFeature />

        {/* ─── 4. Early Preventive Action ─── */}
        <PreventiveFeature />
      </div>
    </div>
  );
}

function MLPredictionFeature() {
  const [activeRisk, setActiveRisk] = useState(riskClasses[0]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 border-b border-border/50 pb-3">
        <div className="w-10 h-10 rounded-xl bg-fg-purple/10 flex items-center justify-center border border-fg-purple/30 text-fg-purple">
          <Brain size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            1. ML Flood Prediction
          </h3>
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            SCIKIT-LEARN DECISION TREE
          </p>
        </div>
      </div>

      <Card className="border-2 border-border/50 overflow-hidden bg-card/60">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Controls */}
          <div className="md:col-span-5 p-6 border-r border-border/50 bg-muted/10 space-y-4">
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Select Risk Input
            </p>
            <div className="flex flex-col gap-3">
              {riskClasses.map((rc) => (
                <button
                  key={rc.level}
                  onClick={() => setActiveRisk(rc)}
                  className={cn(
                    "flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all text-left",
                    activeRisk.level === rc.level
                      ? "shadow-md scale-[1.02]"
                      : "border-transparent bg-background/50 hover:bg-muted/50",
                  )}
                  style={{
                    borderColor:
                      activeRisk.level === rc.level ? rc.color : undefined,
                    background:
                      activeRisk.level === rc.level ? rc.bgColor : undefined,
                  }}
                >
                  <div>
                    <p
                      className="font-bold font-mono text-lg"
                      style={{ color: rc.color }}
                    >
                      {rc.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Water: {rc.waterRange}
                    </p>
                  </div>
                  {activeRisk.level === rc.level && (
                    <Play
                      fill={rc.color}
                      className="text-transparent"
                      size={16}
                    />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-4 bg-background p-3 rounded-lg border border-border/50">
              <span className="font-bold text-foreground">Note:</span> Risk is
              predicted using a Decision Tree model running on Raspberry Pi 5.
            </p>
          </div>

          {/* Visualization */}
          <div className="md:col-span-7 p-8 flex flex-col justify-center relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRisk.level}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div
                    className="inline-flex px-6 py-2 rounded-full font-mono text-lg font-bold border-2 animate-pulse shadow-lg"
                    style={{
                      color: activeRisk.color,
                      borderColor: activeRisk.color,
                      backgroundColor: activeRisk.bgColor,
                    }}
                  >
                    PREDICTION: {activeRisk.label}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {activeRisk.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl border bg-background p-5 shadow-sm text-center">
                    <p className="text-sm font-mono tracking-widest text-muted-foreground mb-3">
                      COMMAND SENT
                    </p>
                    <div className="text-4xl font-bold font-mono tracking-tighter text-foreground">
                      {activeRisk.gateAngle}°
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-2">
                      <Settings size={14} className="text-fg-cyan" /> Gate Servo
                      Angle
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-5 shadow-sm">
                    <p className="text-sm font-mono tracking-widest text-muted-foreground mb-3 text-center">
                      SYSTEM ACTIONS
                    </p>
                    <ul className="space-y-2">
                      {activeRisk.actions.map((a) => (
                        <li key={a} className="flex items-center gap-2 text-sm">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: activeRisk.color }}
                          />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(activeRisk.telegram || activeRisk.buzzer) && (
                  <div className="flex gap-4 justify-center">
                    {activeRisk.buzzer && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fg-red/10 text-fg-red border border-fg-red/30 font-bold text-sm animate-pulse">
                        <Bell size={16} /> Buzzer Active
                      </span>
                    )}
                    {activeRisk.telegram && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-fg-cyan/10 text-fg-cyan border border-fg-cyan/30 font-bold text-sm">
                        <Smartphone size={16} /> Telegram Dispatched
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProportionalFeature() {
  const [sliderVal, setSliderVal] = useState(60);
  const calculatedAngle = Math.round((sliderVal / 100) * 180);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 border-b border-border/50 pb-3">
        <div className="w-10 h-10 rounded-xl bg-fg-cyan/10 flex items-center justify-center border border-fg-cyan/30 text-fg-cyan">
          <Waves size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            2. Proportional Drain Control
          </h3>
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            DYNAMIC SERVO ANGLE
          </p>
        </div>
      </div>

      <Card className="border-2 border-border/50 bg-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Interactive UI */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-border/50 space-y-8 flex flex-col justify-center">
            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-base font-bold text-foreground">
                  Simulate Water Level
                </span>
                <span className="text-3xl font-mono text-fg-cyan font-bold">
                  {sliderVal}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full appearance-none h-3 rounded-full bg-muted/60 outline-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fg-cyan [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,200,255,0.5)]"
              />

              <div className="flex justify-between mt-3 px-1 text-sm text-muted-foreground font-mono">
                <span>0% (Empty)</span>
                <span>100% (Full)</span>
              </div>
            </div>

            <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 font-mono text-center">
              <div className="text-sm text-muted-foreground mb-2 tracking-widest uppercase">
                Equation
              </div>
              <div className="text-lg text-foreground">
                Angle = ({sliderVal}% ÷ 100) × 180°
              </div>
              <div className="text-2xl font-bold text-fg-cyan mt-2">
                = {calculatedAngle}°
              </div>
            </div>
          </div>

          {/* Visual animation */}
          <div className="p-8 flex items-center justify-center relative min-h-[300px] bg-gradient-to-br from-background to-muted/20">
            <div className="relative w-64 h-64 border-4 border-border/60 rounded-full flex items-center justify-center overflow-hidden shadow-xl bg-card">
              {/* Gate visual */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <motion.div
                  className="w-full h-1 bg-fg-amber"
                  animate={{ rotate: calculatedAngle }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                />
                <div className="absolute w-8 h-8 rounded-full bg-background border-4 border-fg-amber z-20" />
              </div>

              {/* Liquid fill */}
              <div
                className="absolute bottom-0 inset-x-0 bg-fg-cyan/20 backdrop-blur-sm z-0"
                style={{
                  height: `${sliderVal}%`,
                  transition: "height 0.3s ease-out",
                }}
              />

              {/* Overlay text */}
              <div className="absolute top-8 font-mono text-sm tracking-widest text-muted-foreground font-bold z-20">
                GATE POSITION
              </div>

              {/* Angle scale marks */}
              <div className="absolute inset-2 border-2 border-dashed border-border/40 rounded-full z-0 opacity-50" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BlockageFeature() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 1) {
      // 5s timer simulation (shortened for demo)
      timer = setTimeout(() => setStep(2), 2500);
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 1500);
    } else if (step === 3) {
      timer = setTimeout(() => setStep(4), 2000);
    } else if (step === 4) {
      timer = setTimeout(() => setStep(0), 4000); // Loop back
    }
    return () => clearTimeout(timer);
  }, [step]);

  const activeState = blockageStates[step];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fg-red/10 flex items-center justify-center border border-fg-red/30 text-fg-red">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              3. Blockage Detection
            </h3>
            <p className="text-sm text-muted-foreground font-mono tracking-wide">
              AUTO-FLUSH LOGIC
            </p>
          </div>
        </div>
        <button
          onClick={() => setStep(0)}
          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          title="Restart Demo"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <Card className="border-2 border-border/50 bg-card overflow-hidden h-[360px] flex flex-col justify-center relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: `radial-gradient(circle at center, ${activeState.color} 0%, transparent 60%)`,
          }}
        />

        <CardContent className="p-8 text-center space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeState.id}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div
                className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4"
                style={{
                  backgroundColor: `${activeState.color}15`,
                  borderColor: `${activeState.color}40`,
                  color: activeState.color,
                  boxShadow: `0 0 30px ${activeState.color}20`,
                }}
              >
                {step === 3 ? (
                  <motion.div
                    animate={{ rotate: [0, -45, 45, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    ⚙️
                  </motion.div>
                ) : (
                  activeState.icon
                )}
              </div>

              <div>
                <p
                  className="text-lg font-mono font-bold tracking-widest px-4 py-1.5 rounded-full inline-block mb-3 border-2"
                  style={{
                    color: activeState.color,
                    borderColor: activeState.color,
                    backgroundColor: `${activeState.color}10`,
                  }}
                >
                  {activeState.label}
                </p>
                <p className="text-base text-muted-foreground max-w-[280px] mx-auto min-h-[48px]">
                  {activeState.description}
                </p>
              </div>

              {/* Progress track */}
              <div className="flex gap-2 justify-center max-w-[200px] mx-auto mt-6">
                {blockageStates.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
                  >
                    {i <= step && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: i === step ? 0.3 : 0 }}
                        className="h-full bg-foreground"
                        style={{ backgroundColor: activeState.color }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <FeasibilityNote title="Viability & Maintenance Context">
        Solid waste (polythene, plastic bottles) is the leading cause of
        waterlogging in Dhaka's street drains. When a gate opens but water
        doesn't flow out, the system detects a jam. Instead of just "reading
        data", it actively pulses the motor to dislodge debris. This{" "}
        <strong>Active Mechanical Flush</strong> is highly practical and
        significantly reduces emergency deployments for municipal maintenance
        crews, turning a passive sensor into an active robotic solver.
      </FeasibilityNote>
    </div>
  );
}

function PreventiveFeature() {
  const [activeStage, setActiveStage] = useState(0);

  // Cycle through states
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((s) => (s + 1) % preventiveStates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const st = preventiveStates[activeStage];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border/50 pb-3">
        <div className="w-10 h-10 rounded-xl bg-fg-amber/10 flex items-center justify-center border border-fg-amber/30 text-fg-amber">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            4. ML-Driven Preventive Action
          </h3>
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            ACTIVE ML FORECASTING
          </p>
        </div>
      </div>

      <Card className="border-2 border-border/50 bg-card overflow-hidden h-[360px] flex flex-col justify-between">
        {/* Chart Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-mono tracking-widest text-muted-foreground">
              LAST 10 READINGS
            </span>
            <span
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-colors duration-500",
                activeStage >= 1
                  ? "bg-fg-amber/20 text-fg-amber border-fg-amber/50"
                  : "bg-muted text-muted-foreground border-border",
              )}
            >
              TREND: {activeStage >= 1 ? "RISING" : "STABLE"}
            </span>
          </div>

          <div className="h-32 relative w-full flex items-end gap-1.5 justify-between">
            {/* Very simple visual chart representation */}
            {trendReadings.map((tr, i) => {
              // If stage 0, static. If stage >= 1, show rising slope
              const hVal = activeStage === 0 ? 30 + (i % 3) * 5 : tr.water;

              return (
                <div
                  key={tr.index}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-popover border border-border text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                    Rain: {activeStage === 0 ? 20 : tr.rain} <br />
                    Water: {hVal}
                  </div>
                  {/* Rain dot */}
                  <div
                    className="w-1.5 rounded-full bg-fg-cyan/60"
                    style={{
                      height: activeStage === 0 ? "10px" : `${tr.rain / 2}px`,
                      marginBottom: "4px",
                    }}
                  />
                  {/* Water bar */}
                  <div
                    className="w-full bg-fg-amber/80 rounded-t-sm transition-all duration-1000 ease-in-out"
                    style={{ height: `${hVal * 1.2}px` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-6 border-t border-border/50 bg-muted/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={st.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm border border-border/50 bg-background"
                style={{
                  color: st.color,
                  boxShadow: `0 4px 12px ${st.color}20`,
                }}
              >
                {st.icon}
              </div>
              <div>
                <h4 className="font-bold text-base" style={{ color: st.color }}>
                  {st.label}
                </h4>
                <p className="text-sm text-muted-foreground leading-snug">
                  {st.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
      <FeasibilityNote title="Academic Viability & Active ML">
        By combining Feature 1's ML with time-series state analysis, the system
        predicts blockages/floods <em>before</em> they hit critical levels. For
        Dhaka's dense streets, pre-opening gates 50% based on aggressive ML rain
        forecasts prevents waterlogging from even starting. This{" "}
        <strong>Active ML</strong> approach proves the system does not passively
        wait for danger—it takes autonomous, intelligent pre-emptive action.
      </FeasibilityNote>
    </div>
  );
}
