import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSurahs, type Surah } from "@/lib/quranApi";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuranPage() {
  const [search, setSearch] = useState("");
  const { data: surahs, isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });

  const filtered = surahs?.filter(
    (s) =>
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-title">
        <BookOpen className="inline-block w-8 h-8 text-primary ml-2" />
        القرآن الكريم
      </h1>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="ابحث عن سورة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 text-right"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      )}
    </div>
  );
}

function SurahCard({ surah }: { surah: Surah }) {
  return (
    <Link
      to={`/quran/${surah.number}`}
      className="glass-card p-4 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 group"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary/20 transition-colors">
        {surah.number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">{surah.name}</h3>
          
        </div>
        <span className="text-xs text-accent">{surah.revelationType === "Meccan" ? "مكية" : "مدنية"} — {surah.numberOfAyahs} آيات</span>
      </div>
    </Link>
  );
}
