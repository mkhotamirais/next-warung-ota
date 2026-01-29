import InteractiveCart from "./InteractiveCart";
import { getCarts } from "@/actions/cart";
import CartEmpty from "./CartEmpty";

export default async function CartWrapper() {
  const { cartQty, cartItems, totalPrice } = await getCarts();

  if (!cartItems || cartItems?.length === 0) {
    return <CartEmpty />;
  }

  const orderedCartItemsByChecked = [...cartItems].sort((a, b) => {
    if (a.isChecked === b.isChecked) return 0;
    return a.isChecked ? -1 : 1;
  });

  return <InteractiveCart cartItems={orderedCartItemsByChecked} cartQty={cartQty} totalPrice={totalPrice} />;
}
