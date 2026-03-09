import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { morningAzkar, eveningAzkar, sleepAzkar, generalAzkar, type Dhikr } from "@/data/azkar";
import { RotateCcw, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AzkarPage() {
  const [fontSize, setFontSize] = useState(1.6);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-title">الأذكار</h1>

      {/* Font size control */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-sm text-muted-foreground">حجم الخط:</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize((s) => Math.max(1, s - 0.2))}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium w-8 text-center">{Math.round(fontSize * 10) / 10}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setFontSize((s) => Math.min(3, s + 0.2))}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="morning" className="max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="morning">الصباح</TabsTrigger>
          <TabsTrigger value="evening">المساء</TabsTrigger>
          <TabsTrigger value="sleep">النوم</TabsTrigger>
          <TabsTrigger value="general">متنوعة</TabsTrigger>
        </TabsList>
        <TabsContent value="morning">
          <AzkarList azkar={morningAzkar} fontSize={fontSize} />
        </TabsContent>
        <TabsContent value="evening">
          <AzkarList azkar={eveningAzkar} fontSize={fontSize} />
        </TabsContent>
        <TabsContent value="sleep">
          <AzkarList azkar={sleepAzkar} fontSize={fontSize} />
        </TabsContent>
        <TabsContent value="general">
          <AzkarList azkar={generalAzkar} fontSize={fontSize} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AzkarList({ azkar, fontSize }: { azkar: Dhikr[]; fontSize: number }) {
  return (
    <div className="space-y-4">
      {azkar.map((dhikr) => (
        <DhikrCard key={dhikr.id} dhikr={dhikr} fontSize={fontSize} />
      ))}
    </div>
  );
}

function DhikrCard({ dhikr, fontSize }: { dhikr: Dhikr; fontSize: number }) {
  const [count, setCount] = useState(0);
  const done = count >= dhikr.count;

  const increment = () => {
    if (done) return;
    const next = count + 1;
    setCount(next);
    if (next >= dhikr.count) {
      toast("سبحان الله ✓ أتممت هذا الذكر");
    }
  };

  return (
    <div
      className={`glass-card p-5 cursor-pointer transition-all select-none ${done ? "opacity-60" : ""}`}
      onClick={increment}
    >
      <p className="font-amiri leading-loose mb-3" style={{ fontSize: `${fontSize}rem` }}>
        {dhikr.text}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dhikr.reference && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{dhikr.reference}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={(e) => { e.stopPropagation(); setCount(0); }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${done ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
            {done ? <Check className="w-4 h-4" /> : null}
            <span>{count}/{dhikr.count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
