import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { network } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNonRole } from "@/hooks/queries/use-non-role";
import { useGetAllPlots } from "@/hooks/queries/use-get-all-plots";

const FormValidator = z.object({
  description: z.string().min(0),
  to: z.string().min(0),
  regarding: z.string().min(0),
});

type FormType = z.infer<typeof FormValidator>;

type FormProps = {
  to: {
    id: string;
    name: string;
  }[];
  plots: {
    id: string;
    name: string;
  }[];
};

const RequestForm: React.FC<FormProps> = ({ to, plots }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<FormType>({
    defaultValues: {
      description: "",
      to: "",
      regarding: ",",
    },
    resolver: zodResolver(FormValidator),
  });
  const onSubmit = async (data: FormType) => {
    const response = await network().post("/requests/send", data);
    if (response.data.success) {
      navigate({ to: "/requests" });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-3 space-y-3">
      <div className="flex items-center">
        <Label htmlFor="to" className="mr-3">
          To
        </Label>
        <Select onValueChange={(v) => setValue("to", v)}>
          <SelectTrigger className="max-w-md">
            <SelectValue
              className="placeholder:text-gray-400 capitalize"
              placeholder="Please select a recipient!"
            />
          </SelectTrigger>
          <SelectContent>
            {to.map((recipient) => (
              <SelectItem value={recipient.id} key={recipient.id} className="capitalize">
                {recipient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center">
        <Label htmlFor="regarding" className="mr-3">
          For Project:
        </Label>
        <Select onValueChange={(v) => setValue("regarding", v)}>
          <SelectTrigger className="max-w-md">
            <SelectValue
              className="placeholder:text-gray-400 capitalize"
              placeholder="Please select a recipient!"
            />
          </SelectTrigger>
          <SelectContent>
            {plots.map((plot) => (
              <SelectItem value={plot.id} key={plot.id} className="capitalize">
                {plot.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center">
        <Label htmlFor="description">Description</Label>
        <Input className="ml-3" {...register("description")} />
      </div>
      <Button type="submit">
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
};

const Page: React.FC = () => {
  const roleQuery = useNonRole();
  const plotsQuery = useGetAllPlots();
  console.log(plotsQuery.data);
  return (
    <div>
      <div className="border-b border-gray-200">
        <p className="text-xl font-semibold p-3">Send A Request</p>
      </div>
      <div>
        {roleQuery.data && plotsQuery.data && (
          <RequestForm to={roleQuery.data} plots={plotsQuery.data} />
        )}
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/requests/new")({
  component: Page,
});
