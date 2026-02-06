import { llmConfigStore } from '../stores/llmConfigStore';
import { get } from 'svelte/store';
import { userStore } from '../stores/userStore';
import { runtimeConfig } from '../runtime-config';

// Request interfaces - moved from data to service layer
export interface AccessKeyRequestBody {
	access_key: string;
}

export interface LlmConfigRequestBody {
	llm_provider: string;
	llm_key?: string;
	llm_endpoint?: string;
	llm_deployment_name?: string;
	llm_api_version?: string;
	llm_secret_key?: string;
	llm_model_id?: string;
	llm_region?: string;
	llm_temperature: number;
}

export interface SqlConvertRequestBody {
	sql_code: string;
	source_dialect: string;
	target_dialect: string;
	specific_instructions?: string;
	add_explanation: boolean;
}

export interface SqlWorkflowRequestBody {
	sql_code: string;
	source_dialect: string;
	target_dialect: string;
	specific_instructions?: string;
}

export interface SqlStreamRequestBody {
	access_key: AccessKeyRequestBody;
	llm_config: LlmConfigRequestBody;
	sql_convert: SqlConvertRequestBody;
}

export interface SqlWorkflowStreamRequestBody {
	access_key: AccessKeyRequestBody;
	llm_config: LlmConfigRequestBody;
	sql_workflow: SqlWorkflowRequestBody;
}

export interface CodeConversionRequest {
	code: string;
	debug: boolean;
	input_language: string;
	target_language: string;
	prompt: string;
	add_explanation: boolean;
}

export interface CodeConversionResponse {
	output: string;
	tokens: {
		input: number;
		output: number;
	};
	time: number;
}


export class CodeConversionService {
	private static readonly STREAM_URL = `${runtimeConfig.CODE_CONVERSION_URL}/sql/stream`;
	private static readonly WORKFLOW_URL = `${runtimeConfig.CODE_CONVERSION_URL}/sql/workflow`;
	private static readonly TOKENS_URL = `${runtimeConfig.API_BASE_URL}/api/util/get-tokens`; //Make sure this is supplied with two inputs: the input text and the llm name
	private static readonly LLM_PRICE_URL = `${runtimeConfig.API_BASE_URL}/api/util/get-llm-price`;

