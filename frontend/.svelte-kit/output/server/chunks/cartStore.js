import { d as derived, w as writable } from "./index.js";
const cartStore = writable([]);
const cartCount = derived(cartStore, ($cart) => $cart.length);
const cartTotal = derived(
  cartStore,
  ($cart) => $cart.reduce((total, item) => total + (item.price || 0), 0)
);
const cart = {
  subscribe: cartStore.subscribe,
  // Add an item to the cart
  addItem: (item) => {
    cartStore.update((items) => {
      const exists = items.find((i) => i.id === item.id);
      if (exists) {
        return items;
      }
      return [...items, item];
    });
  },
  // Remove an item from the cart
  removeItem: (id) => {
    cartStore.update((items) => items.filter((item) => item.id !== id));
  },
  // Clear the entire cart
  clearCart: () => {
    cartStore.set([]);
  }
};
if (typeof window !== "undefined") {
  const savedCart = localStorage.getItem("aiMarketplaceCart");
  if (savedCart) {
    cartStore.set(JSON.parse(savedCart));
  }
  cartStore.subscribe((value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aiMarketplaceCart", JSON.stringify(value));
    }
  });
}
export {
  cart as a,
  cartTotal as b,
  cartCount as c
};
