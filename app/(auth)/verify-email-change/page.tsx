import { Suspense } from "react";
import VerifyEmailChangePage from "./VerifyEmailChangePage";
import Load from "@/components/fallbacks/Load";

export default function VerifyEmailChange() {
  return (
    <Suspense fallback={<Load />}>
      <VerifyEmailChangePage />
    </Suspense>
  );
}
