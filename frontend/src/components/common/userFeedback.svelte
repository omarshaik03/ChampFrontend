 <script>
    // Props for the component
    export let userQuestion = '';
    export let modelResponse = '';
    export let appName = '';
    export let questionAsked = false;
    
    let selectedRating = 0;
    let isSubmitted = false;
    let isVisible = true;
    let showImprovement = false;
    let improvementText = '';
    
    // Handle rating selection
    function handleRating(rating) {
      selectedRating = rating;
    }
    
    // Submit initial feedback
    async function submitFeedback() {
      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }
      
      const feedbackData = {
        rating: selectedRating,
        userQuestion,
        modelResponse,
        appName,
        timestamp: new Date().toISOString()
      };
      
      try {
        console.log('Initial feedback submitted:', feedbackData);
        
        isSubmitted = true;
        
        // Show improvement text box if rating < 5
        if (selectedRating < 5) {
          showImprovement = true;
        } else {
          // Start fade out if no improvement needed
          startFadeOut();
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
      }
    }
    
    // Submit improvement feedback
    async function submitImprovement() {
      try {
        // Log improvement feedback
        console.log('Improvement feedback:', {
          rating: selectedRating,
          improvementSuggestion: improvementText,
          userQuestion,
          modelResponse,
          appName,
          timestamp: new Date().toISOString()
        });
        
        showImprovement = false;
        startFadeOut();
      } catch (error) {
        console.error('Error submitting improvement feedback:', error);
        alert('Failed to submit improvement feedback. Please try again.');
      }
    }
    
    // Skip improvement feedback
    function skipImprovement() {
      showImprovement = false;
      startFadeOut();
    }
    
    // Handle fade out and reset
    function startFadeOut() {
      setTimeout(() => {
        isVisible = false;
      }, 2000);
      
      setTimeout(() => {
        isSubmitted = false;
        selectedRating = 0;
        improvementText = '';
        questionAsked = false;
        isVisible = true;
        showImprovement = false;
        
        dispatch('feedbackComplete');
      }, 2500);
    }
    
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  </script>
  
  {#if questionAsked}
    <div 
      class="feedback-container"
      class:fade-out={!isVisible}
      class:hidden={!isVisible && !isSubmitted}
    >
      {#if !isSubmitted}
        <div class="rating-container">
          <p class="feedback-prompt">How helpful was this response?</p>
          <div class="stars">
            {#each Array(5) as _, i}
              <button
                class="star-btn"
                class:selected={selectedRating >= i + 1}
                on:click={() => handleRating(i + 1)}
                aria-label={`Rate ${i + 1} stars`}
              >
                ★
              </button>
            {/each}
          </div>
          <button
            class="submit-btn"
            on:click={submitFeedback}
            disabled={selectedRating === 0}
          >
            Submit Feedback
          </button>
        </div>
      {:else if showImprovement}
        <div class="improvement-container">
          <p class="feedback-prompt">How can we improve?</p>
          <textarea
            class="improvement-input"
            bind:value={improvementText}
            placeholder="Your suggestions (optional)"
            rows="3"
          ></textarea>
          <div class="button-group">
            <button class="submit-btn" on:click={submitImprovement}>
              Submit
            </button>
            <button class="skip-btn" on:click={skipImprovement}>
              Skip
            </button>
          </div>
        </div>
      {:else}
        <p class="thank-you">Thank you for your feedback!</p>
      {/if}
    </div>
  {/if}
  
  <style>
    .feedback-container {
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 8px;
      background-color: #f5f5f5;
      opacity: 1;
      transition: opacity 0.5s ease-out;
    }
    
    .fade-out {
      opacity: 0;
    }
    
    .hidden {
      display: none;
    }
    
    .rating-container, .improvement-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .feedback-prompt {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }
    
    .stars {
      display: flex;
      gap: 0.5rem;
    }
    
    .star-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #ccc;
      transition: color 0.2s;
    }
    
    .star-btn.selected {
      color: #ffd700;
    }
    
    .improvement-input {
      width: 100%;
      max-width: 400px;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: vertical;
      font-family: inherit;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
    }
    
    .submit-btn, .skip-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }
    
    .submit-btn {
      background-color: #007bff;
      color: white;
    }
    
    .submit-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .submit-btn:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .skip-btn {
      background-color: #6c757d;
      color: white;
    }
    
    .skip-btn:hover {
      background-color: #5a6268;
    }
    
    .thank-you {
      text-align: center;
      color: #28a745;
      font-weight: 500;
    }
  </style>