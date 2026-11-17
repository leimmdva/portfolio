import type { Route } from "./+types/projects";
import { loadHome } from "./home";
import { HOME_PATH, LOCALES, LocaleProvider, PROJECTS_PATH, useLocale, useUi } from "~/i18n/ui";
import { ProjectsBrowser } from "~/components/home/Projects";
import styles from "./projects.module.css";

const SITE_URL = "https://leylammdva.com";

// Same build-time content as the home page.
export function loader() {
  return loadHome("en");
}

// The content is baked into the page, so ?project= changes must not refetch it.
export function shouldRevalidate() {
  return false;
}

export function meta({ loaderData: { locale, site } }: Route.MetaArgs) {
  const title = locale === "tr" ? "Projeler" : "Projects";
  return [
    { title: `${title} · ${site.name}` },
    { name: "description", content: site.lead },
    ...LOCALES.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l, href: `${SITE_URL}${PROJECTS_PATH[l]}` })),
    { tagName: "link", rel: "canonical", href: `${SITE_URL}${PROJECTS_PATH[locale]}` },
  ];
}

/** The full-screen projects page that the home page's folder opens. */
export default function ProjectsPage({ loaderData: { locale, site } }: Route.ComponentProps) {
  return (
    <LocaleProvider value={locale}>
      <div className={styles.page}>
        <TopBar />
        <main id="top">
          <ProjectsBrowser projects={site.projects} />
        </main>
      </div>
    </LocaleProvider>
  );
}

function TopBar() {
  const ui = useUi();
  const locale = useLocale();
  return (
    <header className={styles.bar}>
      <a className={styles.back} href={HOME_PATH[locale]}>
        <span aria-hidden="true">←</span> <span className={styles.backText}>{ui.backHome}</span>
      </a>
      <h1 className={styles.title}>{ui.projectsPageTitle}</h1>
      {/* Plain links: each language is its own pre-rendered page. */}
      <nav aria-label={ui.languageSwitch} className={styles.lang}>
        {LOCALES.map((l) => (
          <a
            key={l}
            href={PROJECTS_PATH[l]}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "page" : undefined}
            aria-label={ui.languageNames[l]}
            className={l === locale ? styles.langActive : undefined}
          >
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
    </header>
  );
}
