import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBrowse } from "@/hooks/queries/use-browse";
import { ClipboardPen } from "lucide-react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { downloadCSV } from "@/lib/csv-download";
import { Download } from "lucide-react";

const Page: React.FC = () => {
  const { data } = useBrowse();
  const navigate = useNavigate();
  if (data) {
    return (
      <div className="max-h-screen overflow-y-scroll">
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-3">Browse</p>
        </div>
        <div className="mt-3 mx-3">
          <Button onClick={() => downloadCSV(data, "Browsable Properties")}>
            <span>
              <Download className="h-4 w-4 mr-2" />
            </span>
            Download These Properties
          </Button>
        </div>
        <div className="p-3 grid grid-cols-3 gap-3">
          {data.map((plot) => (
            <div
              key={plot.id}
              className="h-40 rounded-sm border border-gray-200 shadow-sm p-3 flex items-center space-x-2"
            >
              <div>
                <img
                  src={plot.image || ""}
                  alt={plot.name}
                  className="object-fill max-h-32 rounded-sm"
                />
              </div>
              <div>
                <p className="font-semibold">{plot.name}</p>
                <p>Price: £{plot.price}</p>
                <p>{plot.address}</p>
                <p>{plot.postcode}</p>
                <p>Size: {plot.bhk} BHK</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={() => navigate({ to: "/requests" })}
                      >
                        <ClipboardPen className="h-5 w-5 mr-2" />
                        <span className="text-sm">Reserve</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reserve This Property</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
};

export const Route = createLazyFileRoute("/browse")({
  component: Page,
});
