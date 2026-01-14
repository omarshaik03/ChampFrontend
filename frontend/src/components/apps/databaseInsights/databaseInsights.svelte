<script lang="ts">    import DbMain from './dbMain.svelte';
	import DbInsightsLogin from './dbinisghtslogin.svelte';
	import type { Llm } from '$lib/commontypes';
	import type { User } from '../../../lib/stores/userStore';
	import { userStore } from '../../../lib/stores/userStore';

	// data management
    let user = $userStore;
    let url_base: string | undefined;
	$: if (user) {
		url_base = user.url_base;
	}

    let sqlDialect: string;
    let username: string;
    let password: string;
    let host: string;
    let driver: string;
    let port: string;
    let database: string;
    let poolRecycle: string;
	let llm: Llm = "GPT4o";

	let url: string;

    let loggedIn = false;
</script>

{#if user && user.token}
	{#if !loggedIn}
		<DbInsightsLogin
			url_base={url_base}
			token={user.token}
			bind:llm={llm}
			bind:sqlDialect={sqlDialect}
			bind:username={username}
			bind:password={password}
			bind:host={host}
			bind:driver={driver}
			bind:port={port}
			bind:database={database}
			bind:poolRecycle={poolRecycle}
			bind:loggedIn={loggedIn}
		/>{:else}
		<DbMain 
			url_base={url_base} 
			token={user.token} 
			bind:loggedIn={loggedIn} 
			llm={llm}
			sqlDialect={sqlDialect}
			username={username}
			password={password}
			host={host}
			driver={driver}
			port={port}
			database={database}
			poolRecycle={poolRecycle}
		/>
	{/if}
{:else}
	<p>Loading...</p>
{/if}