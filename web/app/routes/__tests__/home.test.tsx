import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "../home";

describe("Home", () => {
  it("shows the site owner's name", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Leyla Mammadova",
    );
  });
});
