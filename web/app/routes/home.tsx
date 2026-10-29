import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leyla Mammadova" },
    {
      name: "description",
      content:
        "Math & Computer Science student at ESOGU, building full-stack web and mobile products.",
    },
  ];
}

export default function Home() {
  return (
    <main className="page">
      <h1>Leyla Mammadova</h1>
      <p>Portfolio v2 is under construction.</p>
    </main>
  );
}
