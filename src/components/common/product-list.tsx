"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import { Button } from "../ui/button";
import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ products, title }: ProductListProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
  return (
    <div className="space-y-4 py-10 md:px-20 lg:px-40">
      <div className="flex justify-between">
        <h3 className="px-5 font-semibold md:text-lg">{title}</h3>
        <div className="flex gap-3">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => scrollBy(-320)}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => scrollBy(320)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div
        className="flex w-full gap-4 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
