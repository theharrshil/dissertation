import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { cn, network, truncate } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const validator = z.object({
  name: z.string(),
  bhk: z.number(),
  image: z.string().nullable().optional(),
  price: z.number(),
});

type Validator = z.infer<typeof validator>;

const Page: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<Validator>({
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
    try {
      if (!data.image) {
        data.image = null;
      }
      await network().post("/developer/extra", data);
      navigate({ to: "/extras" });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="border-b border-gray-200 shadow-sm">
        <p className="text-2xl font-semibold p-4">Add Extra</p>
      </div>
      <div className="p-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-xl border border-gray-300 rounded-md shadow-sm space-y-2 pt-2"
        >
          <div className="flex justify-between items-center px-4 py-2">
            <Label className="w-52">Name</Label>
            <Input {...register("name")} className="w-full" />
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

export const Route = createLazyFileRoute("/extras/add")({
  component: Page,
});
