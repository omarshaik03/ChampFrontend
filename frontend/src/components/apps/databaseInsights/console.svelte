<script>
    export let logMessages = [];
  
    function clearLogs() {
      logMessages = [];
    }
  </script>
  
  <div class="bg-light p-3 mt-4" style="height: 200px; overflow-y: scroll;">
    <h5>Console</h5>
    <div>
      {#each logMessages as message}
        <p>{message}</p>
      {/each}
    </div>
    <button class="btn btn-secondary mt-2" on:click={clearLogs}>Clear</button>
  </div>
  