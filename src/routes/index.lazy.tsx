import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { useAppSelector } from "@/hooks/use-store";
import { ProjectValidator } from "@/validators";
import { NameById } from "@/components/name-by-id";

const Page: React.FC = () => {
  const role = useAppSelector((state) => state.auth.role);
  const { data } = useQuery({
    queryKey: ["user-home"],
    queryFn: async () => {
      try {
        const response = await network().get(`${role === "buyer" ? "/buyer" : "/developer"}/home`);
        const parsed = await ProjectValidator.spa(response.data);
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
  console.log(data);
  if (data) {
    return (
      <div>
        <div className="border-b border-gray-200 shadow-sm">
          <p className="text-2xl font-semibold p-3">Home</p>
        </div>
        <div className="p-3">
          {data.length === 0 ? (
            <div>You have no ongoing projects!</div>
          ) : (
            <div className="grid grid-cols-2">
              {data.map((project) => {
                const local = new Date(
                  new Date(project.createdAt).toLocaleString("en-GB", { timeZone: "Europe/London" })
                );
                return (
                  <div
                    key={project.id}
                    className="w-full border border-gray-200 rounded p-5 flex space-x-4"
                  >
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

export const Route = createLazyFileRoute("/")({
  component: Page,
});
