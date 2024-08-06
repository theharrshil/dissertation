import { useQuery } from "@tanstack/react-query";
import { network } from "@/lib/utils";

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user-by-id", id],
    queryFn: async () => {
      try {
        const response = await network().get(`/auth/by-id?id=${id}`);
        console.log(response.data);
        return response.data.data;
      } catch {
        throw new Error("something went wrong!");
      }
    },
    staleTime: Infinity,
  });
};
