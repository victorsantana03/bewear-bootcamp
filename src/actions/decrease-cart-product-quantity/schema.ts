import { z } from "zod";

export const decreaseCartProductQuantitySchema = z.object({
  cartItemId: z.uuid(),
});

export type decreaseCartProductQuantitySchema = z.infer<
  typeof decreaseCartProductQuantitySchema
>;
