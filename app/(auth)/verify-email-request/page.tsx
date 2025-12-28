import Load from "@/components/fallbacks/Load";
import { Suspense } from "react";
import VerifyEmailRequestPage from "./VerifyEmailRequestPage";

export default function VerifyEmailRequest() {
  return (
    <Suspense fallback={<Load />}>
      <VerifyEmailRequestPage />
    </Suspense>
  );
}
