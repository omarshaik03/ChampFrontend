export type OutputType = 'standard' | 'structured' | 'crewai';

export type ChatContent = {
	analysis: any;
    user: string | undefined
    chatbot: {structured_output: {[header:string]: string}[]} | string | undefined;
    link: {[key:string] :string};
    debug?: {[key: string]: string};
    time?: string;
    review?: {rating: number, review: string};
    img_url?: string;
};

export type OpenSearchIndex = string;

export const APPS: {[key: string]: {
    alias: string;
    route: string;
}} = {
    Home: {
        alias: "Home",
        route: "/"
    },
    Profile: {
        alias: "Profile",
        route: "/auth/profile"
    },
    CodeConvert: {
        alias: "Code Conversion",
        route: "/code/convert"
    },
    CodeInsights: {
        alias: "Code Insights",
        route: "/code/insights"
    },
    DatabaseInsights: {
        alias: "Database Insights",
        route: "/databaseinsights"
    },
    DocumentInsights: {
        alias: "Document Insights",
        route: "/documentinsights"
    },
    "DocumentInights(CrewAI)": {
        alias: "Document Insights (CrewAI)",
        route: "/documentinsights/crewai"
    },
    WebInsights: {
        alias: "Web Insights",
        route: "/webinsights"
    },
    MemberInsights: {
        alias: "Member Insights",
        route: "/memberinsights"
    },
    // CodeReview: {
    //     alias: "Code Review",
    //     route: "/codereview"
    // },
    Admin: {
        alias: "Admin",
        route: "/admin"
    },
};

export type Llm = 
    'GPT4' | 'GPT3' | 'GPT4o' |
    'Claude 3.5 Sonnet' | 'Claude V3 Opus' | 'Claude V2' |
    'Llama 3.2 90B' | 'Llama 3 70b' | 'Llama 3 8b' | 'Llama 2 Chat 70b'| 
    'Mistral 7B' | "Mistral Large" | "Mistral Small" | "Mixtral 8x7B";

export type LlmDetail = {
    name: Llm;
    token_cost: {
        input: number,
        output: number,
    }
}

export const LLMS: {
    [key: string]: LlmDetail
} = {
    'gpt-4o': {name: 'GPT4o', token_cost: {input: 0.005/1000, output: 0.015/1000,}},
    'Mistral Large': {name: 'Mistral Large', token_cost: {input: 0.004/1000, output: 0.012/1000,}},
    'Llama 3.2 90B': {name: 'Llama 3.2 90B', token_cost: {input: 0.002/1000, output: 0.002/1000,}},
    'Claude 3.5 Sonnet': {name: 'Claude 3.5 Sonnet', token_cost: {input: 0.003/1000, output: 0.015/1000,}},
}