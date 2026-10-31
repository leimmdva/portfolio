import { describe, expect, it } from "vitest";

import { site } from "../site";
import { localizeSite } from "../site.tr";

describe("localizeSite", () => {
  const tr = localizeSite(site);

  it("translates the text and keeps names, links and contact details", () => {
    expect(tr.contact).toEqual({ before: "Birlikte ", accent: "değerli bir şey üretelim." });
    expect(tr.email).toBe(site.email);
    expect(tr.cvUrl).toBe(site.cvUrl);
    expect(tr.socials).toEqual(site.socials);
    expect(tr.projects.map((p) => p.name)).toEqual(site.projects.map((p) => p.name));
    const matrink = tr.projects.find((p) => p.slug === "matrink")!;
    expect(matrink.details?.links).toEqual([{ label: "Uygulamayı aç", url: "https://matrink.vercel.app" }]);
  });

  it("translates timeline entries by their English title and dates", () => {
    expect(tr.experience[0]).toEqual({
      period: "2025 — günümüz",
      title: "Başkan Yardımcısı · ESOGU MACS Kulübü",
      description: "Daha önce Matematik ve Bilgisayar Bilimleri kulübünün Kurumsal İletişim Koordinatörüydüm.",
    });
  });

  it("keeps content it has no translation for in English", () => {
    const extra = {
      slug: "new-app",
      category: "04 · Web",
      name: "New app",
      summary: "Not translated yet.",
      tags: ["React"],
    };
    const item = { period: "2027", title: "New role", description: "Not translated yet." };
    const out = localizeSite({ ...site, projects: [...site.projects, extra], experience: [...site.experience, item] });
    expect(out.projects.at(-1)).toEqual(extra);
    expect(out.experience.at(-1)).toEqual(item);
  });
});
