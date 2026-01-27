"use client";

import { Button } from "../ui/button-tmp";
import { Spinner } from "../ui/spinner";

export default function LoadIcon() {
  return (
    <Button variant={"secondary"} className="rounded-full animate-pulse" size="icon">
      <Spinner />
    </Button>
  );
}
