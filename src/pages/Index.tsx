import { Link } from "react-router-dom";
import { BookOpen, Book, Award, Heart } from "lucide-react";
import islamicPattern from "@/assets/islamic-pattern.jpg";

const features = [
  { icon: BookOpen, title: "القرآن الكريم", desc: "تلاوة وتفسير مع إمكانية الاستماع", to: "/quran" },
  { icon: Book, title: "الأذكار", desc: "أذكار الصباح والمساء مع عداد تسبيح", to: "/azkar" },
  { icon: Award, title: "الختمة", desc: "تتبع تقدمك في ختم القرآن", to: "/khatma" },
  { icon: Heart, title: "إهداء الثواب", desc: "أهدِ ثواب قراءتك لأحبائك", to: "/dedication" },
];

export default function Index() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-gradient pattern-overlay text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${islamicPattern})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="font-amiri text-4xl md:text-6xl font-bold mb-6 leading-tight">
            مصحف النور
          </h1>
          <p className="font-amiri text-xl md:text-3xl mb-4 opacity-90 leading-relaxed max-w-3xl mx-auto">
            ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾
          </p>
          <p className="text-sm md:text-base opacity-75 mb-8">سورة الحجر - الآية 9</p>
          <Link
            to="/quran"
            className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-background/30 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            ابدأ القراءة
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="section-title">
          <span className="text-gold">✦</span> الميزات الرئيسية <span className="text-gold">✦</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dedication Card */}
      <section className="container mx-auto px-4 pb-16">
        <div className="islamic-border p-8 md:p-12 text-center max-w-2xl mx-auto">
          <p className="text-gold text-2xl mb-4">❁</p>
          <h2 className="font-amiri text-2xl md:text-3xl font-bold mb-4">على روح من؟</h2>
          <p className="text-muted-foreground mb-6">هذا الموقع صدقة جارية على روح</p>
          <div className="space-y-3 mb-6">
            <div className="glass-card p-4 rounded-lg">
              <p className="font-bold text-lg">أحمد ربيع</p>
              <p className="text-sm text-muted-foreground">والدي الحبيب - رحمه الله</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <p className="font-bold text-lg">إسلام أحمد ربيع</p>
              <p className="text-sm text-muted-foreground">أخي الغالي - رحمه الله</p>
            </div>
          </div>
          <p className="font-amiri text-lg text-primary leading-relaxed">
            اللهم اغفر لهما وارحمهما وعافهما واعف عنهما، وأكرم نزلهما، ووسع مدخلهما، واغسلهما بالماء والثلج والبرد
          </p>
        </div>
      </section>
    </div>
  );
}
