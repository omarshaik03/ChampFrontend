<script lang="ts">
    import { marked } from 'marked';

    export let showVerbose = false;
    export let streamEvents: any[] = [];
    export let agentOutput: string = '';
    export let agentStreaming = false;
    export let waitingForResume = false;
    export let scrollEl: HTMLPreElement | null = null;

    function sanitizeOutput(text: string): string {
        if (!text) return '';

        try {
            return text
                .replace(/\uFFFD/g, '?')
                .replace(/\0/g, '')
                .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
                .normalize('NFC');
        } catch (error) {
            console.warn('Error sanitizing output:', error);
            return text.replace(/[^\x20-\x7E\n\r\t]/g, '?');
        }
    }

    function formatAgentOutput(output: string): string {
        if (!output) return 'No output yet...';

        try {
            const sanitized = sanitizeOutput(output);

            let formatted = sanitized
                .replace(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/g, '\n**$1**')
                .replace(/(Step \d+|Phase \d+)/gi, '\n### $1')
                .replace(/\[SESSION_START\]/g, '🚀')
                .replace(/\[INTERRUPT\]/g, '⏸️')
                .replace(/\[SUCCESS\]/g, '✅')
                .replace(/\[ERROR\]/g, '❌')
                .replace(/\[RESUME\]/g, '�')
                .replace(/(\[Error\]|\[ERROR\])/gi, '\n🚨 **$1**')
                .replace(/(\[Success\]|\[SUCCESS\])/gi, '\n✅ **$1**')
                .replace(/(\[Info\]|\[INFO\])/gi, '\n💡 **$1**')
                .replace(/(\[Warning\]|\[WARNING\]|\[Warn\]|\[WARN\])/gi, '\n⚠️ **$1**')
                .replace(/(\{[\s\S]*?\})/g, (match) => {
                    try {
                        JSON.parse(match);
                        return `\n\`\`\`json\n${match}\n\`\`\`\n`;
                    } catch {
                        return `\n\`${match}\`\n`;
                    }
                })
                .replace(/\n{3,}/g, '\n\n');

            return formatted.trim();
        } catch (error) {
            console.warn('Error formatting agent output:', error);
            return sanitizeOutput(output) || 'Error displaying output';
        }
    }
</script>

<div class="console-container">
    <pre class="console-output p-3" bind:this={scrollEl}>{#if showVerbose}<code class="json-output">{JSON.stringify(streamEvents, null, 2)}</code>{:else}<div class="formatted-output">{@html marked.parse(formatAgentOutput(agentOutput || ''))}</div>{/if}{#if agentStreaming}<span class="blinking-cursor">▊</span>{/if}</pre>

    {#if waitingForResume}
        <div class="resume-indicator p-2 text-center bg-warning">
            <small class="text-dark">
                <i class="bi bi-pause-circle-fill me-1"></i>
                Agent paused - waiting for user input
            </small>
        </div>
    {/if}
</div>

<style>
    .console-container {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e5e5;
    }

    .console-output {
        font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
        background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
        color: #e0e0e0;
        margin: 0;
        min-height: 120px;
        max-height: 400px;
        overflow-y: auto;
        line-height: 1.5;
        font-size: 0.9em;
        border: none;
        position: relative;
        scrollbar-width: thin;
        scrollbar-color: #555 #2d2d2d;
    }

    .console-output::-webkit-scrollbar {
        width: 8px;
    }

    .console-output::-webkit-scrollbar-track {
        background: #2d2d2d;
    }

    .console-output::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 4px;
    }

    .console-output::-webkit-scrollbar-thumb:hover {
        background: #666;
    }

    .formatted-output {
        color: #e0e0e0;
    }

    .formatted-output :global(h1),
    .formatted-output :global(h2),
    .formatted-output :global(h3) {
        color: #4fc3f7;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    .formatted-output :global(strong) {
        color: #81c784;
        font-weight: 600;
    }

    .formatted-output :global(code) {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 4px;
        border-radius: 3px;
        color: #ffab40;
        font-size: 0.85em;
    }

    .formatted-output :global(pre) {
        background: rgba(0, 0, 0, 0.3);
        padding: 12px;
        border-radius: 6px;
        border-left: 3px solid #4fc3f7;
        margin: 8px 0;
        overflow-x: auto;
    }

    .formatted-output :global(p) {
        margin-bottom: 0.5rem;
        line-height: 1.6;
    }

    .json-output {
        color: #a5d6ff;
        font-size: 0.85em;
        white-space: pre-wrap;
    }

    .resume-indicator {
        border-top: 1px solid #ffc107;
        animation: pulse-warning 2s infinite;
    }

    .blinking-cursor {
        color: #4fc3f7;
        animation: blink 1s steps(2, start) infinite;
        font-weight: bold;
        margin-left: 2px;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }

    @keyframes pulse-warning {
        0%, 100% { background-color: #fff3cd; }
        50% { background-color: #ffeaa7; }
    }
</style>
