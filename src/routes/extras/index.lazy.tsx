import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { z } from "zod";

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
        <div className="grid grid-cols-3 p-3 gap-x-5">
          {data.map((extra) => (
            <div key={extra.id} className="rounded p-3 shadow-sm border border-gray-300 w-80">
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
      </div>
    );
  }
  return <div>Extras Page</div>;
};

export const Route = createLazyFileRoute("/extras/")({
  component: Page,
});
