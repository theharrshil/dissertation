import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";

const Page: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      try {
        const response = await network().get("/auth/all-users?role=developer");
        return response.data;
      } catch {
        throw new Error("something went wrong!");
      }
    },
  });
  console.log(data);
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Page,
});
