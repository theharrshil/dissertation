import { createLazyFileRoute } from "@tanstack/react-router";

const Browse: React.FC = () => {
  return <div>Browse</div>;
};

export const Route = createLazyFileRoute("/browse")({
  component: Browse,
});
