import * as React from "react";
import { network } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";

export const ChoiceById: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery({
    queryKey: ["choice", id],
    queryFn: async () => {
      const response = await network().post("/buyer/choice", { id });
      return response.data.data;
    },
  });
  if (data) {
    return <p>{data.name}</p>;
  }
  <p>Loading...</p>;
};

export const ExtraById: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery({
    queryKey: ["choice", id],
    queryFn: async () => {
      const response = await network().post("/buyer/extra", { id });
      return response.data.data;
    },
  });
  if (data) {
    return <p>{data.name}</p>;
  }
  <p>Loading...</p>;
};
