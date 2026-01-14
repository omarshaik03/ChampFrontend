import type { ClassValue } from 'svelte/elements';
type $$ComponentProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius?: number;
    color?: string;
    shapeRendering: string;
    strokeColor?: string;
    strokeWidth?: number;
    selected?: boolean;
    class?: ClassValue;
};
declare const MinimapNode: import("svelte").Component<$$ComponentProps, {}, "">;
type MinimapNode = ReturnType<typeof MinimapNode>;
export default MinimapNode;
