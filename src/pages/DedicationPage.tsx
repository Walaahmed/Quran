import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send } from "lucide-react";
import { toast } from "sonner";

interface Dedication {
  id: number;
  name: string;
  dua: string;
  date: string;
}

const defaultNames = ["أحمد ربيع", "إسلام أحمد ربيع"];

export default function DedicationPage() {
  const [dedications, setDedications] = useLocalStorage<Dedication[]>("dedications", []);
  const [selectedName, setSelectedName] = useState(defaultNames[0]);
  const [customName, setCustomName] = useState("");
  const [dua, setDua] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const submit = () => {
    const name = useCustom ? customName.trim() : selectedName;
    if (!name || !dua.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    const newDed: Dedication = {
      id: Date.now(),
      name,
      dua: dua.trim(),
      date: new Date().toLocaleDateString("ar-EG"),
    };
    setDedications((prev) => [newDed, ...prev]);
    setDua("");
    setCustomName("");
    toast.success("تم إهداء الثواب بنجاح ✓ جزاك الله خيراً");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="section-title">
        <Heart className="inline-block w-8 h-8 text-primary ml-2" />
        إهداء الثواب
      </h1>

      <div className="islamic-border p-6 mb-8">
        <h2 className="font-bold mb-4">اختر اسم المتوفى</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {defaultNames.map((name) => (
            <button
              key={name}
              onClick={() => { setSelectedName(name); setUseCustom(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !useCustom && selectedName === name
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {name}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              useCustom
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            اسم آخر
          </button>
        </div>

        {useCustom && (
          <input
            type="text"
            placeholder="اكتب اسم المتوفى..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm mb-3"
          />
        )}

        <Textarea
          placeholder="اكتب دعاءك هنا... مثال: اللهم اغفر له وارحمه وعافه واعف عنه"
          value={dua}
          onChange={(e) => setDua(e.target.value)}
          className="mb-4"
          rows={3}
        />

        <Button onClick={submit} className="w-full">
          <Send className="w-4 h-4 ml-2" />
          إهداء الثواب
        </Button>
      </div>

      {/* Previous dedications */}
      {dedications.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-4">دعواتكم السابقة</h2>
          <div className="space-y-3">
            {dedications.map((d) => (
              <div key={d.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary">{d.name}</span>
                  <span className="text-xs text-muted-foreground">{d.date}</span>
                </div>
                <p className="text-sm font-amiri leading-relaxed">{d.dua}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
