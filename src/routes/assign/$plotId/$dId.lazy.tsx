import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { CartAtom, type CartItem } from "@/slices/cart-slice";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

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

const contains = (ar: CartItem[], c: CartItem): boolean => {
  let temp = false;
  ar.forEach((i) => {
    if (i.id === c.id) {
      temp = true;
    }
  });
  return temp;
};

const Page: React.FC = () => {
  const { plotId, dId } = Route.useParams();
  const [cart, setCart] = useAtom(CartAtom);
  const { data } = useQuery({
    queryKey: ["options", dId],
    queryFn: async () => {
      try {
        const response = await network().post("/buyer/get-options", { plotId, developerId: dId });
        return response.data.data as Response;
      } catch {
        throw new Error("something went wrong!");
      }
    },
  });
  const handleClick = (args: CartItem) => {
    if (cart.length !== 0 && cart[0].developerId === args.developerId) {
      const isIn = contains(cart, args);
      if (isIn) {
        const temp: CartItem[] = [];
        cart.forEach((i) => {
          if (i.id !== args.id) {
            temp.push(i);
          }
        });
        setCart(temp);
      } else {
        setCart([...cart, args]);
      }
    } else {
      setCart([{ ...args }]);
    }
  };
  console.log(cart);
  if (data)
    return (
      <div>
        <div className="border-b border-gray-200 shadow-sm flex justify-between items-center">
          <p className="text-2xl font-semibold p-3">Options Offered by the Developer</p>
          {cart.length !== 0 && (
            <Button variant="outline" asChild>
              <Link to="/cart">Continue to Cart</Link>
            </Button>
          )}
        </div>
        <div className="p-3 space-y-4">
          <div>
            <p className="font-semibold capitalize text-xl">Choices</p>
            <div className="flex space-x-3">
              {data.choices.map((choice) => (
                <div
                  key={choice.id}
                  className={cn(
                    "rounded p-3 shadow-sm border border-gray-300 w-80",
                    contains(cart, { ...choice, type: "choice" }) &&
                      "border-green-300 shadow-sm border-2"
                  )}
                  onClick={() =>
                    handleClick({
                      ...choice,
                      type: "choice",
                    })
                  }
                >
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
          </div>
          <div>
            <p className="font-semibold capitalize text-xl">Extras</p>
            <div className="flex space-x-3">
              {data.extras.map((extra) => (
                <div
                  key={extra.id}
                  className={cn(
                    "rounded p-3 shadow-sm border border-gray-300 w-80 duration-200",
                    contains(cart, { ...extra, type: "extra" }) &&
                      "border-green-300 shadow-sm border-2"
                  )}
                  onClick={() =>
                    handleClick({
                      ...extra,
                      type: "extra",
                    })
                  }
                >
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
        </div>
      </div>
    );
  return <div>...Loading</div>;
};

export const Route = createLazyFileRoute("/assign/$plotId/$dId")({
  component: Page,
});
