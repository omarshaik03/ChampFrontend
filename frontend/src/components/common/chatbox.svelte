<script lang="ts">
    import type { ChatContent } from '$lib/commontypes';
    import { del } from '$lib/redis';
	import { Button, Icon, Tooltip } from '@sveltestrap/sveltestrap';
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { Modal, ModalHeader, ModalBody, ModalBackdrop } from '@sveltestrap/sveltestrap';
	import { loged_in } from '../../login';
    
    export let chatContents: ChatContent[] = [];
    export let debug = false;

    let messageContent = "";
    let showDialog = false;
    let currentReview = '';
    function openDialog(review: string) {
        currentReview = review;
        showDialog = true;

    }
    let isChatLink = true;
    function toggleLink() {
        isChatLink = !isChatLink;
        console.log(chatContents[0].link.sharepoint)
        console.log(chatContents[0].link.S3)


    }
    function closeDialog() {
        showDialog = false;
    }
    const dispatch = createEventDispatcher();

    let messageContents = {};

    async function copyToClipboard(index) {
        const messageElement = messageContents[index];
        if (messageElement) {
            try {
                // Get only the text content, excluding button texts and other UI elements
                const textContent = messageElement.querySelector('div:first-child').textContent;
                await navigator.clipboard.writeText(textContent);
                alert("Copied to clipboard!");
            } catch (err) {
                alert("Failed to copy text: " + err);
            }
        } else {
            alert("No message content found to copy!");
        }
    }

    // onMount(() => {
    //     window.addEventListener('click', (event: MouseEvent) => {
    //         if (!document.getElementById('review-dialog').contains(event.target as Node)) {
    //             closeDialog();
    //         }
    //     });
    // });
    
</script>

{#each chatContents as chat, index}
    {#if chat.user}
        <div class="d-flex flex-row justify-content-end">
            <div class="user-message">
                {chat.user}
                <button id="clear_cache_{index}" on:click={() => del(chat.user ?? "")} class="btn btn-link clear-cache"><Icon name="eraser"/></button>
                <Tooltip target="clear_cache_{index}" placement="top" >
                    Clear the cache for this query
                </Tooltip>
            </div>
        </div>
    {/if}
    {#if chat.chatbot}
        <div class="row">
            <div class="chatbot-message" bind:this={messageContents[index]}>
                <div class="">
                    {@html chat.chatbot}
                </div>
                {#if chat.img_url}
                    <div class="d-flex flex-row justify-content-center">
                        <img src={chat.img_url} alt="Image" style="max-width: 500px; max-height: 500px;"/>
                    </div>
                    {/if}
                <div class="d-flex flex-row justify-content-between">
                    <div>
                        Time taken: {chat.time}
                        {#if chat.debug && debug}
                            {#each Object.keys(chat.debug) as key}
                                <br>
                                {key}: {parseFloat(chat.debug[key]).toFixed(4)}s
                            {/each}
                        {/if}
                    </div>
                    
                    {#if chat.review}
                        <div id="chat_rating_{index}" on:click={() => openDialog(chat.review.review)} style="cursor: pointer;">
                            Review: {#if chat.review.rating == 5}😀{:else if chat.review.rating == 4}🙂{:else if chat.review.rating == 3}😐{:else if chat.review.rating == 2}😕{:else if chat.review.rating == 1}😡{:else}❓{/if}
                        </div>
                        <Tooltip target="chat_rating_{index}" placement="top" >
                            Click to see Review
                        </Tooltip>
                    {/if}
                    <div>
                        <Button color="primary"         
                        on:click={() => copyToClipboard(index)}>
                            Copy Output
                          </Button>
                    </div>
                      
                </div>
            </div>
        </div>
    {/if}
{/each}

{#if showDialog}
    <!-- <div id="review-dialog" class="review-dialog">
        <div class="review-content">
            <button class="close-button" on:click={closeDialog}>x</button>
            <p>{currentReview}</p>
        </div>
    </div> -->
    <Modal bind:isOpen={showDialog} title="Review" >
        <ModalHeader>Review</ModalHeader>

        <div class="review-content">
            <button class="close-button" on:click={closeDialog}>×</button>
            <p>{currentReview}</p>
        </div>
    </Modal>
    
{/if} 



<style>
    .toggle-container {
    display: flex;
    align-items: center;
  }

  .switch {
    position: relative;
    width: 60px;
    height: 30px;
    background-color: #ccc;
    border-radius: 15px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .switch::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s;
  }

  .switch.active {
    background-color: #4caf50;
  }

  .switch.active::before {
    left: 33px;
  }
    .user-message {
        float: left;
        position: relative;
        color: gray;
        background-color: #f0f0f0;
        border-radius: 10px;
        padding: 10px;
        max-width: 70%;
        margin: 5px 0;
        clear: both;
        white-space: break-spaces;
    }
    .chatbot-message {
        color: gray;
        background-color: #f0f0f0;
        position: relative;
        padding: 10px;
        border-radius: 10px;
        max-width: 70%;
        margin: 5px 0;
        float: left;
        padding: 10px;
        clear: both;
        white-space: break-spaces;
    }
    .clear-cache {
        position: absolute;
        right: -15px;
        top: -10px;
    }
 .review-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border: 1px solid #ccc;
        z-index: 1000;
    }
    .review-content {
        max-width: 80%;
        margin: auto;
        text-align: left;
    }
    .close-button {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        background: none;
        border: none;
        font-size: 20px;
        color: gray;
    }
   
</style>