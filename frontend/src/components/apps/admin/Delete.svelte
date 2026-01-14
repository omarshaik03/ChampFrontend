<script lang="ts">
	import '../../../app.css';
	import { Button, Modal } from '@sveltestrap/sveltestrap';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	export let open: boolean = false; // modal control
	import type { User as UserType} from '../../../lib/stores/userStore';
	export let data: UserType;
	export let user_id: number;
	export let user_name: string;


	
	async function deleteUser() {
		console.log(data.url_base)
		if(!user_id) {
			console.log("No user ID")
			return
		}

		await fetch(data.url_base + `/delete`, {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + data.token,
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
				user_id: user_id,
			}),
		}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Something went wrong");
			}
		})
	};
</script>
<Modal isOpen="{open}" on:close={() => open = false} size="sm" class="rounded-lg shadow-lg">
	<div class="p-6">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-red-600" />

		<h3 class="mb-4 text-center text-xl font-semibold text-gray-700 dark:text-gray-300">
			Confirm Deletion
		</h3>
		<p class="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
			Are you sure you want to delete the user <span class="font-bold">{user_name}</span>? This action cannot be undone.
		</p>

		<div class="flex justify-end space-x-4 p-4">
			<Button color="secondary" class="px-6 py-2" on:click={() => (open = false)}>No, Cancel</Button>
			<Button color="danger" class="px-6 py-2" on:click={() => { deleteUser(); open = false; 	console.log(data.url_base); }}>Yes, Delete</Button>
		</div>
	</div>
</Modal>