<script lang="ts">
    import { 
        FormGroup,
        Label,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
        Button,
        Badge,

		Modal,

		ModalHeader,

		ModalBody



    } from "@sveltestrap/sveltestrap";
    import { 
        llmConfigStore,
        PROVIDER_REGISTRY,
        type LlmConfig 
    } from '$lib/stores/llmConfigStore';
	import LlmConfigManager from "./LlmConfigManager.svelte";

    // Props
    export let placeholder: string = 'Select LLM Configuration';
    export let showCreateButton: boolean = true;
    export let showManageButton: boolean = true;
    export let disabled: boolean = false;

    // State
    let configs = $llmConfigStore.configs;
    llmConfigStore.configs.subscribe(value => {
        configs = value;
    });
    let activeConfig: LlmConfig | null;
    llmConfigStore.activeConfig.subscribe(config => {
        activeConfig = config;
    });
    let dropdownOpen: boolean = false;

    let showConfigManager: boolean = false;
    let managerInitialView: 'list' | 'create' = 'list';

    function handleOpenCreate(): void {
        console.log('LlmConfigSelector: opening create modal');
        managerInitialView = 'create';
        showConfigManager = true;
    }

    function handleOpenManage(): void {
        console.log('LlmConfigSelector: opening manage modal');
        managerInitialView = 'list';
        showConfigManager = true;
    }

    function handleCloseConfigManage(): void {
        console.log('LlmConfigSelector: closing config manager modal');
        showConfigManager = false;
    }

    function getProviderDisplayName(provider: string): string {
        return PROVIDER_REGISTRY[provider as keyof typeof PROVIDER_REGISTRY]?.displayName || provider;
    }

    function getProviderBadgeColor(provider: string): string {
        const colors = {
            'azure-openai': 'primary',
            'aws-bedrock': 'warning',
            'openai': 'success',
            'anthropic': 'info'
        };
        return colors[provider as keyof typeof colors] || 'secondary';
    }
</script>

