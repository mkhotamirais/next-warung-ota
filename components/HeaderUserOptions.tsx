import React from "react";
import DropdownMenu, { DropdownMenuClose } from "./ui/DropdownMenu";
import Button from "./ui/Button";

export default function HeaderUserOptions() {
  const trigger = (
    <Button variant="secondary" type="button" className="rounded-full">
      A
    </Button>
  );
  return (
    <DropdownMenu trigger={trigger}>
      <div>
        <div>halo semua</div>
        <DropdownMenuClose>
          <div>tutup</div>
        </DropdownMenuClose>
      </div>
    </DropdownMenu>
  );
}
