import { createContext, useContext } from "react";

export type Locale = "en" | "tr";

export const LOCALES: Locale[] = ["en", "tr"];

/** Where each language's home page lives. */
export const HOME_PATH: Record<Locale, string> = { en: "/", tr: "/tr" };

/** Where each language's full-screen projects page lives. */
export const PROJECTS_PATH: Record<Locale, string> = { en: "/projects", tr: "/tr/projects" };

export function localeFromPath(pathname: string): Locale {
  return /^\/tr(\/|$)/.test(pathname) ? "tr" : "en";
}

/** Interface text that isn't part of the site content. */
export interface UiStrings {
  nav: { work: string; experience: string; skills: string; contact: string };
  mainNav: string;
  mobileNav: string;
  openMenu: string;
  closeMenu: string;
  downloadCv: string;
  languageSwitch: string;
  languageNames: Record<Locale, string>;
  seeWork: string;
  workTitle: string;
  workLabel: string;
  experienceTitle: string;
  skillsTitle: string;
  screenshot: (name: string) => string;
  viewDetails: string;
  aboutProject: (name: string) => string;
  closeDetails: string;
  screenshots: string;
  screenshotN: (n: number) => string;
  screenshotsLater: string;
  overview: string;
  whatIBuilt: string;
  techStack: string;
  links: string;
  emailMe: string;
  footer: string;
  projectsFolder: string;
  openProjects: (count: number) => string;
  projectsPageTitle: string;
  backHome: string;
  projectIndex: string;
  socialCardsLabel: string;
  /** Text on each social card: a line about what is there, and a short tag. */
  socialCards: Record<"email" | "linkedin" | "github" | "instagram", { title: string; tag: string }>;
  openProfile: (label: string) => string;
  contactEmail: string;
}

export const UI: Record<Locale, UiStrings> = {
  en: {
    nav: { work: "Work", experience: "Experience", skills: "Skills", contact: "Contact" },
    mainNav: "Main",
    mobileNav: "Mobile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    downloadCv: "Download CV",
    languageSwitch: "Language",
    languageNames: { en: "English", tr: "Türkçe" },
    seeWork: "See selected work",
    workTitle: "Selected work",
    workLabel: "01 — Projects",
    experienceTitle: "Experience & education",
    skillsTitle: "Skills",
    screenshot: (name) => `${name} screenshot`,
    viewDetails: "View details",
    aboutProject: (name) => ` about ${name}`,
    closeDetails: "Close project details",
    screenshots: "Screenshots",
    screenshotN: (n) => `Screenshot ${n}`,
    screenshotsLater: "Screenshots will be added later.",
    overview: "Overview",
    whatIBuilt: "What I built",
    techStack: "Tech stack",
    links: "Links",
    emailMe: "Email me",
    footer: "Built with React · Designed in Figma",
    projectsFolder: "Projects",
    openProjects: (count) => `Open all ${count} projects`,
    projectsPageTitle: "Projects",
    backHome: "Back to the homepage",
    projectIndex: "All projects",
    socialCardsLabel: "Find me online",
    socialCards: {
      email: { title: "Have a project in mind? Write to me", tag: "Write" },
      linkedin: { title: "Experience, studies and what I'm working on now", tag: "Connect" },
      github: { title: "Source code of my projects and experiments", tag: "Follow" },
      instagram: { title: "Behind the scenes of what I build", tag: "Say hi" },
    },
    openProfile: (label) => `Open my ${label} profile`,
    contactEmail: "Email",
  },
  tr: {
    nav: { work: "Projeler", experience: "Deneyim", skills: "Yetenekler", contact: "İletişim" },
    mainNav: "Ana menü",
    mobileNav: "Mobil menü",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    downloadCv: "CV'yi indir",
    languageSwitch: "Dil",
    languageNames: { en: "English", tr: "Türkçe" },
    seeWork: "Projelerime göz at",
    workTitle: "Öne çıkan projeler",
    workLabel: "01 — Projeler",
    experienceTitle: "Deneyim ve eğitim",
    skillsTitle: "Yetenekler",
    screenshot: (name) => `${name} ekran görüntüsü`,
    viewDetails: "Detayları gör",
    aboutProject: (name) => `: ${name}`,
    closeDetails: "Proje detaylarını kapat",
    screenshots: "Ekran görüntüleri",
    screenshotN: (n) => `Ekran görüntüsü ${n}`,
    screenshotsLater: "Ekran görüntüleri yakında eklenecek.",
    overview: "Genel bakış",
    whatIBuilt: "Neler yaptım",
    techStack: "Teknolojiler",
    links: "Bağlantılar",
    emailMe: "E-posta gönder",
    footer: "React ile geliştirildi · Figma'da tasarlandı",
    projectsFolder: "Projeler",
    openProjects: (count) => `${count} projenin hepsini aç`,
    projectsPageTitle: "Projeler",
    backHome: "Ana sayfaya dön",
    projectIndex: "Bütün projeler",
    socialCardsLabel: "Beni internette bul",
    socialCards: {
      email: { title: "Aklında bir proje mi var? Bana yaz", tag: "Yaz" },
      linkedin: { title: "Deneyimim, eğitimim ve şu an üzerinde çalıştıklarım", tag: "Bağlantı kur" },
      github: { title: "Projelerimin ve denemelerimin kaynak kodu", tag: "Takip et" },
      instagram: { title: "Geliştirdiklerimin kamera arkası", tag: "Merhaba de" },
    },
    openProfile: (label) => `${label} profilimi aç`,
    contactEmail: "E-posta",
  },
};

const LocaleContext = createContext<Locale>("en");

export const LocaleProvider = LocaleContext.Provider;

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useUi(): UiStrings {
  return UI[useLocale()];
}
