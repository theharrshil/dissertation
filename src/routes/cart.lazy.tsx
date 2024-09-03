import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CartAtom, type CartItem, CartPlotId } from "@/slices/cart-slice";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { network } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const paymentValidation = z.object({
  cardNumber: z.string(),
  cvc: z.string(),
  exp_month: z.string(),
  exp_year: z.string(),
});

type PaymentForm = z.infer<typeof paymentValidation>;

const Page: React.FC = () => {
  const [cart, setCart] = useAtom(CartAtom);
  const [plotId, setPlotId] = useAtom(CartPlotId);
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
    if (cart.length > 0) {
      let tmp = 0;
      cart.forEach((i) => {
        if (i.price) {
          tmp += Number.parseInt(i.price);
        }
      });
      setTotal(tmp);
    }
  }, [cart]);
  const { register, handleSubmit } = useForm<PaymentForm>({
    resolver: zodResolver(paymentValidation),
  });
  const removeFromCart = (id: string) => {
    const temp: CartItem[] = [];
    cart.forEach((i) => {
      if (i.id !== id) {
        temp.push(i);
      }
    });
    setCart(temp);
  };
  const onSubmit = async (data: PaymentForm) => {
    const choiceIds: string[] = [];
    const extrasIds: string[] = [];
    cart.forEach((i) => {
      if (i.type === "choice") {
        choiceIds.push(i.id);
      } else {
        extrasIds.push(i.id);
      }
    });
    const sentData = {
      ...data,
      amount: total,
      developerId: cart[0].developerId,
      choiceIds,
      extrasIds,
      plotId,
    };
    try {
      const response = await network().post("/buyer/charge", sentData);
      console.log(response.data);
      setPlotId("");
      setCart([]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="border-b border-gray-200 shadow-sm">
        <p className="text-2xl font-semibold p-4">Cart</p>
      </div>
      <div>
        {cart.length === 0 ? (
          <>You have nothing in the cart</>
        ) : (
          <div className="p-3">
            <div className="max-w-xs mb-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <p>
                      Your Cart Total: <span className="font-semibold">£{total}</span>
                    </p>
                  </div>
                  <Input {...register("cardNumber")} />
                </div>
                <div className="flex space-x-3">
                  <div>
                    <Label>Expiry Month</Label>
                    <Input {...register("exp_month")} />
                  </div>
                  <div>
                    <Label>Expiry Year</Label>
                    <Input {...register("exp_year")} />
                  </div>
                </div>
                <div>
                  <Label>CVC Number</Label>
                  <Input {...register("cvc")} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Pay</Button>
                </div>
              </form>
            </div>
            <div className="flex space-x-3 space-y-3">
              {cart.map((i) => (
                <div
                  key={i.id}
                  className="rounded p-3 shadow-sm border border-gray-300 w-80"
                  onClick={() => removeFromCart(i.id)}
                >
                  <div className="flex items-center justify-center">
                    <img src={i.image || ""} alt={i.name} className="h-44" />
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <p className="capitalize">{i.name}</p>
                    <p>For: {i.bhk} BHK</p>
                    {i.price && <p>Price: £{i.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/cart")({
  component: Page,
});
