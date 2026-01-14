<script lang="ts">
	import { Navbar as NavbarComponent, NavbarBrand, Nav, NavItem, NavLink, Button, Icon, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Tooltip } from "@sveltestrap/sveltestrap";
	import { APPS } from "$lib/commontypes";
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { cartCount, cart } from '../../lib/stores/cartStore';

	// Props for the navbar
	export let allowedApps: string[] = [];
	export let authenticated = false;
	export let currentApp = "Home";
	export let appAlias = "No App Selected";
	export let userName = "User";

	// Clean logout function with browser check
	function handleLogout() {
		if (!browser) return;
		
		sessionStorage.removeItem('token');
		document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		window.location.href = '/auth/login';
	}

	// Function to determine if an app should be accessible
	function isAppAccessible(appName: string, allowedApps: string[] = []): boolean {
		return authenticated && allowedApps.includes(appName);
	}
	
	// Get appropriate icon for each app
	function getAppIcon(appName: string) {
		switch(appName) {
			case "Home":
				return "house-door";
			case "Profile":
				return "person-circle";
			case "CodeInsights":
			case "CodeConvert":
				return "code-slash";
			case "SQLConvert":
				return "code-square";
			case "DocumentInsights":
			case "DocumentInights(CrewAI)":
				return "file-earmark-text";
			case "DatabaseInsights":
				return "database";
			case "WebInsights":
				return "globe";
			case "MemberInsights":
				return "people";
			default:
				return "app";
		}
	}
</script>

