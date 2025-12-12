import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BasePage from "../../BasePage";

const limit = 8;

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{ keyword?: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await params).page || 1);
  const keyword = (await searchParams).keyword || undefined;

  return <BasePage page={page} limit={limit} keyword={keyword} />;
}
