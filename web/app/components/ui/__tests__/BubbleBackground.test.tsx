import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BubbleBackground } from "../BubbleBackground";

afterEach(cleanup);

describe("BubbleBackground", () => {
  it("renders its children above decorative, hidden bubbles", () => {
    const { container } = render(
      <BubbleBackground>
        <h1>Hello</h1>
      </BubbleBackground>,
    );
    expect(screen.getByRole("heading", { name: "Hello" })).toBeTruthy();
    const bubbles = container.querySelector('[aria-hidden="true"]');
    expect(bubbles?.childElementCount).toBe(5);
  });

  it("adds the pointer-following bubble only when interactive", () => {
    const { container } = render(<BubbleBackground interactive />);
    expect(container.querySelector('[aria-hidden="true"]')?.childElementCount).toBe(6);
  });

  it("keeps the caller's class next to its own", () => {
    const { container } = render(<BubbleBackground className="extra" />);
    expect(container.firstElementChild?.classList.contains("extra")).toBe(true);
  });
});
