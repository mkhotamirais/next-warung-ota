import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BasePage from "./BasePage";
import { Suspense } from "react";
import HeaderProductAdmin from "./HeaderProductAdmin";
import FallbackSearchProductsAdmin from "@/components/fallbacks/FallbackSearchProductsAdmin";

const limit = 8;

export default async function Product({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{ keyword?: string; "keyword-admin"?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/dashboard");

  const page = Number((await params).page) || 1;
  const keyword = (await searchParams).keyword || undefined;
  const keywordAdmin = (await searchParams)["keyword-admin"] || undefined;

  const keys = `${page}-${limit}-${keyword}-${keywordAdmin}`;

  return (
    <>
      <HeaderProductAdmin />
      <Suspense fallback={<FallbackSearchProductsAdmin />} key={keys}>
        <BasePage page={page} limit={limit} keyword={keyword} keywordAdmin={keywordAdmin} />
      </Suspense>
    </>
  );
}
