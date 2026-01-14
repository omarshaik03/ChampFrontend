<!-- <script lang="ts">
	import LastRange from '../../../utils/widgets/LastRange.svelte';
	import { onMount } from "svelte";
	import {
		Button,
		Card,
		Input,
		Table,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Form,
		FormCheck,
		Icon
	} from '@sveltestrap/sveltestrap';
	import StatusBadge from './StatusBadge.svelte';
	import Linecompare from './linecompare.svelte';
	import { user } from '../../../login';
	import type { User } from '../../../lib/stores/userStore';

	export let dark: boolean = false;
	export let data: User;
	export let filter= [Boolean,String];
	let sortColumn = '';
	let sortDirection = 'asc';
	let lineCompare = false;
	let oldText = '';
	let newText = '';
	let filtered = 'all'
	let fromDate: Date | null = null;
	let toDate: Date | null = null;
	const headers = [
		['User Id', 'user_id'],
		['Username', 'user_name'],
		['Application', 'application'],
		['User Input', 'user_question'],
		['Logs', 'log'],
		['Time', 'timestamp'],
		['Status', 'status'],
		['Tokens Used', 'tokens_used'],
		['View', 'view'],
	];
	const headers2 = [
		// 'User Input',
		// 'AI Output',
		// 'Logs',
		// 'Time',
		// 'Status',
		// 'Tokens Used',
		['Date Time', 'timestamp'],
		['Application', 'application'],
		['Logs', 'log'],
		['Status', 'status'],
		// ['LLM Response Time', 'llm_response_time'],
		['Tokens Used', 'tokens_used'],
		['View', 'view'],
	];

	const headerMap = {
    'User Id': 'user_id',
    'Username': 'user_name',
    'User Input': 'user_question',
    'AI Output': 'response',
    'Logs': 'log',
    'Time': 'timestamp',
    'Status': 'status',
    'Tokens Used': 'tokens_used',
    'Date Time': 'timestamp',
    'Application': 'application',
    'LLM Response Time': 'llm_response_time',
  };
	let logs: any[] = [];
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
	function countSuccessLogs() {
		return logs.filter(log => log.status === 'success').length;
	}
	function countErrorLogs() {
		return logs.filter(log => log.status === 'error').length;
	}
	$: filteredLogs = logs.filter(log => filtered === 'all' || log.status === filtered);

	// const localeCompareFunction = (a: string, b: string) => a.localeCompare(b);

	function sortLogs(column: string) {
		const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
		sortColumn = column;
		sortDirection = direction;

		logs.sort((a,b) => {
			let valA = a[column];
			let valB = b[column];

			if (typeof valA === 'string' && typeof valB === 'string') {
				return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
			} else if (typeof valA === 'number' && typeof valB === 'number') {
				return direction === 'asc' ? valA - valB : valB - valA;
			} else if (valA instanceof Date && valB instanceof Date) {
				return direction === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
			}
			return 0;
		});
	}

	const filterLogsByDate = () => {
    filteredLogs = logs.filter(log => {
      const timestamp = new Date(log.timestamp);
      // const from = fromDate ? new Date(fromDate) : null;
      // const to = toDate ? new Date(toDate) : null;
	  const from = fromDate ? new Date(fromDate + 'T00:00:00') : null; 	
      const to = toDate ? new Date(toDate + 'T23:59:59') : null; 		

      if (from && timestamp < from) return false;
      // if (to && timestamp > to) return false;
	  if (to) { 														
		to.setHours(23, 59, 59, 999); 	// set to end of day to include entire To date
		if (timestamp > to) return false; 					
	  } 																

      return true;
    });
  };
	
</script>

