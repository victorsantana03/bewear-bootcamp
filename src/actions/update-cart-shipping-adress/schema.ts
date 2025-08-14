import { z } from "zod";

export const updateCartShippingAdressSchema = z.object({
  shippingAdressId: z.uuid(),
});

export type UpdateCartShippingAdressSchema = z.infer<
  typeof updateCartShippingAdressSchema
>;
