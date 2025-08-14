import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAdress } from "@/actions/update-cart-shipping-adress";
import { UpdateCartShippingAdressSchema } from "@/actions/update-cart-shipping-adress/schema";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUpdateCartShippingAddressMutationKey = () => [
  "update-cart-shipping-address",
];

export const useUpdateCartShippingAdress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateCartShippingAddressMutationKey(),
    mutationFn: (data: UpdateCartShippingAdressSchema) =>
      updateCartShippingAdress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });
    },
  });
};
