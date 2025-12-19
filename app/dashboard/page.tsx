import { auth } from "@/auth";
import DashboardTitle from "./DashboardTitle";
import EmailVerificationBanner from "./EmailVerificationBanner";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const isVerified = !!user?.emailVerified;

  if (!user) return redirect("/login");

  return (
    <section>
      <EmailVerificationBanner isVerified={isVerified} />
      <DashboardTitle user={user} />
    </section>
  );
}
