<script lang="ts">
    import { Spinner } from '@sveltestrap/sveltestrap';
	import Structuredoutput from './structuredoutput.svelte';
	import Settingstab from '../common/settingstab.svelte';
	import Chatbox from '../common/chatbox.svelte';
	import Searchbar from '../common/searchbar.svelte';
	import Toastwrapper from '../common/toastwrapper.svelte';
    import type { LlmOption, OpenSearchIndex } from '$lib/commontypes';
    import Timer from '../common/timer.svelte';
    import { sendQuery } from '$lib/query';
    import type { ChatContent } from '$lib/commontypes';

    // Running mode ENV
    const mode = import.meta.env.VITE_MODE;
    // Default prod URL
    let url = "https://hpcsiaipoc.azurewebsites.net/api/opensearch_rag/ragquery/upload"
    // Dev URL
    if (mode === "dev"){
        let url = import.meta.env.VITE_DEV_URL
    }
    
    export let llmSel: LlmOption = "Claude V2"
    export let index: OpenSearchIndex | string = "rag"

    // displays for loading
    let loading = false;

    // Track time taken for the query
    let myTimer: Timer;
    
    // query is the user's input
    let query = "";

    // listOfDefaultQuestions is an array of default questions that the user can select from
    let listOfDefaultQuestions = [
        "What is Facets?",
        "What does the Facets System Administration product contain?",
        "How to setup facets RDS DB for the cluster?",
        "What are pre-requisites for Facets G6?",
        "Can Batch Job ercmcrunblaf be run concurrently with ercdsrunbil0?",
        "Can Batch Job ercmcrunblac be run concurrently with ercmcrunblat?"
    ];

    // chatContent is an array of objects with user, chatbot, and link properties
    // user is the user's message, chatbot is the chatbot's response, and link is the source of the chatbot's response
    let chatContents: ChatContent[] = [];

    // activeStructuredOutput is a boolean that determines whether structured output is active
    // listOfColumns is an array of objects with column_name and column_description properties for structured output
    let activeStructuredOutput = false;
    let listOfColumns: { column_name: string, column_description: string }[] = [];

    listOfColumns = [
        {
            column_name: 'Function',
            column_description: 'Name a function of Facets',
        },
        {
            column_name: 'Description',
            column_description: 'Detailed description of the function',
        },
    ]

    // sendQuery
    async function mySendQuery() {
        try {
            loading = true;
            if(!myTimer) {
                throw new Error("Timer not initialized");
            }
            let timeAndResponse: { response: ChatContent, time: number };
            if (activeStructuredOutput && listOfColumns.length > 0) {
                timeAndResponse = await myTimer.timeAFunction(() => sendQuery(query, llmSel, index, listOfColumns));
            } else {
                timeAndResponse = await myTimer.timeAFunction(() => sendQuery(query, llmSel, index));
            }
            let newChatContent = timeAndResponse.response;
            newChatContent.time = timeAndResponse.time.toFixed(1) + "s";
            chatContents = [newChatContent, ...chatContents];
            loading = false;
        } catch (error) {
            console.error('Error in mySendQuery: ', error);
            loading = false;
        }
    }

</script>


<div id="main" class="main">
    <Chatbox bind:chatContents={chatContents}/>
</div>
<Settingstab>
    <Structuredoutput bind:listOfColumns={listOfColumns} bind:activeStructuredOutput={activeStructuredOutput}/>
</Settingstab>
<div class="bottom-div">
    <div class="w-100">
        <Searchbar bind:query={query} listOfDefaultQuestions={listOfDefaultQuestions} on:sendQuery={mySendQuery}/>
    </div>
</div>
<div class={loading? "": "d-none"}>
    <Toastwrapper open={true} width="200px">
        <div class="d-flex justify-content-between align-items-center" slot="body">
            <Spinner color="primary" />
            <h4 class="m-0"><Timer bind:this={myTimer}/>s</h4>
        </div>
    </Toastwrapper>
</div>

<style>
    .main {
		overflow-y: scroll;
		height: 100%;
        padding: 25px;
		margin-bottom: var(--bottom-div-height);
	}
	.bottom-div {
		background-color: white;
		text-align: center;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: var(--bottom-div-height);
		padding: 25px;
		display: flex;
		align-items: center;
	}
</style>