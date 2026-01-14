<!-- CustomEdge.svelte -->
<script lang="ts">
  import { getBezierPath, type EdgeProps } from '@xyflow/svelte';
  import { Modal, Button, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';
  
  export let id: string;
  export let sourceX: number;
  export let sourceY: number;
  export let targetX: number;
  export let targetY: number;
  export let sourcePosition: string;
  export let targetPosition: string;
  export let data: any = {};
  export let markerEnd: string = '';
  export let style: string = '';
  export let open: boolean = false; // modal control

  // Edge properties
  let isAnimated = data.animated || false;
  let hasArrow = data.arrow || false;
  let edgeColor = data.color || '#b1b1b7';
  let strokeWidth = data.strokeWidth || 2;
  
  // Hover and modal state
  let isHovered = false;
  let showModal = false;
  let buttonPosition = { x: 0, y: 0 };
  
  // Get the path for the edge
  $: [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
  });
  
  // Calculate button position (middle of the edge)
  $: {
      buttonPosition = {
          x: labelX - 15, // Offset to center the button
          y: labelY - 15
      };
  }
  
  function handleMouseEnter() {
      isHovered = true;
  }
  
  function handleMouseLeave() {
      isHovered = false;
  }
  
  function openEditModal(event) {
      event.stopPropagation();
      event.preventDefault();
      open = true;
  }
  
  function saveEdgeChanges() {
      // Update the edge data
      data.animated = isAnimated;
      data.arrow = hasArrow;
      data.color = edgeColor;
      data.strokeWidth = strokeWidth;
      
      // You would typically dispatch an event or call a function to update the edge in your flow
      // For example: dispatch('updateEdge', { id, data });
      
      showModal = false;
      open = false;
  }
  
  // Dynamic marker end based on arrow setting
  $: dynamicMarkerEnd = hasArrow ? 'url(#arrowhead)' : '';
  
  // Dynamic stroke dasharray for animation
  $: strokeDasharray = isAnimated ? '5,5' : '';
  
  // Dynamic styles
  $: edgeStyles = {
      stroke: edgeColor,
      strokeWidth: strokeWidth,
      strokeDasharray: strokeDasharray,
      animation: isAnimated ? 'dashdraw 0.5s linear infinite' : 'none'
  };
</script>

<svelte:head>
  <style>
      @keyframes dashdraw {
          to {
              stroke-dashoffset: -10;
          }
      }
  </style>
</svelte:head>

<g>
  <!-- Define arrowhead marker -->
  <defs>
      <marker 
          id="arrowhead" 
          markerWidth="10" 
          markerHeight="7" 
          refX="10" 
          refY="3.5" 
          orient="auto"
      >
          <polygon 
              points="0 0, 10 3.5, 0 7" 
              fill={edgeColor}
          />
      </marker>
  </defs>
  
  <!-- Invisible wider path for easier hovering -->
  <path
      d={edgePath}
      stroke="transparent"
      stroke-width="20"
      fill="none"
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
      style="cursor: pointer;"
  />
  
  <!-- Visible edge path -->
  <path
      id={id}
      d={edgePath}
      stroke={edgeStyles.stroke}
      stroke-width={edgeStyles.strokeWidth}
      stroke-dasharray={edgeStyles.strokeDasharray}
      fill="none"
      marker-end={dynamicMarkerEnd}
      style="animation: {edgeStyles.animation}"
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
  />
  
  <!-- Edit button (shows on hover) -->
  {#if isHovered}
      <foreignObject 
          x={buttonPosition.x} 
          y={buttonPosition.y} 
          width="30" 
          height="30"
      >
          <button 
              class="edit-edge-btn"
              on:click={openEditModal}
              title="Edit Edge"
              type="button"
          >
              ⚙️
          </button>
      </foreignObject>
  {/if}
</g>

<!-- Edit Modal -->
<Modal isOpen={open} on:close={() => open = false} size="lg">
  <div class="modal-header">
      <h5 class="modal-title">Edit Edge</h5>
  </div>
  <div class="modal-body">
      <!-- Animation Toggle -->
      <FormGroup>
          <div class="form-check">
              <Input 
                  type="checkbox" 
                  id="animated" 
                  bind:checked={isAnimated}
                  class="form-check-input"
              />
              <Label for="animated" class="form-check-label">
                  Animated Edge
              </Label>
          </div>
      </FormGroup>
      
      <!-- Arrow Toggle -->
      <FormGroup>
          <div class="form-check">
              <Input 
                  type="checkbox" 
                  id="arrow" 
                  bind:checked={hasArrow}
                  class="form-check-input"
              />
              <Label for="arrow" class="form-check-label">
                  Show Arrow
              </Label>
          </div>
      </FormGroup>
      
      <!-- Color Picker -->
      <FormGroup>
          <Label for="edgeColor">Edge Color:</Label>
          <div class="color-picker-container">
              <Input type="color" id="edgeColor" bind:value={edgeColor} />
              <span class="color-preview" style="background-color: {edgeColor}"></span>
              <Input type="text" bind:value={edgeColor} placeholder="#b1b1b7" class="color-input" />
          </div>
      </FormGroup>
      
      <!-- Stroke Width -->
      <FormGroup>
          <Label for="strokeWidth">Stroke Width:</Label>
          <Input 
              type="range" 
              id="strokeWidth" 
              min="1" 
              max="10" 
              bind:value={strokeWidth}
          />
          <span class="stroke-width-value">{strokeWidth}px</span>
      </FormGroup>
      
      <!-- Preview -->
      <FormGroup>
          <Label>Preview:</Label>
          <div class="edge-preview">
              <svg width="200" height="50">
                  <defs>
                      <marker 
                          id="preview-arrowhead" 
                          markerWidth="10" 
                          markerHeight="7" 
                          refX="10" 
                          refY="3.5" 
                          orient="auto"
                      >
                          <polygon 
                              points="0 0, 10 3.5, 0 7" 
                              fill={edgeColor}
                          />
                      </marker>
                  </defs>
                  <path
                      d="M 20 25 L 180 25"
                      stroke={edgeColor}
                      stroke-width={strokeWidth}
                      stroke-dasharray={isAnimated ? '5,5' : ''}
                      fill="none"
                      marker-end={hasArrow ? 'url(#preview-arrowhead)' : ''}
                      style="animation: {isAnimated ? 'dashdraw 0.5s linear infinite' : 'none'}"
                  />
              </svg>
          </div>
      </FormGroup>
  </div>
  <div class="modal-footer">
      <Button color="secondary" on:click={() => showModal = false}>Cancel</Button>
      <Button color="primary" on:click={saveEdgeChanges}>Save Changes</Button>
  </div>
</Modal>

<style>
  .edit-edge-btn {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 50%;
      background-color: #4a90e2;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
  }
  
  .edit-edge-btn:hover {
      background-color: #357abd;
      transform: scale(1.1);
  }
  
  .color-picker-container {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
  }
  
  .color-preview {
      width: 30px;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: inline-block;
  }
  
  .color-input {
      width: 100px;
      font-family: monospace;
  }
  
  .stroke-width-value {
      margin-left: 10px;
      font-weight: bold;
      color: #666;
  }
  
  .edge-preview {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 10px;
      background-color: #f9f9f9;
      display: flex;
      justify-content: center;
  }
  
  .form-check {
      display: flex;
      align-items: center;
      gap: 8px;
  }
</style>