"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  UpdateCartShippingAdressSchema,
  updateCartShippingAdressSchema,
} from "./schema";

export const updateCartShippingAdress = async (
  data: UpdateCartShippingAdressSchema,
) => {
  updateCartShippingAdressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAdress = await db.query.shippingAdressTable.findFirst({
    where: (shippingAdress, { eq, and }) =>
      and(
        eq(shippingAdress.id, data.shippingAdressId),
        eq(shippingAdress.userId, session.user.id),
      ),
  });

  if (!shippingAdress) {
    throw new Error("Shipping address not found or unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await db
    .update(cartTable)
    .set({
      shippingAdressId: data.shippingAdressId,
    })
    .where(eq(cartTable.id, cart.id));

  return { success: true };
};
