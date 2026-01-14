<script lang="ts">
    import { fade } from 'svelte/transition';

    export let fromLanguage: string = 'Oracle';
    export let toLanguage: string = 'SQL Server';
    export let duration: number = 500;
    export let size: string = '200px';

    let currentLogo = fromLanguage;
    let isTransitioning = false;

    function getLogoPath(language: string): string {
        switch (language) {
            case 'Oracle':
                return '/images/oracle.png';
            case 'SQL Server':
                return '/images/sqlserver.png';
            case 'Sybase':
                return '/images/sybase.png';
            case 'PostgreSQL':
                return '/images/PostgreSQL-Logo.png';
            default:
                return '';
        }
    }

    export function switchLogo() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentLogo = (currentLogo === fromLanguage) ? toLanguage : fromLanguage;
        setTimeout(() => {
            isTransitioning = false;
        }, duration);
    }

    export function autoTransition(intervalMs: number = 2000) {
        const interval = setInterval(() => {
            switchLogo();
        }, intervalMs);
        
        return () => clearInterval(interval);
    }
</script>

<style>
    .logo-container {
        position: relative;
        display: inline-block;
    }
    
    .logo {
        position: absolute;
        top: 0;
        left: 0;
        object-fit: contain;
        border-radius: 8px;
    }
</style>

<div class="logo-container" style="width: {size}; height: {size};">
    {#if currentLogo === fromLanguage}
        <img
            src={getLogoPath(fromLanguage)}
            alt="{fromLanguage} logo"
            class="logo"
            style="width: {size}; height: {size};"
            in:fade={{ duration }}
            out:fade={{ duration }}
        />
    {/if}

    {#if currentLogo === toLanguage}
        <img
            src={getLogoPath(toLanguage)}
            alt="{toLanguage} logo"
            class="logo"
            style="width: {size}; height: {size};"
            in:fade={{ duration }}
            out:fade={{ duration }}
        />
    {/if}
</div>
