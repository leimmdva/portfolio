import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx", { id: "home-en" }),
  route("tr", "routes/home.tsx", { id: "home-tr" }),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
