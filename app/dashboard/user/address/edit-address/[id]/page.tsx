import { redirect } from "next/navigation";
import EditAddressForm from "./EditAddressForm";
import { getAddressById } from "@/actions/account";

export default async function EditAddress({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const address = await getAddressById(id);

  if (!address) redirect("/dashboard/user/address");

  return <EditAddressForm address={address} />;
}
