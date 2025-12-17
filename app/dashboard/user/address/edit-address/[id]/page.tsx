import { getAddressById } from "@/actions/address";
import { redirect } from "next/navigation";
import EditAddressForm from "./EditAddressForm";

export default async function EditAddress({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const address = await getAddressById(id);

  if (!address) redirect("/dashboard/user/address");

  return <EditAddressForm address={address} />;
}
