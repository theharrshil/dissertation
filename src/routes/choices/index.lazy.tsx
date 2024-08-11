import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
// import { z } from "@hookform/resolvers";
import { network } from "@/lib/utils";

const Page: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["choices"],
    queryFn: async () => {
      try {
        const response = await network().get("/developer/choices");
        return response.data;
      } catch {
        throw new Error("something went wrong");
      }
    },
  });
  console.log(data);
  return <div>Choices</div>;
};

export const Route = createLazyFileRoute("/choices/")({
  component: Page,
});
