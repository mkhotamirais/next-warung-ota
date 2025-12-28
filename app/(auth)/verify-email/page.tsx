import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmailPage";
import Load from "@/components/fallbacks/Load";

export default function VerifyEmail() {
  return (
    <Suspense fallback={<Load />}>
      <VerifyEmailPage />
    </Suspense>
  );
}
