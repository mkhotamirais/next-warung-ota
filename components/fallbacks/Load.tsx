import React from "react";
import { LuLoaderCircle } from "react-icons/lu";
import clsx from "clsx";

export default function Load({ className }: { className?: string }) {
  return <LuLoaderCircle className={clsx("text-4xl animate-spin text-primary my-16 mx-auto", className)} />;
}
