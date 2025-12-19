import { notFound } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const token = (await searchParams).token;
  const email = (await searchParams).email;

  if (!token || !email) {
    notFound();
  }

  return <ResetPasswordForm token={token} email={email} />;
}
