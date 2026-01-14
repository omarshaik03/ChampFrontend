<!-- <script lang="ts">
	import '../../../app.css';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Checkbox,
		Heading,
		Input,
		Pagination,
		PaginationItem,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toolbar,
		ToolbarButton,
		ToolbarGroup
	} from 'flowbite-svelte';
    import { onMount } from "svelte";
	import { CogSolid, DotsVerticalOutline, DownloadSolid } from 'flowbite-svelte-icons';
	import {
		ArrowLeftOutline,
		ArrowRightOutline,
		EditOutline,
		ExclamationCircleSolid,
		PlusOutline,
		TrashBinSolid
	} from 'flowbite-svelte-icons';	import User from './user_edit.svelte';
	import Delete from './Delete.svelte';
	import SignUp from './user_signup.svelte';
	import { toasts } from '../../../lib/stores/toastStore';
	import Export from './export.svelte';
	import type { User as UserType } from '../../../lib/stores/userStore';
	import {Button, Table } from '@sveltestrap/sveltestrap'

	export let data: UserType;

	let ViewAll = false;
	let openUser: boolean = false; // modal control
	let openDelete: boolean = false; // modal control
	let openSignup: boolean = false; // modal control
    let Users: any[] = [];
	let filteredUsers: any[] = [];
	let selected_user_id: number;
	let selected_user_name: string;
	let message = "";
	let userToSearch = "";
	let row_user = {};
	let openExport: boolean = false;
	let logs: any[] = [];
	let currentPage = 1;
  	let itemsPerPage = 10;
	$: totalPages = Math.ceil(Users.length / itemsPerPage);
  
	$: pages = Array.from({ length: totalPages }, (_, i) => ({
    name: (i + 1).toString(),
    href: `#page-${i + 1}`
  	}));
	// let helper: { start: number, end: number, total: number } = { start: 1, end: 10, total: 0 };
	$: helper = {
    start: ((currentPage - 1) * itemsPerPage) + 1,
    end: Math.min(currentPage * itemsPerPage, Users.length),
    total: Users.length
  	};

	function onPageChange(event: CustomEvent<number>) {
		currentPage = parseInt(event.detail.toString());
		console.log("Page changed to:", currentPage); // Add this to debug
	}
	$: displayedUsers = userToSearch ? 
    filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) :
    Users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	export let filter: [boolean, string] = [false, ''];

	onMount(()=> {
			console.log(data.url_base)
			fetch(data.url_base + '/users', {
			method: "GET",
			headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + data.token,
				},
		}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Something went wrong");
			}
		})
		.then((data_response) => {
			console.log(data_response);
			if (data_response) {
				// window.location.href = "/codeinsights";
				//login_status = true;
				Users = data_response;
				filteredUsers = Users;
				// helper = { start: 1, end: 10, total: Users.length };

				console.log(Users.length);
			} else {
				alert(data_response.status);
			}
		}).catch((error) => {
			console.error("Error:", error);
		});
		});
	
	onMount(()=> {
		fetch(data.url_base + '/logs', {
        method: "GET",
        headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + data.token,
            },
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Something went wrong");
        }
    })
    .then((data_response) => {
        if (data_response) {
            logs = data_response;
			if (filter[0]){
				logs = logs.filter(log => log.user_name === data.email);
				logs.sort((a, b) => {
						return new Date(b.timestamp) - new Date(a.timestamp);
					});
			}
			if (filter[1] !== ""){
					logs = logs.filter(log => log.application === filter[1]);
					logs.sort((a, b) => {
						return new Date(b.timestamp) - new Date(a.timestamp);
					});
				}
        } else {
            alert(data_response.status);
        }
    }).catch((error) => {
        console.error("Error:", error);
    });
	});

	
	
	async function search() {
    if (userToSearch) {
        filteredUsers = Users.filter(function (el) {
            return el.name.toLowerCase().includes(userToSearch.toLowerCase())
        });
    } else {
        filteredUsers = [];  // Reset when search is empty
    }
    currentPage = 1;  // Reset to first page when searching
}
</script>

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
	<div class="p-4">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
			<Heading tag="h1" class="text-2xl font-bold text-gray-900 dark:text-white">
				All Users
			</Heading>
			<div class="flex flex-row items-center space-x-4 mt-4 sm:mt-0"></div>
				<input 
					bind:value={userToSearch} 
					placeholder="Search for users" 
					class="w-full sm:w-80 xl:w-96 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
					on:input={() => {search()}}
				/>

				<Button
					size="sm"
					class="gap-2 whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					on:click={() => ((openSignup = true))}
				> 
					<PlusOutline size="sm" /> Add User
				</Button>
				<Button 
					size="sm" 
					color="alternative" 
					class="gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
					on:click={() => ((openExport = true))}
				>
					<DownloadSolid size="md" class="-ml-1" /> Export
				</Button>
			</div>
		</div>
	<div class="table-container">
		<Table striped={true}>
			<TableHead class="sticky top-0 border-y border-gray-200 bg-gray-100 dark:border-gray-700">
				<TableHeadCell class="w-4 p-4"><Checkbox /></TableHeadCell>
				{#each ['Name', 'Group ID', 'Employee ID', 'Tokens Used', 'Tokens Allocated', 'Last Login', 'Actions'] as title}
					<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
				{/each}
			</TableHead>
			<TableBody>
				
				{#each (ViewAll ? filteredUsers : displayedUsers) as user}
					<TableBodyRow class="text-base">
						<TableBodyCell class="w-4 p-4"><Checkbox /></TableBodyCell>
						<TableBodyCell class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
								<div class="text-base font-semibold text-gray-900 dark:text-white">{user.name}</div>
								<div class="text-sm font-normal text-gray-500 dark:text-gray-400">{user.email}</div>
							</div>
						</TableBodyCell>
						<TableBodyCell
							class="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs"
						>
							{user.group_id !== null ? user.group_id : ''}
						</TableBodyCell>
						<TableBodyCell class="p-4">  {user.employee_id !== null ? user.employee_id : ''}</TableBodyCell>
						<TableBodyCell class="p-4">{user.tokens_used !== null ? user.tokens_used : ''}</TableBodyCell>
				
						<TableBodyCell class="p-4">{user.tokens_allocated !== null ? user.tokens_allocated : ''}</TableBodyCell>
						<TableBodyCell class="p-4">{user.last_login !== null ? user.last_login : ''}</TableBodyCell>
						<TableBodyCell class="space-x-2 p-4">
							<Button
								size="sm"
								class="gap-2 px-3"
								on:click={() => ((openUser = true), (row_user = user))}
							>
								<EditOutline size="sm" /> Edit user
							</Button>
							<Button
								color="red"
								size="sm"
								class="gap-2 px-3"
								on:click={() => (
									(openDelete = true),
									(selected_user_id = user.id),
									(selected_user_name = user.name)
									)}
							>
								<TrashBinSolid size="sm" /> Delete user
							</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<div class="flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
		  Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
		  to
		  <span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
		  of
		  <span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
		  Entries
		</div>
	  

		<Pagination {pages} table on:pagechange={onPageChange}>
		  <div slot="prev" class="flex items-center gap-2 text-white bg-gray-800">
			<ArrowLeftOutline class="w-3.5 h-3.5 me-2" />
			Prev
		  </div>
		  <div slot="next" class="flex items-center gap-2 text-white bg-gray-800">
			Next
			<ArrowRightOutline class="w-6 h-6 ms-2" />

		  </div>
		 
		</Pagination>
		<div>
			<Button on:click={() => (ViewAll = !ViewAll)} color="green">View All</Button>

		  </div>
	</div>
</main>

<User bind:open={openUser} data={data} user={row_user} />
<SignUp bind:open={openSignup} user={data}/>
<Delete bind:open={openDelete} bind:user_id={selected_user_id} bind:user_name={selected_user_name} data={data} />
<Export bind:open={openExport} bind:logs={logs} data={data} /> -->

<script lang="ts">
	import '../../../app.css';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Checkbox,
		Heading,
		Input,
		Pagination,
		PaginationItem,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toolbar,
		ToolbarButton,
		ToolbarGroup
	} from 'flowbite-svelte';
    import { onMount } from "svelte";
	import { CogSolid, DotsVerticalOutline, DownloadSolid } from 'flowbite-svelte-icons';
	import {
		ArrowLeftOutline,
		ArrowRightOutline,
		EditOutline,
		ExclamationCircleSolid,
		PlusOutline,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import User from './user_edit.svelte';
	import Delete from './Delete.svelte';
	import SignUp from './user_signup.svelte';
	import { toasts } from '../../../lib/stores/toastStore';
	import Export from './export.svelte';
	import type { User as UserType } from '../../../lib/stores/userStore';
	import {Button, Table, Card, CardBody, Badge, Spinner } from '@sveltestrap/sveltestrap'

	export let data: UserType;

	let ViewAll = false;
	let openUser: boolean = false; // modal control
	let openDelete: boolean = false; // modal control
	let openSignup: boolean = false; // modal control
    let Users: any[] = [];
	let filteredUsers: any[] = [];
	let selected_user_id: number;
	let selected_user_name: string;
	let message = "";
	let userToSearch = "";
	let row_user = {};
	let openExport: boolean = false;
	let logs: any[] = [];
	let currentPage = 1;
  	let itemsPerPage = 10;
	let loading = true;
	let selectedUsers = new Set();

	// Reactive statements for pagination
	$: activeUsers = userToSearch ? filteredUsers : Users;
	$: totalPages = Math.ceil(activeUsers.length / itemsPerPage);
	$: displayedUsers = activeUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	$: helper = {
		start: activeUsers.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1,
		end: Math.min(currentPage * itemsPerPage, activeUsers.length),
		total: activeUsers.length
	};

	// Generate page numbers for pagination
	$: pages = Array.from({ length: totalPages }, (_, i) => ({
		name: (i + 1).toString(),
		href: `#page-${i + 1}`,
		active: currentPage === i + 1
	}));

	export let filter: [boolean, string] = [false, ''];

	onMount(async ()=> {
		console.log(data.url_base)
		try {
			const response = await fetch(data.url_base + '/users', {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + data.token,
				},
			});

			if (response.ok) {
				const data_response = await response.json();
				console.log(data_response);
				Users = data_response || [];
				filteredUsers = Users;
				console.log(Users.length);
			} else {
				throw new Error("Failed to fetch users");
			}
		} catch (error) {
			console.error("Error:", error);
			toasts.add({
				message: "Failed to load users",
				type: "error"
			});
		} finally {
			loading = false;
		}
	});
	
	onMount(async ()=> {
		try {
			const response = await fetch(data.url_base + '/logs', {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + data.token,
				},
			});

			if (response.ok) {
				const data_response = await response.json();
				logs = data_response || [];
				
				if (filter[0]){
					logs = logs.filter(log => log.user_name === data.email);
					logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				}
				if (filter[1] !== ""){
					logs = logs.filter(log => log.application === filter[1]);
					logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				}
			} else {
				throw new Error("Failed to fetch logs");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	});
	
	

	async function search() {
    if (userToSearch) {
        filteredUsers = Users.filter(function (el) {
            return el.name.toLowerCase().includes(userToSearch.toLowerCase())
        });
    } else {
        filteredUsers = [];  // Reset when search is empty
    }
    currentPage = 1;  // Reset to first page when searching
}

	function handlePageChange(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function toggleUserSelection(userId: number) {
		if (selectedUsers.has(userId)) {
			selectedUsers.delete(userId);
		} else {
			selectedUsers.add(userId);
		}
		selectedUsers = selectedUsers; // Trigger reactivity
	}

	function toggleAllUsers() {
		if (selectedUsers.size === displayedUsers.length) {
			selectedUsers.clear();
		} else {
			displayedUsers.forEach(user => selectedUsers.add(user.id));
		}
		selectedUsers = selectedUsers; // Trigger reactivity
	}

	function getTokenUsageColor(used: number, allocated: number) {
		if (!used || !allocated) return 'secondary';
		const percentage = (used / allocated) * 100;
		if (percentage >= 90) return 'danger';
		if (percentage >= 70) return 'warning';
		return 'success';
	}

	function formatLastLogin(lastLogin: string) {
		if (!lastLogin) return 'Never';
		try {
			return new Date(lastLogin).toLocaleDateString();
		} catch {
			return lastLogin;
		}
	}
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
	<div class="container-fluid px-4 py-6">
		<!-- Header Section -->
		<div class="mb-8">
			<Card class="border-0 shadow-lg bg-white dark:bg-gray-800">
				<CardBody class="p-6">
					<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								User Management
							</h1>
							<p class="text-gray-600 dark:text-gray-400">
								Manage user accounts, permissions, and monitor activity
							</p>
						</div>
						
						<div class="flex flex-col sm:flex-row gap-3">
							<Button
								color="primary"
								class="d-flex align-items-center gap-2 shadow-sm"
								on:click={() => (openSignup = true)}
							>
								<PlusOutline size="sm" />
								Add User
							</Button>
							
							<Button
								color="outline-secondary"
								class="d-flex align-items-center gap-2 shadow-sm"
								on:click={() => (openExport = true)}
							>
								<DownloadSolid size="sm" />
								Export Data
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>

		<!-- Stats Cards -->
		<div class="row mb-6">
			<div class="col-md-3 mb-3">
				<Card class="border-0 shadow-sm bg-primary text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{Users.length}</h3>
						<p class="mb-0 opacity-75">Total Users</p>
					</CardBody>
				</Card>
			</div>
			<div class="col-md-3 mb-3">
				<Card class="border-0 shadow-sm bg-success text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{Users.filter(u => u.last_login).length}</h3>
						<p class="mb-0 opacity-75">Active Users</p>
					</CardBody>
				</Card>
			</div>
			<div class="col-md-3 mb-3">
				<Card class="border-0 shadow-sm bg-warning text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{selectedUsers.size}</h3>
						<p class="mb-0 opacity-75">Selected</p>
					</CardBody>
				</Card>
			</div>
			<div class="col-md-3 mb-3">
				<Card class="border-0 shadow-sm bg-info text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{activeUsers.length}</h3>
						<p class="mb-0 opacity-75">Filtered Results</p>
					</CardBody>
				</Card>
			</div>
		</div>

		<!-- Search and Filters -->
		<Card class="border-0 shadow-sm mb-6">
			<CardBody class="p-4">
				<div class="row align-items-center">
					<div class="col-md-8 mb-3 mb-md-0">
						<input
							bind:value={userToSearch}
							placeholder="Search users by name..."
							class="form-control shadow-sm border-0 bg-gray-50 dark:bg-gray-700"
							on:input={search}
						/>
					</div>
					<div class="col-md-4 text-md-end">
						<div class="d-flex gap-2 justify-content-md-end">
							<select class="form-select form-select-sm shadow-sm" bind:value={itemsPerPage} on:change={() => currentPage = 1}>
								<option value={10}>10 per page</option>
								<option value={25}>25 per page</option>
								<option value={50}>50 per page</option>
							</select>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>

		<!-- Main Table -->
		<Card class="border-0 shadow-lg">
			<CardBody class="p-0">
				{#if loading}
					<div class="text-center py-5">
						<Spinner color="primary" />
						<p class="mt-3 text-muted">Loading users...</p>
					</div>
				{:else if activeUsers.length === 0}
					<div class="text-center py-5">
						<div class="mb-4">
							<ExclamationCircleSolid size="xl" class="text-gray-400" />
						</div>
						<h4 class="text-gray-600 dark:text-gray-400">No users found</h4>
						<p class="text-gray-500 dark:text-gray-500">
							{userToSearch ? 'Try adjusting your search criteria' : 'Get started by adding your first user'}
						</p>
					</div>
				{:else}
					<div class="table-responsive">
						<table class="table table-hover mb-0">
							<thead class="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th class="border-0 px-4 py-3">
										<input 
											type="checkbox" 
											class="form-check-input"
											checked={selectedUsers.size === displayedUsers.length && displayedUsers.length > 0}
											on:change={toggleAllUsers}
										/>
									</th>
									<th class="border-0 px-4 py-3 fw-semibold">User</th>
									<th class="border-0 px-4 py-3 fw-semibold">Group ID</th>
									<th class="border-0 px-4 py-3 fw-semibold">Employee ID</th>
									<th class="border-0 px-4 py-3 fw-semibold">Token Usage</th>
									<th class="border-0 px-4 py-3 fw-semibold">Last Login</th>
									<th class="border-0 px-4 py-3 fw-semibold text-end">Actions</th>
								</tr>
							</thead>
							<tbody>
								{#each displayedUsers as user (user.id)}
									<tr class="border-bottom">
										<td class="px-4 py-3">
											<input 
												type="checkbox" 
												class="form-check-input"
												checked={selectedUsers.has(user.id)}
												on:change={() => toggleUserSelection(user.id)}
											/>
										</td>
										<td class="px-4 py-3">
											<div class="d-flex align-items-center">
												<div class="user-avatar text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
													 style="width: 40px; height: 40px; font-size: 14px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
													{user.name.charAt(0).toUpperCase()}
												</div>
												<div>
													<div class="fw-semibold text-gray-900 dark:text-white">{user.name}</div>
													<small class="text-muted">{user.email}</small>
												</div>
											</div>
										</td>
										<td class="px-4 py-3">
											{#if user.group_id}
												<Badge color="secondary">{user.group_id}</Badge>
											{:else}
												<span class="text-muted">—</span>
											{/if}
										</td>
										<td class="px-4 py-3">
											{user.employee_id || '—'}
										</td>
										<td class="px-4 py-3">
											{#if user.tokens_used && user.tokens_allocated}
												<div>
													<Badge color={getTokenUsageColor(user.tokens_used, user.tokens_allocated)}>
														{user.tokens_used.toLocaleString()} / {user.tokens_allocated.toLocaleString()}
													</Badge>
													<div class="progress mt-1" style="height: 4px; background-color: #e9ecef; border-radius: 2px; overflow: hidden;">
														<div 
															class="progress-bar" 
															class:bg-success={getTokenUsageColor(user.tokens_used, user.tokens_allocated) === 'success'}
															class:bg-warning={getTokenUsageColor(user.tokens_used, user.tokens_allocated) === 'warning'}
															class:bg-danger={getTokenUsageColor(user.tokens_used, user.tokens_allocated) === 'danger'}
															style="width: {Math.min((user.tokens_used / user.tokens_allocated) * 100, 100)}%; height: 100%; border-radius: 2px;"
														></div>
													</div>
												</div>
											{:else}
												<span class="text-muted">—</span>
											{/if}
										</td>
										<td class="px-4 py-3">
											<small class="text-muted">{formatLastLogin(user.last_login)}</small>
										</td>
										<td class="px-4 py-3 text-end">
											<div class="d-flex gap-2 justify-content-end">
												<Button
													color="outline-primary"
													size="sm"
													class="d-flex align-items-center gap-1"
													on:click={() => {openUser = true; row_user = user;}}
												>
													<EditOutline size="xs" />
													Edit
												</Button>
												<Button
													color="outline-danger"
													size="sm"
													class="d-flex align-items-center gap-1"
													on:click={() => {
														openDelete = true;
														selected_user_id = user.id;
														selected_user_name = user.name;
													}}
												>
													<TrashBinSolid size="xs" />
													Delete
												</Button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</CardBody>
		</Card>

		<!-- Enhanced Pagination -->
		{#if totalPages > 1}
			<Card class="border-0 shadow-sm mt-4">
				<CardBody class="p-4">
					<div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
						<div class="text-muted">
							Showing <strong>{helper.start}</strong> to <strong>{helper.end}</strong> of <strong>{helper.total}</strong> entries
						</div>
						
						<nav aria-label="User pagination">
							<ul class="pagination pagination-sm mb-0">
								<li class="page-item {currentPage === 1 ? 'disabled' : ''}">
									<button 
										class="page-link d-flex align-items-center gap-2" 
										on:click={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 1}
									>
										<ArrowLeftOutline size="xs" />
										Previous
									</button>
								</li>
								
								{#each pages as page, index}
									{#if totalPages <= 7 || index < 2 || index >= totalPages - 2 || Math.abs(index + 1 - currentPage) <= 1}
										<li class="page-item {page.active ? 'active' : ''}">
											<button 
												class="page-link" 
												on:click={() => handlePageChange(index + 1)}
											>
												{page.name}
											</button>
										</li>
									{:else if index === 2 || index === totalPages - 3}
										<li class="page-item disabled">
											<span class="page-link">...</span>
										</li>
									{/if}
								{/each}
								
								<li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
									<button 
										class="page-link d-flex align-items-center gap-2" 
										on:click={() => handlePageChange(currentPage + 1)}
										disabled={currentPage === totalPages}
									>
										Next
										<ArrowRightOutline size="xs" />
									</button>
								</li>
							</ul>
						</nav>
					</div>
				</CardBody>
			</Card>
		{/if}

		<!-- Quick Actions -->
		{#if selectedUsers.size > 0}
			<Card class="border-0 shadow-sm mt-4 bg-primary">
				<CardBody class="p-3">
					<div class="d-flex justify-content-between align-items-center text-white">
						<span class="fw-semibold">
							{selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
						</span>
						<div class="d-flex gap-2">
							<Button color="light" size="sm">Bulk Edit</Button>
							<Button color="outline-light" size="sm">Export Selected</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		{/if}
	</div>
</main>

<!-- Modals -->
<User bind:open={openUser} {data} user={row_user} />
<SignUp bind:open={openSignup} user={data}/>
<Delete bind:open={openDelete} bind:user_id={selected_user_id} bind:user_name={selected_user_name} {data} />
<Export bind:open={openExport} bind:logs {data} />

<style>
	.user-avatar {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
		border: none !important;
		box-shadow: none !important;
	}
	
	.table-responsive {
		border-radius: 0.5rem;
	}
	
	.progress {
		background-color: #e9ecef !important;
		border-radius: 2px !important;
		height: 4px !important;
		overflow: hidden !important;
		box-shadow: none !important;
		border: none !important;
	}
	
	.progress-bar {
		border-radius: 2px !important;
		transition: width 0.3s ease !important;
		box-shadow: none !important;
		border: none !important;
	}
	
	.card {
		transition: all 0.2s ease-in-out;
	}
	
	.card:hover {
		transform: translateY(-2px);
	}
	
	.table tbody tr:hover {
		background-color: rgba(0, 123, 255, 0.05);
	}

	@media (max-width: 768px) {
		.table th,
		.table td {
			padding: 0.5rem;
			font-size: 0.875rem;
		}
		
		.user-avatar {
			width: 32px !important;
			height: 32px !important;
			font-size: 12px !important;
		}
	}
</style>