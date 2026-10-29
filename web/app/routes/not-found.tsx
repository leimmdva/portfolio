import { ButtonLink } from "~/components/ui/ButtonLink";

// Pre-rendered at /404 and served as the static 404 page for every unknown path,
// so the server never has to render anything.
export function meta() {
  return [{ title: "Page not found" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <main className="page">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <ButtonLink href="/">Back to the homepage</ButtonLink>
    </main>
  );
}
