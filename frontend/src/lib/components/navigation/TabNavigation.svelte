<script lang="ts">
	export let activeTab: string;
	export let onTabChange: (tab: string) => void;

	type TabType = 'apps' | 'agents' | 'apis';

	function handleTabClick(tab: TabType) {
		activeTab = tab;
		onTabChange(tab);
	}
</script>

<div class="tabs-overlap">
	<ul class="nav nav-tabs justify-content-center mb-4">
		<li class="nav-item">
			<button 
				type="button" 
				class="nav-link {activeTab === 'apps' ? 'active' : ''}" 
				on:click={() => handleTabClick('apps')}
			>
				<i class="bi bi-grid-fill me-2"></i>AI Workflows
			</button>
		</li>
		<li class="nav-item">
			<button 
				type="button" 
				class="nav-link {activeTab === 'agents' ? 'active' : ''}" 
				on:click={() => handleTabClick('agents')}
			>
				<i class="bi bi-person-lines-fill me-2"></i>AI Agents
			</button>
		</li>
		<li class="nav-item">
			<button 
				type="button" 
				class="nav-link {activeTab === 'apis' ? 'active' : ''}" 
				on:click={() => handleTabClick('apis')}
			>
				<i class="bi bi-hdd-stack-fill me-2"></i>AI APIs
			</button>
		</li>
	</ul>
</div>

<style>
	.tabs-overlap {
		margin-top: -5.6rem;
		z-index: 10;
		position: relative;
	}

	.nav-tabs .nav-link {
		background-color: var(--bs-light);
		border-bottom: 1px solid var(--bs-light);
		color: var(--bs-link-color);
	}

	.nav-tabs .nav-link:hover {
		background-color: var(--bs-white);
		color: var(--bs-link-hover-color);
	}

	.nav-tabs .nav-link.active {
		background-color: var(--bs-white);
		border-bottom-color: var(--bs-white);
		color: var(--bs-link-hover-color);
	}
</style>
