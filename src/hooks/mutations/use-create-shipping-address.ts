import { useMutation } from "@tanstack/react-query";

import { createShippingAdress } from "@/actions/create-shipping-adress";

export const getCreateShippingAdressMutationKey = () =>
  ["create-shipping-adress"] as const;

export const useCreateShippingAdress = () => {
  return useMutation({
    mutationKey: getCreateShippingAdressMutationKey(),
    mutationFn: createShippingAdress,
  });
};
