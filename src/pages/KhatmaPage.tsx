import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Plus, Minus, RotateCcw, Gift, Check, PartyPopper, X } from "lucide-react";
import { useState } from "react";

const defaultNames = ["أحمد ربيع", "إسلام أحمد ربيع"];

export default function KhatmaPage() {
  const [juzRead, setJuzRead] = useLocalStorage<number>("khatma-juz", 0);
  const [dedicatedTo, setDedicatedTo] = useLocalStorage<string>("khatma-dedicated", "");
  const [totalGlobal, setTotalGlobal] = useLocalStorage<number>("khatma-global", 0);
  const [customName, setCustomName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const progress = Math.round((juzRead / 30) * 100);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const addJuz = () => {
    if (juzRead >= 30) return;
    const newVal = juzRead + 1;
    setJuzRead(newVal);
    setTotalGlobal((prev) => prev + 1);
    if (newVal === 30) {
      setShowCelebration(true);
    } else {
      showFeedback(`أحسنت! قرأت ${newVal}/30 جزءاً`);
    }
  };

  const removeJuz = () => {
    if (juzRead <= 0) return;
    setJuzRead((prev) => prev - 1);
    setTotalGlobal((prev) => Math.max(0, prev - 1));
  };

  const resetKhatma = () => {
    setJuzRead(0);
    showFeedback("تم إعادة تعيين الختمة");
  };

  const handleDedicate = (name: string) => {
    setDedicatedTo(name);
    showFeedback(`تم إهداء ثواب الختمة إلى ${name} ✓`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-8 mx-4 max-w-md w-full text-center shadow-2xl animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">🎉 مبارك!</h2>
            <p className="text-lg text-muted-foreground mb-2">أتممت ختمة كاملة للقرآن الكريم</p>
            {dedicatedTo && (
              <p className="text-primary font-medium mb-4">
                ثوابها مُهدى إلى: <span className="font-bold">{dedicatedTo}</span> — رحمه الله
              </p>
            )}
            <p className="text-sm text-muted-foreground mb-6">تقبّل الله منك وجعلها في ميزان حسناتك</p>
            <Button onClick={() => setShowCelebration(false)} className="px-8">
              الحمد لله
            </Button>
          </div>
        </div>
      )}

      <h1 className="section-title">
        <Award className="inline-block w-8 h-8 text-primary ml-2" />
        الختمة التفاعلية
      </h1>

      {/* Inline Feedback Banner */}
      {feedbackMessage && (
        <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center text-primary font-medium flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-5 h-5" />
          {feedbackMessage}
        </div>
      )}

      {/* Dedication */}
      <div className="islamic-border p-6 mb-8">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-accent" />
          إهداء ثواب الختمة
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {defaultNames.map((name) => (
            <Button
              key={name}
              variant={dedicatedTo === name ? "default" : "secondary"}
              size="sm"
              onClick={() => handleDedicate(name)}
            >
              {name}
              {dedicatedTo === name && <Check className="w-4 h-4 mr-1" />}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="أو أضف اسماً آخر..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customName.trim()) {
                handleDedicate(customName.trim());
                setCustomName("");
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (customName.trim()) {
                handleDedicate(customName.trim());
                setCustomName("");
              }
            }}
            disabled={!customName.trim()}
          >
            إهداء
          </Button>
        </div>
        {dedicatedTo && (
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
            <p className="text-sm text-primary font-medium">
              ثواب هذه الختمة مُهدى إلى: <span className="font-bold">{dedicatedTo}</span> — رحمه الله
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => {
                setDedicatedTo("");
                showFeedback("تم إزالة الإهداء");
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="glass-card p-8 text-center mb-8">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 3.27} 327`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{juzRead}</span>
            <span className="text-sm text-muted-foreground">من 30 جزء</span>
          </div>
        </div>

        <Progress value={progress} className="h-3 mb-4" />
        <p className="text-muted-foreground mb-6">{progress}% مكتمل</p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="icon" onClick={removeJuz} disabled={juzRead <= 0}>
            <Minus className="w-5 h-5" />
          </Button>
          <Button onClick={addJuz} disabled={juzRead >= 30} className="px-8 text-lg">
            <Plus className="w-5 h-5 ml-2" />
            أضف جزءاً
          </Button>
          <Button variant="outline" size="icon" onClick={resetKhatma}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 text-center">
        <h3 className="font-bold mb-2">إحصائيات عامة</h3>
        <p className="text-3xl font-bold text-primary">{totalGlobal}</p>
        <p className="text-sm text-muted-foreground">إجمالي الأجزاء المقروءة</p>
      </div>
    </div>
  );
}
