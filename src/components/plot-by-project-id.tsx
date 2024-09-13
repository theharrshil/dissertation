import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { network } from "../lib/utils";
import { useAppSelector } from "@/hooks/use-store";

export const PlotByProjectId: React.FC<{ id: string }> = ({ id }) => {
  const role = useAppSelector((state) => state.auth.role);
  const { data } = useQuery({
    queryKey: ["choice", id],
    queryFn: async () => {
      const response = await network().post(
        role === "buyer" ? "/buyer/project-by-plot-id" : "/developer/project-by-plot-id",
        { id }
      );
      return response.data.data;
    },
  });
  if (data) {
    return <p>{data.name}</p>;
  }
  <p>Loading...</p>;
};
