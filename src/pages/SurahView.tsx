import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSurah, fetchTafsir, reciters, getSurahAudioUrl } from "@/lib/quranApi";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Play, Pause, BookOpen, Bookmark, BookmarkCheck, Share2, ChevronRight, Volume2, SkipBack, SkipForward, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function SurahView() {
  const { number } = useParams<{ number: string }>();
  const surahNum = parseInt(number || "1");
  const [reciter, setReciter] = useState("afs");
  const [showTafsir, setShowTafsir] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>("bookmarks", []);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: surah, isLoading } = useQuery({
    queryKey: ["surah", surahNum],
    queryFn: () => fetchSurah(surahNum),
  });

  const { data: tafsirData } = useQuery({
    queryKey: ["tafsir", surahNum],
    queryFn: () => fetchTafsir(surahNum),
    enabled: showTafsir,
  });

  useEffect(() => {
    if (surahNum) localStorage.setItem("lastSurah", surahNum.toString());
  }, [surahNum]);

  const cleanup = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => cleanup, [surahNum, reciter, cleanup]);

  const togglePlay = () => {
    if (isPlaying) {
      cleanup();
      return;
    }

    // Always cleanup any existing audio before starting new one
    cleanup();

    const url = getSurahAudioUrl(reciter, surahNum);
    const audio = new Audio(url);
    audio.playbackRate = playbackRate;
    audioRef.current = audio;

    audio.play().then(() => {
      setIsPlaying(true);
      progressInterval.current = setInterval(() => {
        if (audio.duration) {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration);
        }
      }, 300);
    }).catch(() => toast.error("تعذر تشغيل الصوت"));

    audio.onended = () => {
      cleanup();
      toast.success("تم الانتهاء من تلاوة السورة");
    };
    audio.onerror = () => {
      cleanup();
      toast.error("تعذر تشغيل الصوت لهذا القارئ");
    };
  };

  const seekBy = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
    }
  };

  const seekTo = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
    }
  };

  const changeSpeed = () => {
    const idx = SPEED_OPTIONS.indexOf(playbackRate);
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
    toast(`سرعة التلاوة: ${next}x`);
  };

  const toggleBookmark = (globalAyahNumber: number) => {
    setBookmarks((prev) =>
      prev.includes(globalAyahNumber)
        ? prev.filter((b) => b !== globalAyahNumber)
        : [...prev, globalAyahNumber]
    );
    toast(bookmarks.includes(globalAyahNumber) ? "تم إزالة الإشارة المرجعية" : "تم إضافة إشارة مرجعية ✓");
  };

  const shareAyah = (text: string, ayahNum: number) => {
    const shareText = `${text}\n\n— ${surah?.name} (${ayahNum})`;
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      toast("تم نسخ الآية ✓");
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link to="/quran" className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
          القرآن الكريم
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{surah?.name}</span>
      </div>

      <div className="islamic-border p-6 mb-8 text-center">
        <h1 className="font-amiri text-3xl md:text-4xl font-bold mb-2">{surah?.name}</h1>
        <p className="text-muted-foreground text-sm">
          {surah?.numberOfAyahs} آيات — {surah?.revelationType === "Meccan" ? "مكية" : "مدنية"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={reciter} onValueChange={(val) => { cleanup(); setReciter(val); }}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="اختر القارئ" />
          </SelectTrigger>
          <SelectContent>
            {reciters.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showTafsir ? "default" : "outline"}
          onClick={() => setShowTafsir(!showTafsir)}
          size="sm"
        >
          <BookOpen className="w-4 h-4 ml-2" />
          التفسير الميسر
        </Button>

        <Button
          variant={isPlaying ? "destructive" : "default"}
          onClick={togglePlay}
          size="sm"
        >
          {isPlaying ? <Pause className="w-4 h-4 ml-2" /> : <Volume2 className="w-4 h-4 ml-2" />}
          {isPlaying ? "إيقاف التلاوة" : "تشغيل السورة"}
        </Button>
      </div>

      {/* Audio Player */}
      {isPlaying && (
        <div className="glass-card p-4 mb-8 space-y-3">
          {/* Seek bar */}
          <Slider
            value={[progressPercent]}
            onValueChange={seekTo}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => seekBy(-10)} title="تأخير 10 ثوانٍ">
              <SkipBack className="w-4 h-4" />
              <span className="text-xs">10</span>
            </Button>

            <Button variant="default" size="icon" onClick={togglePlay} className="rounded-full h-10 w-10">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => seekBy(10)} title="تقديم 10 ثوانٍ">
              <span className="text-xs">10</span>
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={changeSpeed} className="min-w-[60px]" title="سرعة التلاوة">
              <Gauge className="w-4 h-4 ml-1" />
              {playbackRate}x
            </Button>
          </div>
        </div>
      )}

      {/* Bismillah */}
      {surahNum !== 1 && surahNum !== 9 && (
        <p className="quran-text-lg text-center mb-8">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>
      )}

      {/* Ayahs */}
      <div className="space-y-4">
        {surah?.ayahs.map((ayah, i) => (
          <div
            key={ayah.number}
            className="glass-card p-5 animate-fade-in"
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="ayah-number shrink-0 mt-2">{ayah.numberInSurah}</span>
              <div className="flex-1">
                <p className="quran-text mb-3">{ayah.text}</p>
                {showTafsir && tafsirData?.[i] && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mt-2 leading-relaxed">
                    <span className="font-bold text-accent ml-1">التفسير:</span> {tafsirData[i]}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(ayah.number)}
                className={bookmarks.includes(ayah.number) ? "text-accent" : "text-muted-foreground"}
              >
                {bookmarks.includes(ayah.number) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareAyah(ayah.text, ayah.numberInSurah)}
                className="text-muted-foreground"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {surahNum > 1 && (
          <Link to={`/quran/${surahNum - 1}`}>
            <Button variant="outline">السورة السابقة</Button>
          </Link>
        )}
        <div className="flex-1" />
        {surahNum < 114 && (
          <Link to={`/quran/${surahNum + 1}`}>
            <Button variant="outline">السورة التالية</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