<div class="d-flex gap-2 align-items-center">
    <div class="flex-grow-1">
        <Dropdown 
            isOpen={dropdownOpen && !disabled} 
            toggle={() => !disabled && (dropdownOpen = !dropdownOpen)}
        >
            <DropdownToggle 
                caret 
                color="outline-secondary" 
                class="dropdown-toggle-custom"
                disabled={disabled}
            >
                <div class="dropdown-content">
                    {#if activeConfig}
                        <div class="config-display">
                            <div class="config-name">{activeConfig.name}</div>
                            <div class="config-meta">
                                <Badge color={getProviderBadgeColor(activeConfig.provider)} class="provider-badge">
                                    {getProviderDisplayName(activeConfig.provider)}
                                </Badge>
                                {#if activeConfig.config?.model}
                                    <small class="text-muted model-text">{activeConfig.config.model}</small>
                                {/if}
                            </div>
                        </div>
                    {:else}
                        <span class="text-muted">{placeholder}</span>
                    {/if}
                </div>
            </DropdownToggle>
            
            <DropdownMenu style="width: 100%; max-height: 300px; overflow-y: auto;">
                {#if configs.length === 0}
                    <div class="dropdown-item-text">
                        <div class="text-center py-3">
                            <div class="text-muted mb-2">No configurations available</div>
                            {#if showCreateButton}
                                <Button 
                                    color="primary" 
                                    size="sm" 
                                    on:click={() => {handleOpenCreate();}}
                                >
                                    Create Configuration
                                </Button>
                            {/if}
                        </div>
                    </div>
                {:else}
                    {#each configs as config}
                        <DropdownItem 
                            on:click={() => llmConfigStore.setActiveConfig(config.id)}
                            active={activeConfig?.id === config.id}
                        >
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <div class="d-flex align-items-center">
                                        <strong class="me-2">{config.name}</strong>
                                        <Badge color={getProviderBadgeColor(config.provider)}>
                                            {getProviderDisplayName(config.provider)}
                                        </Badge>
                                    </div>
                                    {#if config.config?.model}
                                        <small class="text-muted d-block mt-1">
                                            Model: {config.config.model}
                                        </small>
                                    {/if}
                                </div>
                                {#if activeConfig?.id === config.id}
                                    <Badge color="success" class="badge-sm">Default</Badge>
                                {/if}
                            </div>
                        </DropdownItem>
                    {/each}
                    
                    {#if showCreateButton || showManageButton}
                        <DropdownItem divider />
                        
                        <div class="dropdown-item-text">
                            <div class="d-flex gap-2 px-1 py-1">
                                {#if showCreateButton}
                                    <Button 
                                        color="primary" 
                                        size="sm" 
                                        outline
                                        on:click={() => handleOpenCreate()}
                                    >
                                        + Create New
                                    </Button>
                                {/if}
                                
                                {#if showManageButton}
                                    <Button 
                                        color="secondary" 
                                        size="sm" 
                                        outline
                                        on:click={() => handleOpenManage()}
                                    >
                                        Manage
                                    </Button>
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/if}
            </DropdownMenu>
        </Dropdown>
    </div>
</div>


<!-- LLM Configuration Manager Overlay (Custom implementation to avoid z-index/nesting issues) -->
{#if showConfigManager}
    <div class="custom-modal-backdrop" on:click={handleCloseConfigManage}></div>
    <div class="custom-modal-dialog">
        <div class="custom-modal-content">
            <div class="custom-modal-header">
                <h5 class="mb-0">LLM Configuration Manager</h5>
                <button type="button" class="btn-close" aria-label="Close" on:click={handleCloseConfigManage}></button>
            </div>
            <div class="custom-modal-body">
                <LlmConfigManager 
                    initialView={managerInitialView}
                    on:select={handleCloseConfigManage}
                />
            </div>
        </div>
    </div>
{/if}

<style>
    /* Dropdown layout */
    :global(.dropdown-menu) {
        width: 100%;
        min-width: 300px;
        z-index: 1050; 
    }
    
    .custom-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
    }

    .custom-modal-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        background-color: #fff;
        border-radius: 0.5rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        z-index: 9999;
        display: flex;
        flex-direction: column;
    }

    .custom-modal-content {
        display: flex;
        flex-direction: column;
        max-height: 100%;
        overflow: hidden;
    }

    .custom-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1rem;
        border-bottom: 1px solid #dee2e6;
    }

    .custom-modal-body {
        position: relative;
        flex: 1 1 auto;
        padding: 1rem;
        overflow-y: auto;
    }

    .btn-close {
        box-sizing: content-box;
        width: 1em;
        height: 1em;
        padding: 0.25em 0.25em;
        color: #000;
        background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
        border: 0;
        border-radius: 0.25rem;
        opacity: 0.5;
        cursor: pointer;
    }

    .btn-close:hover {
        opacity: 0.75;
    }

    .dropdown-content {
        min-width: 400px;
    }
    
    :global(.dropdown-toggle-custom) {
        width: 100%;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background-color 0.2s ease;
    }
    
    :global(.dropdown-toggle-custom:hover) {
        background-color: #f8f9fa !important;
        border-color: #adb5bd !important;
    }
    
    .dropdown-content {
        flex: 1;
        min-width: 0;
    }
    
    .config-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    
    .config-name {
        font-size: 1rem;
        font-weight: 600;
        color: #212529;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
    }
    
    .config-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
    }
    
    :global(.config-meta .provider-badge) {
        font-size: 0.75rem;
        opacity: 0.8;
    }
    
    /* Dropdown item customization */
    :global(.dropdown-item-text) {
        padding: 0;
        margin: 0;
    }
    
    :global(.dropdown-item-text:hover) {
        background-color: transparent;
    }
</style>
