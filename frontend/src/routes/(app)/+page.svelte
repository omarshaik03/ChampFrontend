<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import TabNavigation from '$lib/components/navigation/TabNavigation.svelte';
	import AppsTab from '$lib/components/navigation/AppsTab.svelte';
	import AgentsTab from '$lib/components/agents/AgentsTab.svelte';
	import ApisTab from '$lib/components/navigation/ApisTab.svelte';
	
	function scrollToContent() {
		if (!browser) return; // Skip if not in browser environment
		
		const contentSection = document.getElementById('tabbed-content-section');
		if (contentSection) {
			contentSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let activeTab = 'apps';

	function setTabFromHash() {
		if (!browser) return;
		const hash = window.location.hash.replace('#', '');
		if (['apps', 'agents', 'apis'].includes(hash)) {
			activeTab = hash;
		}
	}

	function setHash(tab: string) {
		if (!browser) return;
		window.location.hash = tab;
	}

	function handleTabChange(tab: string) {
		activeTab = tab;
		setHash(tab);
	}

	onMount(() => {
		setTabFromHash();
		window.addEventListener('hashchange', setTabFromHash);
		return () => window.removeEventListener('hashchange', setTabFromHash);
	});
</script>

<section class="hero d-flex flex-column justify-content-center align-items-center text-center py-5 text-white">
	<h1 class="display-3 mb-3 animate__animated animate__fadeInDown">
		Welcome to <img src="/images/champLogo2.png" alt="CHAMP" class="mx-1" style="height: 76px; width: auto; border-radius: 8px;" title="AI Marketplace" />
	</h1>
	<p class="lead mb-4 animate__animated animate__fadeInUp">Explore powerful AI apps designed to boost your business</p>
	<Button color="primary" size="lg" class="animate__animated animate__fadeInUp" on:click={scrollToContent}>Explore Content</Button>
</section>

<section id="tabbed-content-section" class="container my-5">
	<TabNavigation {activeTab} onTabChange={handleTabChange} />
	<div class="tab-content">
		{#if activeTab === 'apps'}
			<AppsTab />
		{:else if activeTab === 'agents'}
			<AgentsTab />
		{:else if activeTab === 'apis'}
			<ApisTab />
		{/if}
	</div>
</section>

<footer class="footer bg-dark text-white py-4 mt-5">
	<div class="container text-center">
		<div class="mb-2">
			<img src="/images/champLogo2.png" alt="CHAMP" style="height: 40px; width: auto; border-radius: 6px;" />
		</div>
		<div>
			<small>&copy; {new Date().getFullYear()} CHAMP AI Marketplace. All rights reserved.</small>
		</div>
		<div class="mt-2">
			<a href="#apps" class="text-white me-3">Apps</a>
			<a href="#agents" class="text-white me-3">Agents</a>
			<a href="#apis" class="text-white">APIs</a>
		</div>
	</div>
</footer>

<style>
	a {
		text-decoration: none;
	}
	.hero {
		min-height: 70vh;
		background: linear-gradient(135deg, #001f3f 0%, #ffffff 100%);	}
</style>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
</svelte:head>
