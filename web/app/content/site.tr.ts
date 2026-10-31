// Turkish text for the site content. The API only serves English, so the Turkish page takes the
// API content and swaps in these strings. Anything without a translation here (a new project,
// an extra timeline entry) stays in English instead of disappearing.
import type { Project, ProjectDetails, SiteContent } from "./site";

type ProjectText = Partial<Pick<Project, "category" | "summary" | "highlight" | "status">> & {
  cover?: Project["cover"];
  details?: Partial<Pick<ProjectDetails, "tagline" | "overview" | "built" | "linksNote">> & {
    links?: string[];
    results?: string[];
  };
};

interface SiteText {
  availability: string;
  headline: SiteContent["headline"];
  lead: string;
  projects: Record<string, ProjectText>;
  /** Keyed by the English title, so reordering entries in the API keeps them matched. */
  experience: Record<string, { title: string; description: string }>;
  words: Record<string, string>;
  contact: SiteContent["contact"];
}

export const siteTr: SiteText = {
  availability: "Orta seviye pozisyonlara açığım",
  headline: { before: "Yapay zekâdan mobil uygulamalara, ", accent: "full-stack", after: " ürünler geliştiriyorum." },
  lead:
    "ESOGU'da Matematik ve Bilgisayar Bilimleri öğrencisiyim. Full-stack web ve mobil ürünler geliştiriyorum; son dönemde odağım bilgi erişimiyle güçlendirilmiş yapay zekâ (RAG) ve Flutter uygulamaları.",
  projects: {
    dayanak: {
      category: "01 · Yapay zekâ / Bilgi erişimi",
      summary:
        "Kaynak maddeleri göstererek cevap veren bir hukuk metni asistanı. Türk mevzuatı üzerinde madde düzeyinde vektör arama ve her değişikliği puanlayan bir değerlendirme seti.",
      highlight: "Hibrit arama (BM25 + vektör) ölçüldü ve sayılara bakılarak elendi.",
      details: {
        tagline: "İş hukuku ve KVKK için kaynak gösteren bir hukuk asistanı.",
        overview:
          "Sorunu sade Türkçeyle sor, ilgili kanun maddeleri kaynaklarıyla birlikte gelsin. Bilgi erişimindeki her değişiklik, yayına girmeden önce bir değerlendirme setiyle ölçülüyor.",
        built: [
          "Kanunları (İş Kanunu, KVKK) madde ve fıkralara ayıran bir veri hattı",
          "PostgreSQL + pgvector'de bge-m3 vektörleri; FastAPI backend ve Next.js arayüz",
          "Değerlendirme seti: Recall@k ve MRR üzerinden karşılaştırılan 17 bilgi erişimi deneyi",
          "Hibrit BM25 + vektör arama ölçüldü ve sayılara bakılarak elendi; reranker ve cevap vermeme eşiği test edildi",
        ],
        linksNote: "Kaynak kodu istek üzerine paylaşılabilir.",
        results: ["Temel modele göre Recall@5", "Temel modele göre MRR", "Değerlendirme setindeki soru"],
      },
    },
    matrink: {
      category: "02 · Mobil",
      summary:
        "Kader matrisi hesaplayıcısını Gemini Vision ile el yazısı analiziyle birleştiren bir Flutter uygulaması. Giriş, ödeme duvarı ve birim testleriyle korunan bir hesaplama motoru.",
      highlight: "Yayında: matrink.vercel.app",
      details: {
        tagline: "Kader matrisi hesaplayıcısını yapay zekâ destekli el yazısı analiziyle buluşturan bir Flutter uygulaması.",
        overview:
          "Kullanıcılar el yazılarının fotoğrafını çekiyor ve Gemini Vision'dan bir analiz alıyor; yanında cihazda hesaplanan bir kader matrisi tablosu var. Giriş, ödemeler, bildirimler ve erişilebilirlik ayarlarıyla uçtan uca geliştirildi.",
        built: [
          "Saf Dart ile yazılmış, 20 birim testiyle korunan kader matrisi motoru",
          "El yazısı akışı: kamera → Supabase Storage → Edge Function → Gemini Vision → rapor",
          "RevenueCat ile abonelikler ve tek seferlik PDF satın alımları, webhook'larla senkron",
          "Disleksi dostu yazı tipi seçeneği (OpenDyslexic), yazı boyutu ayarı ve KVKK veri dışa aktarımı",
        ],
        links: ["Uygulamayı aç"],
        results: ["Matris motorundaki birim test", "Supabase Edge Function", "Mobil platformlar"],
      },
    },
    proofpay: {
      category: "03 · Hackathon",
      summary:
        "PayPal AI Hackathon için geliştirdiğim proje. Değerlendirme henüz sürüyor; proje detayları ve final sıralaması sonuçlar açıklanınca burada olacak.",
      status: "Devam ediyor · Sonuçlar bekleniyor",
      cover: { title: "ProofPay", caption: "Detaylar sonuçlardan sonra" },
    },
  },
  experience: {
    "Vice President · ESOGU MACS Club": {
      title: "Başkan Yardımcısı · ESOGU MACS Kulübü",
      description: "Daha önce Matematik ve Bilgisayar Bilimleri kulübünün Kurumsal İletişim Koordinatörüydüm.",
    },
    "Mentor · Frontend Web Development class": {
      title: "Mentor · Frontend Web Geliştirme dersi",
      description: "Yeni başlayanlara HTML, CSS ve JavaScript temellerini öğretiyorum.",
    },
    "Freelance web developer": {
      title: "Serbest web geliştirici",
      description: "Bir inşaat şirketi olan Patel İnşaat'ın web sitesini tasarlayıp geliştirdim.",
    },
    "B.Sc. Mathematics & Computer Science": {
      title: "Lisans · Matematik ve Bilgisayar Bilimleri",
      description: "Eskişehir Osmangazi Üniversitesi (ESOGU)",
    },
  },
  /** Short labels, skill group names and skills that read differently in Turkish. */
  words: {
    "Main languages": "Ana diller",
    "Vice President": "Başkan Yardımcısı",
    "ESOGU MACS Club": "ESOGU MACS Kulübü",
    "Languages spoken": "Konuştuğum dil",
    Languages: "Programlama dilleri",
    Frameworks: "Framework'ler",
    "AI & data": "Yapay zekâ ve veri",
    "Infra & tools": "Altyapı ve araçlar",
    Spoken: "Konuştuğum diller",
    "Vector search": "Vektör arama",
    Evaluation: "Değerlendirme",
    Azerbaijani: "Azerbaycanca",
    Turkish: "Türkçe",
    English: "İngilizce",
    Russian: "Rusça",
    German: "Almanca",
  },
  contact: { before: "Birlikte ", accent: "değerli bir şey üretelim." },
};

