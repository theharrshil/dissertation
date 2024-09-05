import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cn, network } from "@/lib/utils";
import { useAppSelector } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { downloadCSV } from "@/lib/csv-download";
import { Download } from "lucide-react";
import { NameById } from "@/components/name-by-id";
import { CartPlotId } from "@/slices/cart-slice";
import { useSetAtom } from "jotai";
import { ChoiceById, ExtraById } from "@/components/feature-by-id";
import { PlotByProjectId } from "@/components/plot-by-project-id";

const Page: React.FC = () => {
  const navigation = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const setCartPlotId = useSetAtom(CartPlotId);
  const [progress, setProgress] = React.useState<never[]>([]);
  const { data } = useQuery({
    queryKey: ["user-home"],
    queryFn: async () => {
      try {
        const response = await network().get(`${role === "buyer" ? "/buyer" : "/developer"}/home`);
        return response.data.data;
      } catch {
        throw new Error("something went wrong");
      }
    },
  });
  React.useEffect(() => {
    if (data && data.progress) {
      setProgress(data.progress);
    }
  }, [data]);
  console.log(data);
  if (data)
    return (
      <>
        {role === "buyer" ? (
          <div className="overflow-y-scroll max-h-screen">
            <div className="border-b border-gray-200 shadow-sm">
              <p className="text-2xl font-semibold p-3">Home</p>
            </div>
            <div className="p-3">
              <>
                <div className="mb-7">
                  <p className="text-xl font-semibold mb-4">Reserved Plots</p>
                  {data.unassigned.length === 0 ? (
                    <p>You have no reserved plots.</p>
                  ) : (
                    // @ts-expect-error uty
                    data.unassigned.map((plot) => (
                      <div
                        key={plot.id}
                        className="h-48 rounded-sm border border-gray-200 shadow-sm p-3 flex items-center justify-around max-w-md"
                      >
                        <div>
                          <img
                            src={plot.image || ""}
                            alt={plot.name}
                            className="object-fill max-h-32 rounded-sm"
                          />
                        </div>
                        <div className="w-48">
                          <p className="font-semibold">{plot.name}</p>
                          <p>Price: £{plot.price}</p>
                          <p>{plot.address}</p>
                          <p>{plot.postcode}</p>
                          <p>Size: {plot.bhk} BHK</p>
                          <Button
                            className="my-2"
                            onClick={() => {
                              setCartPlotId(plot.id);
                              navigation({ to: `/assign/${plot.id}` });
                            }}
                          >
                            Assign
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mb-7">
                  <p className="text-xl font-semibold mb-4">Projects</p>
                  <div>
                    {data.projects.length === 0 ? (
                      <p>You have no projects.</p>
                    ) : (
                      // @ts-expect-error uty
                      data.projects.map((plot) => (
                        <div
                          key={plot.id}
                          className="h-48 rounded-sm border border-gray-200 shadow-sm p-3 flex items-center justify-around max-w-md"
                        >
                          <div>
                            <img
                              src={plot.image || ""}
                              alt={plot.name}
                              className="object-fill max-h-32 rounded-sm"
                            />
                          </div>
                          <div className="w-48">
                            <p className="font-semibold">{plot.name}</p>
                            <p>Price: £{plot.price}</p>
                            <p>{plot.address}</p>
                            <p>{plot.postcode}</p>
                            <p>Size: {plot.bhk} BHK</p>
                            <p className="flex items-center">
                              Developer: <NameById id={plot.developerId} />
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="mb-7">
                  <p className="text-xl font-semibold mb-4">Progress</p>
                  <div>
                    {Object.keys(progress).length === 0 ? (
                      <p>There is no progress to show.</p>
                    ) : (
                      <>
                        {Object.keys(progress).map((project) => {
                          return (
                            <div
                              key={project}
                              className="flex flex-col max-w-sm space-y-3 items-center border border-gray-200 py-3"
                            >
                              <PlotByProjectId id={project} />
                              {/* @ts-expect-error uty */}
                              {data.progress[project].map((feat) => {
                                return (
                                  <div
                                    key={feat.id}
                                    className={cn(
                                      "flex py-1 px-2 items-center w-full",
                                      feat.done ? "bg-green-200" : "bg-red-200"
                                    )}
                                  >
                                    <div className="flex justify-between w-full">
                                      <>
                                        {feat.choiceId ? (
                                          <ChoiceById id={feat.choiceId} />
                                        ) : (
                                          <ExtraById id={feat.extrasId} />
                                        )}
                                      </>
                                      {feat.done ? <p>Done</p> : <p>Pending</p>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </>
            </div>
          </div>
        ) : (
          <div className="overflow-y-scroll max-h-screen">
            <div className="border-b border-gray-200 shadow-sm">
              <p className="text-2xl font-semibold p-3">Home</p>
            </div>
            <div className="relative grid p-3 grid-cols-2">
              {/**@ts-expect-error uty  */}
              {data.map((project) => {
                const local = new Date(
                  new Date(project.createdAt).toLocaleString("en-GB", { timeZone: "Europe/London" })
                );
                const csv: (typeof project)[] = [];
                csv.push(project);
                return (
                  <div
                    key={project.id}
                    className="w-full border border-gray-200 rounded p-5 flex space-x-4 relative"
                  >
                    <div className="absolute right-3 top-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadCSV(csv, project.name)}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                    <div>
                      <img
                        className="max-h-44 rounded object-cover"
                        src={project.image || ""}
                        alt={project.name}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold">{project.name}</p>
                      <p>{project.bhk} BHK</p>
                      <p>Price: £{project.price}</p>
                      <p>Address: {project.address}</p>
                      <p>Post Code: {project.postcode}</p>
                      {project.developerId && (
                        <div className="flex">
                          Being Developed By:
                          <NameById id={project.developerId} />
                        </div>
                      )}
                      <p>Date on Market: {local.toLocaleString()}</p>
                      <Button
                        onClick={() => {
                          navigation({ to: `/projects/${project.id}` });
                        }}
                      >
                        Go To This Project
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Page,
});
