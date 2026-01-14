<script lang="ts">	import { goto } from "$app/navigation";
    import { Input, Button, Icon } from "@sveltestrap/sveltestrap";
	import { toasts } from "../../lib/stores/toastStore";
	import { get_user_data } from "$lib/auth";
	import { userStore } from "../../lib/stores/userStore";

	const url = import.meta.env.VITE_DEV_URL + "/signup";

    let email: string;
    let password: string;
    let firstName: string;
    let lastName: string;
    let confirmation: string;
	let message = "";

    async function signUp() {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('name', firstName + " " + lastName);
		formData.append('password', password);		if (!email || !password || !firstName || !lastName ){
			message = "Please fill out all boxes";
			toasts.push({ message, color: 'warning', header: 'Notice' });
		} else if (password != confirmation) {
			message = "Please make sure passwords match";
			toasts.push({ message, color: 'warning', header: 'Notice' });
		} else {
			const token = await fetch(url, {
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
					const token = response_json.access_token;
					// Set the token in cookie
					document.cookie = `access_token=${token}; path=/; max-age=86400`;
					return token;
				} else {
					throw new Error("Something went wrong");
				}
			}).catch((error) => {
				console.error("Error:", error);
			});

			await get_user_data(token, url)
			.then((response) => {
				if (response) {
					const userObject = {
						id: response.id,
						name: response.name,
						email: response.email,
						url_base: url,
						token: token,
						allowed_apps: response.allowed_apps,
						tokens_left: response.tokens_left,
						tokens_allocated: response.tokens_allocated,
					};
					// Set the user in the store
					userStore.set(userObject);
					goto("/");
				}
			}).catch((error) => {
				console.error("Error:", error);
				message = "Received a token but unable to fetch user data. Please contact support.";
			});
		}
    };
</script>

<div style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px; padding-top:50px">
    <a href="/">
        <img src="/images/Cognizant_logo_2022.png" alt="Cognizant Logo" width="700" height="130">
    </a>
</div>

<div style="text-align: center; margin-bottom: 20px; padding-top:50px;">
    <h1>Create Your Account</h1>
    <p>Please enter your details to sign up.</p>
</div>

<div style="text-align: center; margin-bottom: 15px; width: 20%; margin: auto">
    <Input type="text" placeholder="First Name" style="margin-bottom: 15px;" bind:value="{firstName}" /> 
    <Input type="text" placeholder="Last Name" style="margin-bottom: 15px;" bind:value="{lastName}" /> 
    <Input type="email" placeholder="Email" style="margin-bottom: 15px;" bind:value={email} /> 
    <Input type="password" placeholder="Password" style="margin-bottom: 15px;" bind:value={password} /> 
    <Input type="password" placeholder="Confirm your Password" style="margin-bottom: 15px;" bind:value="{confirmation}" /> 
</div>

<div style="text-align: center; margin-bottom: 20px;">
    <Button on:click={signUp} color="primary">Register your Account</Button>
</div>

<p style="text-align: center; margin-bottom: 15px;">Already have an Account?</p>

<div style="text-align: center; margin-bottom: 20px;">
	<a href="/auth/login">
		<Button color="primary">Login</Button>
	</a>
</div>

<div style="padding-top:10px;">
	<p style="text-align: center; margin: 10px; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
		<Icon name="exclamation-triangle" /> 
		<b>Disclaimer:</b>
		This portal is intended solely for use in conversion-related activities. Users are strictly prohibited from uploading, processing, or sharing any Personal Health Information (PHI), sensitive personal data, or any non-approved code through this platform. Any unauthorized use of this portal, including the submission of non-conversion-related materials, is prohibited and may result in disciplinary action, including termination of access. By using this portal, you agree to comply with these terms and acknowledge that any violation may be subject to applicable legal or regulatory consequences.
	</p>
</div>
