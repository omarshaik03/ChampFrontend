<script lang="ts">
	import { InputGroup } from "@sveltestrap/sveltestrap";

    export let listOfColumns: { column_name: string, column_description: string }[] = [];
    export let activeStructuredOutput: boolean = false;

    async function toggleStructuredOutput() {
        activeStructuredOutput = !activeStructuredOutput;
    }

    async function addToListOfColumns() {
        listOfColumns = [
            ...listOfColumns,
            {
                column_name: '',
                column_description: ''
            }
        ];
    }

    function removeFromListOfColumns(index: number) {
        listOfColumns = listOfColumns.filter((_, i) => i !== index);
    }
    
</script>

{#if activeStructuredOutput}
    <div>
        <h4>Structured Output <button class="btn btn-link" on:click={toggleStructuredOutput}><div>-</div></button></h4>
        <hr>
        <div>
            {#each listOfColumns as column, index}
                <hr>
                <InputGroup>
                    <input type="text" bind:value={column.column_name} class="form-control" placeholder="Column Header"/>
                    <input type="text" bind:value={column.column_description} class="form-control" placeholder="Column Description"/>
                    <button class="btn btn-secondary" on:click={() => removeFromListOfColumns(index)}>X</button>
                </InputGroup>
            {/each}
            <hr>
            <InputGroup>
                <button class="btn btn-secondary" on:click={addToListOfColumns}>+</button>
            </InputGroup>
        </div>
    </div>
{:else}
    <h4>Structured Output <button class="btn btn-link" on:click={toggleStructuredOutput}><div>+</div></button></h4>
    <hr>
{/if}