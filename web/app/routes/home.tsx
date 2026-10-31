import type { Route } from "./+types/home";
import { getSiteContent } from "~/content/load";
import { localizeSite } from "~/content/site.tr";
import { HOME_PATH, LOCALES, LocaleProvider, type Locale } from "~/i18n/ui";
import { SiteHeader } from "~/components/home/SiteHeader";
import { Hero } from "~/components/home/Hero";
import { Facts } from "~/components/home/Facts";
import { Projects } from "~/components/home/Projects";
import { Experience } from "~/components/home/Experience";
import { Skills } from "~/components/home/Skills";
import { Contact } from "~/components/home/Contact";
import { SiteFooter } from "~/components/home/SiteFooter";
import aboutStyles from "~/components/home/About.module.css";

const SITE_URL = "https://leylammdva.com";

// Runs once at build time while the page is pre-rendered (ssr: false), never in the browser.
export async function loadHome(locale: Locale) {
  const site = await getSiteContent();
  return { locale, site: locale === "tr" ? localizeSite(site) : site };
}

export function loader() {
  return loadHome("en");
}

// The content is baked into the page, so ?project= changes must not refetch it.
export function shouldRevalidate() {
  return false;
}

export function meta({ loaderData: { locale, site } }: Route.MetaArgs) {
  return [
    { title: site.name },
    { name: "description", content: site.lead },
    ...LOCALES.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l, href: `${SITE_URL}${HOME_PATH[l]}` })),
    { tagName: "link", rel: "canonical", href: `${SITE_URL}${HOME_PATH[locale]}` },
  ];
}

export default function Home({ loaderData: { locale, site } }: Route.ComponentProps) {
  return (
    <LocaleProvider value={locale}>
      <SiteHeader name={site.name} cvUrl={site.cvUrl} />
      <main id="top">
        <Hero site={site} />
        <Facts facts={site.facts} />
        <Projects projects={site.projects} />
        <div className={`container ${aboutStyles.grid}`}>
          <Experience items={site.experience} />
          <Skills groups={site.skills} />
        </div>
        <Contact site={site} />
      </main>
      <SiteFooter name={site.name} />
    </LocaleProvider>
  );
}
