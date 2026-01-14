<script lang="ts">
    import { Modal, Icon, Input, Button,Spinner, Progress, Form, InputGroup} from '@sveltestrap/sveltestrap';
	import Structuredoutput from '../../old/structuredoutput.svelte';
	import Settingstab from '../../common/settingstab.svelte';
	import Chatbox from '../../common/chatbox.svelte';	import Searchbar from '../../common/searchbar.svelte';
	import Toastwrapper from '../../common/toastwrapper.svelte';
	import Timer from '../../common/timer.svelte';
    import type { ChatContent, OpenSearchIndex } from '$lib/commontypes';
	import UserFeedback from '../../common/userFeedback.svelte';
    import { toasts } from '../../../lib/stores/toastStore';
    import ToastNotifications from '../../common/ToastNotifications.svelte';
    import { userStore } from '../../../lib/stores/userStore';
    import runtimeConfig from '$lib/runtime-config';

    let user = $userStore;
    let url = runtimeConfig.DOC_INSIGHTS_URL;
    let searchUrl = `${url}/query_documents/`;
    let uploadUrl = `${url}/upload/`;
    let jwt: string | undefined;
    if (user) {
        jwt = user.token;
    }
    let questionAsked = false;
    export let index: OpenSearchIndex | string = "image_test";
    export let debug = false;

    // displays for loading and progress
    let loading = false;
    let progress: number | undefined;
    let uploadLoading = false;

    // Track time taken for the query
    let myTimer: Timer;

    // query is the user's input
    let query = "";
    
    // listOfDefaultQuestions is an array of default questions that the user can select from
    let listOfDefaultQuestions = {
        "RFP Comparison": {
            "index": "1_8",
            "questions":[
                "What strategic differentiators are health plans implementing to meet the Nebraska's RFP requirements? Compare these to Molina. The relavent plans are Molina, Centene/Nebraska Total Care, Healthy Blue, United.",
                "What is the level of experience of the proposer in managing Medicaid or Medicare programs? The proposals concern New Mexico and the Molina, BCBS, UHC, and PHP plans.",
                "What strategic differentiators are health plans implementing to meet the state's RFP requirements? How do these compare to Molina's current initiatives as outlined in their proposal? Please specify programs and their intended goals. Specify the exact text from where it is being taken from the document",
                //"Compare the responses and tell me which health plan has comprehensive and strong response.  Also highlight the strength areas and weak areas of each plan region wise",
                "Compliance and Regulatory Adherence - How well does the proposal comply with federal and state regulations for Medicaid or Medicare?",
                "Compliance and Regulatory Adherence - Are there any specific regulatory requirements or guidelines addressed that demonstrate a thorough understanding of the compliance landscape?",
                "Experience and Expertise - What is the level of experience of the proposer in managing Medicaid or Medicare programs?",
                "Experience and Expertise - Do they provide evidence of past successes or case studies that illustrate their expertise?",
                "Service Delivery and Quality - How does the proposal address service delivery improvements and quality of care?",
                "Service Delivery and Quality - Are there innovative strategies or methodologies proposed to enhance patient outcomes?",
                "Cost and Financial Management- What is the cost structure of the proposal, and how does it ensure cost-effectiveness?", 
                "Cost and Financial Management - Are there any unique financial management strategies or budgetary controls outlined?", 
                "Community and Population Health - How does the proposal address the specific needs of low-income populations and vulnerable groups covered by Medicaid?", 
                "Community and Population Health - Are there strategies for addressing social determinants of health and improving community health outcomes?", 
                "Integration and Coordination of Care - How well does the proposal integrate various services such as primary care, behavioral health, and long-term services and supports (LTSS)?", 
                "Integration and Coordination of Care - Does the proposal include plans for coordinating care across multiple providers and settings?", 
                "Member Engagement and Accessibility - What approaches are proposed for engaging Medicaid members and ensuring accessibility of services?", 
                "Member Engagement and Accessibility - Are there specific initiatives to improve health literacy and member communication?", 
                "Chronic Disease Management - How does the proposal address chronic disease management for the elderly and disabled populations served by Medicare?", 
                "Chronic Disease Management - Specific to Medicare - Are there innovative programs for managing high-cost, high-need beneficiaries?", 
                "Technology and Innovation - Does the proposal include advanced technology solutions such as telehealth, remote monitoring, or data analytics for improving care delivery?", 
                "Technology and Innovation - How does the proposer plan to leverage technology to enhance patient care and operational efficiency?", 
                "Quality Metrics and Performance Improvement - What quality metrics and performance improvement plans are included in the proposal?", 
                "Quality Metrics and Performance Improvement - Are there specific targets or benchmarks for quality improvement, and how will they be measured and reported?", 
                "Differentiation and Competitive Edge - What unique features or value propositions does the proposal offer that set it apart from competitors?", 
                "Differentiation and Competitive Edge - Are there any proprietary methodologies, partnerships, or innovations highlighted?", 
                "Scalability and Flexibility - How scalable and adaptable is the proposal to changes in program size, demographics, or regulatory requirements?", 
                "Scalability and Flexibility - Does the proposal include contingency plans or strategies for managing potential risks and uncertainties?", 
                "Data Quality and Completeness - How thorough and complete is the data provided in the proposal?", 
                "Data Quality and Completeness - Are there specific sections or responses that consistently lack detail or clarity?", 
                "Language Analysis - What is the tone and sentiment of the proposal? Is it positive, neutral, or negative?", 
                "Language Analysis - Are there recurring keywords or phrases that indicate a strong commitment to certain aspects of care or program management?", 
                "Comparative Analysis - How do proposals compare against each other in terms of meeting the key evaluation criteria?", 
                "Comparative Analysis - Are there common strengths or weaknesses that can be identified across multiple proposals?", 
                "What strategic or competitive differentiators are health plans driving to address the state's RFP requests and requirements? Compare these differentiators to what Molina is currently doing from the proposal. Call out specific programs and their intended goals."
            ]
        },
        "RFP Codes": {
            "index": "1_10",
            "questions": [
                "What are the codes added for physical therapy, occupational therapy, outpatient speech-language pathology services effective January 1, 2024.",
                "What are the deleted codes from Radiology and certain other imaging services Effective January 1, 2024?",
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

    let showModal = false;

    function toggleModal() {
        showModal = true;
    }

    // New upload method for the new route
    async function uploadFiles() {
        if (!user) {
            toasts.push({ message: "Please login to continue", color: 'danger' });
            return;
        }
        
        try {
            uploadLoading = true;
            progress = 0;
            
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (!fileInput.files || fileInput.files.length === 0) {
                toasts.push({ message: "Please select at least one file", color: 'warning' });
                uploadLoading = false;
                return;
            }

            const formData = new FormData();
            
            // Add all selected files to FormData
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('files', fileInput.files[i]);
            }
            
            // Add access_key as a query parameter
            const uploadUrlWithParams = `${uploadUrl}?access_key=${jwt}`;

            progress = 30;
            
            const response = await fetch(uploadUrlWithParams, {
                method: 'POST',
                body: formData,
            });
            
            progress = 70;
            
            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            progress = 100;
            
            console.log('Upload successful:', data);
            toasts.push({ 
                message: `Successfully uploaded ${data.uploaded_files?.length || 0} files: ${data.uploaded_files?.join(', ') || ''}`, 
                color: 'success' 
            });
            
            // Clear the file input
            fileInput.value = '';
            
        } catch (error) {
            console.error('Error in uploadFiles:', error);
            toasts.push({ 
                message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
                color: 'danger' 
            });
        } finally {
            uploadLoading = false;
            progress = undefined;
            showModal = false;
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
            chatContents = [...chatContents, { user: query, chatbot: "", link: {}, analysis: "" }]; //Don't know what analysis is - Max

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

                const res = await fetch(`${searchUrl}?${params.toString()}`, {
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

            loading = false;
        } catch (error) {
            console.error('Error in mySendQuery: ', error);
            loading = false;
        }
        questionAsked = true;
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
    <div class="w-100">
        {#if !showUpload}
        <div style="text-align:right; margin-bottom: 7px;">
            <Button on:click={toggleUploadBar} color="primary">
                <Icon name="upload" />
                Upload Files
            </Button>
        </div>
        {/if}
        
        <InputGroup class="mt-2">
            {#if showUpload}
            <Form style="flex: 1;">
                <Input type="file" id="fileInput" class="form-control" style="width: 100%; border:solid;" multiple/>
            </Form>
            <Button 
                class="offcanvas-button" 
                color="primary"
                on:click={toggleModal}
                disabled={uploadLoading}
            >
                {#if uploadLoading}
                    <Spinner size="sm" />
                {:else}
                    <Icon name="cloud-upload" />
                {/if}
                Upload
            </Button>
        
            <Button on:click={toggleUploadBar} color="secondary">
                <Icon name="x-lg" />
            </Button>
            {/if}
            
            {#if showModal}
            <Modal bind:isOpen={showModal} title="Upload Files" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div class="d-flex justify-content-center align-items-center" style="padding: 20px; text-align: center;">
                    <h1>Confirm Upload</h1>
                </div>
                <hr style="width: 80%; border: 1px solid #ccc; margin: 5px auto;"/>
                <div class="d-flex justify-content-center align-items-center" style="padding: 10px; text-align: center;">
                    <p style="font-size: 16px; color: #333;">
                        The files will be uploaded to Azure Blob Storage and indexed for search.<br>
                        Upload costs may apply based on file size and content.<br>
                        Are you sure you want to proceed?
                    </p>
                </div>
                <div class="d-flex justify-content-center align-items-center" style="padding: 20px; text-align: center;">
                    <Button 
                        color="primary" 
                        on:click={uploadFiles} 
                        style="margin-right: 10px; padding: 10px 20px; border-radius: 5px;"
                        disabled={uploadLoading}
                    >
                        {#if uploadLoading}
                            <Spinner size="sm" />
                            Uploading...
                        {:else}
                            Yes, Upload
                        {/if}
                    </Button>
                    <Button 
                        color="secondary" 
                        on:click={() => showModal = false} 
                        style="padding: 10px 20px; border-radius: 5px;"
                        disabled={uploadLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
            {/if}
        </InputGroup>
        <div style="margin-top: 6px;">
            <Searchbar bind:query={query} bind:chatContents={chatContents} listOfDefaultQuestions={listOfDefaultQuestions} bind:index={index} on:sendQuery={mySendQuery}/>
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