import { create } from "zustand";

interface CartState {
  cartQty: number;
  setCartQty: (cartQty: number) => void;
  pending: boolean;
  setPending: (pending: boolean) => void;
  pendingSave: string | null;
  setPendingSave: (id: string | null) => void;
  pendingSaving: string | null;
  setPendingSaving: (id: string | null) => void;
  pendingCheckout: boolean;
  setPendingCheckout: (id: boolean) => void;
  pendingDel: string | null;
  setPendingDel: (id: string | null) => void;
}

export const useCart = create<CartState>((set) => ({
  cartQty: 0,
  setCartQty: (cartQty: number) => set({ cartQty }),
  pending: false,
  setPending: (pending: boolean) => set({ pending }),
  pendingSave: null,
  setPendingSave: (id: string | null) => set({ pendingSave: id }),
  pendingSaving: null,
  setPendingSaving: (id: string | null) => set({ pendingSaving: id }),
  pendingCheckout: false,
  setPendingCheckout: (pendingCheckout) => set({ pendingCheckout }),
  pendingDel: null,
  setPendingDel: (id: string | null) => set({ pendingDel: id }),
}));
