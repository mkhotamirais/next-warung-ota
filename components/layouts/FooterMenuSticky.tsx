import { LuHouse, LuUser } from "react-icons/lu";
import Link from "next/link";
import Button from "../ui/Button";

export default function FooterMenuSticky() {
  return (
    <div className="sticky bottom-0 lg:hidden bg-white border-t border-gray-200 py-2 w-full">
      <div className="flex justify-evenly items-center">
        <Link href="/">
          <Button variant="ghost">
            <LuHouse />
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">
            <LuUser />
          </Button>
        </Link>
      </div>
    </div>
  );
}
