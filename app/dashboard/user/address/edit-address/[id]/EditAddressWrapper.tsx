"use client";

import { useAddressDetail } from "@/hooks/tanstack-hooks/useAddress";
import { useParams } from "next/navigation";
import EditAddressForm from "./EditAddressForm";

export default function EditAddressWrapper() {
  const params = useParams();
  const id = params.id as string;
  const { data: address, isPending } = useAddressDetail(id);

  if (isPending) return <div>Loading...</div>;
  return <EditAddressForm key={address?.id} address={address} />;
}
