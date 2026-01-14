// socketStore.ts
import { writable } from 'svelte/store';
import { io } from 'socket.io-client';

export const socketStore: ReturnType<typeof writable<{ socket: ReturnType<typeof io> | undefined}>> = writable({ socket: undefined });

export function addSocket(socket: ReturnType<typeof io>) {
    socketStore.set({ socket });
}

export function closeSocket() {
    socketStore.set({ socket: undefined });
}