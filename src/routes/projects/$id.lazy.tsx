import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";

const Page: React.FC = () => {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await network().get(`/developer/project/${id}`);
      return response.data.data;
    },
  });
  console.log(data);
  return <div>Welcome To Project View</div>;
};

export const Route = createLazyFileRoute("/projects/$id")({
  component: Page,
});
