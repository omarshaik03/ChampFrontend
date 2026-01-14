<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import type { App } from '$lib/data/apps';

	export let app: App;
	export let onAddToCart: (app: App) => void;
</script>

<div class="col-12 col-sm-6 col-lg-4">
	<a href={app.route} class="text-decoration-none">
		<div class="app-card position-relative overflow-hidden rounded shadow-lg bg-dark-gray" style="height: 26rem; background-image: url('{app.image}'); background-size: cover; background-position: center;">
			<div class="d-flex flex-column justify-content-between p-3 text-white bg-dark bg-opacity-50 h-100 w-100">
				<div class="app-badges">
					{#if app.price !== null}
						<span class="badge bg-primary mb-2">${app.price.toFixed(2)}</span>
					{:else}
						<span class="badge bg-info mb-2">Contact for Pricing</span>
					{/if}
				</div>
				<div>
					<h4>{app.name}</h4>
					<p class="mb-2">{app.description}</p>
					<div class="d-flex gap-2">
						<Button color="success" size="sm" on:click={(e) => { e.stopPropagation(); e.preventDefault(); onAddToCart(app); }}>
							<i class="bi bi-cart-plus-fill me-1"></i>Add to Cart
						</Button>
					</div>
				</div>
			</div>
		</div>
	</a>
</div>

<style>
	.bg-dark-gray {
		background-color: #333;
	}
	.app-card {
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		width: 100%;
	}
	.app-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
	}
	.app-badges {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>
