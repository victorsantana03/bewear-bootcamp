import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6 px-2">
        <div className="space-y-5 md:flex md:flex-row lg:justify-center lg:px-20">
          <div className="relative aspect-[4/5] w-full max-w-[640px]">
            <Image
              src={productVariant.imageUrl}
              alt={productVariant.name}
              fill
              sizes="(max-width:768px) 100vw, 640px"
              className="rounded-3xl object-cover"
              priority
            />
          </div>
          <div className="">
            <div className="px-5">
              {/*VARIANTES */}
              <VariantSelector
                variants={productVariant.product.variants}
                selectedVariantSlug={productVariant.slug}
              />
            </div>
            <div className="px-5">
              {/*DESCRIÇÃO */}
              <h2 className="text-lg font-semibold">
                {productVariant.product.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {productVariant.name}
              </p>
              <h3 className="text-lg font-semibold">
                {formatCentsToBRL(productVariant.priceInCents)}
              </h3>
            </div>

            <ProductActions productVariantId={productVariant.id} />

            <div className="px-5 py-5">
              <p className="text-shadow-amber-600">
                {productVariant.product.description}
              </p>
            </div>
          </div>
        </div>
        <div>
          <ProductList title="Talvez você goste" products={likelyProducts} />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
