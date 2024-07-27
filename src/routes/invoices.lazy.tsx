import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/invoices")({
  component: () => <div>Hello /invoices!</div>,
});
