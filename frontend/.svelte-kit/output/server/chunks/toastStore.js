import { w as writable } from "./index.js";
const DEFAULT_TIMEOUT = 3e3;
const toastStore = writable([]);
const toasts = {
  subscribe: toastStore.subscribe,
  // Add a new toast notification
  push: (toast) => {
    const id = toast.id || Math.random().toString(36).substr(2, 9);
    const color = toast.color || "primary";
    let timeout = toast.timeout;
    if (!timeout) {
      timeout = color === "danger" ? 1e4 : DEFAULT_TIMEOUT;
    }
    toastStore.update((all) => [...all, { ...toast, id, timeout, color }]);
    setTimeout(() => {
      toastStore.update((all) => all.filter((t) => t.id !== id));
    }, timeout);
    return id;
  },
  // Remove a specific toast by ID
  remove: (id) => {
    toastStore.update((all) => all.filter((t) => t.id !== id));
  },
  // Clear all toast notifications
  clear: () => {
    toastStore.set([]);
  }
};
export {
  toasts as t
};
