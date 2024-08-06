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
import { NonRoleValidator, useNonRole } from "@/hooks/queries/use-non-role";

const FormValidator = z.object({
  description: z.string().min(0),
  to: z.string().min(0),
});

type FormType = z.infer<typeof FormValidator>;

const FormProps = NonRoleValidator.omit({ success: true });

const RequestForm: React.FC<z.infer<typeof FormProps>> = ({ data }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<FormType>({
    defaultValues: {
      description: "",
      to: "",
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
            {data.map((recipient) => (
              <SelectItem value={recipient.id} key={recipient.id} className="capitalize">
                {recipient.name}
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
  const { data } = useNonRole();
  return (
    <div>
      <div className="border-b border-gray-200">
        <p className="text-xl font-semibold p-3">Send A Request</p>
      </div>
      <div>{data && <RequestForm data={data} />}</div>
    </div>
  );
};

export const Route = createLazyFileRoute("/requests/new")({
  component: Page,
});
