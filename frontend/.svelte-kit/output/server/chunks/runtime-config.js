function isPlaceholder(v) {
  return !v || /__.*__/.test(v);
}
const appConfig = typeof window !== "undefined" && window.__APP_CONFIG__ || {};
function pick(key, viteValue) {
  const v = appConfig[key];
  if (typeof v === "string" && !isPlaceholder(v)) return v;
  return viteValue;
}
const runtimeConfig = {
  API_BASE_URL: pick("API_BASE_URL", "https://hpcsiaipoc.azurewebsites.net"),
  AI_AGENTIC_URL: pick("AI_AGENTIC_URL", "https://hpcsiaipoc-agent-dev.azurewebsites.net"),
  CODE_CONVERSION_URL: pick("CODE_CONVERSION_URL", "https://hpcsiaipoc-codeconvert.azurewebsites.net"),
  DOC_INSIGHTS_URL: pick("DOC_INSIGHTS_URL", "https://hpcsiaipoc-document-insights.azurewebsites.net"),
  CODE_INSIGHTS_URL: pick("CODE_INSIGHTS_URL", void 0),
  CODE_REVIEW_URL: pick("CODE_REVIEW_URL", "http://localhost:8004")
};
export {
  runtimeConfig as r
};
