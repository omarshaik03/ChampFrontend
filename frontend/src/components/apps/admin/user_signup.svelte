<script lang="ts">
	import '../../../app.css';
	import { Button, Input, Label, Modal } from '@sveltestrap/sveltestrap';
	import { toasts } from '../../../lib/stores/toastStore';
	import type { User } from '../../../lib/stores/userStore';
	import ToastNotifications from '../../common/ToastNotifications.svelte';

	export let open: boolean = false; // modal control
	export let user: User;

	//export let data;
	let message = "";
	let email: string;
    let password: string;
    let firstName: string;
    let lastName: string;
	let employeeID: string;
	let groupID: string;
	let url = user.url_base + "/signup";
	console.log(url)

	async function signUp() {
		const formData = new FormData();		formData.append('email', email);
		formData.append('name', firstName + " " + lastName);
		formData.append('password', password);
		formData.append('employeeID', employeeID);
		// formData.append('groupID', groupID);
		
		if (!email || !password || !firstName || !lastName ) {
			message = "Please fill out all boxes";
			toasts.push({ message, color: 'warning' });
		} else {
			await fetch(url, {
				method: "POST",
				body: formData,
			}).then((response) => {
				if (response.ok) {
					message = "User added successfully";
					toasts.push({ message, color: 'success' });
					return response.json();
				} else {
					message = "User already in database: Cannot add duplicate user!"
					toasts.push({ message, color: 'danger' });
					throw new Error("Something went wrong");
				}
			}).then((response_json) => {
				if (response_json) {
					user.token = response_json.access_token;
					
				} else {
					throw new Error("Something went wrong");
				}
			}).catch((error) => {
				console.error("Error:", error);
			});
		}
    };
</script>

{#if user}
	<ToastNotifications position="top-right" maxToasts={5} />
	<Modal
		isOpen="{open}"
		on:close={() => open = false}
		title='Add New User'
		size="md"
		class="m-4"
	>
		<!-- Modal body -->
		<div class="space-y-6 p-4">
			<form action="#">
				<div class="grid grid-cols-6 gap-6">
					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>First Name</span>
						<Input name="first_name" bind:value="{firstName}" class="border outline-none" placeholder="e.g. Bonnie" required />
					</Label>
					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>Last Name</span>
						<Input name="last_name" bind:value="{lastName}" class="border outline-none" placeholder="e.g. Green" required />
					</Label>
					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>Email</span>
						<Input
							name="email"
							type="email"
							bind:value="{email}"
							class="border outline-none"
							placeholder="e.g. bonnie@flowbite.com"
						/>
					</Label>
					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>Tokens Used</span>
						<Input
							name="Tokens Used"
							class="border outline-none"
							placeholder={user.tokens_left ? String(user.tokens_left) : 'e.g. 0'}
							required
						/>
					</Label>

					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>Tokens Allocated</span>
						<Input
							name="Tokens Allocated"
							class="border outline-none"
							placeholder={user.tokens_allocated ? String(user.tokens_allocated) : 'e.g. 0'}
							required
						/>
					</Label>
					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>Password</span>
						<Input
							name="Password"
							class="border outline-none"
							bind:value="{password}"
							placeholder="Password"
							required
						/>
					</Label>
					<Label class="col-span-6 space-y-2 sm:col-span-3">
						<span>Employee ID</span>
						<Input
							name="Employee ID"
							class="border outline-none"
							bind:value="{employeeID}"
							placeholder={'optional'}
							required
						/>
					</Label>
				</div>
			</form>
		</div>

		<!-- Modal footer -->
		<div class="flex justify-end space-x-4 p-4 border-t">
			<Button color="secondary" on:click={() => open = false}>Cancel</Button>
			<Button type="submit" color="primary" on:click={signUp}>Add User</Button>
		</div>
	</Modal>
{:else}
	<p>Loading...</p>
{/if}