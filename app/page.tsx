import HomeHero from "@/components/homepage/HomeHero";
import HomeProductCategoryList from "@/components/homepage/HomeProductCategoryList";
import HomeProductList from "@/components/homepage/HomeProductList";

export default async function Home() {
  return (
    <main className="flex-1">
      <HomeHero />
      <HomeProductCategoryList />
      <HomeProductList />
    </main>
  );
}
