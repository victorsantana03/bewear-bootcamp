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
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
