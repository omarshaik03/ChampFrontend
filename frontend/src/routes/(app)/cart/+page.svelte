<script lang="ts">
    import { Button, Table, Input } from "@sveltestrap/sveltestrap";
    import { cart, cartTotal } from "../../../lib/stores/cartStore";
    import { toasts } from "../../../lib/stores/toastStore";
    import { goto } from "$app/navigation";
    import { derived } from "svelte/store";

    // Create a derived store to check if any items need price quote
    const hasContactForPricingItems = derived(cart, $cart => 
        $cart.some(item => item.price === null)
    );

    function removeItem(id: string, name: string) {
        cart.removeItem(id);
        toasts.push({
            message: `${name} removed from cart`,
            color: 'warning',
            header: 'Removed from Cart'
        });
    }

    function clearCart() {
        cart.clearCart();
        toasts.push({
            message: 'Cart has been cleared',
            color: 'info',
            header: 'Cart Cleared'
        });
    }

    function proceedToCheckout() {
        if ($hasContactForPricingItems) {
            toasts.push({
                message: 'Your cart contains items that require a price quote. Please contact our sales team.',
                color: 'warning',
                header: 'Price Quote Required'
            });
            return;
        }
        goto('/cart/checkout');
    }

    function contactSales() {
        // You would implement actual contact sales functionality here
        toasts.push({
            message: 'Our sales team will contact you shortly.',
            color: 'success',
            header: 'Request Submitted'
        });
    }
</script>

<div class="container my-5">
    <h1 class="mb-4">Your Cart</h1>

    {#if $cart && $cart.length > 0}
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $cart as item}
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-shrink-0 me-3">
                                            <img src={item.image} alt={item.name} class="rounded" width="60" height="60" style="object-fit: cover;">
                                        </div>
                                        <div>
                                            <h6 class="mb-0">{item.name}</h6>
                                        </div>
                                    </div>                                </td>
                                <td>{item.description || 'No description available'}</td>
                                <td>
                                    {#if item.price !== null}
                                        ${item.price.toFixed(2)}
                                    {:else}
                                        <span class="text-info">Contact for Pricing</span>
                                    {/if}
                                </td>
                                <td>
                                    <Button color="danger" size="sm" on:click={() => removeItem(item.id, item.name)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </Table>
            </div>
        </div>        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Total: <span class="text-primary">${$cartTotal.toFixed(2)}</span>
                    {#if $hasContactForPricingItems}
                        <span class="ms-2 text-info small">(Additional pricing required)</span>
                    {/if}
                    </h5>
                    <div>
                        <Button color="secondary" class="me-2" on:click={clearCart}>Clear Cart</Button>
                        {#if $hasContactForPricingItems}
                            <Button color="info" on:click={contactSales}>Contact Sales</Button>
                        {:else}
                            <Button color="primary" on:click={proceedToCheckout}>Proceed to Checkout</Button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="text-center py-5">
            <div class="mb-4">
                <i class="bi bi-cart text-muted" style="font-size: 4rem;"></i>
            </div>
            <h3>Your cart is empty</h3>
            <p class="text-muted mb-4">Looks like you haven't added any apps to your cart yet.</p>
            <Button color="primary" href="/">Browse Apps</Button>
        </div>
    {/if}
</div>

<style>
    /* Add any custom styles here */
    .card {
        border-radius: 0.5rem;
        border: none;
    }
</style>

<!-- Include Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
