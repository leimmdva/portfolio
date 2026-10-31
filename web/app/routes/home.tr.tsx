// The Turkish home page at /tr: the same page, with the Turkish text swapped in.
import { loadHome } from "./home";

export { default, meta, shouldRevalidate } from "./home";

export function loader() {
  return loadHome("tr");
}
