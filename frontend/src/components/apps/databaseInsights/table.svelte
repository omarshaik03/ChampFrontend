<script lang="ts">
	import { Table } from "@sveltestrap/sveltestrap";
    
    // Props to accept data and configuration
    export let data: string[][] = [];
    export let use_headers = false;
    export let striped = false;
    export let bordered = false;
    export let hover = false;
    export let responsive = true;
    export let size = '';

    // Extract headers from data
    let headers: string[] = [];
    $: if (use_headers) {
        headers = data[0];
        data = data.slice(1);
    }
  </script>
  
  <Table {striped} {bordered} {hover} {responsive} {size}>
    {#if use_headers}
      <thead>
        <tr>
          {#each headers as header}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
    {/if}
    <tbody>
      {#each data as row}
        <tr>
          {#each row as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </Table>