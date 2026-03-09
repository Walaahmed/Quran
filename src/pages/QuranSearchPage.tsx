import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchQuran } from "@/lib/quranApi";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuranSearchPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ["quran-search", searchTerm],
    queryFn: () => searchQuran(searchTerm),
    enabled: searchTerm.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setSearchTerm(query.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-title">
        <Search className="inline-block w-7 h-7 text-primary ml-2" />
        البحث في القرآن
      </h1>

      <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8 flex gap-2">
        <Input
          placeholder="ابحث عن آية أو كلمة..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-right flex-1"
        />
        <Button type="submit" disabled={query.trim().length < 2}>
          <Search className="w-4 h-4 ml-1" />
          بحث
        </Button>
      </form>

      {isLoading && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-destructive">حدث خطأ أثناء البحث. حاول مرة أخرى.</p>
      )}

      {results && results.length === 0 && (
        <p className="text-center text-muted-foreground">لا توجد نتائج للبحث عن "{searchTerm}"</p>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground text-center mb-4">
            تم العثور على {results.length} نتيجة
          </p>
          {results.map((match: any, i: number) => (
            <Link
              key={i}
              to={`/quran/${match.surah.number}`}
              className="glass-card p-4 block hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <p className="font-amiri text-lg leading-loose mb-2 text-quran">{match.text}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {match.surah.name} — آية {match.numberInSurah}
                </span>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {match.surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
