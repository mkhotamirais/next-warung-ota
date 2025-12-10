import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import ProductList from "./ProductList";
import Button from "@/components/ui/Button";
// import SearchProductAdmin from "./SearchProductAdmin";
import Link from "next/link";
import LoadProductsAdmin from "@/components/fallbacks/LoadProductsAdmin";

const limit = 8;

export default async function Product({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; keyword?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/dashboard");

  const page = Number((await searchParams).page) || 1;
  const keyword = (await searchParams).keyword || "";

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Product List</h2>
        <Link href="/dashboard/admin/product/create-product">
          <Button>Create Product</Button>
        </Link>
      </div>
      <div className="mb-4">{/* <SearchProductAdmin /> */}</div>
      <Suspense fallback={<LoadProductsAdmin />} key={keyword}>
        <ProductList page={page} limit={limit} keyword={keyword} />
      </Suspense>
    </>
  );
}
