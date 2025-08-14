import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createShippingAdress } from "@/actions/create-shipping-adress";

import { getUserAdressesQueryKey } from "../queries/use-user-adresses";

export const getCreateShippingAdressMutationKey = () =>
  ["create-shipping-adress"] as const;

export const useCreateShippingAdress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateShippingAdressMutationKey(),
    mutationFn: createShippingAdress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserAdressesQueryKey(),
      });
    },
  });
};
