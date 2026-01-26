import List from "./List";
import AuthTitleHeader from "@/components/AuthTitleHeader";
import { getAddresses } from "@/actions/account";

export default async function BasePage({ page, limit }: { page: number; limit: number }) {
  const { addresses, totalPages, totalAddressCount } = await getAddresses({ page, limit });

  if (!addresses) return null;

  return (
    <>
      <AuthTitleHeader
        title="Address List"
        totalCount={totalAddressCount}
        url="/user/address/create-address"
        label="Create Address"
      />
      <List
        addresses={addresses}
        limit={limit}
        page={page}
        totalPages={totalPages}
        totalAddresssCount={totalAddressCount}
      />
    </>
  );
}
