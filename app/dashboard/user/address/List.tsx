"use client";

import { Address } from "@/lib/generated/prisma";
import AddressCard from "./AddressCard";
import Pagination from "@/components/ui/Pagination";

interface ListProps {
  addresses: Address[];
  limit: number;
  page: number;
  totalPages: number;
  totalAddresssCount: number;
}

export default function List({ addresses, limit, page, totalPages, totalAddresssCount }: ListProps) {
  return (
    <>
      <div>
        {addresses?.length ? (
          <div>
            {addresses?.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        ) : (
          <h2>No Address Found</h2>
        )}
      </div>
      {totalAddresssCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/user/address/page" />
      ) : null}
    </>
  );
}
