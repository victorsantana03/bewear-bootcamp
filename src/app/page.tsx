import { desc } from "drizzle-orm";
import Image from "next/image";

import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5 md:hidden">
          <Image
            src="/banner_01.png"
            width={0}
            height={0}
            alt="Leve uma vida com estilo"
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="hidden w-full justify-center bg-[linear-gradient(180deg,#7459ED_0%,#D4D7E4_100%)] px-5 md:flex md:items-center md:justify-center">
          <Image
            src="/banner_01.png"
            width={600}
            height={0}
            alt="Leve uma vida com estilo"
            className="object-cover"
          />
        </div>

        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5 md:hidden">
          <Image
            src="/banner_02.png"
            width={0}
            height={0}
            alt="Seja autêntico"
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="hidden w-full justify-center px-5 py-10 md:flex md:items-center md:justify-center">
          <Image
            src="/banner_02.png"
            width={600}
            height={0}
            alt="Seja autêntico"
            className="object-cover"
          />
        </div>

        <ProductList products={newlyCreatedProducts} title="Novos produtos" />

        <Footer />
      </div>
    </>
  );
}
