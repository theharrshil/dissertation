import { network } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ResponseValidator } from "@/components/forms/auth-form";

export const useUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await network.get("/auth");
        const parsed = await ResponseValidator.spa(response.data);
        if (parsed.success) {
          const { data } = parsed.data;
          return data;
        } else {
          throw new Error("there was a problem");
        }
      } catch (e) {
        console.log(e);
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
  return query;
};
