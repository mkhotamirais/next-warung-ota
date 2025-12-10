"use client";

import Drawer, { DrawerClose } from "./ui/Drawer";
import Button from "./ui/Button";
import { LuMenu } from "react-icons/lu";
import Link from "next/link";
import Logo from "./Logo";

const TriggerBar = (
  <Button variant="outline" aria-label="nav bar" size="sm">
    <LuMenu />
  </Button>
);

export default function HeaderMobile() {
  return (
    <Drawer trigger={TriggerBar} position="right" className="flex sm:hidden" classWidth="w-100">
      <div className="p-4">
        <DrawerClose>
          <Logo className="mb-4" />
        </DrawerClose>
        <div className="flex flex-col gap-2">
          <DrawerClose asChild>
            <Link href="/signin">
              <Button size="sm" className="">
                Masuk
              </Button>
            </Link>
          </DrawerClose>
          <Button variant="ghost" size="sm">
            <Link href="/cart">Setting</Link>
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
