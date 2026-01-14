<script lang="ts">
	import type { Llm } from '$lib/commontypes';
    import { Button, Icon } from '@sveltestrap/sveltestrap';

    export let url_base: undefined | string;
    export let token: undefined | string;

    export let llm: Llm;
    export let sqlDialect: undefined | string = undefined;
    export let username: undefined | string = undefined;
    export let password: undefined | string = undefined;
    export let host: undefined | string = undefined;
    export let driver: undefined | string = undefined;
    export let port: undefined | string = undefined;
    export let database: undefined | string = undefined;
    export let poolRecycle: undefined | string = undefined;

    export let loggedIn = false;

    // More dialect and driver options can be added here
    // Drivers must be installed in the backend
    let dialectAndDriverOptions: { [key: string]: string[] } = {
        "mysql": ["pymysql"],
        "mssql": ["pymssql"],
    }

    let errors = false;
    let message = "";

    async function login() {
        let response = await fetch(`${url_base}/api/database-insights/create-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "dialect": sqlDialect,
                "username": username,
                "password": password,
                "host": host,
                "driver": driver,
                "port": port,
                "database": database,
                "pool_recycle": poolRecycle,
                "llm": llm,
            })
        })
        .then(response => response.json())
        .then(data => {
            loggedIn = true;
            console.log(data);
            return data;
        })
        .catch((error) => {
            errors = true;
            message = error;
        });
    }
</script>

<div style="display: flex; justify-content: center; align-items: center; height: 70vh; padding: 20px;">
    <div style="width: 50%; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <!-- Username Input -->
        <input
            class="form-field"
            bind:value={username}
            type="text"
            placeholder="Username"
        />

        <!-- Password Input -->
        <input
            class="form-field"
            bind:value={password}
            type="password"
            placeholder="Password"
        />

        <!-- Dialect Dropdown -->
        <select class="form-field" bind:value={sqlDialect} on:change={() => {
            if (sqlDialect) {
                driver = dialectAndDriverOptions[sqlDialect][0]
            }
        }}>
            <option value="" disabled selected>Select Dialect</option>
            {#each Object.keys(dialectAndDriverOptions) as dialect}
                <option value={dialect}>{dialect.toUpperCase()}</option>
            {/each}
        </select>

        <!-- Driver Dropdown -->
        <select class="form-field" bind:value={driver} disabled={!sqlDialect}>
            <option value="" disabled selected>Select Driver</option>
            {#if sqlDialect}
                {#each dialectAndDriverOptions[sqlDialect] as driverOption}
                    <option value={driverOption}>{driverOption.toUpperCase()}</option>
                {/each}
            {/if}
        </select>

        <!-- Host Input -->
        <input
            class="form-field"
            bind:value={host}
            type="text"
            placeholder="Host"
        />

        <!-- Port Input -->
        <input
            class="form-field"
            bind:value={port}
            type="text"
            placeholder="Port (Optional)"
        />

        <!-- Database Input -->
        <input
            class="form-field"
            bind:value={database}
            type="text"
            placeholder="Database"
        />

        <!-- Pool Recycle Input (Optional) -->
        <input
            class="form-field"
            bind:value={poolRecycle}
            type="text"
            placeholder="Pool Recycle (Optional)"
        />

        <!-- Submit Button -->
        <Button
            on:click={login}
            style="
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 5px;
                background-color: #4d4dff;
                color: #fff; cursor: pointer;
                transition: background-color 0.3s ease;"
        >
            Login
        </Button>
    </div>
</div>

{#if errors}
<p style="color: red; text-align: center">
    <Icon name="exclamation-circle-fill" /> {message}
</p>
{/if}

<style>
	.form-field {
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px;
		box-sizing: border-box;
		margin-bottom: 10px;
	}
</style>