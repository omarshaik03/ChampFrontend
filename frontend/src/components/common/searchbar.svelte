<script lang="ts">
    import { Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Icon, Modal } from '@sveltestrap/sveltestrap';
    import { createEventDispatcher } from 'svelte';
    import type { ChatContent } from '$lib/commontypes';
    let open = false;
    const toggle = () => (open = !open);
    

    export let listOfDefaultQuestions: any = {};
    let listOfDefaultQuestionsKey: undefined | string = undefined;
    export let query: string = "";
    export let chatContents: ChatContent[] = [];
    export let promptaddition: string = "";
    export let index: string = "";
    let switchQuestions = false;

    let dispatch = createEventDispatcher();

    async function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            sendQuery();
        }
    }

    async function sendQuery() {
        dispatch('sendQuery');
    }
    

    async function setQuery(val: string) {
        query = val;
    }
    async function clear() {
        chatContents = [];
        query = "";
    }

    async function addtoPrompt() {
        open = false;
        alert('Details have been added to the prompt');
    }
</script>

<div style="display: flex; justify-content: space-between; flex-wrap: nowrap;" class="input-group">
    <!-- <Input
        disabled={false}
        invalid={false}
        placeholder="Add to Prompt . . . "
        plaintext={false}
        reverse={false}
        type="text"
        valid={false}
        bind:value={promptaddition}
        class = "form-control"
        style = "width: 70%; border: solid; margin-bottom: 5px;"
        on:keypress={handleKeyDown}
    />
    <Button on:click={addtoPrompt} >Add to Prompt</Button> -->

    <Input
        disabled={false}
        invalid={false}
        placeholder="Ask a Question . . . "
        plaintext={false}
        reverse={false}
        type="text"
        valid={false}
        bind:value={query}
        class = "form-control"
        style = "width: 70%; border: solid;"
        on:keypress={handleKeyDown}
    />
    {#if Object.keys(listOfDefaultQuestions).length > 0}
        <Button on:click={clear}>Clear</Button>
        <Dropdown direction="up" >
            <DropdownToggle style="background-color:white; color: black; border:solid; max-width: 300px; overflow:hidden" caret>{listOfDefaultQuestionsKey || "Examples"}</DropdownToggle>
            <DropdownMenu style="overflow-y: scroll; max-height:500px;">
                {#each Object.keys(listOfDefaultQuestions) as key}
                    <DropdownItem on:click={() => {listOfDefaultQuestionsKey = key; index = listOfDefaultQuestions[key].index}}>{key}</DropdownItem>
                {/each}
            </DropdownMenu>
        </Dropdown>
        {#if listOfDefaultQuestionsKey && listOfDefaultQuestions[listOfDefaultQuestionsKey].questions.length > 0}
            <Dropdown direction="up" >
                <DropdownToggle style="background-color:white; color: black; border:solid;" caret>Select Question</DropdownToggle>
                <DropdownMenu style="overflow-y: scroll; max-height:500px;">
                    {#each listOfDefaultQuestions[listOfDefaultQuestionsKey].questions as question}
                        <DropdownItem on:click={() => {query = question}}>{question}</DropdownItem>
                    {/each}
                </DropdownMenu>
            </Dropdown>
        {/if}
    {/if}
    <Button style="text-align: right;" on:click={sendQuery} color="secondary">
        <Icon name="chat-fill" />
    </Button>
    
</div>