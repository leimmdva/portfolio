import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { site } from "../site";

const publicDir = path.resolve(__dirname, "../../../public");

describe("site content", () => {
  it("links the CV buttons to a file the build ships", () => {
    expect(site.cvUrl).toMatch(/^\/[\w.-]+\.pdf$/);
    expect(existsSync(path.join(publicDir, site.cvUrl))).toBe(true);
  });
});
