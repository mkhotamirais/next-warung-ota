import { LuHouse, LuUser } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button-tmp";

export default function FooterMenuSticky() {
  return (
    <div className="h-16 sticky bottom-0 lg:hidden bg-white border-t border-gray-200 py-2 w-full flex items-center">
      <div className="container flex justify-evenly items-center h-full w-full">
        <Link href="/">
          <Button variant="ghost">
            <LuHouse className="text-xl" />
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">
            <LuUser className="text-xl" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
