<script lang="ts">
    import { 
        Card, 
        CardHeader, 
        CardTitle, 
        CardBody,
        FormGroup, 
        Label, 
        Input, 
        Button,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
        Alert,
        Spinner,
        Badge
    } from "@sveltestrap/sveltestrap";
    import { createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';
    import { 
        llmConfigStore, 
        PROVIDER_REGISTRY,
        type LlmProvider,
        type LlmConfig,
        type ProviderMetadata,
        getAllProviders,
        modelSupportsTemperature
    } from '$lib/stores/llmConfigStore';
    import { userStore } from '$lib/stores/userStore';
    import type { User } from '$lib/stores/userStore';

    // Props
    export let mode: 'create' | 'edit' = 'create';
    export let configId: string | null = null;
    export let compact: boolean = false;

    // Events
    const dispatch = createEventDispatcher<{
        save: { config: LlmConfig };
        cancel: void;
    }>();

    // State
    let selectedProvider: LlmProvider = 'AzureOpenAI';
    let configName: string = '';
    let configData: Record<string, string | number> = {};
    let selectedModel: string = "";
    let errors: string[] = [];
    let isValidating: boolean = false;
    let providerDropdownOpen: boolean = false;
    let modelDropdownOpen: boolean = false;
    let isInitialized: boolean = false;
    let currentUser: User | null = get(userStore);
    let isUserLoggedIn = Boolean(currentUser);
    let wasUserLoggedIn = isUserLoggedIn;

    // Reactive declarations
    $: providerMetadata = PROVIDER_REGISTRY[selectedProvider];
    $: availableProviders = getAllProviders();
    $: supportsTemperature = selectedModel ? modelSupportsTemperature(selectedModel) : true;
    $: currentUser = $userStore;
    $: isUserLoggedIn = Boolean(currentUser);
    $: if (isUserLoggedIn !== wasUserLoggedIn) {
        if (mode === 'create' && isUserLoggedIn) {
            applyFieldDefaults(configData, providerMetadata, true);
            if (!selectedModel) {
                selectedModel = providerMetadata.defaultModel || '';
            }
        }
        wasUserLoggedIn = isUserLoggedIn;
    }
    
    // Load existing config if in edit mode FIRST
    $: if (mode === 'edit' && configId && !isInitialized) {
        loadExistingConfig();
    }
    
    // Initialize form when provider changes (but not on initial edit load)
    $: if (selectedProvider && mode === 'create') {
        initializeForm();
    }

    function resolveFieldDefault(field: ProviderMetadata['fields'][number], useDefaults: boolean): string | number {
        if (useDefaults) {
            if (field.defaultValue !== undefined && field.defaultValue !== null) {
                if (field.type === 'number') {
                    const numeric = Number(field.defaultValue);
                    return Number.isNaN(numeric) ? '' : numeric;
                }
                return field.defaultValue as string;
            }

            if (field.type === 'select' && field.options && field.options.length > 0) {
                return field.options[0].value;
            }

            if (field.type === 'number' && field.placeholder) {
                const parsed = Number(field.placeholder);
                if (!Number.isNaN(parsed)) {
                    return parsed;
                }
            }

            if (field.type === 'number' && field.min !== undefined) {
                return field.min;
            }
        }

        return field.type === 'number' ? '' : '';
    }

    function applyFieldDefaults(target: Record<string, string | number>, metadata: ProviderMetadata, useDefaults: boolean): void {
        metadata.fields.forEach(field => {
            const value = target[field.key];
            const hasValue = value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '');

            if (!hasValue) {
                target[field.key] = resolveFieldDefault(field, useDefaults);
            }
        });
    }

    function initializeForm(): void {
        configData = {};

        // Initialize model selection to provider default
        selectedModel = isUserLoggedIn ? providerMetadata.defaultModel || '' : '';

        applyFieldDefaults(configData, providerMetadata, isUserLoggedIn);

        clearErrors();
    }

    function loadExistingConfig(): void {
        // Get current configs from store using get() to avoid subscription
        const currentConfigs = get(llmConfigStore.configs);
        const existingConfig = currentConfigs.find(c => c.id === configId);
        
        if (existingConfig) {
            selectedProvider = existingConfig.provider;
            configName = existingConfig.name;
            configData = { ...existingConfig.config } as Record<string, string | number>;

            applyFieldDefaults(configData, PROVIDER_REGISTRY[selectedProvider], isUserLoggedIn);

            // Preserve previously saved model if present - THIS MUST BE SET FIRST
            if ((existingConfig.config as any).model) {
                selectedModel = (existingConfig.config as any).model;
            } else if (!selectedModel && isUserLoggedIn) {
                selectedModel = providerMetadata.defaultModel || '';
            }
            
            // Mark as initialized to prevent initializeForm from overriding
            isInitialized = true;
        }
    }

    function clearErrors(): void {
        errors = [];
    }

    async function validateForm(): Promise<boolean> {
        isValidating = true;
        clearErrors();

        // Basic validation
        if (!configName.trim()) {
            errors.push('Configuration name is required');
        }

        if (!selectedModel) {
            errors.push('Model selection is required');
        }

        // Provider-specific validation
        const validation = llmConfigStore.validateConfig(selectedProvider, {
            ...configData,
            model: selectedModel
        });

        if (!validation.isValid) {
            errors.push(...validation.errors);
        }

        isValidating = false;
        return errors.length === 0;
    }

    async function handleSave(): Promise<void> {
        console.log('handleSave called with:', { 
            configName, 
            selectedProvider, 
            selectedModel, 
            configData,
            mode 
        });
        
        const isValid = await validateForm();
        console.log('Validation result:', isValid, 'Errors:', errors);
        
        if (!isValid) return;

        try {
            // Convert string values to appropriate types
            const fullConfig: Record<string, any> = {
                ...configData,
                model: selectedModel
            };

            // Convert number fields from string to number
            providerMetadata.fields.forEach(field => {
                if (field.type === 'number' && fullConfig[field.key]) {
                    fullConfig[field.key] = parseFloat(fullConfig[field.key]);
                }
            });

            // Remove temperature if model doesn't support it
            if (!supportsTemperature && fullConfig.temperature !== undefined) {
                delete fullConfig.temperature;
            }

            console.log('Attempting to save config:', fullConfig);

            let savedConfig: LlmConfig | null = null;

            if (mode === 'create') {
                const newConfigId = await llmConfigStore.createConfig(
                    selectedProvider,
                    configName,
                    fullConfig
                );
                
                console.log('Created config with ID:', newConfigId);
                
                // Create the config object directly since we know its structure
                savedConfig = {
                    id: newConfigId,
                    name: configName,
                    provider: selectedProvider,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    config: fullConfig
                } as LlmConfig;
                
            } else if (configId) {
                await llmConfigStore.updateConfig(configId, {
                    name: configName,
                    config: fullConfig
                } as Partial<LlmConfig>);
                
                // For edit mode, we can reconstruct the updated config
                savedConfig = {
                    id: configId,
                    name: configName,
                    provider: selectedProvider,
                    isActive: true, // We don't change this in edit mode
                    createdAt: new Date(), // This would be preserved in actual store
                    updatedAt: new Date(),
                    config: fullConfig
                } as LlmConfig;
            }

            if (savedConfig) {
                console.log('Dispatching save event with config:', savedConfig);
                dispatch('save', { config: savedConfig });
            }
        } catch (error) {
            console.error('Save error:', error);
            errors = [error instanceof Error ? error.message : 'Failed to save configuration'];
        }
    }

    function handleCancel(): void {
        dispatch('cancel');
    }

    function handleProviderSelect(provider: string): void {
        selectedProvider = provider as LlmProvider;
        providerDropdownOpen = false;
    }

    function handleModelSelect(model: string): void {
        selectedModel = model;
        modelDropdownOpen = false;
    }
