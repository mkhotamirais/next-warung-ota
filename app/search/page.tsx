import Results from "./Results";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const keyword = (await searchParams).keyword;

  return (
    <main className="flex-1 py-6 bg-gray-100">
      <div className="container">
        <h1 className="text-xl">
          Hasil Pencarian <b>`{keyword}`</b>
        </h1>
        <Results keyword={keyword} />
      </div>
    </main>
  );
}
