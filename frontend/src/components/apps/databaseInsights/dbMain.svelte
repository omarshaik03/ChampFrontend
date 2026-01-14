<script lang="ts">
    import { onMount } from 'svelte';
	import Sidebar from './sidebar.svelte';
	import Canvas from './canvas.svelte';
    import Console from './console.svelte';
   
	export let url_base: undefined | string;
	export let token: undefined | string;
	export let llm: string;
	export let sqlDialect: string;
	export let username: string;
	export let password: string;
	export let host: string;
	export let driver: string;
	export let port: undefined | string = undefined;
	export let database: string;
	export let poolRecycle: undefined | string = undefined;

	export let loggedIn: boolean = false;
  
    let selectedDb: string = 'SQL';
    let logMessages:any[] = [];
  
    function logMessage(message: string) {
      logMessages = [...logMessages, message];
    }
  
    // Simulate logging messages
    onMount(() => {
      logMessage('Welcome to Database Insights!');
    });
</script>
  
<div class="d-flex">
	<!-- Sidebar -->
	<Sidebar bind:selectedDb={selectedDb} bind:loggedIn={loggedIn}/>

	<!-- Main Canvas Area -->
	<div class="flex-grow-1">
		<Canvas
			url_base={url_base}
			token={token}
			selectedDb={selectedDb}
			bind:llm={llm}
			bind:sqlDialect={sqlDialect}
			bind:username={username}
			bind:password={password}
			bind:host={host}
			bind:driver={driver}
			bind:port={port}
			bind:database={database}
			bind:poolRecycle={poolRecycle}
		/>

		<!-- Console Output -->
		<Console {logMessages} />
	</div>
</div>
  
<style>
	.d-flex {
		display: flex;
		height: 100vh;
	}

	.flex-grow-1 {
		flex-grow: 1;
		padding-left: 20px;
	}
</style>
  