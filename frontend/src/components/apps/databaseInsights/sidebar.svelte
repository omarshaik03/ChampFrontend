<script lang="ts">
    export let selectedDb = 'SQL';
    export let loggedIn = false;
  
    const databases = ['SQL', 'MySQL', 'PostgreSQL', 'SQLite'];
  
    function selectDatabase(db: any) {
      selectedDb = db;
    }
</script>
  
<aside class="bg-dark text-white p-3" style="width: 250px; height: 100vh;">
	<h4>Database Selector</h4>
	<ul class="list-unstyled">
		{#each databases as db}
			<li>
				<button
					class="btn btn-link text-white"
					on:click={() => selectDatabase(db)}
					class:selected={db === selectedDb}
				>
					{db}
				</button>
			</li>
		{/each}
	</ul>

	<!--Log Out Button-->
    <button class="btn btn-primary" on:click={() => loggedIn = false}>Log Out</button>
</aside>
  
<style>
	button.selected {
		font-weight: bold;
		color: #007bff;
	}
</style>
  