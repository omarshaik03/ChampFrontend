// Token cost configuration for LLM models
// Rates are per 1000 tokens

export interface TokenCost {
	input: number;
	output: number;
}

export interface ModelTokenCost {
	model: string;
	displayName: string;
	tokenCost: TokenCost;
}

// Token costs per model (rates per 1000 tokens)
export const MODEL_TOKEN_COSTS: Record<string, ModelTokenCost> = {
	'gpt-4o': {
		model: 'gpt-4o',
		displayName: 'GPT-4o',
		tokenCost: { input: 0.005, output: 0.015 }
	},
	'claude-3-5-sonnet-20241022': {
		model: 'claude-3-5-sonnet-20241022',
		displayName: 'Claude 3.5 Sonnet',
		tokenCost: { input: 0.003, output: 0.015 }
	},
	'mistral-large': {
		model: 'mistral-large',
		displayName: 'Mistral Large',
		tokenCost: { input: 0.004, output: 0.012 }
	},
	'llama-3-2-90b': {
		model: 'llama-3-2-90b',
		displayName: 'Llama 3.2 90B',
		tokenCost: { input: 0.002, output: 0.002 }
	}
};

// Utility functions for token cost calculations
export function getModelTokenCost(model: string): TokenCost | null {
	const modelCost = MODEL_TOKEN_COSTS[model];
	return modelCost ? modelCost.tokenCost : null;
}

export function calculateTokenCost(model: string, inputTokens: number, outputTokens: number): number {
	const tokenCost = getModelTokenCost(model);
	if (!tokenCost) return 0;
	
	return (inputTokens * tokenCost.input + outputTokens * tokenCost.output) / 1000;
}

export function getModelDisplayName(model: string): string {
	const modelCost = MODEL_TOKEN_COSTS[model];
	return modelCost ? modelCost.displayName : model;
}

// Get all available models for selection dropdowns
export function getAllSupportedModels(): ModelTokenCost[] {
	return Object.values(MODEL_TOKEN_COSTS);
}
