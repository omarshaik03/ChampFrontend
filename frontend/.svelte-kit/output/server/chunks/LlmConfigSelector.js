import { a as store_get, p as prevent_snippet_stringification, e as ensure_array_like, u as unsubscribe_stores, c as bind_props } from "./index2.js";
import { a4 as fallback, a3 as FILENAME } from "./utils2.js";
import { p as push_element, a as pop_element } from "./dev.js";
import { D as Dropdown, d as DropdownToggle, t as Badge, e as DropdownMenu, B as Button, f as DropdownItem } from "./Tooltip.js";
import { w as writable, d as derived } from "./index.js";
import { e as escape_html } from "./context.js";
const PROVIDER_REGISTRY = {
  "AzureOpenAI": {
    name: "AzureOpenAI",
    displayName: "Azure OpenAI",
    description: "Microsoft Azure OpenAI Service",
    fields: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "Enter your Azure OpenAI API key",
        defaultValue: "a51a2bac408a4087821ccd00f7c35d3e",
        helpText: "Found in Azure Portal > Resource > Keys and Endpoint"
      },
      {
        key: "azure_endpoint",
        label: "Endpoint",
        type: "text",
        required: true,
        placeholder: "https://your-resource.openai.azure.com/",
        defaultValue: "https://aoaihpcsipoc.openai.azure.com",
        validation: /^https:\/\/.+\.openai\.azure\.com\/?$/,
        helpText: "Azure OpenAI resource endpoint URL"
      },
      {
        key: "azure_deployment",
        label: "Deployment Name",
        type: "text",
        required: true,
        placeholder: "Enter your deployment name",
        defaultValue: "gpt-5",
        helpText: "The name of your model deployment in Azure"
      },
      {
        key: "api_version",
        label: "API Version",
        type: "text",
        required: true,
        placeholder: "2024-08-01-preview",
        defaultValue: "2024-08-01-preview",
        helpText: "Azure OpenAI API version to use"
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "number",
        required: false,
        // Made optional as some models like GPT-5 don't support it
        placeholder: "0.2",
        defaultValue: 0.2,
        min: 0,
        max: 2,
        step: 0.1,
        helpText: "Controls randomness in responses (0.0 = deterministic, 2.0 = very random). Not supported for GPT-5."
      }
    ],
    defaultModel: "gpt-4o",
    supportedModels: [
      { value: "gpt-4o", label: "GPT-4o", description: "Most capable multimodal model" },
      { value: "gpt-5", label: "GPT-5", description: "Next generation model (temperature not supported)" }
    ]
  },
  "AWSBedrock": {
    name: "AWSBedrock",
    displayName: "AWS Bedrock",
    description: "Amazon Bedrock Foundation Models",
    fields: [
      {
        key: "accessKeyId",
        label: "Access Key ID",
        type: "text",
        required: true,
        placeholder: "Enter AWS Access Key ID",
        defaultValue: "",
        helpText: "AWS IAM user access key with Bedrock permissions"
      },
      {
        key: "secretAccessKey",
        label: "Secret Access Key",
        type: "password",
        required: true,
        placeholder: "Enter AWS Secret Access Key",
        defaultValue: "",
        helpText: "AWS IAM user secret access key"
      },
      {
        key: "region",
        label: "Region",
        type: "select",
        required: true,
        options: [
          { value: "us-east-1", label: "US East (N. Virginia)" },
          { value: "us-west-2", label: "US West (Oregon)" },
          { value: "eu-west-1", label: "Europe (Ireland)" },
          { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
          { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" }
        ],
        defaultValue: "us-east-1",
        helpText: "AWS region where Bedrock is available"
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "number",
        required: true,
        placeholder: "0.2",
        defaultValue: 0.2,
        min: 0,
        max: 2,
        step: 0.1,
        helpText: "Controls randomness in responses (0.0 = deterministic, 2.0 = very random)"
      }
    ],
    defaultModel: "claude-3-5-sonnet-20241022",
    supportedModels: [
      { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", description: "Most intelligent model" }
    ]
  }
};
function modelSupportsTemperature(modelName) {
  const noTemperatureModels = ["gpt-5", "o1-preview", "o1-mini"];
  return !noTemperatureModels.includes(modelName);
}
class LlmConfigStore {
  store;
  constructor() {
    this.store = writable({
      configs: [],
      activeConfigId: null,
      isLoading: false,
      error: null
    });
    this.loadFromStorage();
  }
  // Public store interface
  subscribe = (run) => this.store.subscribe(run);
  // Computed stores
  get configs() {
    return derived(this.store, ($store) => $store.configs);
  }
  get activeConfig() {
    return derived(
      this.store,
      ($store) => $store.configs.find((config) => config.id === $store.activeConfigId) || null
    );
  }
  get isLoading() {
    return derived(this.store, ($store) => $store.isLoading);
  }
  get error() {
    return derived(this.store, ($store) => $store.error);
  }
  // Actions
  async createConfig(provider, name, config) {
    this.setLoading(true);
    this.clearError();
    try {
      const newConfig = {
        id: this.generateId(),
        name,
        provider,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        config
      };
      this.store.update((state) => ({
        ...state,
        configs: [...state.configs, newConfig]
      }));
      await this.saveToStorage();
      this.setLoading(false);
      return newConfig.id;
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to create configuration");
      this.setLoading(false);
      throw error;
    }
  }
  async updateConfig(id, updates) {
    this.setLoading(true);
    this.clearError();
    try {
      this.store.update((state) => ({
        ...state,
        configs: state.configs.map(
          (config) => config.id === id ? { ...config, ...updates, updatedAt: /* @__PURE__ */ new Date() } : config
        )
      }));
      await this.saveToStorage();
      this.setLoading(false);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to update configuration");
      this.setLoading(false);
      throw error;
    }
  }
  async deleteConfig(id) {
    this.setLoading(true);
    this.clearError();
    try {
      this.store.update((state) => {
        const remainingConfigs = state.configs.filter((config) => config.id !== id);
        let newActiveConfigId = state.activeConfigId;
        if (state.activeConfigId === id) {
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
      this.setError(error instanceof Error ? error.message : "Failed to delete configuration");
      this.setLoading(false);
      throw error;
    }
  }
  setActiveConfig(id) {
    this.store.update((state) => ({
      ...state,
      activeConfigId: id
    }));
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      this.saveToStorage();
    }
  }
  // Validation utilities
  validateConfig(provider, config) {
    const metadata = PROVIDER_REGISTRY[provider];
    const errors = [];
    const modelName = config.model || "";
    const supportsTemperature = modelSupportsTemperature(modelName);
    for (const field of metadata.fields) {
      const value = config[field.key];
      if (field.key === "temperature" && !supportsTemperature) {
        continue;
      }
      if (field.required) {
        if (field.type === "number") {
          if (value === void 0 || value === null || value === "") {
            errors.push(`${field.label} is required`);
            continue;
          }
        } else {
          if (!value || typeof value === "string" && value.trim() === "") {
            errors.push(`${field.label} is required`);
            continue;
          }
        }
      }
      if (value && field.validation && typeof value === "string" && !field.validation.test(value)) {
        errors.push(`${field.label} format is invalid`);
      }
      if (field.type === "number" && value !== void 0 && value !== null && value !== "") {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push(`${field.label} must be a valid number`);
        } else {
          if (field.min !== void 0 && numValue < field.min) {
            errors.push(`${field.label} must be at least ${field.min}`);
          }
          if (field.max !== void 0 && numValue > field.max) {
            errors.push(`${field.label} must be at most ${field.max}`);
          }
        }
      }
    }
    if (metadata.supportedModels?.length) {
      if (!config.model || typeof config.model === "string" && config.model.trim() === "") {
        errors.push("Model selection is required");
      } else if (!metadata.supportedModels.find((m) => m.value === config.model)) {
        errors.push("Selected model is not in supported list");
      }
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  // Get provider-specific configuration for API calls
  getApiConfig(configId) {
    const state = this.getCurrentState();
    const config = state.configs.find((c) => c.id === configId);
    if (!config) {
      throw new Error("Configuration not found");
    }
    switch (config.provider) {
      case "AzureOpenAI": {
        const azureConfig = config;
        return {
          id: azureConfig.id,
          description: azureConfig.name,
          type: azureConfig.provider,
          config: azureConfig.config
        };
      }
      case "AWSBedrock": {
        const bedrockConfig = config;
        return {
          id: bedrockConfig.id,
          type: bedrockConfig.provider,
          description: bedrockConfig.name,
          config: bedrockConfig.config
        };
      }
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }
  // Private methods
  generateId() {
    return `llm_config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  setLoading(loading) {
    this.store.update((state) => ({ ...state, isLoading: loading }));
  }
  setError(error) {
    this.store.update((state) => ({ ...state, error }));
  }
  clearError() {
    this.setError(null);
  }
  getCurrentState() {
    let currentState;
    this.store.subscribe((state) => currentState = state)();
    return currentState;
  }
  async saveToStorage() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    try {
      const state = this.getCurrentState();
      localStorage.setItem("llm-configs", JSON.stringify({
        configs: state.configs,
        activeConfigId: state.activeConfigId
      }));
    } catch (error) {
      console.warn("Failed to save LLM configurations to localStorage:", error);
    }
  }
  loadFromStorage() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    try {
      const stored = localStorage.getItem("llm-configs");
      if (stored) {
        const data = JSON.parse(stored);
        const configs = (data.configs || []).map((config) => {
          const createdAt = config.createdAt ? new Date(config.createdAt) : /* @__PURE__ */ new Date();
          const updatedAt = config.updatedAt ? new Date(config.updatedAt) : /* @__PURE__ */ new Date();
          return {
            ...config,
            createdAt: isNaN(createdAt.getTime()) ? /* @__PURE__ */ new Date() : createdAt,
            updatedAt: isNaN(updatedAt.getTime()) ? /* @__PURE__ */ new Date() : updatedAt
          };
        });
        this.store.update((state) => ({
          ...state,
          configs,
          activeConfigId: data.activeConfigId || null
        }));
      }
    } catch (error) {
      console.warn("Failed to load LLM configurations from localStorage:", error);
    }
  }
}
const llmConfigStore = new LlmConfigStore();
LlmConfigSelector[FILENAME] = "src/lib/components/llm-config/LlmConfigSelector.svelte";
function LlmConfigSelector($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let placeholder = fallback($$props["placeholder"], "Select LLM Configuration");
      let showCreateButton = fallback($$props["showCreateButton"], true);
      let showManageButton = fallback($$props["showManageButton"], true);
      let disabled = fallback($$props["disabled"], false);
      let configs = store_get($$store_subs ??= {}, "$llmConfigStore", llmConfigStore).configs;
      llmConfigStore.configs.subscribe((value) => {
        configs = value;
      });
      let activeConfig;
      llmConfigStore.activeConfig.subscribe((config) => {
        activeConfig = config;
      });
      let dropdownOpen = false;
      function getProviderDisplayName(provider) {
        return PROVIDER_REGISTRY[provider]?.displayName || provider;
      }
      function getProviderBadgeColor(provider) {
        const colors = {
          "azure-openai": "primary",
          "aws-bedrock": "warning",
          "openai": "success",
          "anthropic": "info"
        };
        return colors[provider] || "secondary";
      }
      $$renderer2.push(`<div class="d-flex gap-2 align-items-center">`);
      push_element($$renderer2, "div", 62, 0);
      $$renderer2.push(`<div class="flex-grow-1">`);
      push_element($$renderer2, "div", 63, 4);
      Dropdown($$renderer2, {
        isOpen: dropdownOpen && !disabled,
        toggle: () => !disabled && (dropdownOpen = !dropdownOpen),
        children: prevent_snippet_stringification(($$renderer3) => {
          DropdownToggle($$renderer3, {
            caret: true,
            color: "outline-secondary",
            class: "dropdown-toggle-custom",
            disabled,
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="dropdown-content svelte-18xkvqh">`);
              push_element($$renderer4, "div", 74, 16);
              if (activeConfig) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="config-display svelte-18xkvqh">`);
                push_element($$renderer4, "div", 76, 24);
                $$renderer4.push(`<div class="config-name svelte-18xkvqh">`);
                push_element($$renderer4, "div", 77, 28);
                $$renderer4.push(`${escape_html(activeConfig.name)}</div>`);
                pop_element();
                $$renderer4.push(` <div class="config-meta svelte-18xkvqh">`);
                push_element($$renderer4, "div", 78, 28);
                Badge($$renderer4, {
                  color: getProviderBadgeColor(activeConfig.provider),
                  class: "provider-badge",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(getProviderDisplayName(activeConfig.provider))}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                if (activeConfig.config?.model) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<small class="text-muted model-text">`);
                  push_element($$renderer4, "small", 83, 36);
                  $$renderer4.push(`${escape_html(activeConfig.config.model)}</small>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<span class="text-muted">`);
                push_element($$renderer4, "span", 88, 24);
                $$renderer4.push(`${escape_html(placeholder)}</span>`);
                pop_element();
              }
              $$renderer4.push(`<!--]--></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          DropdownMenu($$renderer3, {
            style: "width: 100%; max-height: 300px; overflow-y: auto;",
            children: prevent_snippet_stringification(($$renderer4) => {
              if (configs.length === 0) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="dropdown-item-text">`);
                push_element($$renderer4, "div", 95, 20);
                $$renderer4.push(`<div class="text-center py-3">`);
                push_element($$renderer4, "div", 96, 24);
                $$renderer4.push(`<div class="text-muted mb-2">`);
                push_element($$renderer4, "div", 97, 28);
                $$renderer4.push(`No configurations available</div>`);
                pop_element();
                $$renderer4.push(` `);
                if (showCreateButton) {
                  $$renderer4.push("<!--[-->");
                  Button($$renderer4, {
                    color: "primary",
                    size: "sm",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<!---->Create Configuration`);
                    }),
                    $$slots: { default: true }
                  });
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<!--[-->`);
                const each_array = ensure_array_like(configs);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let config = each_array[$$index];
                  DropdownItem($$renderer4, {
                    active: activeConfig?.id === config.id,
                    children: prevent_snippet_stringification(($$renderer5) => {
                      $$renderer5.push(`<div class="d-flex align-items-center justify-content-between">`);
                      push_element($$renderer5, "div", 115, 28);
                      $$renderer5.push(`<div>`);
                      push_element($$renderer5, "div", 116, 32);
                      $$renderer5.push(`<div class="d-flex align-items-center">`);
                      push_element($$renderer5, "div", 117, 36);
                      $$renderer5.push(`<strong class="me-2">`);
                      push_element($$renderer5, "strong", 118, 40);
                      $$renderer5.push(`${escape_html(config.name)}</strong>`);
                      pop_element();
                      $$renderer5.push(` `);
                      Badge($$renderer5, {
                        color: getProviderBadgeColor(config.provider),
                        children: prevent_snippet_stringification(($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(getProviderDisplayName(config.provider))}`);
                        }),
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div>`);
                      pop_element();
                      $$renderer5.push(` `);
                      if (config.config?.model) {
                        $$renderer5.push("<!--[-->");
                        $$renderer5.push(`<small class="text-muted d-block mt-1">`);
                        push_element($$renderer5, "small", 124, 40);
                        $$renderer5.push(`Model: ${escape_html(config.config.model)}</small>`);
                        pop_element();
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--></div>`);
                      pop_element();
                      $$renderer5.push(` `);
                      if (activeConfig?.id === config.id) {
                        $$renderer5.push("<!--[-->");
                        Badge($$renderer5, {
                          color: "success",
                          class: "badge-sm",
                          children: prevent_snippet_stringification(($$renderer6) => {
                            $$renderer6.push(`<!---->Default`);
                          }),
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[!-->");
                      }
                      $$renderer5.push(`<!--]--></div>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                }
                $$renderer4.push(`<!--]--> `);
                if (showCreateButton || showManageButton) {
                  $$renderer4.push("<!--[-->");
                  DropdownItem($$renderer4, { divider: true });
                  $$renderer4.push(`<!----> <div class="dropdown-item-text">`);
                  push_element($$renderer4, "div", 139, 24);
                  $$renderer4.push(`<div class="d-flex gap-2 px-1 py-1">`);
                  push_element($$renderer4, "div", 140, 28);
                  if (showCreateButton) {
                    $$renderer4.push("<!--[-->");
                    Button($$renderer4, {
                      color: "primary",
                      size: "sm",
                      outline: true,
                      children: prevent_snippet_stringification(($$renderer5) => {
                        $$renderer5.push(`<!---->+ Create New`);
                      }),
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--> `);
                  if (showManageButton) {
                    $$renderer4.push("<!--[-->");
                    Button($$renderer4, {
                      color: "secondary",
                      size: "sm",
                      outline: true,
                      children: prevent_snippet_stringification(($$renderer5) => {
                        $$renderer5.push(`<!---->Manage`);
                      }),
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--></div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if ($$store_subs) unsubscribe_stores($$store_subs);
      bind_props($$props, { placeholder, showCreateButton, showManageButton, disabled });
    },
    LlmConfigSelector
  );
}
LlmConfigSelector.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  LlmConfigSelector as L,
  llmConfigStore as l
};
