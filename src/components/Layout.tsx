import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Book, Sun, Moon, Menu, X, Home, BookOpen, Heart, Info, Award, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AzkarReminderToggle } from "./AzkarReminder";

const navLinks = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/quran", label: "القرآن الكريم", icon: BookOpen },
  
  { to: "/azkar", label: "الأذكار", icon: Book },
  { to: "/tasbih", label: "السبحة", icon: Circle },
  { to: "/khatma", label: "الختمة", icon: Award },
  { to: "/dedication", label: "إهداء الثواب", icon: Heart },
  { to: "/about", label: "عن الموقع", icon: Info },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <BookOpen className="w-7 h-7" />
            <span className="font-cairo">مصحف النور</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="text-muted-foreground"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-1 mt-8">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === link.to
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/50 py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-4">
            <AzkarReminderToggle />
          </div>
          <p className="font-amiri text-lg text-muted-foreground mb-2">
            صدقة جارية على روح أحمد ربيع و إسلام أحمد ربيع
          </p>
          <p className="text-sm text-muted-foreground">
            اللهم اغفر لهما وارحمهما وعافهما واعف عنهما
          </p>
          <p className="text-xs text-muted-foreground mt-4">مصحف النور © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
