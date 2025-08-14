import { useQuery } from "@tanstack/react-query";

import { getUserAdresses } from "@/actions/get-user-adresses";

export const getUserAdressesQueryKey = () => ["user-adresses"] as const;

export const useUserAdresses = () => {
  return useQuery({
    queryKey: getUserAdressesQueryKey(),
    queryFn: getUserAdresses,
  });
};
