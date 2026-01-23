// This file allows connecting API testing endpoints from various apps.
// Add your endpoints here to have them appear in the Admin Testing Dashboard.

export type TestEndpoint = {
    id: string;
    app: string;
    name: string;
    url: string; // Relative or absolute URL
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any; // JSON body
    description?: string;
    critical?: boolean; // If true, included in batch testing
    bodyType?: 'json' | 'form-data';
    formFields?: {
        name: string;
        type: 'text' | 'file';
        required?: boolean;
        defaultValue?: string;
    }[];
};

export const TESTING_ENDPOINTS: TestEndpoint[] = [
    {
        id: 'doc_insights_search',
        app: 'DocumentInsights',
        name: 'Search Documents',
        url: '{{DOC_INSIGHTS_URL}}/search/?query=health&top=2',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer {{TOKEN}}'
        },
        description: 'Search document insights with query=health and top=2',
        critical: true
    },
    {
        id: 'code_insight_submit',
        app: 'CodeInsights',
        name: 'Submit Code ZIP',
        url: '{{CODE_INSIGHTS_URL}}/input-zip-download',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer {{TOKEN}}'
        },
        description: 'Submit ZIP file for code insights analysis.',
        bodyType: 'form-data',
        formFields: [
            { name: 'access_key', type: 'text' },
            { name: 'report_file', type: 'file', required: true },
            { name: 'zip_file', type: 'file', required: true },
            { name: 'llm_key', type: 'text' },
            { name: 'llm_endpoint', type: 'text' },
            { name: 'llm_deployment_name', type: 'text' },
            { name: 'llm_api_version', type: 'text' }
        ]
    },
    {
        id: 'code_review_url',
        app: 'CodeReview',
        name: 'Review Git URL',
        url: '{{CODE_REVIEW_URL}}/review/url',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer {{TOKEN}}'
        },
        description: 'Analyze commits from a public Git repository URL',
        bodyType: 'form-data',
        formFields: [
            { name: 'repo_url', type: 'text', defaultValue: 'https://github.com/pallets/click.git', required: true },
            { name: 'to_ref', type: 'text', defaultValue: 'HEAD', required: true },
            { name: 'format', type: 'text', defaultValue: 'json', required: true },
            { name: 'from_ref', type: 'text', defaultValue: 'HEAD~5' },
            { name: 'max_commits', type: 'text', defaultValue: '5' },
            { name: 'branch', type: 'text', defaultValue: 'main' }
        ]
    },
    {
        id: 'external_example',
        app: 'External',
        name: 'JSON Placeholder',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        method: 'GET',
        description: 'Example external API call.'
    }
];
