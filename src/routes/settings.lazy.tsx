import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { network } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const Page: React.FC = () => {
  const navigate = useNavigate();
  const client = useQueryClient();
  const logOut = async () => {
    const response = await network.get("/auth/logout");
    if (response.data.success) {
      client.removeQueries({
        queryKey: ["user"],
      });
      navigate({ to: "/" });
    }
  };
  return (
    <div>
      <Button onClick={logOut}>Log Out</Button>
    </div>
  );
};

export const Route = createLazyFileRoute("/settings")({
  component: Page,
});
