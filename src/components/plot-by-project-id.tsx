import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { network } from "../lib/utils";

export const PlotByProjectId: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery({
    queryKey: ["choice", id],
    queryFn: async () => {
      const response = await network().post("/buyer/project-by-plot-id", { id });
      return response.data.data;
    },
  });
  console.log(data);
  if (data) {
    return <p>{data.name}</p>;
  }
  <p>Loading...</p>;
};
