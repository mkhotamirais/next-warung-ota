import Link from "next/link";
import React from "react";
import Button from "./ui/Button";

interface AuthTitleHeaderProps {
  title: string;
  totalCount: number;
  url: string;
  label: string;
}

export default function AuthTitleHeader({ title, totalCount, url, label }: AuthTitleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="h2">
        {title} ({totalCount})
      </h2>
      <Link href={url}>
        <Button className="w-fit" variant="link">
          {label}
        </Button>
      </Link>
    </div>
  );
}
