<script lang="ts">
    import { Button, Icon } from "@sveltestrap/sveltestrap";
    let settingsTab = false;
</script>

<div class="settings-tab" class:active={settingsTab}>
    <div class="setting-tab-button-parent">
        <div class="settings-tab-button" style="margin-left: 2px;">
            <div>
                <button class="btn btn-secondary tab-button" on:click={()=>{settingsTab=!settingsTab}}><Icon name="gear-fill"/></button>
            </div>
        </div>
    </div>
    <div class="settings-tab-content">
        <slot />
    </div>
</div>

<style>
    .settings-tab {
        position: fixed;
        left: calc(-1 * var(--settings-tab-width));
        top: calc(var(--nav-height) + 50px);
        width: var(--settings-tab-width);
        max-height: calc(100% - var(--nav-height) - var(--bottom-div-height));
        min-height: 50px;
        box-sizing: border-box;
        border: 1px solid black;
        border-radius: 0px 10px 10px 0px;
        transition: left 0.5s;
        background-color: white;
        z-index: 5;
    }
    .settings-tab.active {
        left: 0;
    }
    .setting-tab-button-parent {
        position: absolute;
    }
    .settings-tab-button {
        display: flex;
        justify-content: start;
        position: relative;
        width: 50px;
        height: 50px;
        left: calc(var(--settings-tab-width));
        top: 5px;
        box-sizing: border-box;
        cursor: pointer;
        overflow: hidden;
    }
    .settings-tab-content {
        width: 100%;
        height: 100%;
        padding: 10px;
        overflow-y: scroll;
    }
    .tab-button {
        background-color: rgba(100, 100, 100, 0.5);
        border: none;
    }

    :root {
        --settings-tab-width: 300px;
    }
</style>