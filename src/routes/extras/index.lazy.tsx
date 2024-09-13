import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Pen, Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const validator = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      developerId: z.string(),
      price: z.string(),
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
    queryKey: ["extras"],
    queryFn: async () => {
      try {
        const response = await network().get("/developer/extras");
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
          <p className="text-2xl font-semibold p-4">Extras</p>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <Button variant="outline" onClick={() => navigate({ to: "/extras/add" })}>
              <Plus className="h-4 w-4 mr-2" /> Add Extra
            </Button>
          </div>
          {data.length === 0 ? (
            <div>You have not added any extras.</div>
          ) : (
            <div className="grid grid-cols-3 gap-x-5 gap-y-3">
              {data.map((extra) => (
                <div
                  key={extra.id}
                  className="rounded p-3 shadow-sm border border-gray-300 w-80 relative"
                >
                  <div className="absolute top-2 right-2 flex gap-2 items-center">
                    <Button
                      size="icon"
                      onClick={() => navigate({ to: `/extras/edit/${extra.id}` })}
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src={extra.image || ""} alt={extra.name} className="h-44" />
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <p className="capitalize">{extra.name}</p>
                    <p>For: {extra.bhk} BHK</p>
                    <p>Price: £{extra.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return <div>Extras Page</div>;
};

export const Route = createLazyFileRoute("/extras/")({
  component: Page,
});
