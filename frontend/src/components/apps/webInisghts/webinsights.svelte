<script lang="ts">
    import { Icon, Input, Button,Spinner, Progress, Form, InputGroup, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Tooltip} from '@sveltestrap/sveltestrap';
	import Structuredoutput from '../../old/structuredoutput.svelte';
	import Settingstab from '../../common/settingstab.svelte';
	import Chatbox from '../../common/chatbox.svelte';
	import Searchbar from '../../common/searchbar.svelte';
	import Toastwrapper from '../../common/toastwrapper.svelte';
    import Timer from '../../common/timer.svelte';
    import { sendQuery } from '$lib/query';
    import type { ChatContent, Llm, OpenSearchIndex } from '$lib/commontypes';    import { wait } from '$lib/redis';
	import UserFeedback from '../../common/userFeedback.svelte';
	import { toasts } from '../../../lib/stores/toastStore';
	import ToastNotifications from '../../common/ToastNotifications.svelte';
	import { userStore, type User } from '../../../lib/stores/userStore';
    import runtimeConfig from "$lib/runtime-config";

    let user = $userStore;
    let url_base = import.meta.env.VITE_DEV_URL;
    let jwt: string | undefined;
    if (user) {
        jwt = user.token;
    }
    let questionAsked = false;
    let uploadLoading = false;
    
    let url = runtimeConfig.DOC_INSIGHTS_URL;
    // New crawl URL for the new route
    let newCrawlUrl = `${url}/crawl/`;
    let newSearchUrl = `${url}/query_documents/`;
    
    let message = "";
    export let index:OpenSearchIndex | string = "webinsights_new";
    export let debug = false;

    // displays for loading and progress
    let loading = false;
    let progress: number | undefined;

    // Track time taken for the query
    let myTimer: Timer;

    // query is the user's input
    let query = "";

    let max_num_of_urls = 10;
	let domainValue = '';
    let selectedQuestion ='';

    let listsOfDefaultQuestions = {
        "https://www.cognizant.com/us/en/services/ai/rewire-for-ai": {
            "index": "webinsights_new",
            "questions":[
                'What is Cognizant Flowsource?',
                'What is Cognizant Neuro AI?'
        ]},
        "https://www.niddk.nih.gov/health-information/digestive-diseases": {
            "index": "webinsights_new",
            "questions":[
                'What are the symptoms of Appendicitis and how do you diagnose it?',
                'What is Crohns Disease? Are there any treatments available for it?'
        ]},
    }

    // chatContent is an array of objects with user, chatbot, and link properties
    // user is the user's message, chatbot is the chatbot's response, and link is the source of the chatbot's response
    let chatContents: ChatContent[] = [];

    // activeStructuredOutput is a boolean that determines whether structured output is active
    // listOfColumns is an array of objects with column_name and column_description properties for structured output
    let activeStructuredOutput = false;
    let listOfColumns: { column_name: string, column_description: string }[] = [];

    listOfColumns = [
        {
            column_name: 'Code',
            column_description: 'The CPT code',
        },
        {
            column_name: 'Notes',
            column_description: 'The notes pertaining to the CPT code',
        },
        {
            column_name: 'Explanation',
            column_description: 'The explained notes for the CPT code',
        },
    ]

    // New crawl method using the crawl endpoint
    async function crawlWebsite() {
        if (!user) {
            toasts.push({ message: "Please login to continue", color: 'danger' });
            return;
        }

        if (!domainValue.trim()) {
            toasts.push({ message: "Please enter a valid URL", color: 'warning' });
            return;
        }

        // Validate URL format
        try {
            new URL(domainValue);
        } catch (error) {
            toasts.push({ message: "Please enter a valid URL format (ex: https://test.com", color: 'warning' });
            return;
        }

        // Check if domain already exists in default questions
        if (Object.keys(listsOfDefaultQuestions).includes(domainValue.trim())) {
            progress = 70;
            await wait(1000 + (Math.random() * 1000));
            progress = undefined;
            toasts.push({ message: 'Website already saved: ' + domainValue, color: 'info' });
            return;
        }

        try {
            uploadLoading = true;
            progress = 0;
            
            // Prepare the request body to match CrawlRequest Pydantic model
            const requestBody = {
                url: domainValue.trim(),
                max_urls: max_num_of_urls,
                cookies: null, // Optional, can be added later if needed
                headers: null  // Optional, can be added later if needed
            };
            
            // Add access_key as a query parameter
            const crawlUrlWithParams = `${newCrawlUrl}?access_key=${jwt}`;
            
            progress = 30;
            
            const response = await fetch(crawlUrlWithParams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            
            progress = 70;
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                throw new Error(`Crawl failed with status: ${response.status} - ${errorData.detail || 'Unknown error'}`);
            }
            
            const data = await response.json();
            progress = 100;
            
            console.log('Crawl successful:', data);
            toasts.push({ 
                message: `${data.message || `Successfully crawled ${data.total_urls || 0} pages from: ${domainValue}`}`, 
                color: 'success' 
            });
            
            // Clear the input
            domainValue = '';
            
        } catch (error) {
            console.error('Error in crawlWebsite:', error);
            toasts.push({ 
                message: `Crawl failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
                color: 'danger' 
            });
        } finally {
            uploadLoading = false;
            progress = undefined;
        }
    }

    // sendQuery
    async function mySendQuery() {
        if (!user) {
            toasts.push({ message: "Please login to continue", color: 'danger' });
            return;
        }
        let timeAndResponse: { response: ChatContent, time: number };
        if (!jwt) {
            toasts.push({ message: "Please login to continue", color: 'danger' });
            return;
        }
        try {
            loading = true;
            if(!myTimer) {
                throw new Error("Timer not initialized");
            }
            if (!query) {
                toasts.push({ message: "Please enter a query", color: 'warning' });
                loading = false;
                return;
            }
            // Push user message first so it shows in UI
            chatContents = [...chatContents, { user: query, chatbot: "", link: {}, analysis: "" }];

            // Fetch bot response using the timer function
            timeAndResponse = await myTimer.timeAFunction(async () => {
                const params = new URLSearchParams({
                    query: "Answer the question based on the documents.",
                    user_query: query,
                    max_documents: "15",
                    min_search_score: "0.3",
                    include_sources: "true",
                    access_key: jwt || ""
                });

                const res = await fetch(`${newSearchUrl}?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                });
                
                if (!res.ok) {
                    throw new Error(`Error fetching query_documents: ${res.status}`);
                }

                const data = await res.json();
                console.log('API Response data:', data);
                console.log("Type of data.analysis:", typeof data.analysis);
                console.log("data.analysis value:", data.analysis);

                // Return the response in the expected format
                const chatbotResponse = typeof data?.analysis === "string" && data.analysis.trim().length > 0
                    ? data.analysis
                    : "No analysis found.";

                const response = {
                    user: query,
                    chatbot: chatbotResponse,
                    link: Array.isArray(data?.documents) ? data.documents : []
                };

                console.log("Built response object:", response);
                
                return {
                    user: query,
                    chatbot: chatbotResponse,
                    link: Array.isArray(data?.documents) ? data.documents : []
                };
            });

            // Create the complete chat content with the actual time
            const completeChatContent = {
                user: query,
                chatbot: timeAndResponse.response.chatbot,
                link: timeAndResponse.response.link,
                time: timeAndResponse.time.toFixed(1) + "s"
            };

            console.log('Complete chat content to add:', completeChatContent);

            if (!timeAndResponse.response.chatbot || timeAndResponse.response.chatbot === "No analysis found.") {
                console.warn("chatbot response missing or fallback triggered", timeAndResponse.response);
            }
            const { response, time } = timeAndResponse;
            // Replace the last placeholder message with the complete response
            chatContents = [
                ...chatContents.slice(0, chatContents.length - 1),
                {
                    ...response,
                    time: time.toFixed(1) + "s"
                }
            ];

        } catch (error) {
            console.error('Error in mySendQuery:', error);
            toasts.push({ message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, color: 'danger' });
            loading = false;
        }

        loading = false;
        questionAsked = true;
    }

    async function setDomainValue(value: string) {
		domainValue = value;
		selectedQuestion = '';
		query = '';
	}

    async function setMaxURLS(value: number) {
        max_num_of_urls = value;
    }

    async function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            await mySendQuery();
        }
    }

    let showUpload = false;
    function toggleUploadBar() {
        showUpload = !showUpload;
    }

    function handleFeedbackComplete() {
        questionAsked = false;
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
              appName="Web Insights"
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
    <Settingstab user={user} index={index} app="webinsights">
        <Structuredoutput bind:listOfColumns={listOfColumns} bind:activeStructuredOutput={activeStructuredOutput}/>
    </Settingstab>
{/if}

<div class="bottom-div">
    <div class="w-100">
        {#if !showUpload}
        <div style="text-align:right; margin-bottom: 7px;">
            <Button on:click={toggleUploadBar} color="primary">
                <Icon name="upload" />
                Crawl Website
            </Button>
        </div>
        {/if}
        
        <InputGroup class="mt-2">
            {#if showUpload}
            <Form style="display: flex; align-items: center; flex: 1; margin-bottom: 10px;">
                <Input 
                    type="url" 
                    id="urlInput" 
                    class="form-control" 
                    style="flex: 1; border: solid; margin-right: 5px;" 
                    placeholder="Enter website URL to crawl"
                    bind:value={domainValue}
                />
                <Input 
                    type="number" 
                    id="maxUrlInput" 
                    class="form-control" 
                    style="width: 90px; border: solid; margin-left: 0; margin-right: 5px;" 
                    min="1"
                    max="1000"
                    placeholder="Max URLs"
                    bind:value={max_num_of_urls}
                />
                <Tooltip target="maxUrlInput" placement="top">
                    <strong># of pages to crawl</strong>
                </Tooltip>
            </Form>

            <!-- <Dropdown direction="down">
                <DropdownToggle style="background-color:white; color: black; border:solid; margin-right: 5px;" caret>
                    Select Website
                </DropdownToggle>
                <DropdownMenu>
                    {#each Object.keys(listsOfDefaultQuestions) as key}
                        <DropdownItem on:click={()=>setDomainValue(key)}>{key}</DropdownItem>
                    {/each}
                </DropdownMenu>
            </Dropdown> -->

            <Button 
                class="offcanvas-button" 
                color="primary"
                on:click={crawlWebsite}
                disabled={uploadLoading || !domainValue.trim()}
                style="margin-right: 5px;"
            >
                {#if uploadLoading}
                    <Spinner size="sm" />
                    Crawling...
                {:else}
                    <Icon name="cloud-upload" />
                    Crawl
                {/if}
            </Button>
        
            <Button on:click={toggleUploadBar} color="secondary">
                <Icon name="x-lg" />
            </Button>
            {/if}
        </InputGroup>
        
        <div style="margin-top: 6px;">
            <Searchbar bind:query={query} bind:chatContents={chatContents} listOfDefaultQuestions={listsOfDefaultQuestions} bind:index={index} on:sendQuery={mySendQuery}/>
        </div>
        {#if progress}
            <Progress value={progress}>{progress}%</Progress>
        {/if}
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
    :root {
		--bottom-div-height: 150px;
	}
</style>