const at = <T>(list: T[] | undefined, i: number, fallback: T) => list?.[i] ?? fallback;
const word = (s: string) => siteTr.words[s] ?? s;

function localizeProject(p: Project): Project {
  const t = siteTr.projects[p.slug];
  if (!t) return p;
  const d = p.details;
  return {
    ...p,
    category: t.category ?? p.category,
    summary: t.summary ?? p.summary,
    highlight: p.highlight && (t.highlight ?? p.highlight),
    status: p.status && (t.status ?? p.status),
    cover: p.cover && (t.cover ?? p.cover),
    tags: p.tags.map(word),
    details: d && {
      ...d,
      tagline: t.details?.tagline ?? d.tagline,
      overview: t.details?.overview ?? d.overview,
      built: t.details?.built ?? d.built,
      linksNote: d.linksNote && (t.details?.linksNote ?? d.linksNote),
      links: d.links.map((l, i) => ({ ...l, label: at(t.details?.links, i, l.label) })),
      results: d.results.map((r, i) => ({ ...r, label: at(t.details?.results, i, r.label) })),
    },
  };
}

/** The Turkish version of content that came from the API in English. */
export function localizeSite(site: SiteContent): SiteContent {
  return {
    ...site,
    availability: siteTr.availability,
    headline: siteTr.headline,
    lead: siteTr.lead,
    facts: site.facts.map((f) => ({ value: word(f.value), label: word(f.label) })),
    projects: site.projects.map(localizeProject),
    experience: site.experience.map((e) => ({
      ...e,
      ...siteTr.experience[e.title],
      period: e.period.replace(/\bnow\b/, "günümüz"),
    })),
    skills: site.skills.map((g) => ({ name: word(g.name), items: g.items.map(word) })),
    contact: siteTr.contact,
  };
}
