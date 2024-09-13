import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { network } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Pen } from "lucide-react";

const validator = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      developerId: z.string(),
      bhk: z.string(),
      image: z.string().nullable(),
      stripe_product_id: z.string().nullable(),
      stripe_price_id: z.string().nullable(),
    })
  ),
  success: z.boolean(),
});

const Page: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["choices"],
    queryFn: async () => {
      try {
        const response = await network().get("/developer/choices");
        const parsed = await validator.spa(response.data);
        if (parsed.success) {
          return parsed.data.data;
        } else {
          throw new Error("parsing error");
        }
      } catch {
        throw new Error("something went wrong");
      }
    },
  });
  if (data) {
    return (
      <div className="max-h-screen overflow-y-scroll">
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-4">Choices</p>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <Button variant="outline" onClick={() => navigate({ to: "/choices/add" })}>
              <Plus className="h-4 w-4 mr-2" /> Add Choice
            </Button>
          </div>
          {data.length === 0 ? (
            <div>
              <p>You have not added any choices.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-5">
              {data.map((choice) => (
                <div
                  key={choice.id}
                  className="rounded p-3 shadow-sm border border-gray-300 w-80 relative"
                >
                  <div className="absolute top-2 right-2 flex gap-2 items-center">
                    <Button
                      size="icon"
                      onClick={() => navigate({ to: `/choices/edit/${choice.id}` })}
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src={choice.image || ""} alt={choice.name} className="h-44" />
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <p className="capitalize">{choice.name}</p>
                    <p>For: {choice.bhk} BHK</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return <div>Choices Page</div>;
};

export const Route = createLazyFileRoute("/choices/")({
  component: Page,
});
