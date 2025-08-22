"use client";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ products, title }: ProductListProps) => {
  return (
    <div className="space-y-6 md:px-20 lg:px-40">
      <h3 className="px-5 font-semibold md:text-lg">{title}</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
