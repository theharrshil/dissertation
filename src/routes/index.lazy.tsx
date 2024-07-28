import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

const Page: React.FC = () => {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Page,
});
