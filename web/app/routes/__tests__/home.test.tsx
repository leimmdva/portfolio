import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("lists every project with its name", async () => {
    await renderHome();
    const work = screen.getByRole("region", { name: "Selected work" });
    const names = within(work)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(site.projects.map((p) => p.name));
  });

  it("shows ProofPay as pending instead of listing details", async () => {
    await renderHome();
    const card = screen.getByRole("article", { name: "ProofPay" });
    expect(within(card).getByText("In progress · Results pending")).toBeTruthy();
    expect(within(card).queryByRole("list")).toBeNull();
  });

  it("links the email button and every social profile", async () => {
    await renderHome();
    const contact = screen.getByRole("region", { name: /worth shipping/ });
    expect(within(contact).getByRole("link", { name: "Email me" }).getAttribute("href")).toBe(
      `mailto:${site.email}`,
    );
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

  describe("project dialog", () => {
    it("opens from a card and closes with the close button", async () => {
      await renderHome();
      fireEvent.click(screen.getByRole("button", { name: "View details about Dayanak →" }));

      const dialog = await screen.findByRole("dialog", { name: "Dayanak" });
      expect(within(dialog).getByText("0.776 → 0.812")).toBeTruthy();
      expect(within(dialog).getByText("Source code available on request.")).toBeTruthy();

      fireEvent.click(within(dialog).getByRole("button", { name: "Close project details" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });

    it("opens straight from a shared ?project= link", async () => {
      await renderHome("/?project=matrink");
      const dialog = await screen.findByRole("dialog", { name: "MatrInk" });
      expect(within(dialog).getByRole("link", { name: "Open the live app ↗" }).getAttribute("href")).toBe(
        "https://matrink.vercel.app",
      );
    });

    it("shows bornin2 as in progress, with details but no public link", async () => {
      await renderHome();
      const card = screen.getByRole("article", { name: "bornin2" });
      expect(within(card).getByText("In progress")).toBeTruthy();
      fireEvent.click(within(card).getByRole("button", { name: "View details about bornin2 →" }));

      const dialog = await screen.findByRole("dialog", { name: "bornin2" });
      expect(within(dialog).getByText("69.8 vs 70.3")).toBeTruthy();
      expect(within(dialog).getByText("A public version is coming soon.")).toBeTruthy();
      expect(within(dialog).queryByRole("link", { name: /↗/ })).toBeNull();
    });

    it("shows the card image and the screenshots when a project has them", async () => {
      const withImages: SiteContent = {
        ...site,
        projects: site.projects.map((p) =>
          p.slug === "matrink"
            ? {
                ...p,
                image: { url: "/projects/matrink/cover.webp", alt: "MatrInk on three phones" },
                details: {
                  ...p.details!,
                  screenshots: [
                    { url: "/projects/matrink/1.webp", alt: "Landing page" },
                    { url: "/projects/matrink/2.webp", alt: "Matrix calculator" },
                  ],
                },
              }
            : p,
        ),
      };
      await renderHome("/?project=matrink", withImages);

      const card = screen.getByRole("article", { name: "MatrInk" });
      expect(within(card).getByRole("img", { name: "MatrInk on three phones" }).getAttribute("src")).toBe(
        "/projects/matrink/cover.webp",
      );
      const dialog = await screen.findByRole("dialog", { name: "MatrInk" });
      const shots = within(dialog).getByRole("list", { name: "Screenshots" });
      expect(within(shots).getAllByRole("img").map((i) => i.getAttribute("alt"))).toEqual([
        "Landing page",
        "Matrix calculator",
      ]);
      expect(within(dialog).queryByText("Screenshots will be added later.")).toBeNull();
    });

    it("keeps the placeholders for a project without screenshots", async () => {
      const withoutShots: SiteContent = {
        ...site,
        projects: site.projects.map((p) =>
          p.slug === "dayanak" ? { ...p, details: { ...p.details!, screenshots: undefined } } : p,
        ),
      };
      await renderHome("/?project=dayanak", withoutShots);
      const dialog = await screen.findByRole("dialog", { name: "Dayanak" });
      expect(within(dialog).queryByRole("img")).toBeNull();
      expect(within(dialog).getByText("Screenshots will be added later.")).toBeTruthy();
    });

    it("shows Night Shift with its concept art and a link to the source", async () => {
      await renderHome("/?project=night-shift");
      const card = screen.getByRole("article", { name: "Night Shift" });
      expect(within(card).getByText("In progress · Hackathon until 5 Dec")).toBeTruthy();
      expect(within(card).getByRole("img").getAttribute("src")).toBe("/projects/night-shift/cover.webp");
      const dialog = await screen.findByRole("dialog", { name: "Night Shift" });
      expect(within(dialog).getAllByRole("img")).toHaveLength(2);
      expect(within(dialog).getByRole("link", { name: "Source code on GitHub ↗" }).getAttribute("href")).toBe(
        "https://github.com/leimmdva/night-shift",
      );
    });

    it("ignores unknown slugs and projects without details", async () => {
      await renderHome("/?project=proofpay");
      expect(screen.queryByRole("dialog")).toBeNull();
      cleanup();
      await renderHome("/?project=nope");
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("gives ProofPay no details button", async () => {
      await renderHome();
      const card = screen.getByRole("article", { name: "ProofPay" });
      expect(within(card).queryByRole("button")).toBeNull();
    });
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
  });
});
