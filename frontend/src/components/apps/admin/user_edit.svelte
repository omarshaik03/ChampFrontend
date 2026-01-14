<script lang="ts">	import '../../../app.css';
	import { Button, Input, Label, Modal, } from '@sveltestrap/sveltestrap';
	import { toasts } from '../../../lib/stores/toastStore';
	import type { User as UserType} from '../../../lib/stores/userStore';
	
	export let open: boolean = false; // modal control
	export let data: UserType;
	export let user: any;

	//export let data;
	let message = "";
	let email: string;
    let password: string;
    let firstName: string;
    let lastName: string;
	let tokens_used: string;
	let tokens_allocated: string;
	let group_id: string;
	let employee_id: string;
	let permission: string | string[];
	let edit_url = data.url_base + "/edit_user";
	let reset_url = data.url_base + "/reset_password";
	let users: any[] = [];

	function init(form: HTMLFormElement) {
		if (user?.name) [user.first_name, user.last_name] = user.name.split(' ');
		for (const key in user) {
			// console.log(key, data[key]);
			const el = form.elements.namedItem(key) as RadioNodeList;
			if (el) el.value = user[key];
		}
	}
	const updateUserInState = (updatedUser: { user_id: any; }) => {
    users = users.map(user => user.id === updatedUser.user_id ? { ...user, ...updatedUser } : user);
  	};

	// async function edit_user() {
	// 	const formData = new FormData();
	// 	formData.append('email', email);
	// 	formData.append('first_name', firstName);
	// 	formData.append('last_name', lastName);
	// 	//formData.append('password', password);
	// 	formData.append('user_id', user.id);
	// 	formData.append('employee_id', employee_id);
	// 	formData.append('group_id', group_id);
	// 	formData.append('tokens_allocated', tokens_allocated);
	// 	formData.append('tokens_used', tokens_used);
	// 	// if (typeof permission === 'string') {
	// 	// permission = [permission];
	// 	// }

	// 	// permission.forEach(perm => {
	// 	// formData.append('permission', perm);
	// 	// });
	// 	// if (!email || !firstName || !lastName ){
	// 	// 	message = "Please fill out all boxes";
	// 	// 	addMessage(message);
	// 	// }
	// 	//  else 
	// 	{
	// 		await fetch(edit_url, {
	// 			method: "POST",
	// 			body: formData,
	// 			headers: {
	// 				"Authorization": `Bearer ${data.token}`
	// 			}
	// 		}).then((response) => {
	// 			if (response.ok) {
	// 				console.log(email);
	// 				console.log(firstName);
	// 				message = "User editted successfully";
	// 				addMessage(message);
	// 				const updatedUser = { 
	// 					user_id: user.id, 
	// 					email, 
	// 					first_name: firstName, 
	// 					last_name: lastName,
	// 					employee_id,
	// 					group_id,
	// 					tokens_allocated,
	// 					tokens_used
	// 				};
	// 				updateUserInState(updatedUser);
	// 				open = false;
	// 				return response.json();
	// 			} else {
	// 				throw new Error("Something went wrong");
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error:", error);
	// 		});
	// 	}
	// };
	console.log(user.id);
	async function reset_password () {
		console.log(data.url_base)
		await fetch(data.url_base + `/reset_password`, {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + data.token,
			},
			body: JSON.stringify({user_id: user.id})

		}).then((response) => {
				if (response.ok) {
					message = "Password reset successfully";
					toasts.push({ message, color: 'success', header: 'Password Reset' });
					alert(message);
					return response.json();
				} else {
					throw new Error("Something went wrong");
				}
			})
	};
	async function edit_user() {
    const userData = {
        email,
        first_name: firstName,
        last_name: lastName,
        user_id: user.id,
        employee_id,
        group_id,
        tokens_allocated,
        tokens_used,
        // permission: Array.isArray(permission) ? permission : [permission]
    };

    // if (!email || !firstName || !lastName) {
    //     const message = "Please fill out all boxes";
    //     addMessage(message);
    //     return; // Exit early if validation fails
    // }

    try {
        const response = await fetch(edit_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            console.log(email);
            console.log(firstName);
            const message = "User edited successfully";
            toasts.push({ message, color: 'success', header: 'User Updated' });
            const updatedUser = { 
                user_id: user.id, 
                email, 
                first_name: firstName, 
                last_name: lastName,
                employee_id,
                group_id,
                tokens_allocated,
                tokens_used
            };
            updateUserInState(updatedUser);
            open = false;
            return response.json();
        } else {
            throw new Error("Something went wrong");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

</script>
<Modal
	isOpen="{open}"
	on:close={() => open = false}
	title='Edit User'
	size="md"
	class="m-4"
>
	<!-- Modal body -->
	<div class="space-y-6 p-4">
		<form action="#" use:init>
			<div class="grid grid-cols-6 gap-6">
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>First Name</span>
					<Input name="first_name" bind:value="{firstName}" class="border outline-none rounded-md p-2" placeholder="e.g. Bonnie" required />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Last Name</span>
					<Input name="last_name" bind:value="{lastName}" class="border outline-none rounded-md p-2" placeholder="e.g. Green" required />
				</Label>
				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Email</span>
					<Input
						name="email"
						type="email"
						bind:value="{email}"
						class="border outline-none rounded-md p-2"
						placeholder={email || "e.g. bonnie@flowbite.com"}
					/>
				</Label>

				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Employee ID</span>
					<Input
						name="employee_id"
						class="border outline-none rounded-md p-2"
						placeholder={employee_id || 'e.g. 0'}
						bind:value="{employee_id}"
						required
					/>
				</Label>

				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Tokens Used</span>
					<Input
						name="tokens_used"
						class="border outline-none rounded-md p-2"
						bind:value="{tokens_used}"
						placeholder={tokens_used || 'e.g. 0'}
						required
					/>
				</Label>

				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Tokens Allocated</span>
					<Input
						name="tokens_allocated"
						class="border outline-none rounded-md p-2"
						bind:value="{tokens_allocated}"
						placeholder={tokens_allocated || 'e.g. 0'}
						required
					/>
				</Label>

				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Group ID</span>
					<Input
						name="group_id"
						class="border outline-none rounded-md p-2"
						bind:value="{group_id}"
						placeholder={group_id || 'e.g. 0'}
						required
					/>
				</Label>

				<Label class="col-span-6 space-y-2 sm:col-span-3">
					<span>Permissions</span>
					<Input
						name="password"
						class="border outline-none rounded-md p-2"
						bind:value="{permission}"
						placeholder={Array.isArray(permission) ? permission.join(', ') : (permission || 'e.g. 0')}
						required
					/>
				</Label>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div class="flex justify-end space-x-4 p-4">
		<Button color="danger" on:click={() => open = false}>Cancel</Button>
		<Button color="primary" on:click={edit_user}>Save Changes</Button>
		<Button color="secondary" on:click={reset_password}>
			Reset Password
		</Button>
	</div>
</Modal>