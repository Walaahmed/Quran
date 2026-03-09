import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

function getAzkarTimeMessage(): string | null {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "🌅 حان وقت أذكار الصباح";
  if (hour >= 17 && hour < 19) return "🌇 حان وقت أذكار المساء";
  return null;
}

export function useAzkarReminder() {
  const [enabled] = useLocalStorage("azkar-reminders", false);

  useEffect(() => {
    if (!enabled) return;

    // Check on mount
    const msg = getAzkarTimeMessage();
    if (msg) {
      toast(msg, {
        action: { label: "اذهب للأذكار", onClick: () => window.location.assign("/azkar") },
        duration: 10000,
      });
    }

    // Check every 30 minutes
    const interval = setInterval(() => {
      const m = getAzkarTimeMessage();
      if (m) {
        toast(m, {
          action: { label: "اذهب للأذكار", onClick: () => window.location.assign("/azkar") },
          duration: 10000,
        });
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled]);
}

export function AzkarReminderToggle() {
  const [enabled, setEnabled] = useLocalStorage("azkar-reminders", false);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    toast(next ? "تم تفعيل تذكير الأذكار 🔔" : "تم إيقاف تذكير الأذكار");

    // Request notification permission
    if (next && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle} className="gap-2">
      {enabled ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4" />}
      {enabled ? "التذكير مفعّل" : "تفعيل التذكير"}
    </Button>
  );
}