<NavbarComponent dark color="dark" expand="md" class="shadow-lg py-2 bg-dark">
	<NavbarBrand href="/" class="d-flex align-items-center">
		<!--<img src="/images/champLogo2.png" alt="Champ Logo" class="mx-1" style="height: 50px; width: auto; border-radius: 8px;" title="AI Marketplace" />-->
		<img src="/images/CognizantLogoWhite.png" alt="Cognizant" class="mx-1" style="height: 50px; width: auto;" title="Cognizant" />
	</NavbarBrand>
	<Nav class="ml-auto d-flex gap-3" navbar>
		{#if authenticated}
			<NavItem class="d-flex align-items-center">
				<div class="d-flex align-items-center px-3 text-light">
					<Icon name="person-circle" class="me-2 fs-5" />
					<span>Welcome, {userName}</span>
				</div>
			</NavItem>
		{/if}
		
		<NavItem class="d-flex align-items-center">
			<Dropdown theme="light" direction="down">
				<DropdownToggle color="light" caret>
					<Icon name="grid-3x3-gap" class="me-1" />
					{appAlias}
				</DropdownToggle>
				<DropdownMenu>
					{#if authenticated}
						{#each Object.keys(APPS) as app}
							{#if isAppAccessible(app, allowedApps)}
								<DropdownItem on:click={() => { currentApp = app; appAlias = APPS[app].alias; goto(APPS[app].route) }}>
									<Icon name={getAppIcon(app)} class="me-2" />
									{APPS[app].alias}
								</DropdownItem>
							{:else}
								<DropdownItem disabled class="text-muted">
									<Icon name={getAppIcon(app)} class="me-2" />
									<span>{APPS[app].alias}</span>
									<small class="ms-2">(No Access)</small>
								</DropdownItem>
							{/if}
						{/each}
					{:else}
						<DropdownItem disabled class="text-muted">
							<Icon name="lock" class="me-2" />
							<span>Please log in to access apps</span>
						</DropdownItem>
						{#each Object.keys(APPS) as app}
							<DropdownItem disabled class="text-muted">
								<Icon name={getAppIcon(app)} class="me-2" />
								<span>{APPS[app].alias}</span>
							</DropdownItem>
						{/each}
					{/if}
				</DropdownMenu>
			</Dropdown>
		</NavItem>
		
		{#if authenticated}
			<NavItem class="d-flex align-items-center">
				<a href="/auth/profile">
					<Button color="outline-light">
						<Icon name="person-badge" class="me-1" />
						My Profile
					</Button>
				</a>
			</NavItem>
			<NavItem class="d-flex align-items-center">
				<Button color="outline-light" on:click={handleLogout}>
					<Icon name="box-arrow-right" class="me-1" />
					Logout
				</Button>
			</NavItem>
		{:else}
			<NavItem class="d-flex align-items-center">
				<Button 
					class="login-btn"
					style="background-color: #6c757d; border: none; color: #fff; transition: background-color 0.3s ease;"
					href="/auth/login"
				>
					<Icon name="box-arrow-in-right" class="me-1" />
					Login
				</Button>
			</NavItem>
			<NavItem class="d-flex align-items-center">
				<Button
					color="outline-light"
					href="/auth/signup"
				>
					<Icon name="person-plus" class="me-1" />
					Register
				</Button>			</NavItem>
		{/if}
				<NavItem class="d-flex align-items-center me-2">
			<div class="cart-dropdown">
				<a href="/cart" class="position-relative cart-icon">
					<Button color="outline-light">
						<Icon name="cart" class="me-1" />
						Cart
						{#if $cartCount > 0}
							<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								{$cartCount}
								<span class="visually-hidden">items in cart</span>
							</span>
						{/if}
					</Button>
				</a>
				
				{#if $cartCount > 0}
					<div class="cart-preview">
						<div class="cart-preview-header">
							<h6 class="m-0">Cart ({$cartCount} {$cartCount === 1 ? 'item' : 'items'})</h6>
						</div>						<div class="cart-preview-body">
							{#each $cart.slice(0, 3) as item}
								<div class="cart-preview-item">									<img src={item.image} alt={item.name} class="cart-preview-img" />
									<div class="cart-preview-details">
										<span class="cart-preview-name">{item.name}</span>
										{#if item.price !== null}
											<span class="cart-preview-price">${item.price.toFixed(2)}</span>
										{:else}
											<span class="cart-preview-price text-info">Contact for Pricing</span>
										{/if}
									</div>
								</div>
							{/each}
							{#if $cartCount > 3}
								<div class="text-center py-2">
									<small>+ {$cartCount - 3} more items</small>
								</div>
							{/if}
						</div>
						<div class="cart-preview-footer">
							<a href="/cart" class="btn btn-primary btn-sm w-100">View Cart</a>
						</div>
					</div>
				{/if}
			</div>
		</NavItem>
		
		<NavItem class="d-flex align-items-center">
			<button class="btn btn-dark ms-1">
				<Icon name="question-circle" id="disclaimer" />
				<Tooltip target="disclaimer" placement="left">
					Disclaimer:
					This portal is intended solely for use in conversion-related activities. Users are strictly prohibited from uploading, processing, or sharing any Personal Health Information (PHI), sensitive personal data, or any non-approved code through this platform. Any unauthorized use of this portal, including the submission of non-conversion-related materials, is prohibited and may result in disciplinary action, including termination of access. By using this portal, you agree to comply with these terms and acknowledge that any violation may be subject to applicable legal or regulatory consequences.
				</Tooltip>
			</button>
		</NavItem>
	</Nav>
</NavbarComponent>

<style>
	:global(.navbar) {
		padding: 0.75rem 1rem;
	}
	
	:global(.navbar-brand) {
		font-weight: 600;
	}
	
	:global(.nav-item) {
		margin: 0 0.25rem;
	}

	:global(.dropdown-item.disabled) {
		color: #6c757d !important;
		opacity: 0.6;
		pointer-events: none;
	}
	
	:global(.login-btn:hover), :global(.logout-btn:hover) {
		background-color: #5a6268 !important;
	}
	
	/* Soften the harsh white borders on outline buttons */
	:global(.btn-outline-light) {
		border-color: rgba(255, 255, 255, 0.5) !important; /* Reduce opacity for softer borders */
		transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
	}
		:global(.btn-outline-light:focus) {
		box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.2) !important; /* Softer focus outline */
	}
	
	/* Cart dropdown styles */
	.cart-dropdown {
		position: relative;
	}
	
	.cart-dropdown:hover .cart-preview {
		display: block;
	}
	
	.cart-preview {
		display: none;
		position: absolute;
		top: 100%;
		right: 0;
		width: 300px;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
		z-index: 1000;
		color: #333;
		overflow: hidden;
	}
	
	.cart-preview-header {
		padding: 0.75rem;
		background-color: #f8f9fa;
		border-bottom: 1px solid #dee2e6;
	}
	
	.cart-preview-body {
		max-height: 240px;
		overflow-y: auto;
	}
	
	.cart-preview-item {
		display: flex;
		padding: 0.75rem;
		border-bottom: 1px solid #dee2e6;
	}
	
	.cart-preview-img {
		width: 40px;
		height: 40px;
		border-radius: 0.25rem;
		object-fit: cover;
		margin-right: 0.75rem;
	}
	
	.cart-preview-details {
		display: flex;
		flex-direction: column;
	}
	
	.cart-preview-name {
		font-weight: 600;
		font-size: 0.875rem;
	}
	
	.cart-preview-price {
		color: #6c757d;
		font-size: 0.875rem;
	}
	
	.cart-preview-footer {
		padding: 0.75rem;
		border-top: 1px solid #dee2e6;
	}
</style>