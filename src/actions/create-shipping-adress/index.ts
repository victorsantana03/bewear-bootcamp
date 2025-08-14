"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAdressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateShippingAdressSchema,
  createShippingAdressSchema,
} from "./schema";

export const createShippingAdress = async (
  data: CreateShippingAdressSchema,
) => {
  createShippingAdressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [shippingAdress] = await db
    .insert(shippingAdressTable)
    .values({
      userId: session.user.id,
      recipientName: data.fullName,
      street: data.adress,
      number: data.number,
      complement: data.complement || null,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      zipCode: data.zipCode,
      country: "Brasil",
      phone: data.phone,
      email: data.email,
      cpfOrCnpj: data.cpf,
    })
    .returning();

  revalidatePath("/cart/identification");

  return shippingAdress;
};
