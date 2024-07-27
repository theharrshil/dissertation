import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/reports")({
  component: () => <div>Hello /reports!</div>,
});
