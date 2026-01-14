<script lang="ts">
    // diff-match-patch error ignored because it is not a module
    // @ts-ignore
    import DiffMatchPatch from "diff-match-patch";

    export const data = {};
    export let inputText = "";
    export let outputText = "";
    export let view: "input" | "output" | "diff" = "diff";

    let dmp = new DiffMatchPatch();
    let diff = dmp.diff_main(inputText, outputText);
    dmp.diff_cleanupSemantic(diff);

    let diffHtml = dmp.diff_prettyHtml(diff);
    console.log(diff);
</script>

<div class="row flex-nowrap">
    {#if view === "input"}
        <div class="col">
            <h2>Input</h2>
            <pre>{inputText}</pre>
        </div>
    {/if}

    {#if view === "output"}
        <div class="col">
            <h2>Output</h2>
            <pre>{outputText}</pre>
        </div>
    {/if}

    {#if view === "diff"}
        <div class="col">
            <h2>Diff</h2>
            <div class="diff" style="white-space: pre-wrap;">
                {@html diffHtml}
            </div>
        </div>
    {/if}
</div>