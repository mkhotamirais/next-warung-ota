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
    <Drawer trigger={TriggerBar} position="right" className="flex sm:hidden">
      <div className="p-4">
        <Logo className="mb-4" />
        <div className="flex flex-col gap-2">
          <DrawerClose asChild>
            <Button asChild size="sm">
              <Link href="/login">Masuk</Link>
            </Button>
          </DrawerClose>
          <Button variant="ghost" size="sm">
            <Link href="/cart">Setting</Link>
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
