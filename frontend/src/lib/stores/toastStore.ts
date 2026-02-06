import { writable } from 'svelte/store';

// Define the structure of a toast notification
export interface ToastNotification {
    id: string;
    message: string;
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    timeout?: number;
    header?: string;
}

// Default timeout in milliseconds (10 seconds for better visibility)
const DEFAULT_TIMEOUT = 10000;

// Create a writable store to hold active toast notifications
const toastStore = writable<ToastNotification[]>([]);

// Helper functions for the toast store
export const toasts = {
    subscribe: toastStore.subscribe,
    
    // Add a new toast notification
    push: (toast: Omit<ToastNotification, 'id'> & { id?: string }) => {
        const id = toast.id || Math.random().toString(36).substr(2, 9);
        const timeout = toast.timeout || DEFAULT_TIMEOUT;
        const color = toast.color || 'primary';
        
        // Add the toast to the store
        toastStore.update(all => [...all, { ...toast, id, timeout, color }]);
        
        // Remove the toast after the timeout
        setTimeout(() => {
            toastStore.update(all => all.filter(t => t.id !== id));
        }, timeout);
        
        return id;
    },
    
    // Remove a specific toast by ID
    remove: (id: string) => {
        toastStore.update(all => all.filter(t => t.id !== id));
    },
    
    // Clear all toast notifications
    clear: () => {
        toastStore.set([]);
    }
};
