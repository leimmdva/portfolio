import type { Route } from "./+types/home";
import { loadSiteContent } from "~/content/load";
import { SiteHeader } from "~/components/home/SiteHeader";
import { Hero } from "~/components/home/Hero";
import { Facts } from "~/components/home/Facts";
import { Projects } from "~/components/home/Projects";
import { Experience } from "~/components/home/Experience";
import { Skills } from "~/components/home/Skills";
import { Contact } from "~/components/home/Contact";
import { SiteFooter } from "~/components/home/SiteFooter";
import aboutStyles from "~/components/home/About.module.css";

// Runs once at build time while the page is pre-rendered (ssr: false), never in the browser.
export async function loader() {
  return loadSiteContent();
}

// The content is baked into the page, so ?project= changes must not refetch it.
export function shouldRevalidate() {
  return false;
}

export function meta({ loaderData: site }: Route.MetaArgs) {
  return [
    { title: site.name },
    { name: "description", content: site.lead },
  ];
}

export default function Home({ loaderData: site }: Route.ComponentProps) {
  return (
    <>
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
    </>
  );
}