</script>

<Card class={compact ? 'border-0' : ''}>
    {#if !compact}
        <CardHeader>
            <CardTitle>
                {mode === 'create' ? 'Create' : 'Edit'} LLM Configuration
            </CardTitle>
        </CardHeader>
    {/if}
    
    <CardBody>
        <!-- Configuration Name -->
        <FormGroup>
            <Label for="configName">Configuration Name</Label>
            <Input 
                type="text" 
                id="configName" 
                bind:value={configName}
                placeholder="Enter a name for this configuration"
                invalid={errors.some(e => e.includes('name'))}
            />
        </FormGroup>

        <!-- Provider Selection -->
        <FormGroup>
            <Label for="providerSelect">LLM Provider</Label>
            <Dropdown 
                isOpen={providerDropdownOpen} 
                toggle={() => providerDropdownOpen = !providerDropdownOpen}
            >
                <DropdownToggle caret color="outline-secondary" style="width: 100%;">
                    <div class="d-flex align-items-center">
                        <strong>{PROVIDER_REGISTRY[selectedProvider].displayName}</strong>
                        <small class="text-muted ms-2">
                            {PROVIDER_REGISTRY[selectedProvider].description}
                        </small>
                    </div>
                </DropdownToggle>
                <DropdownMenu style="width: 100%;">
                    {#each availableProviders as provider}
                        <DropdownItem 
                            on:click={() => handleProviderSelect(provider.name)}
                            active={selectedProvider === provider.name}
                        >
                            <div>
                                <strong>{provider.displayName}</strong>
                                <br>
                                <small class="text-muted">{provider.description}</small>
                            </div>
                        </DropdownItem>
                    {/each}
                </DropdownMenu>
            </Dropdown>
        </FormGroup>

        <!-- Model Selection -->
        <FormGroup>
            <Label for="modelSelect">Model <span class="text-danger">*</span></Label>
            <Dropdown 
                isOpen={modelDropdownOpen} 
                toggle={() => modelDropdownOpen = !modelDropdownOpen}
            >
                <DropdownToggle caret color="outline-secondary" style="width: 100%;">
                    {#if selectedModel}
                        {providerMetadata.supportedModels.find(m => m.value === selectedModel)?.label || selectedModel}
                    {:else}
                        Select a model
                    {/if}
                </DropdownToggle>
                <DropdownMenu style="width: 100%;">
                    {#each providerMetadata.supportedModels as model}
                        <DropdownItem 
                            on:click={() => handleModelSelect(model.value)}
                            active={selectedModel === model.value}
                        >
                            <div>
                                <strong>{model.label}</strong>
                                {#if model.description}
                                    <br>
                                    <small class="text-muted">{model.description}</small>
                                {/if}
                            </div>
                        </DropdownItem>
                    {/each}
                </DropdownMenu>
            </Dropdown>
        </FormGroup>

        <!-- Provider Configuration Fields -->
        {#each providerMetadata.fields as field}
            <!-- Skip temperature field if model doesn't support it -->
            {#if field.key !== 'temperature' || supportsTemperature}
                <FormGroup>
                    <Label for={field.key}>
                        {field.label}
                        {#if field.required}
                            <span class="text-danger">*</span>
                        {/if}
                    </Label>
                    
                    {#if field.type === 'select' && field.options}
                    <Input 
                        type="select" 
                        id={field.key}
                        bind:value={configData[field.key]}
                        invalid={errors.some(e => e.includes(field.label))}
                    >
                        {#if !configData[field.key]}
                            <option value="" disabled>Select {field.label}</option>
                        {/if}
                        {#each field.options as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </Input>
                {:else if field.type === 'number'}
                    <Input 
                        type="number"
                        id={field.key}
                        bind:value={configData[field.key]}
                        placeholder={field.placeholder}
                        invalid={errors.some(e => e.includes(field.label))}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                {:else}
                    <Input 
                        type={field.type}
                        id={field.key}
                        bind:value={configData[field.key]}
                        placeholder={field.placeholder}
                        invalid={errors.some(e => e.includes(field.label))}
                    />
                {/if}
                
                {#if field.helpText}
                    <small class="text-muted">{field.helpText}</small>
                {/if}
            </FormGroup>
            {/if}
        {/each}

        <!-- Errors Display -->
        {#if errors.length > 0}
            <Alert color="danger" class="mt-3">
                <strong>Please fix the following errors:</strong>
                <ul class="mb-0 mt-2">
                    {#each errors as error}
                        <li>{error}</li>
                    {/each}
                </ul>
            </Alert>
        {/if}

        <!-- Actions -->
        <div class="d-flex gap-2 mt-4">
            <Button 
                color="primary" 
                on:click={() => {
                    console.log('Create button clicked!');
                    handleSave();
                }}
                disabled={isValidating}
            >
                {#if isValidating}
                    <Spinner size="sm" class="me-2" />
                {/if}
                {mode === 'create' ? 'Create' : 'Update'} Configuration
            </Button>

            <Button 
                color="secondary" 
                outline 
                on:click={handleCancel}
            >
                Cancel
            </Button>
        </div>
    </CardBody>
</Card>

<style>
    :global(.dropdown-menu) {
        max-height: 300px;
        overflow-y: auto;
    }
</style>
