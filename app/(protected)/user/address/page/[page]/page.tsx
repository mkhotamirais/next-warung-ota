import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BasePage from "../../BasePage";

export default async function AddressPage({ params }: { params: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session || !session.user) redirect("/profile");

  const page = Number((await params).page || 1);
  const limit = 8;

  return <BasePage page={page} limit={limit} />;
}
