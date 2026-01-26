import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BasePage from "../../BasePage";
import HeaderProductAdmin from "../../HeaderProductAdmin";
import FallbackSearchProductsAdmin from "@/components/fallbacks/FallbackSearchProductsAdmin";
import { Suspense } from "react";

const limit = 8;

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{ keyword?: string; "keyword-admin"?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await params).page || 1);
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
