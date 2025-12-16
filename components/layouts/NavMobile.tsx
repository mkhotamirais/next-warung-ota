import React from "react";
import Drawer, { DrawerClose } from "../ui/Drawer";
import Button from "../ui/Button";
import { LuMenu, LuX } from "react-icons/lu";
import Logo from "../Logo";
import Footer from "./Footer";
import Link from "next/link";
import { menu as m } from "@/lib/content";

export default function NavMobile() {
  const trigger = (
    <Button variant="ghost" size="sm">
      <LuMenu />
    </Button>
  );
  return (
    <Drawer trigger={trigger} className="block lg:hidden" position="right">
      <div className="h-full relative px-4 pt-3">
        <div className="flex items-center justify-between">
          <Logo className="flex!" />
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="w-fit">
              <LuX />
            </Button>
          </DrawerClose>
        </div>
        <nav className="flex flex-col gap-1 mt-4">
          {m.mainMenu.map((item, i) => (
            <DrawerClose key={i} asChild>
              <Link href={item.url}>
                <Button variant="ghost" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            </DrawerClose>
          ))}
        </nav>
        <Footer className="absolute bottom-0" />
      </div>
    </Drawer>
  );
}
