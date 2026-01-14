<script lang="ts">
    import { Position, useSvelteFlow, Handle, type NodeProps } from '@xyflow/svelte';
    import { Button, Input, Label, FormGroup } from '@sveltestrap/sveltestrap';

    export let id: string;
    export let data: NodeProps;
   
    export let open: boolean = false; // modal control

    import { onMount } from 'svelte';
    import { Modal } from '@sveltestrap/sveltestrap';

    let showModal = false;
    let nodeColor = data.color || '#ffffff';
    let nodeType = data.type || 'default';
    let additionalFields: { name: string; value: string }[] = [];
    const { getNode } = useSvelteFlow();
    const node = getNode(id); // Retrieve the node using its ID
    
    // Initialize additional fields from data
    onMount(() => {
        if (data.fields && Array.isArray(data.fields)) {
            additionalFields = data.fields.map((field: any) => {
                if (typeof field === 'string') {
                    return { name: field, value: '' };
                }
                return { name: field.name || '', value: field.value || '' };
            });
        }
    });

    function editNode(event: MouseEvent) {
        event.preventDefault();
        open = true;
    }

    function saveChanges() {
        data.color = nodeColor;
        data.type = nodeType;
        node.type = nodeType; // Update the node type in the flow
        data.fields = additionalFields.filter(field => field.name.trim() !== '');
        
        // Update the local additionalFields to reflect the saved data
        additionalFields = [...data.fields];
        
        open = false;
    }

    function addField() {
        additionalFields = [...additionalFields, { name: '', value: '' }];
    }

    function removeField(index: number) {
        additionalFields = additionalFields.filter((_, i) => i !== index);
    }
   
</script>
   
<div class="text-updater-node default-node" style="background-color: {nodeColor};         border: 1px solid grey;">
    <div>      
        <form>
            <input
                id="text"
                name="text"
                value={data.text} />
            <button on:click={editNode}>Edit</button>
        </form>
        
        <!-- Display additional fields on the node -->
        {#if additionalFields && additionalFields.length > 0}
            <div class="additional-fields-display">
                {#each additionalFields as field}
                    {#if field.name.trim() !== ''}
                        <div class="field-display">
                            <span class="field-name">{field.name}:</span>
                            <span class="field-value">{field.value || 'N/A'}</span>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
        
        <Handle
            type="source"
            position={Position.Top}
            style={{ top: '50%' }}
            isConnectable={true}
            id="input" 
        />
        <Handle
            type="target"
            position={Position.Bottom}
            style={{ top: '50%' }}
            isConnectable={true}
            id="output"
        />
    </div>
</div>

<Modal isOpen={open} on:close={() => open = false} size="lg">
    <div class="modal-header">
        <h5 class="modal-title">Edit Node</h5>
    </div>
    <div class="modal-body">
        <!-- Color Picker Section -->
        <FormGroup>
            <Label for="color">Node Color:</Label>
            <div class="color-picker-container">
                <Input type="color" id="color" bind:value={nodeColor} />
                <span class="color-preview" style="background-color: {nodeColor}"></span>
                <Input type="text" bind:value={nodeColor} placeholder="#ffffff" class="color-input" />
            </div>
        </FormGroup>
        
        <!-- Node Type Dropdown -->
        <FormGroup>
            <Label for="type">Node Type:</Label>
            <Input type="select" id="type" bind:value={nodeType}>
                <option value="default">Default</option>
                <option value="input">Input</option>
                <option value="output">Output</option>
            </Input>
        </FormGroup>

        <!-- Additional Fields Section -->
        <FormGroup>
            <Label>Additional Fields:</Label>
            <div class="additional-fields">
                {#each additionalFields as field, index}
                    <div class="field-row">
                        <Input 
                            type="text" 
                            bind:value={field.name} 
                            placeholder="Field name"
                            class="field-name"
                        />
                        <Input 
                            type="text" 
                            bind:value={field.value} 
                            placeholder="Field value"
                            class="field-value"
                        />
                        <Button 
                            color="danger" 
                            size="sm" 
                            on:click={() => removeField(index)}
                            class="remove-field-btn"
                        >
                            ×
                        </Button>
                    </div>
                {/each}
                <Button 
                    color="success" 
                    size="sm" 
                    on:click={addField}
                    class="add-field-btn"
                >
                    + Add Field
                </Button>
            </div>
        </FormGroup>
    </div>
    <div class="modal-footer">
        <Button color="secondary" class="px-6 py-2" on:click={() => (open = false)}>Cancel</Button>
        <Button color="primary" on:click={saveChanges}>Save Changes</Button>
    </div>
</Modal>

<style>
    form {
        /* This bit sets up the horizontal layout */
        display: flex;
        flex-direction: row;
        
        /* This bit draws the box around it */
        border: 1px solid grey;

        /* I've used padding so you can see the edges of the elements. */
        padding: 1px;
    }

    input {
        /* Tell the input to use all the available space */
        flex-grow: 2;
        /* And hide the input's outline, so the form looks like the outline */
        border: none;
    }

    /* remove the input focus blue box, it will be in the wrong place. */
    input:focus {
        outline: none;
    }

    /* Add the focus effect to the form so it contains the button */
    form:focus-within { 
        outline: 1px solid blue 
    }

    button {
        /* Just a little styling to make it pretty */
        border: 1px solid rgb(122, 122, 136);
        background: rgb(118, 118, 129);
        color: white;
    }

    /* Modal specific styles */
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

    .additional-fields {
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 15px;
        background-color: #f9f9f9;
    }

    .field-row {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        align-items: center;
    }

    .field-name {
        flex: 1;
    }

    .field-value {
        flex: 1;
    }

    .remove-field-btn {
        width: 35px;
        height: 35px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 1;
    }

    .add-field-btn {
        margin-top: 10px;
    }

    .text-updater-node {
        transition: background-color 0.2s ease;
        min-width: 150px;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Additional fields display on node */
    .additional-fields-display {
        margin-top: 8px;
        padding: 6px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .field-display {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        font-size: 12px;
        line-height: 1.2;
    }

    .field-display:last-child {
        margin-bottom: 0;
    }

    .field-display .field-name {
        font-weight: bold;
        color: rgba(0, 0, 0, 0.8);
        margin-right: 8px;
        flex-shrink: 0;
    }

    .field-display .field-value {
        color: rgba(0, 0, 0, 0.7);
        text-align: right;
        word-break: break-word;
        flex-grow: 1;
    }
</style>