<script lang="ts">
	import '../../../app.css';
	import { Badge } from 'flowbite-svelte';
	import type { BadgeProps } from 'flowbite-svelte/Badge.svelte';

	export let state: keyof typeof states;
	export let dark: boolean = false;

	const states = {
		success: 'success',
		error: 'error',
	};

	const colors: Record<string, BadgeProps['color']> = {
		success: 'green',
		error: 'red',
	};
</script>

<Badge color={colors[state] ?? 'dark'} border={dark}>{states[state] ?? 'Unknown'}</Badge>
