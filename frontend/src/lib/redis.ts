import type { ChatContent, LlmOption, OpenSearchIndex, OutputType} from "./commontypes";

//Hide later
const mode = import.meta.env.VITE_MODE;

let url = "https://adjusted-wren-54019.upstash.io"
let token = "AdMDAAIncDE2NWUwM2E4MGU3ZWM0NDhkODkxZmI3Mzc2YjE3N2NkM3AxNTQwMTk"
if (mode === "dev"){
    url = "https://usw2-brief-osprey-32006.upstash.io"
    token = "AX0GASQgYzEyZGRlM2UtNDk0Zi00YjQ2LTk3OGQtMzk2ZGEyMjVjYzBmYzg1MmFiMTU2NDE5NDc3MDliYTUwNDM2NmRiOTA2YjQ="
}

export async function del_all(): Promise<any> {
    const keys = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
            [
                ["KEYS", "*"],
            ],
        ),
    });
    const body = await keys.json();
    const keysArray:string[] = body[0].result
    let delBody = [
        ["DEL"]
    ]; 
    keysArray.forEach((key) => {
        delBody[0].push(key);
    });
    const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(delBody),
    });
    console.log("Deleted all keys");
    return body.result;
}

export async function del(key: string): Promise<any> {
    const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
            [
                ["DEL", key],
            ],
        ),
    });
    const body = await response.json();
    return body.result;
}

export function wait(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export async function setQueryCache(
    key: string,
    chatContent: ChatContent,
    index: OpenSearchIndex,
    llm: LlmOption,
    outputType: OutputType,
    structuredString?: string
): Promise<any> {
    let cacheBody: ChatContent = {
        user: chatContent.user,
        chatbot: chatContent.chatbot,
        link: chatContent.link,
    };
    if (chatContent.debug) {
        cacheBody.debug = chatContent.debug;
    }
    if (chatContent.review) {
        cacheBody.review = chatContent.review;
    }

    //check if the key exists
    if (!await keyExists(key)) {
        await createEmptyCache(key);
    }

    if (structuredString  && outputType === "structured") {
        await validateOrCreatePath(key, [index, llm, outputType, structuredString]);
        const response = await set(
            key,
            JSON.stringify(cacheBody),
            `$.["${index}"]["${llm}"]["${outputType}"]["${structuredString}"]`
        );
        return response;
    } else {
        await validateOrCreatePath(key, [index, llm, outputType]);
        const response = await set(
            key,
            JSON.stringify(cacheBody),
            `$.["${index}"]["${llm}"]["${outputType}"]`
        );
        return response;
    }
}

export async function getQueryCache(
    key: string,
    index: OpenSearchIndex,
    llm: LlmOption,
    outputType: OutputType,
    structuredString?: string
): Promise<ChatContent | null> {
    let response: string | null;
    if (structuredString && outputType === "structured") {
        response = await get(key, `$.["${index}"]["${llm}"]["${outputType}"]["${structuredString}"]`);
    } else {
        response = await get(key, `$.["${index}"]["${llm}"]["${outputType}"]`);
    }
    if (response == null) {
        return null;
    }
    const listOfResults = JSON.parse(response);
    const chatContent: ChatContent = listOfResults[0];
    return chatContent;
}

// -- Helper functions --
async function createEmptyCache(key: string): Promise<any> {
    const result = await set(key, "{}");
    return result;
}

async function keyExists(key: string): Promise<boolean> {
    const result = await get(key);
    return result != null;
}

async function validateOrCreatePath(key: string, path: string[]) {
    let currentPath = "$";
    for (let i = 0; i < path.length; i++) {
        currentPath += `["${path[i]}"]`;
        let response = await get(key, currentPath);
        console.log(response);
        if (response == "[]") {
            await set(key, "{}", currentPath);
        }
    }
}

async function get(key: string, path?: string): Promise<string | null> {
    if (path == null) {
        path = "$";
    }
    const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
            [
                ["JSON.GET", key, path]
            ],
        ),
    });
    const body = await response.json();
    return body[0].result;
}

async function set(key: string, value: string, path?: string): Promise<any> {
    if (path == null) {
        path = "$";
    }
    const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        body: JSON.stringify(
            [
                ["JSON.SET", key, path, value]
            ],
        ),
    });
    const body = await response.json();
    return body[0].result;
}