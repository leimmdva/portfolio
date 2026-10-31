import { createContext, useContext } from "react";

export type Locale = "en" | "tr";

export const LOCALES: Locale[] = ["en", "tr"];

/** Where each language's home page lives. */
export const HOME_PATH: Record<Locale, string> = { en: "/", tr: "/tr" };

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
