import { writable } from 'svelte/store';

// Define the structure of the user data
export interface User {
    id: string;
    name: string;
    email: string;
    url_base: string | undefined;
    token: string | undefined;
    allowed_apps: string[] | undefined;
    tokens_left: number;
    tokens_allocated: number;
}

// Create a writable store for user data
export const userStore = writable<User | null>(null);