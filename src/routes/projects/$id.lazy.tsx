import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cn, network } from "@/lib/utils";
import { NameById } from "@/components/name-by-id";
import { ChoiceById, ExtraById } from "@/components/feature-by-id";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

interface Response {
  project: {
    choices: string[] | null;
    extras: string[] | null;
    id: string;
    ownerId: string;
    developerId: string;
    ongoing: boolean | null;
    plotId: string;
  };
  plot: {
    id: string;
    name: string;
    createdAt: Date;
    ownerId: string | null;
    developerId: string | null;
    address: string;
    isReserved: boolean;
    postcode: string;
    price: string;
    currency: string;
    bhk: string;
    image: string | null;
  };
  progress: {
    id: string;
    ownerId: string;
    developerId: string;
    done: boolean;
    projectId: string;
    choiceId: string | null;
    extrasId: string | null;
  }[];
}

const Page: React.FC = () => {
  const { id } = Route.useParams();
  const elementRef = React.useRef(null);
  const { data, refetch } = useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await network().get(`/developer/project/${id}`);
      return response.data.data as Response;
    },
  });
  const handleDownloadImage = () => {
    if (elementRef.current === null) {
      return;
    }
    toPng(elementRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "generated-image.png";
        link.click();
      })
      .catch((err) => {
        console.error("Error generating image:", err);
      });
  };
  const handleGeneratePdf = () => {
    if (elementRef.current === null) {
      return;
    }
    toPng(elementRef.current)
      .then((dataUrl) => {
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("generated-document.pdf");
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
      });
  };
  console.log(data);
  return (
    <div className="max-h-screen overflow-y-scroll">
      <div className="border-b border-gray-200 shadow-sm">
        <p className="text-2xl font-semibold p-4">Welcome to Project View</p>
      </div>
      <div className="p-3 space-x-2">
        <Button onClick={handleDownloadImage}>Download This as Image</Button>
        <Button onClick={handleGeneratePdf}>Download This as PDF</Button>
      </div>
      {data ? (
        <div className="flex justify-around" ref={elementRef}>
          <div className="p-4 w-full max-w-md">
            <div className="flex flex-col gap-4 border-gray-200 shadow-sm border p-3">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">Plot</p>
                <div className="flex gap-2">
                  <p className="font-semibold">Name</p>
                  <p>{data.plot.name}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Address</p>
                  <p>{data.plot.address}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Postcode</p>
                  <p>{data.plot.postcode}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Price</p>
                  <p>{data.plot.price}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">Currency</p>
                  <p>{data.plot.currency}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">BHK</p>
                  <p>{data.plot.bhk}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold">Image</p>
                  <img src={data.plot.image || ""} alt="plot-image" className="h-40" />
                </div>
              </div>
              {data.plot.ownerId ? (
                <div className="gap-2 flex items-center">
                  <p className="font-semibold">Owner: </p>
                  <NameById id={data.plot.ownerId} />
                </div>
              ) : null}
              {data.plot.developerId ? (
                <div className="flex gap-2 items-center ">
                  <p className="font-semibold">Developer</p>
                  <NameById id={data.plot.developerId} />
                </div>
              ) : null}
            </div>
          </div>
          <div className="p-4 w-full">
            <div className="flex flex-col gap-4 border-gray-200 shadow-sm border p-3 max-w-md">
              <div className="flex gap-2 items-center">
                <p className="font-semibold">Project</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-semibold">Ongoing</p>
                <p>{data.project.ongoing ? "Yes" : "No"}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-semibold">Progress</p>
              </div>
              <div className="flex gap-2 items-center flex-col">
                {data.progress.map((feat) => (
                  <div
                    key={feat.id}
                    className={cn(
                      "flex py-1 px-2 items-center w-full justify-between cursor-pointer",
                      feat.done ? "bg-green-200" : "bg-red-200"
                    )}
                    onClick={async () => {
                      try {
                        await network().post("/developer/update-progress", {
                          id: feat.id,
                        });
                        refetch();
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    <p className="font-semibold">{feat.done ? "Done" : "Pending"}</p>
                    {feat.choiceId ? (
                      <ChoiceById id={feat.choiceId} />
                    ) : (
                      <ExtraById id={feat.extrasId as string} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};

export const Route = createLazyFileRoute("/projects/$id")({
  component: Page,
});
