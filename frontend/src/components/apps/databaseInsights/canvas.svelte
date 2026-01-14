<script lang="ts">
	import Table from "./table.svelte";
	import SqlHighlight from "./sqlHighlight.svelte";
	import QueryResult from "./queryResult.svelte";
	import Spinner from "./spinner.svelte";
	import { io, Socket } from "socket.io-client";
	import { socketStore, addSocket, closeSocket } from "../../../lib/stores/socketStore";
	export let url_base: undefined | string;
	export let token: undefined | string;

    export let selectedDb: string;
	export let llm: string;
	export let sqlDialect: string;
	export let username: string;
	export let password: string;
	export let host: string;
	export let driver: string;
	export let port: undefined | string = undefined;
	export let database: string;
	export let poolRecycle: undefined | string = undefined;

	let isLoading = false;

    let query = '';

    let messages: {
		precontent?: string;
		content: any;
		type: string;
	}[] = [];

	function parseTableData(data: string): string[][] {
		// Example input: [(101, 1, '550e8400-e29b-41d4-a716-446655440000', datetime.datetime(2025, 1, 16, 15, 42, 36, 393000), 'SourceA'), 
		// (102, 2, '550e8400-e29b-41d4-a716-446655440001', datetime.datetime(2025, 1, 16, 15, 42, 36, 393000), 'SourceB'), 
		// (103, 3, '550e8400-e29b-41d4-a716-446655440002', datetime.datetime(2025, 1, 16, 15, 42, 36, 393000), 'SourceC')]
		
		// Remove the outer brackets and split the string into rows
		let rows = data.slice(1, -1).split('), (');
		
		// Parse each row into an array of strings
		return rows.map(row => {
			// Remove any leading or trailing brackets and split by comma
			return row.replace(/[\(\)]/g, '').split(', ').map(cell => cell.trim());
		});
	}

	function handleQueryResponse(data: any) {
		let chunk = data.response;

		let message: {
			precontent?: string;
			content: any;
			type: string;
		};
		let message_type = chunk["type"];
		let tool_name = chunk["tool_name"];
		if (message_type === "tool_response") {
			if (tool_name === "sql_db_query") {
				message = {
					precontent: `Tool: ${tool_name} responded with:`,
					content: parseTableData(chunk["content"]),
					type: "table",
				}
			} else if(tool_name === "sql_db_schema" || tool_name === "sql_db_query_checker") {
				message = {
					precontent: `Tool: ${tool_name} responded with:`,
					content: chunk["content"],
					type: "sql"
				}							
			} else {
				message = {
					content: `Tool: ${tool_name} responded with: ${chunk["content"]}`,
					type: "chat"
				}
			}
		} else if(message_type === "tool_call") {
			if (tool_name === "sql_db_query" || tool_name === "sql_db_query_checker") {
				message = {
					precontent: `Calling tool: ${tool_name}, with query:`,
					content: `${chunk["arguments"]["query"]}`,
					type: "sql"
				}
			} else {
				message = {
					content: `Calling tool: ${chunk["tool_name"]}, with parameters: ${JSON.stringify(chunk["arguments"], null, 2)}`,
					type: "chat"
				}
			}
		} else if(message_type === "agent_response") {
			message = {
				content: chunk["content"],
				type: "chat"
			}
		} else {
			message = {
				content: JSON.stringify(chunk, null, 2),
				type: "unknown"
			}
		}
		messages = [...messages, message];
	}

	$: socket = $socketStore.socket;
	if (llm && sqlDialect && username && password && host && driver && database) {
		if (socket === undefined) {
			addSocket(io(`${url_base}`));
		} else {
			socket.on('connect', () => {
				
			});

			socket.on('disconnect', () => {
				// Blank
			});

			socket.on('query_response', (data) => {
				handleQueryResponse(data);
			});

			socket.onAny((event, ...args) => {
				console.log(`Event: ${event}, Status: ${args[0].status}, Message: ${args[0].message}`);
			});
		}
	}

	function create_agent() {
		if (typeof socket !== 'undefined') {
			console.log(`Creating agent with LLM: ${llm} and host: ${host}`);
			socket.emit('create_agent', {
				"username": username,
				"password": password,
				"host": host,
				"driver": driver,
				"port": port,
				"database": database,
				"pool_recycle": poolRecycle,
				"dialect": sqlDialect,
				"llm": llm,
			});
		}
	}

	function query_db() {
		if (typeof socket !== 'undefined') {
			console.log("Querying database");
			socket.emit('query', {
				"query": query
			});
		}
	}
</script>
  

  <main class="flex-grow-1 p-4">
    <h2>Database Interaction</h2>
    <div class="form-group">
      <label for="queryInput">Enter SQL Query</label>
	  <Spinner buffering={isLoading}
	  />
      <textarea
        id="queryInput"
        class="form-control"
        rows="5"
        bind:value={query}
        placeholder={`Write your ${selectedDb} query here...`}
      ></textarea>
    </div>
    <button class="btn btn-primary mt-2" on:click={query_db}>Execute</button>
	<button class="btn btn-primary mt-2" on:click={create_agent}>Create Agent</button>
  
    <div class="mt-4 message-container">
		{#if messages.length > 0}
			<h5>Query Result:</h5>
			
			{#each messages as message}
				<div class="mt-2">
					{#if message.type === "table"}
						{#if message.precontent}
							<p>{message.precontent}</p>
						{/if}
						<Table 
							data={message.content}
							striped={true}
							hover={true}
							bordered={true}
							use_headers={false}
						/>
					{:else if message.type === "sql"}
						{#if message.precontent}
							<p>{message.precontent}</p>
						{/if}
						<SqlHighlight
							content = {message.content}
						/>
					{:else if message.type === "chat"}
						<p>
							<QueryResult
								content = {message.content}
							/>
						</p>
					{:else}
						<p>
							<QueryResult
								content = {message.content}
							/>
						</p>
					{/if}
				</div>
			{/each}
		{/if}
    </div>
  </main>
  
<style>
	.message-container {
		width: 1000px;
		overflow-wrap: break-word;
	}
</style>