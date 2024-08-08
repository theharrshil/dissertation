import { network } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

const validator = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
    })
  ),
  success: z.boolean(),
});

export const useGetAllPlots = () => {
  return useQuery({
    queryKey: ["all-plots"],
    queryFn: async () => {
      try {
        const response = await network().get("/plot/all");
        const parsed = await validator.passthrough().spa(response.data);
        if (parsed.success) {
          return parsed.data.data;
        } else {
          throw new Error("parsing error");
        }
      } catch {
        throw new Error("something went wrong!");
      }
    },
    staleTime: Infinity,
  });
};
