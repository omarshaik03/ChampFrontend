<script lang="ts">
	import AppCard from '$lib/components/ui/AppCard.svelte';
	import { apps, type App } from '$lib/data/apps';
	import { cart } from '../../stores/cartStore';
	import { toasts } from '../../stores/toastStore';

	function addToCart(app: App) {
		cart.addItem(app);
		toasts.push({
			message: `${app.name} added to cart!`,
			color: 'success',
			header: 'Added to Cart'
		});
	}
</script>

<div class="tab-pane fade show active">
	<div class="row g-4">
		{#each apps as app}
			<AppCard {app} onAddToCart={addToCart} />
		{/each}
	</div>
</div>
