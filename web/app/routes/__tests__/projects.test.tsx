import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { site, type SiteContent } from "~/content/site";
import { localizeSite } from "~/content/site.tr";
import ProjectsPage from "../projects";

afterEach(cleanup);

// jsdom has no ResizeObserver, so the page shows the plain project list instead of the moving wall.
async function renderProjects(url = "/projects", content: SiteContent = site) {
  const Stub = createRoutesStub([
    { path: "/projects", Component: ProjectsPage as never, loader: () => ({ locale: "en", site: content }) },
    {
      path: "/tr/projects",
      Component: ProjectsPage as never,
      loader: () => ({ locale: "tr", site: localizeSite(content) }),
    },
  ]);
  const result = render(<Stub initialEntries={[url]} />);
  await screen.findByRole("heading", { level: 1 });
  return result;
}

describe("Projects page", () => {
  it("has a title, a way back home and a language switch", async () => {
    await renderProjects();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Projects");
    expect(screen.getByRole("link", { name: "Back to the homepage" }).getAttribute("href")).toBe("/");
    const lang = screen.getByRole("navigation", { name: "Language" });
    expect(within(lang).getByRole("link", { name: "Türkçe" }).getAttribute("href")).toBe("/tr/projects");
  });

  it("shows the Turkish page at /tr/projects", async () => {
    await renderProjects("/tr/projects");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Projeler");
    expect(screen.getByRole("link", { name: "Ana sayfaya dön" }).getAttribute("href")).toBe("/tr");
  });

  it("lists every project with its name", async () => {
    await renderProjects();
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(site.projects.map((p) => p.name));
  });

  it("shows ProofPay as pending instead of listing details", async () => {
    await renderProjects();
    const card = screen.getByRole("article", { name: "ProofPay" });
    expect(within(card).getByText("In progress · Results pending")).toBeTruthy();
    expect(within(card).queryByRole("list")).toBeNull();
  });

  it("shows ProofPay as pending instead of listing details", async () => {
    await renderProjects();
    const card = screen.getByRole("article", { name: "ProofPay" });
    expect(within(card).getByText("In progress · Results pending")).toBeTruthy();
    expect(within(card).queryByRole("list")).toBeNull();
  });

  describe("project dialog", () => {
    it("opens from a card and closes with the close button", async () => {
      await renderProjects();
      fireEvent.click(screen.getByRole("button", { name: "View details about Dayanak →" }));

      const dialog = await screen.findByRole("dialog", { name: "Dayanak" });
      expect(within(dialog).getByText("0.776 → 0.812")).toBeTruthy();
      expect(within(dialog).getByText("Source code available on request.")).toBeTruthy();

      fireEvent.click(within(dialog).getByRole("button", { name: "Close project details" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });

    it("opens straight from a shared ?project= link", async () => {
      await renderProjects("/projects?project=matrink");
      const dialog = await screen.findByRole("dialog", { name: "MatrInk" });
      expect(within(dialog).getByRole("link", { name: "Open the live app ↗" }).getAttribute("href")).toBe(
        "https://matrink.vercel.app",
      );
    });

    it("shows bornin2 as in progress, with details but no public link", async () => {
      await renderProjects();
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
      await renderProjects("/projects?project=matrink", withImages);

      const card = screen.getByRole("article", { name: "MatrInk" });
      expect(within(card).getByRole("img", { name: "MatrInk on three phones" }).getAttribute("src")).toBe(
        "/projects/matrink/cover.webp",
      );
      const dialog = await screen.findByRole("dialog", { name: "MatrInk" });
      const shots = within(dialog).getByRole("list", { name: "Screenshots" });
      expect(
        within(shots)
          .getAllByRole("img")
          .map((i) => i.getAttribute("alt")),
      ).toEqual(["Landing page", "Matrix calculator"]);
      expect(within(dialog).queryByText("Screenshots will be added later.")).toBeNull();
    });

    it("keeps the placeholders for a project without screenshots", async () => {
      const withoutShots: SiteContent = {
        ...site,
        projects: site.projects.map((p) =>
          p.slug === "dayanak" ? { ...p, details: { ...p.details!, screenshots: undefined } } : p,
        ),
      };
      await renderProjects("/projects?project=dayanak", withoutShots);
      const dialog = await screen.findByRole("dialog", { name: "Dayanak" });
      expect(within(dialog).queryByRole("img")).toBeNull();
      expect(within(dialog).getByText("Screenshots will be added later.")).toBeTruthy();
    });

    it("shows Night Shift with its concept art and a link to the source", async () => {
      await renderProjects("/projects?project=night-shift");
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
      await renderProjects("/projects?project=proofpay");
      expect(screen.queryByRole("dialog")).toBeNull();
      cleanup();
      await renderProjects("/projects?project=nope");
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("gives ProofPay no details button", async () => {
      await renderProjects();
      const card = screen.getByRole("article", { name: "ProofPay" });
      expect(within(card).queryByRole("button")).toBeNull();
    });
  });
});
