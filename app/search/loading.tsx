import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";

export default function LoadingSearch() {
  return (
    <main className="flex-1 bg-gray-100">
      <div className="container">
        <h1 className="text-xl">Mencari...</h1>
        <FallbackSearchProducts />
      </div>
    </main>
  );
}
