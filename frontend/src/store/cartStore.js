import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (game) =>
    set((state) => {
      if (state.cart.some((item) => item._id === game._id)) return state;
      return { cart: [...state.cart, game] };
    }),
  removeFromCart: (gameId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== gameId),
    })),
}));
