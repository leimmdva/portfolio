import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound, { meta } from "../not-found";

describe("NotFound", () => {
  it("says the page does not exist and links home", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "404" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to the homepage" }).getAttribute("href")).toBe("/");
  });

  it("keeps the page out of search results", () => {
    expect(meta()).toContainEqual({ name: "robots", content: "noindex" });
  });
});
