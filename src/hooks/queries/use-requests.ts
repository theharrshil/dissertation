import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { z } from "zod";

const Validator = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      status: z.string(),
      recipient: z.string(),
      sender: z.string(),
      message: z.string().nullable(),
      plotId: z.string().nullable(),
      createdAt: z.string(),
    })
  ),
  success: z.boolean(),
});

export const useRequests = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        const response = await network().get("/requests");
        console.log(response.data);
        const parsed = await Validator.spa(response.data);
        if (parsed.success) {
          return parsed.data.data.reverse();
        } else {
          throw new Error(parsed.error.message);
        }
      } catch (e) {
        console.log(e);
      }
    },
    refetchOnMount: true,
    staleTime: Infinity,
  });
};
