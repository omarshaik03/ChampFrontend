<script lang='ts'>
	import { goto } from "$app/navigation";
	import { Button, Icon, Input } from "@sveltestrap/sveltestrap";
	import { get_user_data } from "$lib/auth";
	import { userStore } from '../../lib/stores/userStore';
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import runtimeConfig from '$lib/runtime-config';

	const url_base = runtimeConfig.API_BASE_URL;
	if (!url_base) {
		throw new Error("Missing API_BASE_URL in runtime config");
	}

    let email = ""; 
    let password ="";
	let message = "";
	let errors = false; 
// Initialize returnPath to the default value

	let returnPath = "/";

	onMount(() => {
		if (browser) {
			// Get the stored return path when component mounts
			const storedPath = sessionStorage.getItem("returnTo");
			if (storedPath) {
				returnPath = storedPath;
			}
		}
	});

	async function login(email: string, password: string) {
		errors = false;
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);

		const token = await fetch(`${url_base}/login`, {
			method: "POST",
			body: formData,
		}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Something went wrong");
			}
		}).then((response_json) => {
			if (response_json) {
				if (response_json.login) {
					const token = response_json.access_token;
					// Set the token in cookie
					document.cookie = `access_token=${token}; path=/; max-age=86400`;
					return token;
				} else {
					throw new Error("Something went wrong");
				}
			} else {
				throw new Error("Something went wrong");
			}
		}).catch((error) => {
			console.error("Error:", error);
            message = "Wrong email or password. Please check your credentials and try again.";
			alert(message);
            errors = true;
		});

		if (!token) {
			return;
		}

		// Fetch user data using the token
		await get_user_data(token, url_base)
		.then((response) => {
			if (response) {
				const userObject = {
					id: response.id,
					name: response.name,
					email: response.email,
					url_base: url_base,
					token: token,
					allowed_apps: response.allowed_apps,
					tokens_left: response.tokens_left,
					tokens_allocated: response.tokens_allocated,
				};				// Set the user in the store
				userStore.set(userObject);
				
				// Navigate back to the original page the user was trying to access
				// Clear the returnTo from session storage
				const navigateTo = returnPath || "/";
				sessionStorage.removeItem("returnTo");
				goto(navigateTo);
			}
		}).catch((error) => {
			console.error("Error:", error);
			message = "Received a token but unable to fetch user data. Please contact support.";
			errors = true;
		});
	}
</script>

<div style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px; padding-top:50px">
    <a href="/">
        <img src="/images/Cognizant_logo_2022.png" alt="Cognizant Logo" width="700" height="130">
    </a>
</div>

<div style="text-align: center; margin-bottom: 20px; padding-top:50px;">
    <h1 class="text-4xl font-bold">Welcome to the AI Marketplace</h1>
    <p>Please enter your username and password to log in.</p>
</div>

<div style="text-align: center; margin-bottom: 15px; width: 20%; margin: auto">
    <Input type="email" placeholder="Email" style="margin-bottom: 15px;" bind:value={email} /> 
    <Input type="password" placeholder="Password" style="margin-bottom: 15px;" bind:value={password} /> 
</div>

<div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
    <Input type="checkbox" label="Remember Me" />
</div>

<div style="text-align: center; margin-bottom: 20px;">
    <Button on:click="{() => login(email, password)}" color="primary">Log In</Button>
</div>

<p style="text-align: center; margin-bottom: 15px;">Need to create an Account?</p>

<div style="text-align: center; margin-bottom: 20px;">
	<a href="/auth/signup">
		<Button  color="primary">Register</Button>
	</a>
</div>

<div style="padding-top:123px;">
	<p style="text-align: center; margin: 10px; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
		<Icon name="exclamation-triangle" /> 
		<b>Disclaimer:</b>
		This portal is intended solely for use in conversion-related activities. Users are strictly prohibited from uploading, processing, or sharing any Personal Health Information (PHI), sensitive personal data, or any non-approved code through this platform. Any unauthorized use of this portal, including the submission of non-conversion-related materials, is prohibited and may result in disciplinary action, including termination of access. By using this portal, you agree to comply with these terms and acknowledge that any violation may be subject to applicable legal or regulatory consequences.
	</p>
</div>
