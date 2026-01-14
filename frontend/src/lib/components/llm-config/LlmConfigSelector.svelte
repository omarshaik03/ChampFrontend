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

    function handleOpenCreate(): void {
        console.log('LlmConfigSelector: opening create modal');
        showConfigManager = true;
    }

    function handleOpenManage(): void {
        console.log('LlmConfigSelector: opening manage modal');
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

<!-- LLM Configuration Manager Modal -->
<Modal isOpen={showConfigManager} toggle={handleCloseConfigManage} size="xl">
    <ModalHeader toggle={handleCloseConfigManage}>
        LLM Configuration Manager
    </ModalHeader>
    <ModalBody>
        <LlmConfigManager 
            on:select={handleCloseConfigManage}
        />
    </ModalBody>
</Modal>

<style>
    /* Dropdown layout */
    :global(.dropdown-menu) {
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
