import { Suspense } from "react";
import { notFound } from "next/navigation";
import ResetPasswordClientForm from "./ResetPasswordClientForm";

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

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="container">
        <Suspense fallback={<div>Loading form...</div>}>
          <ResetPasswordClientForm token={token} email={email} />
        </Suspense>
      </div>
    </main>
  );
}
