import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { site } from "~/content/site";
import Home from "../home";

afterEach(cleanup);

function renderHome(url = "/") {
  const Stub = createRoutesStub([{ path: "/", Component: Home }]);
  return render(<Stub initialEntries={[url]} />);
}

describe("Home", () => {
  it("shows the headline and the owner's name", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "I build full-stack products, from retrieval AI to mobile apps.",
    );
    expect(screen.getByRole("link", { name: site.name }).getAttribute("href")).toBe("#top");
  });

  it("lists every project with its name", () => {
    renderHome();
    const work = screen.getByRole("region", { name: "Selected work" });
    const names = within(work)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(site.projects.map((p) => p.name));
  });

  it("shows ProofPay as pending instead of listing details", () => {
    renderHome();
    const card = screen.getByRole("article", { name: "ProofPay" });
    expect(within(card).getByText("In progress · Results pending")).toBeTruthy();
    expect(within(card).queryByRole("list")).toBeNull();
  });

  it("links the email button and every social profile", () => {
    renderHome();
    const contact = screen.getByRole("region", { name: /worth shipping/ });
    expect(within(contact).getByRole("link", { name: "Email me" }).getAttribute("href")).toBe(
      `mailto:${site.email}`,
    );
    const hrefs = within(contact)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    for (const s of site.socials) expect(hrefs).toContain(s.url);
  });

  it("opens and closes the mobile menu", () => {
    renderHome();
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(button);
    const menu = screen.getByRole("navigation", { name: "Mobile" });
    fireEvent.click(within(menu).getByRole("link", { name: "Work" }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });

  describe("project dialog", () => {
    it("opens from a card and closes with the close button", () => {
      renderHome();
      fireEvent.click(screen.getByRole("button", { name: "View details about Dayanak →" }));

      const dialog = screen.getByRole("dialog", { name: "Dayanak" });
      expect(within(dialog).getByText("0.776 → 0.812")).toBeTruthy();
      expect(within(dialog).getByText("Source code available on request.")).toBeTruthy();

      fireEvent.click(within(dialog).getByRole("button", { name: "Close project details" }));
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("opens straight from a shared ?project= link", () => {
      renderHome("/?project=matrink");
      const dialog = screen.getByRole("dialog", { name: "MatrInk" });
      expect(within(dialog).getByRole("link", { name: "Open the live app ↗" }).getAttribute("href")).toBe(
        "https://matrink.vercel.app",
      );
    });

    it("ignores unknown slugs and projects without details", () => {
      renderHome("/?project=proofpay");
      expect(screen.queryByRole("dialog")).toBeNull();
      cleanup();
      renderHome("/?project=nope");
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("gives ProofPay no details button", () => {
      renderHome();
      const card = screen.getByRole("article", { name: "ProofPay" });
      expect(within(card).queryByRole("button")).toBeNull();
    });
  });
});