	/**
	 * Gets the number of tokens for a given input using a specified LLM
	 */
	static async getTokenCount(
		input: string,
		llmName: string
	): Promise<number> {
		const user = get(userStore);
		const token = user?.token;

		if (!token) {
			console.error('No auth token available for getTokenCount');
			throw new Error('Authentication required');
		}

		try {
			const response = await fetch(this.TOKENS_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					input: input,
					llm: llmName
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to get token count: ${response.status}`);
			}

			const data = await response.json();
			return data.num_tokens || 0;
		} catch (error) {
			console.error('Error getting token count:', error);
			throw error;
		}
	}

	/**
	 * Gets the pricing information for a specified LLM
	 */
	static async getLlmPrice(
		llmName: string
	): Promise<{ cost_per_input_token: number; cost_per_output_token: number }> {
		const user = get(userStore);
		const token = user?.token;

		if (!token) {
			console.error('No auth token available for getLlmPrice');
			throw new Error('Authentication required');
		}

		try {
			const response = await fetch(this.LLM_PRICE_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					llm: llmName
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to get LLM price: ${response.status}`);
			}

			const data = await response.json();
			return {
				cost_per_input_token: data.cost_per_input_token || 0,
				cost_per_output_token: data.cost_per_output_token || 0
			};
		} catch (error) {
			console.error('Error getting LLM price:', error);
			throw error;
		}
	}

	/**
	 * Converts code from one SQL language to another using streaming response
	 * Uses llmConfigStore for configuration management
	 */
	static async convertCodeStream(
		request: CodeConversionRequest,
		accessKey: string,
		configId: string,
		controller?: AbortController
	): Promise<Response> {
		const requestBody = this.buildRequestBody(request, accessKey, configId);

		return fetch(CodeConversionService.STREAM_URL, {
			method: 'POST',
			signal: controller?.signal,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
	}

	/**
	 * Executes SQL workflow conversion using non-streaming response
	 * Uses workflow endpoint for batch processing
	 */
	static async convertCodeWorkflow(
		request: SqlWorkflowRequestBody,
		accessKey: string,
		configId: string,
		controller?: AbortController
	): Promise<Response> {
		const requestBody = this.buildWorkflowRequestBody(request, accessKey, configId);

		return fetch(CodeConversionService.WORKFLOW_URL, {
			method: 'POST',
			signal: controller?.signal,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
	}

	/**
	 * Builds the request body using llmConfigStore
	 */
	private static buildRequestBody(
		request: CodeConversionRequest, 
		accessKey: string, 
		configId: string
	): SqlStreamRequestBody {
		const llmConfig = llmConfigStore.getApiConfig(configId);
		
		return {
			access_key: {
				access_key: accessKey
			},
			llm_config: llmConfig,
			sql_convert: {
				sql_code: request.code,
				source_dialect: request.input_language,
				target_dialect: request.target_language,
				specific_instructions: request.prompt,
				add_explanation: request.add_explanation
			}
		};
	}

	/**
	 * Builds the workflow request body using llmConfigStore
	 */
	private static buildWorkflowRequestBody(
		request: SqlWorkflowRequestBody,
		accessKey: string,
		configId: string
	): SqlWorkflowStreamRequestBody {
		const llmConfig = llmConfigStore.getApiConfig(configId);
		
		return {
			access_key: {
				access_key: accessKey
			},
			llm_config: llmConfig,
			sql_workflow: {
				sql_code: request.sql_code,
				source_dialect: request.source_dialect,
				target_dialect: request.target_dialect,
				specific_instructions: request.specific_instructions
			}
		};
	}

	/**
	 * Processes streaming response from code conversion API
	 * Follows agentService pattern for consistency and extensibility
	 */
	static async processStreamResponse(
		body: ReadableStream<Uint8Array>,
		onChunk: (data: CodeConversionResponse) => void,
		onComplete: () => void,
		onError: (reason: string) => void
	): Promise<void> {
		const reader = body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const events = this.parseSSEEvents(buffer);
				
				// Process each complete event
				for (const event of events) {
					const responseData = this.normalizeResponse(event);
					onChunk(responseData);
				}

				// Keep incomplete data in buffer for next iteration
				const lastEventIndex = buffer.lastIndexOf('\n\n');
				if (lastEventIndex !== -1) {
					buffer = buffer.substring(lastEventIndex + 2);
				}
			}
			onComplete();
		} catch (error) {
			console.error('Error processing stream:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			onError(`Stream processing error: ${errorMessage}`);
		} finally {
			reader.releaseLock();
		}
	}

	/**
	 * Processes streaming workflow response
	 * Uses the same streaming pattern as convertCodeStream but for workflow endpoint
	 */
	static async processWorkflowResponse(
		body: ReadableStream<Uint8Array>,
		onChunk: (data: CodeConversionResponse) => void,
		onComplete: () => void,
		onError: (reason: string) => void
	): Promise<void> {
		const reader = body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const events = this.parseSSEEvents(buffer);
				
				// Process each complete event
				for (const event of events) {
					const responseData = this.normalizeResponse(event);
					onChunk(responseData);
				}

				// Keep incomplete data in buffer for next iteration
				const lastEventIndex = buffer.lastIndexOf('\n\n');
				if (lastEventIndex !== -1) {
					buffer = buffer.substring(lastEventIndex + 2);
				}
			}
			onComplete();
		} catch (error) {
			console.error('Error processing workflow stream:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			onError(`Workflow stream processing error: ${errorMessage}`);
		} finally {
			reader.releaseLock();
		}
	}

	/**
	 * Parses SSE events similar to agentService pattern
	 * More robust handling of event/data pairs
	 */
	static parseSSEEvents(rawData: string): any[] {
		const events: any[] = [];
		const chunks = rawData.split('\n\n');
		
		for (const chunk of chunks) {
			if (!chunk.trim()) continue;
			
			const lines = chunk.split('\n');
			let eventType = '';
			let eventData = '';
			
			for (const line of lines) {
				if (line.startsWith('event: ')) {
					eventType = line.substring(7);
				} else if (line.startsWith('data: ')) {
					eventData = line.substring(6);
				}
			}
			
			// Handle data-only chunks (common in code conversion)
			if (!eventType && eventData) {
				try {
					const parsedData = JSON.parse(eventData);
					events.push(parsedData);
				} catch (error) {
					console.error("Error parsing SSE event data:", error, eventData);
				}
			} else if (eventType && eventData) {
				try {
					const parsedData = JSON.parse(eventData);
					events.push({ type: eventType, ...parsedData });
				} catch (error) {
					console.error("Error parsing SSE event data:", error, eventData);
				}
			}
		}
		
		return events;
	}

	/**
	 * Normalizes different response formats to consistent CodeConversionResponse
	 * Extensible design for supporting various backend formats
	 */
	private static normalizeResponse(parsedChunk: any): CodeConversionResponse {
		// Handle workflow completion event specifically
		if (parsedChunk.event_type === 'workflow_completed' && parsedChunk.final_code !== undefined) {
			return {
				output: parsedChunk.final_code || '',
				tokens: {
					input: parsedChunk.workflow_metadata?.estimated_tokens || 0,
					output: 0 // Not provided in workflow completion
				},
				time: parseFloat((parsedChunk.processing_time || 0).toFixed(2))
			};
		}

		// Define the response mappers for extensibility
		const responseMappers = [
			this.mapPrimaryFormat,
			this.mapLegacyFormat,
			this.mapAlternativeFormats
		];

		// Try each mapper until one succeeds
		for (const mapper of responseMappers) {
			const result = mapper(parsedChunk);
			if (result) return result;
		}

		// Fallback: extract any text content
		const fallbackContent = this.extractTextContent(parsedChunk);
		return {
			output: fallbackContent,
			tokens: { input: 0, output: 0 },
			time: 0
		};
	}

	/**
	 * Maps primary backend response format (uses 'code' field)
	 */
	private static mapPrimaryFormat(chunk: any): CodeConversionResponse | null {
		if (chunk.code === undefined) return null;

		return {
			output: chunk.code || '',
			tokens: {
				input: chunk.tokens?.input || 0,
				output: chunk.tokens?.output || 0
			},
			time: parseFloat((chunk.time || 0).toFixed(2)),
			...(chunk.explanation && chunk.explanation !== null && { explanation: chunk.explanation })
		};
	}

	/**
	 * Maps legacy format with 'output' field and explanation separator
	 */
	private static mapLegacyFormat(chunk: any): CodeConversionResponse | null {
		if (chunk.output === undefined) return null;

		const [output, explanation] = chunk.output.split(/\[=+\]/);
		return {
			output: output || '',
			tokens: {
				input: chunk.tokens?.input || 0,
				output: chunk.tokens?.output || 0
			},
			time: parseFloat((chunk.time || 0).toFixed(2)),
			...(explanation && { explanation })
		};
	}

	/**
	 * Maps alternative response formats (content, data, message, text fields)
	 */
	private static mapAlternativeFormats(chunk: any): CodeConversionResponse | null {
		const contentField = chunk.content || chunk.data || chunk.message || chunk.text;
		if (!contentField) return null;

		return {
			output: contentField,
			tokens: {
				input: chunk.tokens?.input || chunk.input_tokens || 0,
				output: chunk.tokens?.output || chunk.output_tokens || 0
			},
			time: parseFloat((chunk.time || chunk.elapsed_time || 0).toFixed(2))
		};
	}

	/**
	 * Extracts any text content as fallback
	 */
	private static extractTextContent(chunk: any): string {
		if (typeof chunk === 'string') return chunk;
		if (chunk && typeof chunk === 'object') {
			// Try common text fields
			const textFields = ['final_code', 'code', 'output', 'content', 'data', 'message', 'text', 'result'];
			for (const field of textFields) {
				if (chunk[field] && typeof chunk[field] === 'string') {
					return chunk[field];
				}
			}
			// Return stringified object as last resort
			return JSON.stringify(chunk);
		}
		return '';
	}

	/**
	 * Utility methods for file operations and common tasks
	 */
	
	/**
	 * Validates response and handles common error scenarios
	 * Extensible error handling for different response types
	 */
	static validateResponse(response: Response): { isValid: boolean; errorMessage?: string } {
		const validators = [
			() => response ? null : 'No response from server',
			() => response.status === 401 ? 'Unauthorized - please check your access key' : null,
			() => response.status === 429 ? 'Rate limit exceeded - please try again later' : null,
			() => response.status === 500 ? 'Internal server error - please try again' : null,
			() => response.status !== 200 ? `Server error: ${response.status} ${response.statusText}` : null,
			() => !response.body ? 'No response body received' : null
		];

		for (const validator of validators) {
			const error = validator();
			if (error) return { isValid: false, errorMessage: error };
		}
		
		return { isValid: true };
	}

	/**
	 * Downloads content as a file
	 */
	static downloadAsFile(content: string, filename: string = 'output.sql'): void {
		if (!content) {
			throw new Error('No content to download');
		}
		
		const file = new File([content], filename, { type: 'text/plain' });
		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	/**
	 * Copies text to clipboard
	 */
	static async copyToClipboard(text: string): Promise<void> {
		if (!text) {
			throw new Error('No text to copy');
		}
		await navigator.clipboard.writeText(text);
	}

	/**
	 * Reads file content as text
	 */
	static readFileAsText(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(reader.error);
			reader.readAsText(file);
		});
	}
}
