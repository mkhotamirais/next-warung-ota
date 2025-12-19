"use client";

import Button from "@/components/ui/Button";
import { Address } from "@/lib/generated/prisma";
import { capitalize } from "@/lib/utils";
import { HiDotsVertical } from "react-icons/hi";
import Delete from "./Delete";
import DropdownMenu, { DropdownMenuClose } from "@/components/ui/DropdownMenu";
import Link from "next/link";

interface AddressCardProps {
  address: Address;
}

const Trigger = (
  <Button variant="ghost" type="button" aria-label="more" size="sm">
    <HiDotsVertical />
  </Button>
);

export default function AddressCard({ address }: AddressCardProps) {
  const village = address.village.split("-")[1];
  const district = address.district.split("-")[1];
  const regency = address.regency.split("-")[1];
  const province = address.province.split("-")[1];
  const fullAddress = `${address.street}, DESA/KEL ${village}, KEC. ${district}, ${regency}, PROV. ${province}, ${address.postalCode}`;

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
      <DropdownMenu trigger={Trigger} className="mr-3">
        <div className="p-2 flex gap-2">
          <DropdownMenuClose asChild>
            <Link href={`/dashboard/user/address/edit-address/${address.id}`}>
              <Button className="w-fit">Edit</Button>
            </Link>
          </DropdownMenuClose>
          <Delete address={address} />
        </div>
      </DropdownMenu>
    </div>
  );
}
