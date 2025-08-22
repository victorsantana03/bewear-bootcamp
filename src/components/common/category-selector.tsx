import Link from "next/link";

import { categoryTable } from "@/db/schema";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6 md:mx-20 lg:mx-40">
      <div className="grid grid-cols-2 gap-3 md:gap-x-8 lg:grid-cols-3 lg:gap-x-12 xl:grid-cols-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="rounded-3xl bg-white text-xs font-semibold"
          >
            <Link href={`/category/${category.slug}`}>
              <p className="md:text-sm md:font-semibold">{category.name}</p>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
