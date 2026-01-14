<script lang="ts">
    import { Modal, Icon, Input, Button,Spinner, Progress, Form, InputGroup, Dropdown, DropdownToggle, DropdownItem, DropdownMenu} from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';
	import Structuredoutput from '../../old/structuredoutput.svelte';
	import Settingstab from '../../common/settingstab.svelte';
	import Chatbox from '../../common/chatbox.svelte';	import Searchbar from '../../common/searchbar.svelte';
	import Toastwrapper from '../../common/toastwrapper.svelte';
	import Timer from '../../common/timer.svelte';
    import { sendQuery } from '$lib/query';
    import type { ChatContent, Llm, OpenSearchIndex } from '$lib/commontypes';
    import { sendCrewQuery } from '$lib/query';
	import UserFeedback from '../../common/userFeedback.svelte';
    import { toasts } from '../../../lib/stores/toastStore';
    import ToastNotifications from '../../common/ToastNotifications.svelte';
    import { userStore } from '../../../lib/stores/userStore';

    let user = $userStore;
    let url_base = import.meta.env.VITE_DEV_URL;
    let jwt: string | undefined;
    if (user) {
        jwt = user.token;
    }
    let questionAsked = false;
    // Define route URL
    let url = url_base + "/api/opensearch_rag/ragquery/upload";
    export let llmSel: Llm= "Claude V3 Opus"
    export let index: OpenSearchIndex | string = "image_test";
    export let debug = false;

    // displays for loading and progress
    let loading = false;
    let progress: number | undefined;

    // Track time taken for the query
    let myTimer: Timer;
    let timer2: number | undefined;

    // query is the user's input
    let query = "";

    // listOfDefaultQuestions is an array of default questions that the user can select from
    
    let listOfDefaultQuestions = {
        "RFP Comparison": {
            "index": "1_8",
            "questions":[
                "What strategic differentiators are health plans implementing to meet the Nebraska's RFP requirements? Compare these to Molina. The relavent plans are Molina, Centene/Nebraska Total Care, Healthy Blue, United."
            ]
        },
        "RFP Codes": {
            "index": "1_10",
            "questions": [
                "What are the codes added for physical therapy, occupational therapy, outpatient speech-language pathology services effective January 1, 2024.",
            ]
        }

        
    };

   
    // chatContent is an array of objects with user, chatbot, and link properties
    // user is the user's message, chatbot is the chatbot's response, and link is the source of the chatbot's response
    let chatContents: ChatContent[] = [];

    // activeStructuredOutput is a boolean that determines whether structured output is active
    // listOfColumns is an array of objects with column_name and column_description properties for structured output
    let activeStructuredOutput = false;
    let listOfColumns: { column_name: string, column_description: string }[] = [];

    listOfColumns = [
        {
            column_name: 'Health Plan',
            column_description: 'The health plan',
        },
        {
            column_name: 'Differentiators',
            column_description: 'The strategic differentiators',
        },
        {
            column_name: 'Compare/Contrast',
            column_description: 'Compare/Contrast to the Molina plan',
        },
        {
            column_name: 'Score',
            column_description: 'The score awarded to the plan',
        }
    ]

    function handleFeedbackComplete() {
    questionAsked = false;
  }

  type CrewResponse = {
    task_id: string;
    status: string;
    result?: string;
    };
  type CrewRequest = {
    objective: string;
    context: string;
    max_iterations: number;
    async_execution: boolean;
    };

    let crewResponse: CrewResponse | null = null;

    // Example CrewRequest object (replace with actual values as needed)
    let crewRequest: CrewRequest = {
        objective: "",
        context: "",
        max_iterations: 1,
        async_execution: false
    };

    async function fetchCrewResponse(): Promise<CrewResponse | null> {
    try {
        // Use the crewRequest variable in the fetch body
        const res = await fetch(`http://127.0.0.1:8001/crew/tasks_sync`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(crewRequest),
        });
        if (!res.ok) throw new Error("Failed to fetch crew response");
        const data: CrewResponse = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching CrewResponse:", err);
        return null;
    }
}

    async function handleCrewResponse() {
    crewResponse = await fetchCrewResponse();
    if (crewResponse) {
        const crewChat: ChatContent = {
            user: "Crew Response",
            chatbot: crewResponse.result || "No result available",
            link: {},
        };
        chatContents = [crewChat, ...chatContents];
    } else {
        toasts.push({ message: "No crew response received", color: 'warning' });
        }
    }

    async function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleCrewResponse();
        }
    }
    
    async function clear() {
        chatContents = [];
        query = "";
    }
    
</script>

<ToastNotifications position="top-right" maxToasts={5} />

<div id="main" class="main">
    <div class="chat-container">
      {#if chatContents.length > 0}
        <!-- First message -->
        <div class="message-group">
          <Chatbox 
            chatContents={[chatContents[0]]} 
            {debug}
          />
          {#if questionAsked}
            <UserFeedback
              userQuestion={query}
              modelResponse={typeof chatContents[0]?.chatbot === 'string' ? chatContents[0].chatbot : undefined}
              appName="Document Insights"
              {questionAsked}
              on:feedbackComplete={handleFeedbackComplete}
            />
          {/if}
        </div>
        
        <!-- Remaining messages -->
        {#if chatContents.length > 1}
          <Chatbox 
            chatContents={chatContents.slice(1)} 
            {debug}
          />
        {/if}
      {:else}
        <Chatbox 
          chatContents={chatContents} 
          {debug}
        />
      {/if}
    </div>
  </div>

{#if user}
    <Settingstab user={user} bind:index={index} app="documentinsights">
        <Structuredoutput bind:listOfColumns={listOfColumns} bind:activeStructuredOutput={activeStructuredOutput}/>
    </Settingstab>
{/if}

<div class="bottom-div">
    <!-- <LogoSpin /> -->

    <div class="input-wrapper" style="align-items: center">
        <Input
        disabled={false}
        invalid={false}
        placeholder="Ask a Question . . . "
        plaintext={false}
        reverse={false}
        type="text"
        valid={false}
        bind:value={query}
        class="chat-input"
        style = "width: 100%; border: solid;"
        on:keypress={handleKeyDown}
        />
        <Button on:click={clear}>Clear</Button>
        <Button on:click={handleCrewResponse} color="secondary">
            <Icon name="chat-fill" />
        </Button>
    </div>
    {#if progress}
        <Progress value={progress}>{progress}%</Progress>
    {/if}
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
    :root {
        --bottom-div-height: 100px;
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 2px;
    }

</style>
