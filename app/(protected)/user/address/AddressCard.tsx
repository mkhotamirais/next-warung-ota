"use client";

import { Address } from "@/lib/generated/prisma";
import { capitalize } from "@/lib/utils";
import { HiDotsVertical } from "react-icons/hi";
import Delete from "./Delete";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button-tmp";
import { useState } from "react";

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  const village = address.village.split("-")[1];
  const district = address.district.split("-")[1];
  const regency = address.regency.split("-")[1];
  const province = address.province.split("-")[1];
  const fullAddress = `${address.street}, DESA/KEL ${village}, KEC. ${district}, ${regency}, PROV. ${province}, ${address.postalCode}`;

  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between border p-2 rounded border-gray-300 mb-2">
      <div className="w-full">
        <div>
          <span>{address.label}</span>{" "}
          <span className="text-primary text-sm">{address.isDefault ? "(Default Address)" : ""}</span>
        </div>
        <div>
          {address.recipient} - {address.phone}
        </div>
        <address className="">{capitalize(fullAddress)}</address>
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" type="button" aria-label="more" size="sm">
            <HiDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="p-2 flex gap-2">
            <Button className="w-fit" asChild>
              <Link href={`/user/address/edit-address/${address.id}`}>Edit</Link>
            </Button>
            <Delete address={address} setOpen={setOpen} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
