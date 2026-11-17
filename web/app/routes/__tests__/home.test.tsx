import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { site, type SiteContent } from "~/content/site";
import { localizeSite } from "~/content/site.tr";
import Home from "../home";

afterEach(cleanup);

// Home reads its content from the route loader, like the pre-rendered build does.
async function renderHome(url = "/", content: SiteContent = site) {
  const Stub = createRoutesStub([
    { path: "/", Component: Home as never, loader: () => ({ locale: "en", site: content }) },
    { path: "/tr", Component: Home as never, loader: () => ({ locale: "tr", site: localizeSite(content) }) },
  ]);
  const result = render(<Stub initialEntries={[url]} />);
  await screen.findByRole("heading", { level: 1 });
  return result;
}

describe("Home", () => {
  it("shows the headline and the owner's name", async () => {
    await renderHome();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "I build full-stack products, from retrieval AI to mobile apps.",
    );
    expect(screen.getByRole("link", { name: site.name }).getAttribute("href")).toBe("#top");
  });

  it("doesn't show an availability pill in the hero", async () => {
    await renderHome();
    expect(screen.queryByText(site.availability)).toBeNull();
  });

  it("shows a Projects folder that links to the projects page", async () => {
    await renderHome();
    const work = screen.getByRole("region", { name: "Selected work" });
    const folder = within(work).getByRole("link", { name: `Open all ${site.projects.length} projects` });
    expect(folder.getAttribute("href")).toBe("/projects");
    expect(within(folder).getByText("Projects")).toBeTruthy();
  });

  it("links the email button and every social profile", async () => {
    await renderHome();
    const contact = screen.getByRole("region", { name: /worth shipping/ });
    expect(within(contact).getByRole("link", { name: "Email me" }).getAttribute("href")).toBe(`mailto:${site.email}`);
    const hrefs = within(contact)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    for (const s of site.socials) expect(hrefs).toContain(s.url);
  });

  it("opens and closes the mobile menu", async () => {
    await renderHome();
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(button);
    const menu = screen.getByRole("navigation", { name: "Mobile" });
    fireEvent.click(within(menu).getByRole("link", { name: "Work" }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("marks English as the current language and links to the Turkish page", async () => {
    await renderHome();
    const lang = screen.getByRole("navigation", { name: "Language" });
    expect(within(lang).getByRole("link", { name: "English" }).getAttribute("aria-current")).toBe("page");
    expect(within(lang).getByRole("link", { name: "Türkçe" }).getAttribute("href")).toBe("/tr");
  });

  it("shows the Turkish page at /tr", async () => {
    await renderHome("/tr");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Yapay zekâdan mobil uygulamalara, full-stack ürünler geliştiriyorum.",
    );
    expect(screen.getByRole("region", { name: "Öne çıkan projeler" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Projeler" }).getAttribute("href")).toBe("#work");
    const lang = screen.getByRole("navigation", { name: "Dil" });
    expect(within(lang).getByRole("link", { name: "Türkçe" }).getAttribute("aria-current")).toBe("page");
    expect(within(lang).getByRole("link", { name: "English" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: `${site.projects.length} projenin hepsini aç` }).getAttribute("href")).toBe(
      "/tr/projects",
    );
  });
});
