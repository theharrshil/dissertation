import { createLazyFileRoute } from "@tanstack/react-router";

const Page: React.FC = () => {
  return <div>Page</div>;
};

export const Route = createLazyFileRoute("/browse")({
  component: Page,
});
