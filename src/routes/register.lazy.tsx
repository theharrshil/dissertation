import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { network, truncate, cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const validator = z.object({
  name: z.string(),
  address: z.string(),
  postcode: z.string(),
  price: z.number(),
  bhk: z.number(),
  image: z.string().nullable().optional(),
});

type Validator = z.infer<typeof validator>;

const Page: React.FC = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, setValue } = useForm<Validator>({
    resolver: zodResolver(validator),
  });
  const { data } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      try {
        const response = await network().get("/images");
        const parsed = await z
          .object({
            data: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                url: z.string(),
                uploadedBy: z.string(),
              })
            ),
            success: z.boolean(),
          })
          .spa(response.data);
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
  const onSubmit = async (data: Validator) => {
    if (!data.image) {
      data.image = null;
    }
    await network().post("/buyer/register-plot", { ...data });
    navigate({ to: "/" });
    console.log(data);
  };
  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="border-b border-gray-200 shadow-sm">
        <p className="text-2xl font-semibold p-4">Register A Plot</p>
      </div>
      <div className="p-3">
        <form
          className="max-w-xl border border-gray-300 rounded-md shadow-sm space-y-2 pt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between items-center px-4 py-2">
            <Label className="w-52">Name</Label>
            <Input {...register("name")} className="w-full" />
          </div>
          <div className="flex justify-between items-center px-4 py-2">
            <Label className="w-52">Address</Label>
            <Input {...register("address")} className="w-full" />
          </div>
          <div className="flex justify-between items-center px-4 py-2">
            <Label className="w-52">Post Code</Label>
            <Input {...register("postcode")} className="w-full" />
          </div>
          <div className="flex justify-between items-center px-4 py-2">
            <Label className="w-52">BHK</Label>
            <Input {...register("bhk", { valueAsNumber: true })} className="w-full" type="number" />
          </div>
          {data && (
            <div className="flex justify-between items-center px-4 py-2">
              <Label className="w-52">Image (Optional)</Label>
              <Select onValueChange={(v) => setValue("image", v)}>
                <SelectTrigger className={cn("w-full h-40")}>
                  <SelectValue
                    className="placeholder:text-gray-400"
                    placeholder="Please select an image!"
                  />
                </SelectTrigger>
                <SelectContent>
                  {data.map((image) => (
                    <SelectItem key={image.id} value={image.url}>
                      <div className="w-full flex items-center space-x-4">
                        <img src={image.url} alt={image.name} className="w-24" />
                        <p>{truncate(image.name, 50)}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-between items-center px-4 py-2">
            <Label className="w-52">Price</Label>
            <Input
              {...register("price", { valueAsNumber: true })}
              className="w-full"
              type="number"
            />
          </div>
          <div className="w-full bg-gray-50 p-3 border-t border-t-gray-300 flex items-center justify-end">
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/register")({
  component: Page,
});
