"use client";

import Logo from "./Logo";
import HeaderSearch from "./HeaderSearch";
import HeaderFilter from "./HeaderFilter";
import HeaderUserOptions from "./HeaderUserOptions";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white h-16 border-b border-gray-300">
      <div className="container flex flex-row items-center h-16 justify-between">
        <Logo className="hidden sm:flex" />
        <div className="flex items-center justify-between w-full sm:w-auto gap-0 sm:gap-2">
          <div className="flex items-center gap-1 mr-1">
            <HeaderSearch />
            <HeaderFilter />
          </div>
          <div className="flex items-center gap-1">
            <HeaderUserOptions />
            {/* <HeaderMobile /> */}
          </div>
        </div>
      </div>
    </header>
  );
}
