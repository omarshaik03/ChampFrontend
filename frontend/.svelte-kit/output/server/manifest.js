export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["config.js","favicon.ico","favicon.png","images/CognizantLogoWhite.png","images/Cognizant_logo_2022.png","images/PostgreSQL-Logo.png","images/champLogo.jpg","images/champLogo2.png","images/codeInsights.png","images/databaseInsights.png","images/documentInsights.png","images/facetsLogo.png","images/graphUI.png","images/memberInsights.png","images/oracle.png","images/sqlconvert.png","images/sqlserver.png","images/sybase.png","images/webinsights.png"]),
	mimeTypes: {".js":"text/javascript",".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.C9CSEIFr.js",app:"_app/immutable/entry/app.ljZq9DAT.js",imports:["_app/immutable/entry/start.C9CSEIFr.js","_app/immutable/chunks/CwNfz3HV.js","_app/immutable/chunks/_MZGgvaG.js","_app/immutable/chunks/B17Q6ahh.js","_app/immutable/chunks/BZQtr_Lx.js","_app/immutable/entry/app.ljZq9DAT.js","_app/immutable/chunks/_MZGgvaG.js","_app/immutable/chunks/DdfBw5sN.js","_app/immutable/chunks/DjduXCyD.js","_app/immutable/chunks/D2BTio8A.js","_app/immutable/chunks/BZQtr_Lx.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/(app)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/(app)/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(app)/admin/testing",
				pattern: /^\/admin\/testing\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/auth/profile",
				pattern: /^\/auth\/profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/auth/signup",
				pattern: /^\/auth\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/cart",
				pattern: /^\/cart\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/cart/checkout",
				pattern: /^\/cart\/checkout\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/cart/success",
				pattern: /^\/cart\/success\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(app)/codereview",
				pattern: /^\/codereview\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(app)/code/convert",
				pattern: /^\/code\/convert\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(app)/code/insights",
				pattern: /^\/code\/insights\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(app)/databaseinsights",
				pattern: /^\/databaseinsights\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(app)/documentinsights",
				pattern: /^\/documentinsights\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(app)/graphUI",
				pattern: /^\/graphUI\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(app)/jsonParser",
				pattern: /^\/jsonParser\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(app)/memberinsights",
				pattern: /^\/memberinsights\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(app)/webinsights",
				pattern: /^\/webinsights\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
