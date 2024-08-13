import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { z } from "zod";

const Validator = z.object({
  data: z.object({
    name: z.string(),
    id: z.string(),
    ownerId: z.string().nullable(),
    isReserved: z.boolean(),
    developerId: z.string().nullable(),
    image: z.string().nullable(),
    address: z.string(),
    createdAt: z.string(),
    postcode: z.string(),
    price: z.string(),
    currency: z.string(),
    bhk: z.string(),
  }),
  success: z.boolean(),
});

export const PlotById: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery({
    queryKey: ["plot", id],
    queryFn: async () => {
      try {
        const response = await network().get(`/plot?id=${id}`);
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
  if (data) {
    return <p className="ml-1">{data.name}</p>;
  }
  return <p className="ml-1">Loading...</p>;
};
