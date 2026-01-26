import Link from "next/link";
import { Button } from "./ui/button";

interface AuthTitleHeaderProps {
  title: string;
  totalCount: number;
  url: string;
  label: string;
}

export default function AuthTitleHeader({ title, totalCount, url, label }: AuthTitleHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 w-full">
      <h1 className="h1">
        {title} ({totalCount})
      </h1>
      <Button className="w-fit" asChild>
        <Link href={url}>{label}</Link>
      </Button>
    </div>
  );
}
