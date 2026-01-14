import { getQueryCache, setQueryCache, wait } from "./redis";
import type { OutputType, ChatContent, OpenSearchIndex, Llm } from "./commontypes";

//Set URL based on mode
let url_base = import.meta.env.VITE_DEV_URL;
// Define route URL
let url = url_base + "/api/opensearch_rag/ragquery/rag";
//url = "http://127.0.0.1:8000/" + "api/opensearch_rag/ragquery/rag";

console.log("URL: ", url);

let linkRefernce: { [id: string]: string} = {
    "What is Facets?": "https://cx.trizetto.com/htmldoc/FAC610/Getting-Started-with-Facets---Facets-Getting-Started-Guide_260003913.html",
    "What does the Facets System Administration product contain?": "https://cx.trizetto.com/htmldoc/FAC610/Getting-Started-with-Facets---Facets-Getting-Started-Guide_260003913.html",
    "How to setup facets RDS DB for the cluster?": "/pdf",
    "What are pre-requisites for Facets G6?": "https://google.com",
    "Can Batch Job ercmcrunblaf be run concurrently with ercdsrunbil0?": "https://google.com",
    "Can Batch Job ercmcrunblac be run concurrently with ercmcrunblat?": "https://google.com"
}

const controller = new AbortController();

export async function sendCrewQuery(
    query: string,
    llmSel: Llm,
    index: OpenSearchIndex | string,
    socket_id: string,
    jwt: string,
    user: string,
    structuredListOfColumns?: { column_name: string, column_description: string }[]
) {
    const cachedChatContent = await getQueryCache(query, index, llmSel, 'crewai');
    if (cachedChatContent) {
        console.log(cachedChatContent);
        return { cached: true, content: cachedChatContent };
    }

    let body: {
        socket_id: any,
        question: string, model: Llm, index: OpenSearchIndex, promptedit?: string,
        list_of_columns?: { column_name: string, column_description: string }[]
    };
    if (structuredListOfColumns && structuredListOfColumns.length > 0) {
        body = {
            socket_id: socket_id,
            question: query,
            model: llmSel,
            index: index,
            list_of_columns: structuredListOfColumns,
        };
    } else {
        body = {
            socket_id: socket_id,
            question: query,
            model: llmSel,
            index: index,
        };
    }
    const response = await fetch(
        url_base + "/api/opensearch_rag/ragquery/crewTest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt,
            },
            body: JSON.stringify(body),
        }
    );
    if (!response.ok) {
        await fetch(
            url_base + "/logs",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt,
                },
                body: JSON.stringify({
                    user_id: user,
                    user_question: query,
                    feedback: "none",
                    model_id: llmSel,
                    application: index,
                    index: index,
                    logs: "Failed to send query. Error:" + response.status,
                }),
            });
        throw new Error("HTTP error " + response.status);
    }
    const data = await response.json();
    const answer = data.response.answer;
    console.log(data.response);
    console.log(data.response.review_task_output);
    const chatContent: ChatContent = {
        user: query,
        chatbot: answer,
        link: {},
        debug: {"tokens": data.response.tokens_used},
        review: {
            rating: data.response.review_task_output.json_dict.score,
            review: data.response.review_task_output.json_dict.explanation
        }
    }
    await setQueryCache(query, chatContent, index, llmSel, 'crewai');
    await fetch(
        url_base + "/logs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt,
            },
            body: JSON.stringify({
                user_id: user,
                user_question: query,
                response: chatContent.chatbot,
                feedback: "none",
                model_id: llmSel,
                application: index,
                tokens_used: data.tokens_used,
                index: index,
            }),
        });
    return { cached: false, content: chatContent };
}

