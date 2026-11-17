import { cleanup, render, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { AssistantWall, pickItem, type WallItem } from "../AssistantWall";

afterEach(cleanup);

const items: WallItem[] = ["One", "Two", "Three"].map((title, i) => ({
  badge: `0${i + 1}`,
  label: "Label",
  title,
  text: `${title} text`,
  action: "View details →",
}));

describe("pickItem", () => {
  it("walks every column through all items", () => {
    for (const c of [-2, -1, 0, 1, 2]) {
      const seen = new Set([0, 1, 2].map((r) => pickItem(3, c, r)));
      expect(seen.size).toBe(3);
    }
  });

  it("starts the centre column with the first item and returns -1 without items", () => {
    expect(pickItem(5, 0, 0)).toBe(0);
    expect(pickItem(0, 0, 0)).toBe(-1);
  });
});

describe("AssistantWall", () => {
  it("draws the cards after mounting and hides the decorative wall from assistive tech", async () => {
    const { container } = render(<AssistantWall items={items} interval={0} />);
    await waitFor(() => expect(container.textContent).toContain("One"));
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
    expect(container.textContent).toContain("Three text");
  });

  it("puts no inline style on the empty frame used for the pre-rendered page", () => {
    // Render to string the way the pre-render does: no effects run, so nothing is mounted.
    const html = AssistantWallStatic();
    expect(html).not.toContain("style=");
  });
});

function AssistantWallStatic() {
  return renderToString(<AssistantWall items={items} />);
}
