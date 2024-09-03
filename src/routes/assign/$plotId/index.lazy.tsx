import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { NameById } from "@/components/name-by-id";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface Response {
  choices: {
    id: string;
    name: string;
    developerId: string;
    bhk: string;
    image: string | null;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
  }[];
  extras: {
    id: string;
    name: string;
    developerId: string;
    price: string;
    bhk: string;
    image: string | null;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
  }[];
}

const Page: React.FC = () => {
  const { plotId } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["possible-options"],
    queryFn: async () => {
      try {
        const response = await network().post("/buyer/to-be-chosen", { plotId });
        return response.data.data as Response;
      } catch {
        throw new Error("something went wrong");
      }
    },
  });
  if (data) {
    const developers: string[] = [];
    data.choices.forEach((c) => {
      if (!developers.includes(c.developerId)) developers.push(c.developerId);
    });
    data.extras.forEach((e) => {
      if (!developers.includes(e.developerId)) developers.push(e.developerId);
    });
    return (
      <div>
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-3">Choose A Developer</p>
        </div>
        <div className="p-3 space-y-3 max-w-xl">
          {developers.map((d) => {
            return (
              <div key={d} className="border border-gray-300 p-3 rounded-sm">
                <div className="flex items-center justify-between max-w-xl">
                  <div className="flex">
                    Developer: <NameById id={d} />
                  </div>
                  <Link to={`/assign/${plotId}/${d}`}>
                    <Button variant="ghost">Explore</Button>
                  </Link>
                </div>
                <div className="mt-2">
                  <p className="font-semibold capitalize">Choices:</p>
                  {data.choices.map((c) => {
                    if (c.developerId === d) return <div key={c.id}>Choices Id: {c.id}</div>;
                    return null;
                  })}
                </div>
                <div>
                  <p className="font-semibold capitalize">Extras:</p>
                  {data.extras.map((e) => {
                    if (e.developerId === d)
                      return (
                        <div key={e.id}>
                          <p>Extras Id: {e.id}</p>
                          <p>Price: {e.price}</p>
                        </div>
                      );
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
};

export const Route = createLazyFileRoute("/assign/$plotId/")({
  component: Page,
});
