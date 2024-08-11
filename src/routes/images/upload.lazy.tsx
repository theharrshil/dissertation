import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { storage } from "@/lib/resources";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { network } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

const validator = z.object({
  file: z.instanceof(File, {
    message: "file is required",
  }),
});

type Validator = z.infer<typeof validator>;

const Page: React.FC = () => {
  const navigate = useNavigate();
  const { setValue, handleSubmit } = useForm<Validator>({ resolver: zodResolver(validator) });
  const onSubmit = async ({ file }: Validator) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploaded = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploaded.ref);
      const response = await network().post("/developer/upload-image", {
        url,
        name: uploaded.metadata.name,
      });
      navigate({
        to: "/images",
      });
      console.log(response.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue("file", e.target.files[0]);
    }
  };
  return (
    <div>
      <div className="border-b border-gray-200 shadow-sm">
        <p className="text-2xl font-semibold p-3">Upload an Image</p>
      </div>
      <div className="p-3">
        <p className="font-semibold mb-3">
          Upload an Image and it'll be available to attach to choices and extras and it's tab
        </p>
        <form
          className="grid w-full max-w-sm items-center gap-1.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label htmlFor="picture"></Label>
          <Input type="file" name="picture" id="picture" onChange={handleFileChange} />
          <Button type="submit">Upload</Button>
        </form>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/images/upload")({
  component: Page,
});
