const BASE_URL = "https://api.alquran.cloud/v1";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
  tafsir?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export const reciters = [
  { id: "afs", name: "مشاري العفاسي", server: "server8" },
  { id: "minsh", name: "محمد صديق المنشاوي", server: "server10" },
  { id: "husr", name: "محمود خليل الحصري", server: "server13" },
  { id: "basit", name: "عبد الباسط عبد الصمد", server: "server7" },
  { id: "ajm", name: "أحمد العجمي", server: "server10" },
  { id: "maher", name: "ماهر المعيقلي", server: "server12" },
  { id: "s_gmd", name: "سعد الغامدي", server: "server7" },
];

export function getSurahAudioUrl(reciterCode: string, surahNumber: number): string {
  const reciter = reciters.find((r) => r.id === reciterCode);
  const server = reciter?.server || "server8";
  const paddedNum = surahNumber.toString().padStart(3, "0");
  return `https://${server}.mp3quran.net/${reciterCode}/${paddedNum}.mp3`;
}

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surah`);
  const data = await res.json();
  return data.data;
}

export async function fetchSurah(number: number, _reciter?: string): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surah/${number}`);
  const data = await res.json();

  const ayahs: Ayah[] = data.data.ayahs.map((ayah: any) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
  }));

  return { ...data.data, ayahs };
}

export async function fetchTafsir(surahNumber: number): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/surah/${surahNumber}/ar.muyassar`);
  const data = await res.json();
  return data.data.ayahs.map((a: any) => a.text);
}

export async function searchQuran(query: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}/all/ar`);
  const data = await res.json();
  return data.data?.matches || [];
}
