<script lang="ts">
    import { Button } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    
    let orderId = "";
    
    onMount(() => {
        // Generate a random order ID
        orderId = "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    });
</script>

<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow-sm text-center p-4">
                <div class="success-icon mb-4">
                    <i class="bi bi-check-circle text-success" style="font-size: 5rem;"></i>
                </div>
                
                <h1 class="display-6 mb-3">Thank You for Your Purchase!</h1>
                
                <p class="lead">Your order has been successfully processed.</p>
                
                <div class="order-details my-4 p-3 bg-light rounded">
                    <p class="mb-1">Order ID: <strong>{orderId}</strong></p>
                    <p class="mb-0">A confirmation email has been sent to your email address.</p>
                </div>
                
                <p>
                    Your purchased apps are now available in your account. You can access them at any time from your dashboard.
                </p>
                
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <Button color="primary" href="/">
                        Continue Shopping
                    </Button>
                    <Button color="secondary" outline href="/profile">
                        View My Account
                    </Button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .card {
        border-radius: 1rem;
        border: none;
    }
    
    .success-icon {
        animation: scale-in 0.5s ease-out;
    }
    
    @keyframes scale-in {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .order-details {
        background-color: #f8f9fa;
        border-left: 4px solid #28a745;
    }
</style>

<!-- Include Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
