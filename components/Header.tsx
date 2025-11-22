"use client";

import Logo from "./Logo";
import { LuShoppingCart } from "react-icons/lu";
import Button from "./ui/Button";
import Link from "next/link";
import HeaderSearch from "./HeaderSearch";
import HeaderFilter from "./HeaderFilter";
import HeaderMobile from "./HeaderMobile";
import DropdownMenu, { DropdownMenuClose } from "./ui/DropdownMenu";
import HeaderUserOptions from "./HeaderUserOptions";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white h-16 border-b border-gray-300">
      <div className="container flex flex-row items-center h-16 justify-between">
        <Logo className="hidden sm:flex" />
        <div className="flex items-center justify-between w-full sm:w-auto gap-0 sm:gap-2">
          <div className="flex items-center">
            <HeaderSearch />
            <HeaderFilter />
          </div>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" aria-label="cart" size="sm">
              <Link href="/cart">
                <LuShoppingCart />
              </Link>
            </Button>
            {/* <Button size="sm" asChild aria-label="login" className="hidden sm:flex ml-2">
              <Link href="/signin">Masuk</Link>
            </Button> */}
            <HeaderUserOptions />
            <HeaderMobile />
          </div>
        </div>
      </div>
    </header>
  );
}
