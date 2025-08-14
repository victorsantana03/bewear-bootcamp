import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { db } from "@/db";
import { shippingAdressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSumary from "../components/cart-summary";
import Addresses from "./components/adresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/cart");
  }

  const shippingAdresses = await db.query.shippingAdressTable.findMany({
    where: eq(shippingAdressTable.userId, session.user.id),
  });

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  return (
    <div className="space-y-3">
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          shippingAdresses={shippingAdresses}
          defaultShippingAdressId={cart.shippingAddress?.id || null}
        />
        <CartSumary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <Footer />
    </div>
  );
};

export default IdentificationPage;
