import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useAppDispatch } from "@/hooks/use-store";
import { resetAuth } from "@/slices/auth-slice";
import { useQueryClient } from "@tanstack/react-query";

const Page: React.FC = () => {
  const navigate = useNavigate();
  const client = useQueryClient();
  const dispatch = useAppDispatch();
  const logOut = async () => {
    localStorage.removeItem("token");
    dispatch(resetAuth());
    client.clear();
    navigate({ to: "/" });
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
