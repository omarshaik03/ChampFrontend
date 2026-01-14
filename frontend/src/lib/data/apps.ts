export interface App {
	id: string;
	name: string;
	price: number | null;
	image: string;
	route: string;
	description: string;
}

export const apps: App[] = [
	{
		id: 'documentinsights',
		name: 'Document Insights',
		price: null,
		image: '/images/documentInsights.png',
		route: '/documentinsights',
		description: 'Analyze and extract insights from documents'
	},
	{
		id: 'memberinsights',
		name: 'Member Insights',
		price: null,
		image: '/images/memberInsights.png',
		route: '/memberinsights',
		description: 'Understand your community better'
	},
	{
		id: 'sqlconvert',
		name: 'SQL Convert',
		price: null,
		image: 'images/sqlconvert.png',
		route: '/code/convert',
		description: 'Convert SQL between different dialects'
	},
	{
		id: 'databaseinsights',
		name: 'Database Insights',
		price: null,
		image: '/images/databaseInsights.png',
		route: '/databaseinsights',
		description: 'Get powerful insights from your database'
	},
	{
		id: 'webinsights',
		name: 'Web Insights',
		price: null,
		image: '/images/webinsights.png',
		route: '/webinsights',
		description: 'Analyze web content and get valuable insights'
	},
	{
		id: 'codeinsights',
		name: 'Code Insights',
		price: null,
		image: 'images/codeInsights.png',
		route: '/code/insights',
		description: 'Use codeInsights reports to remediate custom code'
	},
	{
		id: 'graphUI',
		name: 'Agent Graph Generator',
		price: null,
		image: 'images/graphUI.png',
		route: '/jsonParser',
		description: 'Use graphs to create node based diagrams'
	},
	{
		id: 'codereview',
		name: 'Code Review',
		price: null,
		image: 'images/codeInsights.png',
		route: '/codereview',
		description: 'Analyze Git commits with AI-powered insights'
	},
];
