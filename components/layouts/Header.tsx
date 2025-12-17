"use client";

import Logo from "../Logo";
import HeaderSearch from "./HeaderSearch";
import HeaderFilter from "./HeaderFilter";
import CartBtn from "../CartBtn";
import HeaderUser from "./HeaderUser";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white h-16 border-b border-gray-300">
      <div className="container flex flex-row items-center h-16 justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <NavDesktop />
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-1">
          <HeaderSearch />
          <HeaderFilter />
          <CartBtn />
          <div className="hidden lg:block">
            <HeaderUser />
          </div>
          <NavMobile />
        </div>
      </div>
    </header>
  );
}
