"use client";

import CartBtn from "./CartBtn";
import Logo from "../Logo";
import AuthBtn from "./AuthBtn";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import NavSearch from "./NavSearch";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white h-16 border-b border-gray-300">
      <div className="container flex flex-row items-center h-16 justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <NavDesktop />
        </div>
        <div className="flex gap-2 items-center">
          <NavSearch />
          <CartBtn />
          <AuthBtn />
          <NavMobile />
        </div>
      </div>
    </header>
  );
}
