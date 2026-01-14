import { writable } from "svelte/store";
export const loged_in = writable(false);
export const signed_up = writable(false);
export const user = writable(null);
export const csrfToken = writable(null);
export const jwt_token = writable(null);
export const role = writable(null);
export const errorMessage = writable("error is here");