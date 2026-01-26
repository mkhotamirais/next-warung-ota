"use client";

import { Address } from "@/lib/generated/prisma";
import AddressCard from "./AddressCard";
import Pagination from "@/components/ui/Pagination";
// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";

interface ListProps {
  addresses: Address[];
  limit: number;
  page: number;
  totalPages: number;
  totalAddresssCount: number;
}

export default function List({ addresses, limit, page, totalPages, totalAddresssCount }: ListProps) {
  // export default function List() {
  // const [addresses, setAddresses] = useState<Address[]>([]);
  // const [totalPages, setTotalPages] = useState(0);
  // const [totalAddresssCount, setTotalAddresssCount] = useState(0);

  // const searchParams = useSearchParams();
  // const params = useParams();
  // const page = Number(params.page || 1);
  // const limit = Number(searchParams.get("limit") || 8);

  // useEffect(() => {
  //   const getAddresses = async () => {
  //     const res = await fetch(`/api/account/address?page=${page}&limit=${limit}`);
  //     const data = await res.json();

  //     setAddresses(data.addresses);
  //     setTotalAddresssCount(data.totalAddresssCount);
  //     setTotalPages(data.totalPages);
  //   };
  //   getAddresses();
  // }, [page, limit]);

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
