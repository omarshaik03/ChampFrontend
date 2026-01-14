import { writable, derived } from 'svelte/store';

// Define the structure of a cart item (an app)
export interface CartItem {
    id: string;
    name: string;
    price: number | null; // Price can be null for "Contact for Pricing"
    image: string;
    route: string;
    description?: string; // Add description as optional property
}

// Create a writable store for cart items
const cartStore = writable<CartItem[]>([]);

// Create derived stores for convenience
export const cartCount = derived(cartStore, $cart => $cart.length);
export const cartTotal = derived(cartStore, $cart => 
    $cart.reduce((total, item) => total + (item.price || 0), 0)
);

// Cart store operations
export const cart = {
    subscribe: cartStore.subscribe,
    
    // Add an item to the cart
    addItem: (item: CartItem) => {
        cartStore.update(items => {
            // Check if item already exists in cart
            const exists = items.find(i => i.id === item.id);
            if (exists) {
                // Return unchanged if already in cart
                return items;
            }
            // Add the new item
            return [...items, item];
        });
    },
    
    // Remove an item from the cart
    removeItem: (id: string) => {
        cartStore.update(items => items.filter(item => item.id !== id));
    },
    
    // Clear the entire cart
    clearCart: () => {
        cartStore.set([]);
    }
};

// Initialize cart from localStorage if available (runs in browser only)
if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('aiMarketplaceCart');
    if (savedCart) {
        cartStore.set(JSON.parse(savedCart));
    }
    
    // Subscribe to changes and save to localStorage
    cartStore.subscribe(value => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('aiMarketplaceCart', JSON.stringify(value));
        }
    });
}
