"use client";

import Logo from "../Logo";
import Footer from "./Footer";
import Link from "next/link";
import { menu as m } from "@/lib/content";
import { Button } from "../ui/button-tmp";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";

export default function NavMobile() {
  return (
    <div className="block lg:hidden">
      <Sheet>
        <SheetTrigger asChild className="">
          <Button variant={"outline"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="block lg:hidden w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo className="flex!" />
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="h-full relative px-4">
            <nav className="flex flex-col gap-1">
              {m.mainMenu.map((item, i) => (
                <SheetClose key={i} asChild>
                  <Button variant="ghost" className="block" asChild>
                    <Link href={item.url}>{item.label}</Link>
                  </Button>
                </SheetClose>
              ))}
            </nav>
            <Footer className="absolute bottom-0" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
