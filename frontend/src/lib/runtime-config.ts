// Accessor for runtime config injected via public/config.template.js -> /config.js
// Falls back to build-time Vite env variables if placeholders remain.

interface AppRuntimeConfig {
  API_BASE_URL?: string;
  AI_AGENTIC_URL?: string;
  CODE_CONVERSION_URL?: string;
  CODE_INSIGHTS_URL?: string;
  DOC_INSIGHTS_URL?: string;
  CODE_REVIEW_URL?: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppRuntimeConfig;
  }
}

function isPlaceholder(v: string | undefined) {
  return !v || /__.*__/.test(v);
}

const appConfig: AppRuntimeConfig = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};

function pick(key: keyof AppRuntimeConfig, viteValue: string): string {
  const v = appConfig[key];
  if (typeof v === 'string' && !isPlaceholder(v)) return v;
  return viteValue;
}

export const runtimeConfig: Required<AppRuntimeConfig> = {
  API_BASE_URL: pick('API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  AI_AGENTIC_URL: pick('AI_AGENTIC_URL', import.meta.env.VITE_AI_AGENTIC_URL),
  CODE_CONVERSION_URL: pick('CODE_CONVERSION_URL', import.meta.env.VITE_CODE_CONVERSION_URL),
  DOC_INSIGHTS_URL: pick('DOC_INSIGHTS_URL', import.meta.env.VITE_DOC_INSIGHTS_URL),
  CODE_INSIGHTS_URL: pick('CODE_INSIGHTS_URL', import.meta.env.VITE_CODE_INSIGHTS_URL),
  CODE_REVIEW_URL: pick('CODE_REVIEW_URL', import.meta.env.VITE_CODE_REVIEW_URL),
};

export default runtimeConfig;
