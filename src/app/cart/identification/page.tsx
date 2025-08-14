import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Header from "@/components/common/header";
import { db } from "@/db";
import { cartTable, shippingAdressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Addresses from "./components/adresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session?.user.id),
    with: {
      items: true,
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/cart");
  }

  const shippingAdresses = await db.query.shippingAdressTable.findMany({
    where: eq(shippingAdressTable.userId, session.user.id),
  });
  return (
    <>
      <Header />
      <div className="px-5">
        <Addresses shippingAdresses={shippingAdresses} />
      </div>
    </>
  );
};

export default IdentificationPage;
