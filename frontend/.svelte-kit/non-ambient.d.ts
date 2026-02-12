
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(app)" | "/" | "/(app)/admin" | "/(app)/admin/testing" | "/(app)/auth" | "/(app)/auth/login" | "/(app)/auth/profile" | "/(app)/auth/signup" | "/(app)/cart" | "/(app)/cart/checkout" | "/(app)/cart/success" | "/(app)/codereview" | "/(app)/code" | "/(app)/code/convert" | "/(app)/code/insights" | "/(app)/databaseinsights" | "/(app)/documentinsights" | "/(app)/graphUI" | "/(app)/jsonParser" | "/(app)/memberinsights" | "/(app)/webinsights";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/(app)": Record<string, never>;
			"/": Record<string, never>;
			"/(app)/admin": Record<string, never>;
			"/(app)/admin/testing": Record<string, never>;
			"/(app)/auth": Record<string, never>;
			"/(app)/auth/login": Record<string, never>;
			"/(app)/auth/profile": Record<string, never>;
			"/(app)/auth/signup": Record<string, never>;
			"/(app)/cart": Record<string, never>;
			"/(app)/cart/checkout": Record<string, never>;
			"/(app)/cart/success": Record<string, never>;
			"/(app)/codereview": Record<string, never>;
			"/(app)/code": Record<string, never>;
			"/(app)/code/convert": Record<string, never>;
			"/(app)/code/insights": Record<string, never>;
			"/(app)/databaseinsights": Record<string, never>;
			"/(app)/documentinsights": Record<string, never>;
			"/(app)/graphUI": Record<string, never>;
			"/(app)/jsonParser": Record<string, never>;
			"/(app)/memberinsights": Record<string, never>;
			"/(app)/webinsights": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/testing" | "/admin/testing/" | "/auth" | "/auth/" | "/auth/login" | "/auth/login/" | "/auth/profile" | "/auth/profile/" | "/auth/signup" | "/auth/signup/" | "/cart" | "/cart/" | "/cart/checkout" | "/cart/checkout/" | "/cart/success" | "/cart/success/" | "/codereview" | "/codereview/" | "/code" | "/code/" | "/code/convert" | "/code/convert/" | "/code/insights" | "/code/insights/" | "/databaseinsights" | "/databaseinsights/" | "/documentinsights" | "/documentinsights/" | "/graphUI" | "/graphUI/" | "/jsonParser" | "/jsonParser/" | "/memberinsights" | "/memberinsights/" | "/webinsights" | "/webinsights/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/config.js" | "/favicon.ico" | "/favicon.png" | "/images/CognizantLogoWhite.png" | "/images/Cognizant_logo_2022.png" | "/images/PostgreSQL-Logo.png" | "/images/champLogo.jpg" | "/images/champLogo2.png" | "/images/codeInsights.png" | "/images/databaseInsights.png" | "/images/documentInsights.png" | "/images/facetsLogo.png" | "/images/graphUI.png" | "/images/memberInsights.png" | "/images/oracle.png" | "/images/sqlconvert.png" | "/images/sqlserver.png" | "/images/sybase.png" | "/images/webinsights.png" | string & {};
	}
}