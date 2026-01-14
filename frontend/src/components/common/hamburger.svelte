<script>
	import { Button } from "@sveltestrap/sveltestrap";
    let navOpen = false;

    async function handleNav() {
		navOpen = !navOpen;
	}
	
</script>
<div class="container-fluid">
    <Button color="light" on:click={handleNav}>
        <span class:change={navOpen} class="navbar-toggler-icon"></span>
    </Button>
</div>
