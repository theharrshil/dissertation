import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { z } from "zod";

export const NonRoleValidator = z.object({
  data: z.array(
    z.object({
      createdAt: z.string(),
      email: z.string().email(),
      id: z.string(),
      name: z.string(),
      role: z.string(),
      password: z.string(),
      salt: z.string(),
    })
  ),
  success: z.boolean(),
});

export const useNonRole = () => {
  return useQuery({
    queryKey: ["non-role-users"],
    queryFn: async () => {
      try {
        const response = await network().get("/requests/possible-recipients");
        const parsed = NonRoleValidator.safeParse(response.data);
        if (parsed.success) {
          return parsed.data.data;
        } else {
          throw new Error("parsing error!");
        }
      } catch {
        throw new Error("something went wrong!");
      }
    },
  });
};
