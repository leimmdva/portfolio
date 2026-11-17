// The Turkish projects page at /tr/projects: the same page, with the Turkish text swapped in.
import { loadHome } from "./home";

export { default, meta, shouldRevalidate } from "./projects";

export function loader() {
  return loadHome("tr");
}
