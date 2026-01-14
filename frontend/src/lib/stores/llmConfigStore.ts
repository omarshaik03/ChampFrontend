import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
// LLM Provider Types
export type LlmProvider = 'AzureOpenAI' | 'AWSBedrock';

// Base configuration interface
export interface BaseLlmConfig {
	id: string;
	name: string;
	provider: LlmProvider;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Provider-specific configurations
export interface AzureOpenAIConfig extends BaseLlmConfig {
	provider: 'AzureOpenAI';
	config: {
		api_key: string;
		azure_endpoint: string;
		azure_deployment: string;
		api_version: string;
		temperature?: number; // Optional as some models like GPT-5 don't support it
		model: string;
	};
}

export interface AWSBedrockConfig extends BaseLlmConfig {
	provider: 'AWSBedrock';
	config: {
		accessKeyId: string;
		secretAccessKey: string;
		region: string;
		model: string;
		temperature?: number; // Optional as some models may not support it
	};
}

export type LlmConfig = AzureOpenAIConfig | AWSBedrockConfig;

// Provider metadata for UI generation
export interface ProviderMetadata {
	name: string;
	displayName: string;
	description: string;
	iconUrl?: string;
	fields: {
		key: string;
		label: string;
		type: 'text' | 'password' | 'select' | 'number';
		required: boolean;
		placeholder?: string;
		defaultValue?: string | number;
		options?: { value: string; label: string }[];
		validation?: RegExp;
		helpText?: string;
		min?: number;
		max?: number;
		step?: number;
	}[];
	defaultModel?: string;
	supportedModels: { value: string; label: string; description?: string }[];
}

// Provider registry
export const PROVIDER_REGISTRY: Record<LlmProvider, ProviderMetadata> = {
	'AzureOpenAI': {
		name: 'AzureOpenAI',
		displayName: 'Azure OpenAI',
		description: 'Microsoft Azure OpenAI Service',
		fields: [
			{
				key: 'api_key',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'Enter your Azure OpenAI API key',
				defaultValue: 'a51a2bac408a4087821ccd00f7c35d3e',
				helpText: 'Found in Azure Portal > Resource > Keys and Endpoint'
			},
			{
				key: 'azure_endpoint',
				label: 'Endpoint',
				type: 'text',
				required: true,
				placeholder: 'https://your-resource.openai.azure.com/',
				defaultValue: 'https://aoaihpcsipoc.openai.azure.com',
				validation: /^https:\/\/.+\.openai\.azure\.com\/?$/,
				helpText: 'Azure OpenAI resource endpoint URL'
			},
			{
				key: 'azure_deployment',
				label: 'Deployment Name',
				type: 'text',
				required: true,
				placeholder: 'Enter your deployment name',
				defaultValue: 'gpt-5',
				helpText: 'The name of your model deployment in Azure'
			},
			{
				key: 'api_version',
				label: 'API Version',
				type: 'text',
				required: true,
				placeholder: '2024-08-01-preview',
				defaultValue: '2024-08-01-preview',
				helpText: 'Azure OpenAI API version to use'
			},
			{
				key: 'temperature',
				label: 'Temperature',
				type: 'number',
				required: false, // Made optional as some models like GPT-5 don't support it
				placeholder: '0.2',
				defaultValue: 0.2,
				min: 0,
				max: 2,
				step: 0.1,
				helpText: 'Controls randomness in responses (0.0 = deterministic, 2.0 = very random). Not supported for GPT-5.'
			}
		],
		defaultModel: 'gpt-4o',
		supportedModels: [
			{ value: 'gpt-4o', label: 'GPT-4o', description: 'Most capable multimodal model' },
			{ value: 'gpt-5', label: 'GPT-5', description: 'Next generation model (temperature not supported)' },
		]
	},
	'AWSBedrock': {
		name: 'AWSBedrock',
		displayName: 'AWS Bedrock',
		description: 'Amazon Bedrock Foundation Models',
		fields: [
			{
				key: 'accessKeyId',
				label: 'Access Key ID',
				type: 'text',
				required: true,
				placeholder: 'Enter AWS Access Key ID',
				defaultValue: '',
				helpText: 'AWS IAM user access key with Bedrock permissions'
			},
			{
				key: 'secretAccessKey',
				label: 'Secret Access Key',
				type: 'password',
				required: true,
				placeholder: 'Enter AWS Secret Access Key',
				defaultValue: '',
				helpText: 'AWS IAM user secret access key'
			},
			{
				key: 'region',
				label: 'Region',
				type: 'select',
				required: true,
				options: [
					{ value: 'us-east-1', label: 'US East (N. Virginia)' },
					{ value: 'us-west-2', label: 'US West (Oregon)' },
					{ value: 'eu-west-1', label: 'Europe (Ireland)' },
					{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
					{ value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
				],
				defaultValue: 'us-east-1',
				helpText: 'AWS region where Bedrock is available'
			},
			{
				key: 'temperature',
				label: 'Temperature',
				type: 'number',
				required: true,
				placeholder: '0.2',
				defaultValue: 0.2,
				min: 0,
				max: 2,
				step: 0.1,
				helpText: 'Controls randomness in responses (0.0 = deterministic, 2.0 = very random)'
			}
		],
		defaultModel: 'claude-3-5-sonnet-20241022',
		supportedModels: [
			{ value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', description: 'Most intelligent model' },
		]
	}
};

// Helper function to check if a model supports temperature
export function modelSupportsTemperature(modelName: string): boolean {
	// Models that don't support temperature parameter
	const noTemperatureModels = ['gpt-5', 'o1-preview', 'o1-mini'];
	return !noTemperatureModels.includes(modelName);
}

// Store state interface
interface LlmConfigStoreState {
	configs: LlmConfig[];
	activeConfigId: string | null;
	isLoading: boolean;
	error: string | null;
}

// Store implementation
class LlmConfigStore {
	private store: Writable<LlmConfigStoreState>;
	
	constructor() {
		this.store = writable<LlmConfigStoreState>({
			configs: [],
			activeConfigId: null,
			isLoading: false,
			error: null
		});
		
		// Load from localStorage on initialization
		this.loadFromStorage();
	}

	// Public store interface
	subscribe = (run: (value: LlmConfigStoreState) => void) => this.store.subscribe(run);

	// Computed stores
	get configs(): Readable<LlmConfig[]> {
		return derived(this.store, $store => $store.configs);
	}

	get activeConfig(): Readable<LlmConfig | null> {
		return derived(this.store, $store => 
			$store.configs.find(config => config.id === $store.activeConfigId) || null
		);
	}

	get isLoading(): Readable<boolean> {
		return derived(this.store, $store => $store.isLoading);
	}

	get error(): Readable<string | null> {
		return derived(this.store, $store => $store.error);
	}

	// Actions
	async createConfig(provider: LlmProvider, name: string, config: any): Promise<string> {
		this.setLoading(true);
		this.clearError();
		
		try {
			const newConfig: LlmConfig = {
				id: this.generateId(),
				name,
				provider,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				config
			} as LlmConfig;

			this.store.update(state => ({
				...state,
				configs: [...state.configs, newConfig]
			}));

			await this.saveToStorage();
			this.setLoading(false);
			
			return newConfig.id;
		} catch (error) {
			this.setError(error instanceof Error ? error.message : 'Failed to create configuration');
			this.setLoading(false);
			throw error;
		}
	}

	async updateConfig(id: string, updates: Partial<LlmConfig>): Promise<void> {
		this.setLoading(true);
		this.clearError();

		try {
			this.store.update(state => ({
				...state,
				configs: state.configs.map(config =>
					config.id === id
						? { ...config, ...updates, updatedAt: new Date() } as LlmConfig
						: config
				)
			}));

			await this.saveToStorage();
			this.setLoading(false);
		} catch (error) {
			this.setError(error instanceof Error ? error.message : 'Failed to update configuration');
			this.setLoading(false);
			throw error;
		}
	}

	async deleteConfig(id: string): Promise<void> {
		this.setLoading(true);
		this.clearError();

		try {
			this.store.update(state => {
				const remainingConfigs = state.configs.filter(config => config.id !== id);
				let newActiveConfigId = state.activeConfigId;
				
				// If we're deleting the active config, find another one to set as active
				if (state.activeConfigId === id) {
					// Prefer the first remaining config, or null if none exist
					newActiveConfigId = remainingConfigs.length > 0 ? remainingConfigs[0].id : null;
				}
				
				return {
					...state,
					configs: remainingConfigs,
					activeConfigId: newActiveConfigId
				};
			});

			await this.saveToStorage();
			this.setLoading(false);
		} catch (error) {
			this.setError(error instanceof Error ? error.message : 'Failed to delete configuration');
			this.setLoading(false);
			throw error;
		}
	}

	setActiveConfig(id: string | null): void {
		this.store.update(state => ({
			...state,
			activeConfigId: id
		}));
		
		// Only save to storage if we're in a browser environment
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			this.saveToStorage();
		}
	}

	// Validation utilities
	validateConfig(provider: LlmProvider, config: any): { isValid: boolean; errors: string[] } {
		const metadata = PROVIDER_REGISTRY[provider];
		const errors: string[] = [];
		const modelName = config.model || '';
		const supportsTemperature = modelSupportsTemperature(modelName);

		for (const field of metadata.fields) {
			const value = config[field.key];
			
			// Skip temperature validation if model doesn't support it
			if (field.key === 'temperature' && !supportsTemperature) {
				continue;
			}
			
			// Handle different field types for validation
			if (field.required) {
				if (field.type === 'number') {
					// For number fields, check if value is undefined, null, or empty string
					if (value === undefined || value === null || value === '') {
						errors.push(`${field.label} is required`);
						continue;
					}
				} else {
					// For string fields, check if empty or just whitespace
					if (!value || (typeof value === 'string' && value.trim() === '')) {
						errors.push(`${field.label} is required`);
						continue;
					}
				}
			}

			// Validate format for string fields only
			if (value && field.validation && typeof value === 'string' && !field.validation.test(value)) {
				errors.push(`${field.label} format is invalid`);
			}

			// Additional validation for number fields
			if (field.type === 'number' && value !== undefined && value !== null && value !== '') {
				const numValue = Number(value);
				if (isNaN(numValue)) {
					errors.push(`${field.label} must be a valid number`);
				} else {
					if (field.min !== undefined && numValue < field.min) {
						errors.push(`${field.label} must be at least ${field.min}`);
					}
					if (field.max !== undefined && numValue > field.max) {
						errors.push(`${field.label} must be at most ${field.max}`);
					}
				}
			}
		}

		// If provider supports explicit model selection, ensure model present
		if (metadata.supportedModels?.length) {
			if (!config.model || (typeof config.model === 'string' && config.model.trim() === '')) {
				errors.push('Model selection is required');
			} else if (!metadata.supportedModels.find(m => m.value === config.model)) {
				errors.push('Selected model is not in supported list');
			}
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	// Get provider-specific configuration for API calls
	getApiConfig(configId: string): any {
		const state = this.getCurrentState();
		const config = state.configs.find(c => c.id === configId);
		
		if (!config) {
			throw new Error('Configuration not found');
		}

		// Convert to backend API format
		switch (config.provider) {
			case 'AzureOpenAI': {
				const azureConfig = config as AzureOpenAIConfig;
				return {
					id: azureConfig.id,
					description: azureConfig.name,
					type: azureConfig.provider,
					config: azureConfig.config,
				};
			}
			case 'AWSBedrock': {
				const bedrockConfig = config as AWSBedrockConfig;
				return {
					id: bedrockConfig.id,
					type: bedrockConfig.provider,
					description: bedrockConfig.name,
					config: bedrockConfig.config,
				};
			}
			default:
				throw new Error(`Unsupported provider: ${(config as any).provider}`);
		}
	}

	// Private methods
	private generateId(): string {
		return `llm_config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private setLoading(loading: boolean): void {
		this.store.update(state => ({ ...state, isLoading: loading }));
	}

	private setError(error: string | null): void {
		this.store.update(state => ({ ...state, error }));
	}

	private clearError(): void {
		this.setError(null);
	}

	private getCurrentState(): LlmConfigStoreState {
		let currentState: LlmConfigStoreState;
		this.store.subscribe(state => currentState = state)();
		return currentState!;
	}

	private async saveToStorage(): Promise<void> {
		// Check if we're in a browser environment
		if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
			return;
		}
		
		try {
			const state = this.getCurrentState();
			localStorage.setItem('llm-configs', JSON.stringify({
				configs: state.configs,
				activeConfigId: state.activeConfigId
			}));
		} catch (error) {
			console.warn('Failed to save LLM configurations to localStorage:', error);
		}
	}

	private loadFromStorage(): void {
		// Check if we're in a browser environment
		if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
			return;
		}
		
		try {
			const stored = localStorage.getItem('llm-configs');
			if (stored) {
				const data = JSON.parse(stored);
				
				// Convert date strings back to Date objects with fallbacks
				const configs = (data.configs || []).map((config: any) => {
					const createdAt = config.createdAt ? new Date(config.createdAt) : new Date();
					const updatedAt = config.updatedAt ? new Date(config.updatedAt) : new Date();
					
					return {
						...config,
						createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
						updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt
					};
				});
				
				this.store.update(state => ({
					...state,
					configs,
					activeConfigId: data.activeConfigId || null
				}));
			}
		} catch (error) {
			console.warn('Failed to load LLM configurations from localStorage:', error);
		}
	}
}

// Export singleton instance
export const llmConfigStore = new LlmConfigStore();

// Export utility functions
export function getProviderMetadata(provider: LlmProvider): ProviderMetadata {
	return PROVIDER_REGISTRY[provider];
}

export function getAllProviders(): ProviderMetadata[] {
	return Object.values(PROVIDER_REGISTRY);
}

export function getSupportedProviders(): LlmProvider[] {
	return Object.keys(PROVIDER_REGISTRY) as LlmProvider[];
}
