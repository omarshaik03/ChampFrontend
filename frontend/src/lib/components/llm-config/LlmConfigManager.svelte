<script lang="ts">
    import { 
        Card, 
        CardBody,
        Button, 
        Table,
        Badge,
        Modal,
        ModalHeader,
        ModalBody,
        ModalFooter,
        Alert,
        Spinner
    } from "@sveltestrap/sveltestrap";
    import { 
        llmConfigStore,
        PROVIDER_REGISTRY,
        type LlmConfig 
    } from '$lib/stores/llmConfigStore';
    import LlmConfigInput from '$lib/components/llm-config/LlmConfigInput.svelte';

    // Props
    export let allowSelection: boolean = true;
    export let showCreateButton: boolean = true;
    export let compact: boolean = false;

    // State
    let configs = $llmConfigStore.configs;
    llmConfigStore.configs.subscribe(value => {
        configs = value;
    });
    let activeConfig: LlmConfig | null = null;
    llmConfigStore.activeConfig.subscribe(value => {
        activeConfig = value;
    });
    let isLoading = llmConfigStore.isLoading;
    let error = llmConfigStore.error;

    let showCreateModal: boolean = false;
    let showEditModal: boolean = false;
    let showDeleteModal: boolean = false;
    let editingConfig: LlmConfig | null = null;
    let deletingConfig: LlmConfig | null = null;

    // Reactive declarations
    $: sortedConfigs = configs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());


    function handleCreateConfig(): void {
        showCreateModal = true;
    }

    function handleEditConfig(config: LlmConfig): void {
        editingConfig = config;
        showEditModal = true;
    }

    function handleDeleteConfig(config: LlmConfig): void {
        deletingConfig = config;
        showDeleteModal = true;
    }

    function handleSetActive(config: LlmConfig): void {
        llmConfigStore.setActiveConfig(config.id);
    }

    async function confirmDelete(): Promise<void> {
        if (deletingConfig) {
            try {
                await llmConfigStore.deleteConfig(deletingConfig.id);
                showDeleteModal = false;
                deletingConfig = null;
            } catch (error) {
                console.error('Failed to delete configuration:', error);
            }
        }
    }

    function handleConfigSaved(event: CustomEvent<{ config: LlmConfig }>): void {
        showCreateModal = false;
        showEditModal = false;
        editingConfig = null;
    }

    function closeModals(): void {
        showCreateModal = false;
        showEditModal = false;
        showDeleteModal = false;
        editingConfig = null;
        deletingConfig = null;
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

    function formatDate(date: Date): string {
        // Ensure we have a valid date
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return 'Unknown';
        }
        
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
</script>

<Card class={compact ? 'border-0' : ''}>
    <CardBody>
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">LLM Configurations</h5>
            {#if showCreateButton}
                <Button color="primary" size="sm" on:click={handleCreateConfig}>
                    + Create New
                </Button>
            {/if}
        </div>

        <!-- Error Display -->
        {#if $error}
            <Alert color="danger">
                <strong>Error:</strong> {$error}
            </Alert>
        {/if}

        <!-- Loading State -->
        {#if $isLoading}
            <div class="text-center py-4">
                <Spinner color="primary" />
                <div class="mt-2">Loading configurations...</div>
            </div>
        {:else if sortedConfigs.length === 0}
            <!-- Empty State -->
            <div class="text-center py-5">
                <div class="text-muted mb-3">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                    </svg>
                </div>
                <h6>No LLM Configurations</h6>
                <p class="text-muted">Create your first LLM configuration to get started.</p>
                {#if showCreateButton}
                    <Button color="primary" on:click={handleCreateConfig}>
                        Create Configuration
                    </Button>
                {/if}
            </div>
        {:else}
            <!-- Configurations Table -->
            <div class="table-responsive">
                <Table hover striped>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Provider</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each sortedConfigs as config}
                            <tr class={activeConfig?.id === config.id ? 'table-active' : ''}>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <strong>{config.name}</strong>
                                        {#if activeConfig?.id === config.id}
                                            <Badge color="success" class="ms-2">Active</Badge>
                                        {/if}
                                    </div>
                                </td>
                                <td>
                                    <Badge color={getProviderBadgeColor(config.provider)}>
                                        {getProviderDisplayName(config.provider)}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge color={config.isActive ? 'success' : 'secondary'}>
                                        {config.isActive ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </td>
                                <td>
                                    <small class="text-muted">
                                        {formatDate(config.updatedAt)}
                                    </small>
                                </td>
                                <td>
                                    <div class="d-flex gap-1">
                                        {#if allowSelection && activeConfig?.id !== config.id}
                                            <Button 
                                                color="outline-primary" 
                                                size="sm" 
                                                on:click={() => handleSetActive(config)}
                                                title="Set as Active"
                                            >
                                                Set Active
                                            </Button>
                                        {/if}
                                        <Button 
                                            color="outline-secondary" 
                                            size="sm" 
                                            on:click={() => handleEditConfig(config)}
                                            title="Edit Configuration"
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            color="outline-danger" 
                                            size="sm" 
                                            on:click={() => handleDeleteConfig(config)}
                                            title="Delete Configuration"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </Table>
            </div>
        {/if}
    </CardBody>
</Card>

<!-- Create Configuration Modal -->
<Modal isOpen={showCreateModal} toggle={closeModals} size="lg">
    <ModalHeader toggle={closeModals}>
        Create LLM Configuration
    </ModalHeader>
    <ModalBody>
        <LlmConfigInput 
            mode="create"
            compact={true}
            on:save={handleConfigSaved}
            on:cancel={closeModals}
        />
    </ModalBody>
</Modal>

<!-- Edit Configuration Modal -->
<Modal isOpen={showEditModal} toggle={closeModals} size="lg">
    <ModalHeader toggle={closeModals}>
        Edit LLM Configuration
    </ModalHeader>
    <ModalBody>
        <LlmConfigInput 
            mode="edit"
            configId={editingConfig?.id}
            compact={true}
            on:save={handleConfigSaved}
            on:cancel={closeModals}
        />
    </ModalBody>
</Modal>

<!-- Delete Confirmation Modal -->
<Modal isOpen={showDeleteModal} toggle={closeModals}>
    <ModalHeader toggle={closeModals}>
        Confirm Delete
    </ModalHeader>
    <ModalBody>
        <Alert color="warning">
            <strong>Are you sure you want to delete this configuration?</strong>
        </Alert>
        {#if deletingConfig}
            <p>
                This will permanently delete the configuration 
                <strong>"{deletingConfig.name}"</strong> 
                for {getProviderDisplayName(deletingConfig.provider)}.
            </p>
            <p class="text-muted mb-0">This action cannot be undone.</p>
        {/if}
    </ModalBody>
    <ModalFooter>
        <Button color="secondary" on:click={closeModals}>
            Cancel
        </Button>
        <Button color="danger" on:click={confirmDelete}>
            Delete Configuration
        </Button>
    </ModalFooter>
</Modal>

<style>
    .table-active {
        background-color: rgba(13, 110, 253, 0.075) !important;
    }
    
    .table-responsive {
        border-radius: 0.375rem;
    }
    
    :global(.modal-lg) {
        max-width: 700px;
    }
</style>
