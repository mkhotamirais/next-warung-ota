import { getProductCategories } from "@/actions/product-category";
import { Button } from "../ui/button";

export default async function HomeProductCategoryList() {
  const categories = await getProductCategories();
  return (
    <section className="container py-4">
      <div className="flex gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <Button variant={"outline"} key={category.id} size={"sm"} className="capitalize">
              {category.name}
            </Button>
          ))}
      </div>
    </section>
  );
}
