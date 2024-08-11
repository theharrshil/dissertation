import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network, truncate } from "@/lib/utils";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/resources";

const Validator = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      uploadedBy: z.string(),
    })
  ),
  success: z.boolean(),
});

const Page: React.FC = () => {
  const { data, refetch } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      try {
        const response = await network().get("/developer/images");
        const parsed = await Validator.spa(response.data);
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
  const deleteImage = async (name: string, id: string) => {
    try {
      const deleteRef = ref(storage, name);
      await deleteObject(deleteRef);
      await network().post("/developer/delete-image", { id });
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  if (data) {
    return (
      <div className="max-h-screen overflow-y-scroll">
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-3">Images</p>
        </div>
        <div className="p-3">
          <div className="flex">
            <Link to="/images/upload">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
          </div>
          <div className="mt-3">
            <p>Your uploaded images will show up here</p>
          </div>
          <div className="mt-3">
            {data.length === 0 ? (
              <div>There are no images to show!</div>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {data.map((image) => (
                  <div
                    key={image.id}
                    className="border border-gray-300 flex items-center justify-center flex-col p-3 rounded-lg shadow relative"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-3 right-3"
                      onClick={() => deleteImage(image.name, image.id)}
                    >
                      <Trash2 />
                    </Button>
                    <img src={image.url} alt={image.name} className="object-fill max-h-60" />
                    <p>{truncate(image.name, 30)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/images/")({
  component: Page,
});
