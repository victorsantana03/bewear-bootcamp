import { useQuery } from "@tanstack/react-query";

import { getUserAdresses } from "@/actions/get-user-adresses";
import { shippingAdressTable } from "@/db/schema";

export const getUserAdressesQueryKey = () => ["user-adresses"] as const;

export const useUserAdresses = (params?: {
  initialData?: (typeof shippingAdressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUserAdressesQueryKey(),
    queryFn: getUserAdresses,
    initialData: params?.initialData,
  });
};