<Card class="shadow-sm w-100" body>
	<div class="d-flex align-items-center justify-content-between">
		<div class="d-flex align-items-center justify-content-between gap-3 flex-column flex-sm-row">
			<div class="d-flex align-items-center">
				<Dropdown>
					<DropdownToggle color="secondary">
						Filter by status
					</DropdownToggle>
					<DropdownMenu>
						<DropdownItem>
							<FormCheck 
								type="checkbox"
								checked={filtered === 'success'}
								on:change={() => filtered = filtered === 'success' ? 'all' : 'success'}
								label="Success ({countSuccessLogs()})"
							/>
						</DropdownItem>
						<DropdownItem>
							<FormCheck
								type="checkbox"
								checked={filtered === 'error'}
								on:change={() => filtered = filtered === 'error' ? 'all' : 'error'}
								label="Errors ({countErrorLogs()})"
							/>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<div class="date-input-wrapper">
				<Input type="date" bind:value={fromDate} placeholder="From" class="w-full" on:input={filterLogsByDate}>
				  <Icon slot="left" size="md" />
				</Input>
				<Input type="date" bind:value={toDate} placeholder="To" class="w-full" on:input={filterLogsByDate}>
				  <Icon slot="left" size="md" />
				</Input>
			  </div>
		</div>
	</div>	<div class="overflow-auto h-100">
				<Table hover responsive>
			<thead class="bg-light">
				<tr>
					{#if (filter[0])}
						{#each headers2 as header}
							<th class="text-nowrap p-4 fw-normal" on:click={() => sortLogs(header[1])}>{header[0]}</th>
						{/each}
					{/if}
					{#if (!filter[0])}
						{#each headers as header}
							<th class="text-nowrap p-4 fw-normal" on:click={() => sortLogs(header[1])}>{header[0]}</th>
						{/each}
					{/if}
				</tr>
			</thead>
			<tbody>
				{#if !(filter[0])}
				{#each filteredLogs as log}
					<tr class="fs-6">
						<td>{log.user_id}</td>
						<td class="p-4 fw-normal">{log.user_name}</td>
						
						<td class="p-4 fw-normal">{log.application}</td>
						<td class="p-4 fw-normal break-word">{log.user_question}</td>
						<td class="p-4 fw-normal break-word">{log.log}</td>
						<td class="p-4 fw-normal text-muted">
							{log.timestamp}
						</td>
						<td class="p-4 fw-normal">
							<StatusBadge state={log.status} {dark} />
						</td>
						<td class="p-4 fw-normal text-muted">
							{log.tokens_used}
						</td>
						{#if log.application == "codeconvert"}
							<td class="p-4 fw-normal">
								<Button color="primary" size="sm" class="w-auto" on:click={() => ((lineCompare = true, oldText = log.user_question, newText = log.response))}>
									View
								</Button>
							</td>
							<td class="!p-4 font-normal">{log.prompt}</td>
						{/if}
					</tr>
				{/each}
				{/if}
				{#if (filter[0])}
					{#each filteredLogs as log}
					<tr class="fs-6">
						<td class="p-4 fw-normal">{log.timestamp}</td>
						<td class="p-4 fw-normal">{log.application}</td>
						<td class="p-4 fw-normal break-word">{log.log}</td>
						<td class="p-4 fw-normal">
							<StatusBadge state={log.status} {dark} />
						</td>
						<td class="p-4 fw-normal">{log.tokens_used}</td>
						<td class="!p-4 font-normal">
							{#if log.application == "codeconvert"}
								<Button color="primary" size="sm" class="w-20" on:click={() => ((lineCompare = true, oldText = log.user_question, newText = log.response))}>
									View
								</Button>
								<td class="!p-4 font-normal">{log.prompt}</td>

							{/if}
						</td>
					</tr>
					{/each}
				{/if}
			</tbody>
		  </Table>
	</div>	<div class="mb-n1 d-flex align-items-center justify-content-between pt-3 pt-sm-6">
		<LastRange />
		
	</div>
</Card>

<Linecompare bind:open={lineCompare} oldText={oldText} newText={newText}/> -->

<script lang="ts">
	import LastRange from '../../../utils/widgets/LastRange.svelte';
	import { onMount } from "svelte";
	import {
		Button,
		Card,
		Input,
		Table,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Form,
		FormCheck,
		Icon,
		Badge,
		CardBody,
		Spinner
	} from '@sveltestrap/sveltestrap';
	import StatusBadge from './StatusBadge.svelte';
	import Linecompare from './linecompare.svelte';
	import { user } from '../../../login';
	import type { User } from '../../../lib/stores/userStore';

	export let dark: boolean = false;
	export let data: User;
	export let filter = [Boolean, String];
	
	let sortColumn = '';
	let sortDirection = 'asc';
	let lineCompare = false;
	let oldText = '';
	let newText = '';
	let filtered = 'all';
	let fromDate: Date | null = null;
	let toDate: Date | null = null;
	let loading = true;
	let currentPage = 1;
	let itemsPerPage = 15;
	let searchQuery = '';

	const headers = [
		['User Id', 'user_id'],
		['Username', 'user_name'],
		['Application', 'application'],
		['User Input', 'user_question'],
		['Logs', 'log'],
		['Time', 'timestamp'],
		['Status', 'status'],
		['Tokens Used', 'tokens_used'],
		['View', 'view'],
	];
	
	const headers2 = [
		['Date Time', 'timestamp'],
		['Application', 'application'],
		['Logs', 'log'],
		['Status', 'status'],
		['Tokens Used', 'tokens_used'],
		['View', 'view'],
	];

	const headerMap = {
		'User Id': 'user_id',
		'Username': 'user_name',
		'User Input': 'user_question',
		'AI Output': 'response',
		'Logs': 'log',
		'Time': 'timestamp',
		'Status': 'status',
		'Tokens Used': 'tokens_used',
		'Date Time': 'timestamp',
		'Application': 'application',
		'LLM Response Time': 'llm_response_time',
	};

	let logs: any[] = [];
	
	// Make the counts reactive
	$: successCount = logs.filter(log => log.status === 'success').length;
	$: errorCount = logs.filter(log => log.status === 'error').length;
	
	// Reactive statements for filtering and pagination
	$: filteredLogs = logs.filter(log => {
		const statusMatch = filtered === 'all' || log.status === filtered;
		const searchMatch = !searchQuery || 
			log.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.application?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.log?.toLowerCase().includes(searchQuery.toLowerCase());
		
		let dateMatch = true;
		if (fromDate || toDate) {
			const timestamp = new Date(log.timestamp);
			const from = fromDate ? new Date(fromDate + 'T00:00:00') : null;
			const to = toDate ? new Date(toDate + 'T23:59:59') : null;
			
			if (from && timestamp < from) dateMatch = false;
			if (to && timestamp > to) dateMatch = false;
		}
		
		return statusMatch && searchMatch && dateMatch;
	});
	
	$: totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
	$: displayedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	$: helper = {
		start: filteredLogs.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1,
		end: Math.min(currentPage * itemsPerPage, filteredLogs.length),
		total: filteredLogs.length
	};

	onMount(async () => {
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
				
				if (filter[0]) {
					logs = logs.filter(log => log.user_name === data.email);
					logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				}
				if (filter[1] !== "") {
					logs = logs.filter(log => log.application === filter[1]);
					logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				}
			} else {
				throw new Error("Failed to fetch logs");
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			loading = false;
		}
	});

	// Keep these functions for any other usage, but they're no longer needed for the template
	function countSuccessLogs() {
		return logs.filter(log => log.status === 'success').length;
	}
	
	function countErrorLogs() {
		return logs.filter(log => log.status === 'error').length;
	}

	function sortLogs(column: string) {
		const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
		sortColumn = column;
		sortDirection = direction;

		logs.sort((a, b) => {
			let valA = a[column];
			let valB = b[column];

			if (typeof valA === 'string' && typeof valB === 'string') {
				return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
			} else if (typeof valA === 'number' && typeof valB === 'number') {
				return direction === 'asc' ? valA - valB : valB - valA;
			} else if (valA instanceof Date && valB instanceof Date) {
				return direction === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
			}
			return 0;
		});
	}

	function handlePageChange(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function formatTimestamp(timestamp: string) {
		try {
			return new Date(timestamp).toLocaleString();
		} catch {
			return timestamp;
		}
	}

	function truncateText(text: string, maxLength: number = 100) {
		if (!text) return '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}

	function getApplicationBadgeColor(application: string) {
		const colors = {
			'codeconvert': 'primary',
			'chat': 'success',
			'analysis': 'info',
			'default': 'secondary'
		};
		return colors[application] || colors.default;
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
								Activity Logs
							</h1>
							<p class="text-gray-600 dark:text-gray-400">
								Monitor system activity, user interactions, and application performance
							</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>

		<!-- Stats Cards -->
		<div class="row mb-6">
			<div class="col-lg-3 col-md-6 mb-3">
				<Card class="border-0 shadow-sm bg-primary text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{logs.length}</h3>
						<p class="mb-0 opacity-75">Total Logs</p>
					</CardBody>
				</Card>
			</div>
			<div class="col-lg-3 col-md-6 mb-3">
				<Card class="border-0 shadow-sm bg-success text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{successCount}</h3>
						<p class="mb-0 opacity-75">Successful</p>
					</CardBody>
				</Card>
			</div>
			<div class="col-lg-3 col-md-6 mb-3">
				<Card class="border-0 shadow-sm bg-danger text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{errorCount}</h3>
						<p class="mb-0 opacity-75">Errors</p>
					</CardBody>
				</Card>
			</div>
			<div class="col-lg-3 col-md-6 mb-3">
				<Card class="border-0 shadow-sm bg-info text-white">
					<CardBody class="p-4 text-center">
						<h3 class="h2 font-bold mb-1">{filteredLogs.length}</h3>
						<p class="mb-0 opacity-75">Filtered Results</p>
					</CardBody>
				</Card>
			</div>
		</div>

		<!-- Filters and Search -->
		<Card class="border-0 shadow-sm mb-6">
			<CardBody class="p-4">
				<div class="row g-3">
					<div class="col-lg-4 col-md-6">
						<input
							bind:value={searchQuery}
							placeholder="Search logs, users, or applications..."
							class="form-control shadow-sm border-0 bg-gray-50 dark:bg-gray-700"
						/>
					</div>
					<div class="col-lg-2 col-md-6">
						<Dropdown>
							<DropdownToggle color="outline-secondary" class="w-100 d-flex justify-content-between align-items-center">
								Status Filter
								<i class="fas fa-chevron-down"></i>
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem>
									<FormCheck 
										type="radio"
										name="statusFilter"
										checked={filtered === 'all'}
										on:change={() => filtered = 'all'}
										label="All Logs ({logs.length})"
									/>
								</DropdownItem>
								<DropdownItem>
									<FormCheck 
										type="radio"
										name="statusFilter"
										checked={filtered === 'success'}
										on:change={() => filtered = 'success'}
										label="Success ({successCount})"
									/>
								</DropdownItem>
								<DropdownItem>
									<FormCheck
										type="radio"
										name="statusFilter"
										checked={filtered === 'error'}
										on:change={() => filtered = 'error'}
										label="Errors ({errorCount})"
									/>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
					<div class="col-lg-2 col-md-6">
						<Input 
							type="date" 
							bind:value={fromDate} 
							placeholder="From Date" 
							class="shadow-sm border-0 bg-gray-50 dark:bg-gray-700"
						/>
					</div>
					<div class="col-lg-2 col-md-6">
						<Input 
							type="date" 
							bind:value={toDate} 
							placeholder="To Date" 
							class="shadow-sm border-0 bg-gray-50 dark:bg-gray-700"
						/>
					</div>
					<div class="col-lg-2 col-md-6">
						<select class="form-select shadow-sm border-0 bg-gray-50 dark:bg-gray-700" bind:value={itemsPerPage} on:change={() => currentPage = 1}>
							<option value={10}>10 per page</option>
							<option value={15}>15 per page</option>
							<option value={25}>25 per page</option>
							<option value={50}>50 per page</option>
						</select>
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
						<p class="mt-3 text-muted">Loading activity logs...</p>
					</div>
				{:else if filteredLogs.length === 0}
					<div class="text-center py-5">
						<div class="mb-4">
							<i class="fas fa-search fa-3x text-gray-400"></i>
						</div>
						<h4 class="text-gray-600 dark:text-gray-400">No logs found</h4>
						<p class="text-gray-500 dark:text-gray-500">
							{searchQuery || fromDate || toDate || filtered !== 'all' 
								? 'Try adjusting your search criteria or filters' 
								: 'No activity logs available'}
						</p>
					</div>
				{:else}
					<div class="table-responsive">
						<table class="table table-hover mb-0">
							<thead class="bg-gray-50 dark:bg-gray-700">
								<tr>
									{#if filter[0]}
										{#each headers2 as header}
											<th 
												class="border-0 px-4 py-3 fw-semibold cursor-pointer user-select-none hover:bg-gray-100"
												on:click={() => sortLogs(header[1])}
											>
												<div class="d-flex align-items-center gap-2">
													{header[0]}
													{#if sortColumn === header[1]}
														<i class="fas fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} text-primary"></i>
													{/if}
												</div>
											</th>
										{/each}
									{:else}
										{#each headers as header}
											<th 
												class="border-0 px-4 py-3 fw-semibold cursor-pointer user-select-none hover:bg-gray-100"
												on:click={() => sortLogs(header[1])}
											>
												<div class="d-flex align-items-center gap-2">
													{header[0]}
													{#if sortColumn === header[1]}
														<i class="fas fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} text-primary"></i>
													{/if}
												</div>
											</th>
										{/each}
									{/if}
								</tr>
							</thead>
							<tbody>
								{#each displayedLogs as log (log.id || log.timestamp)}
									<tr class="border-bottom">
										{#if !filter[0]}
											<td class="px-4 py-3">
												<Badge color="secondary" class="font-monospace">{log.user_id}</Badge>
											</td>
											<td class="px-4 py-3">
												<div class="d-flex align-items-center">
													<div class="user-avatar text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
														 style="width: 32px; height: 32px; font-size: 12px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
														{log.user_name ? log.user_name.charAt(0).toUpperCase() : 'U'}
													</div>
													<div>
														<div class="fw-semibold">{log.user_name || 'Unknown'}</div>
													</div>
												</div>
											</td>
											<td class="px-4 py-3">
												<Badge color={getApplicationBadgeColor(log.application)}>
													{log.application || 'Unknown'}
												</Badge>
											</td>
											<td class="px-4 py-3">
												<div class="text-truncate" style="max-width: 200px;" title={log.user_question}>
													{truncateText(log.user_question)}
												</div>
											</td>
											<td class="px-4 py-3">
												<div class="text-truncate" style="max-width: 250px;" title={log.log}>
													{truncateText(log.log)}
												</div>
											</td>
											<td class="px-4 py-3">
												<small class="text-muted">{formatTimestamp(log.timestamp)}</small>
											</td>
											<td class="px-4 py-3">
												<StatusBadge state={log.status} {dark} />
											</td>
											<td class="px-4 py-3">
												<Badge color="info" class="font-monospace">
													{log.tokens_used?.toLocaleString() || '0'}
												</Badge>
											</td>
											<td class="px-4 py-3">
												{#if log.application === "codeconvert"}
													<Button 
														color="outline-primary" 
														size="sm" 
														class="d-flex align-items-center gap-1"
														on:click={() => {
															lineCompare = true;
															oldText = log.user_question;
															newText = log.response;
														}}
													>
														<i class="fas fa-eye"></i>
														View
													</Button>
												{:else}
													<span class="text-muted">—</span>
												{/if}
											</td>
										{:else}
											<td class="px-4 py-3">
												<small class="text-muted">{formatTimestamp(log.timestamp)}</small>
											</td>
											<td class="px-4 py-3">
												<Badge color={getApplicationBadgeColor(log.application)}>
													{log.application || 'Unknown'}
												</Badge>
											</td>
											<td class="px-4 py-3">
												<div class="text-truncate" style="max-width: 300px;" title={log.log}>
													{truncateText(log.log, 150)}
												</div>
											</td>
											<td class="px-4 py-3">
												<StatusBadge state={log.status} {dark} />
											</td>
											<td class="px-4 py-3">
												<Badge color="info" class="font-monospace">
													{log.tokens_used?.toLocaleString() || '0'}
												</Badge>
											</td>
											<td class="px-4 py-3">
												{#if log.application === "codeconvert"}
													<Button 
														color="outline-primary" 
														size="sm"
														class="d-flex align-items-center gap-1"
														on:click={() => {
															lineCompare = true;
															oldText = log.user_question;
															newText = log.response;
														}}
													>
														<i class="fas fa-eye"></i>
														View
													</Button>
												{:else}
													<span class="text-muted">—</span>
												{/if}
											</td>
										{/if}
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
						
						<nav aria-label="Log pagination">
							<ul class="pagination pagination-sm mb-0">
								<li class="page-item {currentPage === 1 ? 'disabled' : ''}">
									<button 
										class="page-link d-flex align-items-center gap-2" 
										on:click={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 1}
									>
										<i class="fas fa-chevron-left"></i>
										Previous
									</button>
								</li>
								
								{#each Array.from({length: totalPages}, (_, i) => i + 1) as page}
									{#if totalPages <= 7 || page <= 2 || page >= totalPages - 1 || Math.abs(page - currentPage) <= 1}
										<li class="page-item {currentPage === page ? 'active' : ''}">
											<button 
												class="page-link" 
												on:click={() => handlePageChange(page)}
											>
												{page}
											</button>
										</li>
									{:else if page === 3 || page === totalPages - 2}
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
										<i class="fas fa-chevron-right"></i>
									</button>
								</li>
							</ul>
						</nav>
					</div>
				</CardBody>
			</Card>
		{/if}

	</div>
</main>

<!-- Modal -->
<Linecompare bind:open={lineCompare} {oldText} {newText} />

<style>
	.user-avatar {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
		border: none !important;
		box-shadow: none !important;
	}
	
	.table-responsive {
		border-radius: 0.5rem;
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

	.cursor-pointer {
		cursor: pointer;
	}

	.text-truncate {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 768px) {
		.table th,
		.table td {
			padding: 0.5rem;
			font-size: 0.875rem;
		}
		
		.user-avatar {
			width: 24px !important;
			height: 24px !important;
			font-size: 10px !important;
		}
	}
</style>