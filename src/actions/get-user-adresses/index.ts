"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAdressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getUserAdresses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const adresses = await db
      .select()
      .from(shippingAdressTable)
      .where(eq(shippingAdressTable.userId, session.user.id))
      .orderBy(shippingAdressTable.createdAt);

    return adresses;
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    throw new Error("Erro ao buscar endereços");
  }
}
