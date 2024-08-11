import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";

const Page: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["extras"],
    queryFn: async () => {
      try {
        const response = await network().get("/developer/extras");
        return response.data;
      } catch {
        throw new Error("something went wrong");
      }
    },
  });
  console.log(data);
  return <div>Extras Page</div>;
};

export const Route = createLazyFileRoute("/extras/")({
  component: Page,
});
