import { useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RotateCcw, Volume2, VolumeX, Vibrate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tasbihOptions = [
  { label: "سبحان الله", target: 33 },
  { label: "الحمد لله", target: 33 },
  { label: "الله أكبر", target: 34 },
  { label: "لا إله إلا الله", target: 100 },
  { label: "أستغفر الله", target: 100 },
  { label: "لا حول ولا قوة إلا بالله", target: 100 },
  { label: "سبحان الله وبحمده", target: 100 },
  { label: "سبحان الله العظيم", target: 100 },
];

const clickSoundUrl = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export default function TasbihPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [count, setCount] = useLocalStorage("tasbih-count", 0);
  const [totalCount, setTotalCount] = useLocalStorage("tasbih-total", 0);
  const [soundEnabled, setSoundEnabled] = useLocalStorage("tasbih-sound", true);

  const selected = tasbihOptions[selectedIndex];

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch {}
  }, [soundEnabled]);

  const vibrate = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    setTotalCount((prev) => prev + 1);
    playClick();
    vibrate();

    if (next >= selected.target) {
      toast("سبحان الله ✓ أتممت التسبيح", { description: `${selected.label} — ${selected.target} مرة` });
    }
  };

  const reset = () => {
    setCount(0);
    toast("تم إعادة العداد");
  };

  const switchDhikr = (index: number) => {
    setSelectedIndex(index);
    setCount(0);
  };

  const progress = Math.min((count / selected.target) * 100, 100);
  const done = count >= selected.target;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-title">📿 السبحة الإلكترونية</h1>

      {/* Dhikr selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
        {tasbihOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => switchDhikr(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === selectedIndex
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main counter area */}
      <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
        {/* Circular progress + click area */}
        <button
          onClick={increment}
          className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all active:scale-95 select-none ${
            done ? "opacity-70" : ""
          }`}
          style={{
            background: `conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%)`,
          }}
        >
          <div className="absolute inset-2 rounded-full bg-card flex flex-col items-center justify-center shadow-inner">
            <span className="font-amiri text-4xl font-bold text-foreground">{count}</span>
            <span className="text-sm text-muted-foreground mt-1">/ {selected.target}</span>
            <span className="font-amiri text-lg text-primary mt-2">{selected.label}</span>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={reset} title="إعادة العداد">
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        {/* Total stats */}
        <div className="glass-card p-4 text-center w-full">
          <p className="text-sm text-muted-foreground">إجمالي التسبيحات</p>
          <p className="text-2xl font-bold text-primary">{totalCount.toLocaleString("ar-EG")}</p>
        </div>
      </div>
    </div>
  );
}
