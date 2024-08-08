import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { storage } from "@/lib/resources";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { network } from "@/lib/utils";

const Page: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const onSubmit = async (e: React.FormEvent) => {
    if (file) {
      e.preventDefault();
      try {
        const storageRef = ref(storage, file.name);
        const uploaded = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploaded.ref);
        const response = await network().post("/developer/upload-image", {
          url,
          name: uploaded.metadata.name,
        });
        console.log(response.data);
      } catch (e) {
        console.log("Error: ", e);
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <form className="grid w-full max-w-sm items-center gap-1.5" onSubmit={onSubmit}>
      <Label htmlFor="picture"></Label>
      <Input type="file" name="picture" id="picture" onChange={handleFileChange} />
      <Button type="submit">Upload</Button>
    </form>
  );
};

export const Route = createLazyFileRoute("/upload-image")({
  component: Page,
});