export async function sendQuery(
    query: string,
    app: string,
    llmSel: Llm,
    index: OpenSearchIndex | string,
    jwt: string,
    structuredListOfColumns?: { column_name: string, column_description: string }[],
): Promise<ChatContent> {
    // Check if query is empty
    if (query.trim() === '') {
        throw new Error('Query is empty');
    }
    query = query.trim();
   
    // Construct the request body
    // Differentiate between structured and standard queries
    let body: { 
        question: string, model: Llm, index: OpenSearchIndex, app: string, promptedit?: string,
        list_of_columns?: { column_name: string, column_description: string }[]
    };
    if (structuredListOfColumns && structuredListOfColumns.length > 0) {
        body = {
            question: query,
            model: llmSel,
            index: index,
            app: app,
            list_of_columns: structuredListOfColumns,
        };
    } else {
        body = {
            question: query,
            model: llmSel,
            index: index,
            app: app
        };
    }

    // Send the query
    const response = await fetch(
        url,
        {
            method: 'POST',
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt,
            },
            body: JSON.stringify(body),
        }
    );

    // Response validation
    if (!response || !response.ok) {
        throw new Error('Failed to send query');
    }
    const data = await response.json();
    if (!data) {
        throw new Error('Failed to parse response');
    }
    let chatbotResponse = data.response;
    if (!chatbotResponse) {
        throw new Error('Failed to parse chatbot response');
    }

    const source = data.source;
    if (!source) {
        throw new Error('Failed to parse source');
    }

    const debug = data.recorded_times;
    if (!debug) {
        throw new Error('Failed to parse recorded times');
    }

    const message = data.message;
    if (!message) {
        throw new Error('Failed to parse message');
    }

    const img_url = data.img_url;
    if (!img_url) {
        console.log("No image source");
    }

    // Create chat content
    const chatContent: ChatContent = {
        user: query,
        chatbot: chatbotResponse,
        link: {
            'sharepoint': source.sharepoint ? linkRefernce[source.sharepoint] : source,
            'S3': source.S3 ? linkRefernce[source.S3] : source
        },
        img_url: img_url ? img_url : "",
        debug: debug,
    };

    await fetch(
        url_base + "/logs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt,
            },
            body: JSON.stringify({
                user_id: query,
                user_question: query,
                response: chatbotResponse,
                feedback: "none",
                model_id: llmSel,
                application: index,
                tokens_used: data.tokens_used,
                index: index,
                app: app
            }),
        });

    let outputType: OutputType;
    if (structuredListOfColumns && structuredListOfColumns.length > 0) {
        outputType = 'structured';
    } else {
        outputType = 'standard';
    }

    if (outputType == 'structured' && message == 'Failed Parsing') {
        outputType = 'standard';
    }
    
    // Handle structured output formatting if needed
    if(outputType == 'structured' && structuredListOfColumns && structuredListOfColumns.length > 0){
        chatContent.chatbot = parseStructuredOutput(chatContent.chatbot as { structured_output: {[header:string]: string}[] }) as string;
    }

    return chatContent;
}

export function abortQuery() {
    controller.abort();
}

// -- Helper functions --

async function getQueryCacheHelper(
    query: string,
    llm: Llm,
    index: OpenSearchIndex,
    outputType: OutputType,
    structuredString?: string
): Promise<ChatContent | null> {
    const cache: ChatContent | null = await getQueryCache(query, index, llm, outputType, structuredString);
    await wait(1000 + (Math.random() * 1000));
    if (cache) {
        if(outputType == 'structured'){
            cache.chatbot = parseStructuredOutput(cache.chatbot as { structured_output: {[header:string]: string}[] }) as string;
        }
        return cache;
    } else {
        return null;
    }
}

export function parseStructuredOutput(chatbot: { structured_output: {[header:string]: string}[] }): string | null {
    const structuredOutput = chatbot.structured_output;
    if (!structuredOutput) {
        return null;
    }
    const url = createCSV(structuredOutput);
    const table = createHTMLTable(structuredOutput);
    return `Here is your structured answer: <a href="${url}" download="structured_output.csv">Download CSV</a><br/><br/>${table}`;
}

// create a CSV file from the list of objects with the headers as common keys across the objects
function createCSV(list_of_objects: {[header: string]: string}[]) {
    let headers = Object.keys(list_of_objects[0]);
    let csv = headers.join(',') + '\n';
    list_of_objects.forEach((obj) => {
        let row = headers.map((header) => {
            return `"${obj[header]}"`;
        });
        csv += row.join(',') + '\n';
    });
    
    // create a blob from the CSV string
    let blob = new Blob([csv], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);

    return url;
}

function createHTMLTable(list_of_objects: {[header: string]: string}[]) {
    let headers = Object.keys(list_of_objects[0]);
    let table = '<table class="table"><tr>';
    headers.forEach((header) => {
        table += `<th>${header}</th>`;
    });
    table += '</tr>';
    list_of_objects.forEach((obj) => {
        table += '<tr>';
        headers.forEach((header) => {
            table += `<td>${obj[header]}</td>`;
        });
        table += '</tr>';
    });
    table += '</table>';

    return table;
}