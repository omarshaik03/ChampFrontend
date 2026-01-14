<script>
	import { CardBody } from "@sveltestrap/sveltestrap";
	import { Card } from "flowbite-svelte";

  export let content = '';
</script>

<Card class="query-result-card">
  <CardBody>
      <pre class="query-result">
          {content}
      </pre>
  </CardBody>
</Card>

<style>
  .query-result {
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
  }
</style>