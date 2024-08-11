import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";
import { useAppSelector } from "../use-store";
import { ProjectValidator } from "@/validators";

export const useBrowse = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return useQuery({
    queryKey: ["browse"],
    queryFn: async () => {
      try {
        const response = await network().get("/plot/browse");
        const parsed = await ProjectValidator.spa(response.data);
        if (parsed.success) {
          return parsed.data.data;
        } else {
          throw new Error("parsing error");
        }
      } catch (e) {
        console.log(e);
        throw new Error("something went wrong!");
      }
    },
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
};
