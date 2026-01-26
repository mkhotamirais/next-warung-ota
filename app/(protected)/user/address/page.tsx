import BasePage from "./BasePage";

export default async function UserAddress({ params }: { params: Promise<{ page?: string }> }) {
  const page = Number((await params).page) || 1;
  const limit = 8;

  return <BasePage page={page} limit={limit} />;
}
