import { Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="section-title">عن الموقع</h1>

      <div className="islamic-border p-8 text-center mb-8">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="font-amiri text-2xl font-bold mb-4">صدقة جارية</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          هذا الموقع <span className="font-bold text-foreground">"مصحف النور"</span> صدقة جارية على روح والدي الحبيب
          <span className="font-bold text-primary"> أحمد ربيع </span>
          وأخي الغالي
          <span className="font-bold text-primary"> إسلام أحمد ربيع</span>،
          رحمهما الله وأسكنهما فسيح جناته.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          نسأل الله أن يجعل هذا العمل في ميزان حسناتهما، وأن ينفع به كل من يستخدمه.
          ندعوكم للدعاء لهما بالرحمة والمغفرة.
        </p>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-3 text-primary">دعاء لوالدي أحمد ربيع</h3>
          <p className="font-amiri text-lg leading-loose">
            اللهم اغفر لأبي أحمد ربيع وارحمه، وعافه واعف عنه، وأكرم نزله، ووسع مدخله، واغسله بالماء والثلج والبرد، ونقه من الخطايا كما ينقى الثوب الأبيض من الدنس. اللهم أبدله داراً خيراً من داره وأهلاً خيراً من أهله، وأدخله الجنة وأعذه من عذاب القبر ومن عذاب النار.
          </p>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-3 text-primary">دعاء لأخي إسلام أحمد ربيع</h3>
          <p className="font-amiri text-lg leading-loose">
            اللهم اغفر لأخي إسلام أحمد ربيع وارحمه، وعافه واعف عنه، وأكرم نزله، ووسع مدخله، واغسله بالماء والثلج والبرد، ونقه من الخطايا كما ينقى الثوب الأبيض من الدنس. اللهم أبدله داراً خيراً من داره وأهلاً خيراً من أهله، وأدخله الجنة وأعذه من عذاب القبر ومن عذاب النار.
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <p className="font-amiri text-xl text-primary leading-loose">
            ﴿ رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ ﴾
          </p>
          <p className="text-sm text-muted-foreground mt-2">سورة نوح - الآية 28</p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>تم بناء هذا الموقع بحب ❤️ ودعاء</p>
        <p className="mt-1">نسألكم الدعاء لهما بالرحمة والمغفرة</p>
      </div>
    </div>
  );
}
