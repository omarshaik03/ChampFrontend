#!/bin/sh
set -e

# (Entry point uses LF line endings; if you see 'no such file', CRLF conversion failed.)

# Destination for generated runtime config.
# For plain Vite: dist
# For SvelteKit preview build: .svelte-kit/output/client
CONFIG_DIR="/app/dist"
if [ -d /app/.svelte-kit/output/client ]; then
  CONFIG_DIR="/app/.svelte-kit/output/client"
fi

TEMPLATE_SRC="/app/public/config.template.js"
OUTPUT_FILE="$CONFIG_DIR/config.js"

if [ -f "$TEMPLATE_SRC" ]; then
  echo "Generating runtime config at $OUTPUT_FILE"
  # Use env vars if set, else keep placeholder
  API_BASE=${API_BASE_URL:-${VITE_API_BASE_URL:-__API_BASE_URL__}}
  AI_AGENTIC=${AI_AGENTIC_URL:-${VITE_AI_AGENTIC_URL:-__AI_AGENTIC_URL__}}
  CODE_CONVERSION=${CODE_CONVERSION_URL:-${VITE_CODE_CONVERSION_URL:-__CODE_CONVERSION_URL__}}
  DOCUMENT_INSIGHTS=${DOCUMENT_INSIGHTS_URL:-${VITE_DOC_INSIGHTS_URL:-${VITE_DOCUMENT_INSIGHTS_URL:-__DOCUMENT_INSIGHTS_URL__}}}
  CODE_INSIGHTS=${CODE_INSIGHTS_URL:-${VITE_CODE_INSIGHTS_URL:-__CODE_INSIGHTS_URL__}}

  mkdir -p "$CONFIG_DIR"
  sed \
    -e "s|__API_BASE_URL__|$API_BASE|g" \
    -e "s|__AI_AGENTIC_URL__|$AI_AGENTIC|g" \
    -e "s|__CODE_CONVERSION_URL__|$CODE_CONVERSION|g" \
    -e "s|__DOCUMENT_INSIGHTS_URL__|$DOCUMENT_INSIGHTS|g" \
    -e "s|__CODE_INSIGHTS_URL__|$CODE_INSIGHTS|g" \
    "$TEMPLATE_SRC" > "$OUTPUT_FILE" || {
      echo "Failed to generate config.js" >&2
      exit 1
    }
else
  echo "Template $TEMPLATE_SRC not found; skipping runtime config generation" >&2
fi

# Report possibly unused environment variables (informational)
echo "Scanning for possibly unused URL env vars..." >&2
USED_KEYS="API_BASE_URL AI_AGENTIC_URL CODE_CONVERSION_URL DOCUMENT_INSIGHTS_URL CODE_INSIGHTS_URL VITE_API_BASE_URL VITE_AI_AGENTIC_URL VITE_CODE_CONVERSION_URL VITE_DOC_INSIGHTS_URL VITE_DOCUMENT_INSIGHTS_URL VITE_CODE_INSIGHTS_URL"

# List env vars ending with _URL or starting with VITE_ and not in USED_KEYS
UNUSED=$( \
  env | while IFS='=' read -r NAME VALUE; do
    case "$NAME" in
      *URL|VITE_*|TEST)
        FOUND=0
        for k in $USED_KEYS; do
          [ "$NAME" = "$k" ] && FOUND=1 && break
        done
        [ $FOUND -eq 0 ] && echo "$NAME"
        ;;
    esac
  done | sort -u
)

if [ -n "$UNUSED" ]; then
  echo "Warning: The following env vars are not used by runtime config generation:" >&2
  echo "$UNUSED" >&2
  echo "(If any should be injected, update config.template.js and entrypoint.)" >&2
fi

exec "$@"
