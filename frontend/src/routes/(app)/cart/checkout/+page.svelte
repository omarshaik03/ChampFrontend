<script lang="ts">
    import { Button, Form, FormGroup, Input, Label, Row, Col } from "@sveltestrap/sveltestrap";
    import { cart, cartTotal } from "../../../../lib/stores/cartStore";
    import { toasts } from "../../../../lib/stores/toastStore";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { derived } from "svelte/store";
    
    // Create a derived store to check if any items need price quote
    const hasContactForPricingItems = derived(cart, $cart => 
        $cart.some(item => item.price === null)
    );
    
    let paymentMethod = "credit";
    let billingFirstName = "";
    let billingLastName = "";
    let billingEmail = "";
    let billingCompany = "";
    let billingAddress = "";
    let billingCity = "";
    let billingState = "";
    let billingZip = "";
    let billingCountry = "";
    let cardNumber = "";
    let cardName = "";
    let cardExpiry = "";
    let cardCvv = "";
    let isProcessing = false;
    let formIsValid = false;
    
    // Basic validation
    $: formIsValid = !!billingFirstName && !!billingLastName && !!billingEmail && 
                    !!billingAddress && !!billingCity && !!billingZip && 
                    (paymentMethod !== "credit" || (!!cardNumber && !!cardName && !!cardExpiry && !!cardCvv));
    
    onMount(() => {
        // Redirect if cart is empty or has contact-for-pricing items
        if ($cart.length === 0) {
            toasts.push({
                message: 'Your cart is empty. Please add items before checkout.',
                color: 'warning',
                header: 'Empty Cart'
            });
            goto('/cart');
        } else if ($hasContactForPricingItems) {
            toasts.push({
                message: 'Your cart contains items that require a price quote. Please contact our sales team.',
                color: 'warning',
                header: 'Price Quote Required'
            });
            goto('/cart');
        }
    });
    
    function handleSubmit() {
        if (!formIsValid) return;
        
        isProcessing = true;
        
        // Simulate payment processing
        setTimeout(() => {
            // Clear cart after successful checkout
            cart.clearCart();
            
            // Show success message
            toasts.push({
                message: 'Your order has been successfully processed!',
                color: 'success',
                header: 'Order Confirmed'
            });
            
            // Redirect to success page or homepage
            goto('/cart/success');
            
            isProcessing = false;
        }, 2000);
    }
    
    function cancelCheckout() {
        goto('/cart');
    }
</script>

<div class="container my-5">
    <h1 class="mb-4">Checkout</h1>
    
    <div class="row">
        <div class="col-lg-8">
            <div class="card shadow-sm mb-4">                <div class="card-body">
                    <h4 class="mb-3">Billing Information</h4>
                    <form on:submit|preventDefault={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="billingFirstName">First Name*</Label>
                                    <Input 
                                        type="text" 
                                        id="billingFirstName" 
                                        bind:value={billingFirstName} 
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="billingLastName">Last Name*</Label>
                                    <Input 
                                        type="text" 
                                        id="billingLastName" 
                                        bind:value={billingLastName} 
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup>
                            <Label for="billingEmail">Email Address*</Label>
                            <Input 
                                type="email" 
                                id="billingEmail" 
                                bind:value={billingEmail}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="billingCompany">Company</Label>
                            <Input 
                                type="text" 
                                id="billingCompany" 
                                bind:value={billingCompany}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="billingAddress">Address*</Label>
                            <Input 
                                type="text" 
                                id="billingAddress" 
                                bind:value={billingAddress}
                                required
                            />
                        </FormGroup>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="billingCity">City*</Label>
                                    <Input 
                                        type="text" 
                                        id="billingCity" 
                                        bind:value={billingCity}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="billingState">State/Province</Label>
                                    <Input 
                                        type="text" 
                                        id="billingState" 
                                        bind:value={billingState}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="billingZip">Postal Code*</Label>
                                    <Input 
                                        type="text" 
                                        id="billingZip" 
                                        bind:value={billingZip}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="billingCountry">Country*</Label>
                                    <Input 
                                        type="select" 
                                        id="billingCountry" 
                                        bind:value={billingCountry}
                                        required
                                    >
                                        <option value="">Select a country</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="JP">Japan</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>

                        <hr class="my-4" />

                        <h4 class="mb-3">Payment Method</h4>
                        
                        <FormGroup tag="fieldset">
                            <FormGroup check>
                                <Input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    id="paymentCredit" 
                                    value="credit" 
                                    bind:group={paymentMethod}
                                />
                                <Label check for="paymentCredit">
                                    Credit or Debit Card
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    id="paymentPaypal" 
                                    value="paypal" 
                                    bind:group={paymentMethod}
                                />
                                <Label check for="paymentPaypal">
                                    PayPal
                                </Label>
                            </FormGroup>
                        </FormGroup>

                        {#if paymentMethod === 'credit'}
                            <div class="card-details">
                                <FormGroup>
                                    <Label for="cardNumber">Card Number*</Label>
                                    <Input 
                                        type="text" 
                                        id="cardNumber" 
                                        bind:value={cardNumber}
                                        placeholder="1234 5678 9012 3456"
                                        required={paymentMethod === 'credit'}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="cardName">Name on Card*</Label>
                                    <Input 
                                        type="text" 
                                        id="cardName" 
                                        bind:value={cardName}
                                        required={paymentMethod === 'credit'}
                                    />
                                </FormGroup>

                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="cardExpiry">Expiration Date*</Label>
                                            <Input 
                                                type="text" 
                                                id="cardExpiry" 
                                                bind:value={cardExpiry}
                                                placeholder="MM/YY"
                                                required={paymentMethod === 'credit'}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="cardCvv">CVV*</Label>
                                            <Input 
                                                type="text" 
                                                id="cardCvv" 
                                                bind:value={cardCvv}
                                                placeholder="123"
                                                required={paymentMethod === 'credit'}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        {:else if paymentMethod === 'paypal'}
                            <div class="paypal-message mt-3 mb-4">
                                <p class="text-muted">
                                    You will be redirected to PayPal to complete your purchase securely.
                                </p>
                            </div>
                        {/if}

                        <hr class="my-4" />

                        <div class="d-flex justify-content-between">
                            <Button color="secondary" on:click={cancelCheckout}>
                                Back to Cart
                            </Button>
                            <Button 
                                color="primary" 
                                type="submit" 
                                disabled={!formIsValid || isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Complete Purchase'}
                            </Button>                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-lg-4">
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h4 class="mb-3">Order Summary</h4>
                      {#each $cart as item}
                        <div class="d-flex justify-content-between mb-2">
                            <div>
                                <h6 class="mb-0">{item.name}</h6>
                                <small class="text-muted">{item.description?.substring(0, 50) || 'No description'}</small>
                            </div>
                            {#if item.price !== null}
                                <span>${item.price.toFixed(2)}</span>
                            {:else}
                                <span class="text-info">Contact for Pricing</span>
                            {/if}
                        </div>
                    {/each}
                    
                    <hr />
                    
                    <div class="d-flex justify-content-between">
                        <h5>Total</h5>
                        <h5 class="text-primary">${$cartTotal.toFixed(2)}</h5>
                    </div>
                </div>
            </div>
            
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="mb-3">Secure Checkout</h5>
                    <p class="text-muted small">
                        Your payment information is processed securely. We do not store credit card details nor have access to your payment information.
                    </p>
                    <div class="text-center mt-3">
                        <i class="bi bi-shield-lock me-2"></i> SSL Secure Payment
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .card {
        border-radius: 0.5rem;
        border: none;
    }
</style>

<!-- Include Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
