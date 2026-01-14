export interface CodeConversionLanguage {
	name: string;
	displayName: string;
	logoPath: string;
}

export interface CodeConversionPrompts {
	[key: string]: { [key: string]: string };
}

export const availableLanguages: CodeConversionLanguage[] = [
	{ name: 'SQL Server', displayName: 'MS SQL Server', logoPath: '/images/sqlserver.png' },
	{ name: 'Oracle', displayName: 'Oracle', logoPath: '/images/oracle.png' },
	{ name: 'PostgreSQL', displayName: 'PostgreSQL', logoPath: '/images/PostgreSQL-Logo.png' },
	{ name: 'Sybase', displayName: 'Sybase', logoPath: '/images/sybase.png' }
];

export const conversionPrompts: CodeConversionPrompts = {
	'Default': {
		'Default': 
`You are an expert SQL developer, familiar with both {input_language} and {target_language}.
You have been tasked with converting {input_language} SQL code into {target_language} SQL code.
While converting retain the business logic, name, order, comments, variable names, object names.
While converting assume the DB objects exists already.  Output should  be optimized for performance.
INCLUDE THE ENTIRE CODE CHUNK IN THE RESPONSE.`,
	},
	'Oracle_SQL Server': {
		'Complex Procedure':
`Convert the Oracle stored procedure into a SQL Server stored procedure while ensuring that the functionality remains consistent.

Formatting Considerations:
    Comments: Comments, denoted by -- or ** blocks, should be preserved across the conversion.
    Naming Conventions: Ensure that all table names, column names, variables, and other identifiers are properly converted and retained.
    Descriptions: Ensure all descriptions, comments, and metadata are properly converted and strictly retained. Specifically, make sure to retain specific characters such as '$', etc.
    Newline Characters: Handle newline characters ("\\n") appropriately. They should not be added at the end of variable declarations or in the middle of statements.
    Indentation: Maintain proper indentation for readability and consistency.

Performance Tuning Considerations:
    Reducing Table Size: Filter data to include only the observations needed for the procedure.
    Reduce Join Complexity: Filter the tables before joining them to reduce the number of rows processed.
    Temporary Tables: Use temporary tables to store intermediate results and reduce the number of times data is read from disk.

Conversion Considerations:
    PL/SQL syntax to T-SQL syntax: Ensure proper translation of Oracle's PL/SQL constructs into SQL Server's T-SQL.
    Data types: Convert Oracle-specific data types (e.g., NUMBER, VARCHAR2, DATE) into their SQL Server equivalents (e.g., DECIMAL, VARCHAR, DATETIME).
    Error handling: Replace Oracle's EXCEPTION handling with SQL Server's TRY...CATCH mechanism. Retain the error messages and any other specific logic.
    Sequences: If the Oracle procedure uses sequences (e.g., sequence_name.NEXTVAL), replace them with SQL Server identity columns or SEQUENCE objects.
    Cursors and loops: If cursors and loops are used in the procedure, convert them to SQL Server's equivalent syntax.
    Transaction control: Convert Oracle's transaction control (e.g., COMMIT, ROLLBACK) to SQL Server's.
    OUT parameters: Translate Oracle's IN OUT and OUT parameters to SQL Server's equivalent.`,
		'Complex Statement': 
`Convert the Oracle statement into a SQL Server statement while ensuring that the functionality remains consistent.

Formatting Considerations:
    Comments: Comments, denoted by -- or ** blocks, should be preserved across the conversion.
    Naming Conventions: Ensure that all table names, column names, variables, and other identifiers are properly converted and retained.
    Descriptions: Ensure all descriptions, comments, and metadata are properly converted and strictly retained. Specifically, make sure to retain specific characters such as '$', etc.
    Newline Characters: Handle newline characters ("\\n") appropriately. They should not be added at the end of variable declarations or in the middle of statements.
    Indentation: Maintain proper indentation for readability and consistency.

Performance Tuning Considerations:
    Reducing Table Size: Filter data to include only the observations needed for the procedure.
    Reduce Join Complexity: Filter the tables before joining them to reduce the number of rows processed.
    Temporary Tables: Use temporary tables to store intermediate results and reduce the number of times data is read from disk.

Conversion Considerations:
    Data types: Convert Oracle-specific data types (e.g., NUMBER, VARCHAR2, DATE) into their SQL Server equivalents (e.g., DECIMAL, VARCHAR, DATETIME).
    Functions: Replace Oracle's specific functions with SQL Server equivalents (e.g., NVL with ISNULL, TO_CHAR with CONVERT).
    Joins: Ensure proper join syntax conversion, especially for outer joins (Oracle's (+) operator to SQL Server's LEFT/RIGHT JOIN).
    Date functions: Convert Oracle's date functions (e.g., SYSDATE) to SQL Server's (e.g., GETDATE()).
    String functions: Convert Oracle's string functions (e.g., SUBSTR) to SQL Server's (e.g., SUBSTRING).`,
		'Simple Statement': 
`Convert the Oracle statement into a SQL Server statement while ensuring that the functionality remains consistent.

Key Areas:
    Data types: Convert Oracle-specific data types to SQL Server equivalents.
    Functions: Replace Oracle functions with SQL Server equivalents.
    Joins: Convert Oracle join syntax to ANSI standard.
    Date handling: Replace Oracle date functions with SQL Server equivalents.`,
		'Default': 
`You are an expert SQL developer, familiar with both Oracle and SQL Server.
You have been tasked with converting Oracle SQL code into SQL Server SQL code.
While converting retain the business logic, name, order, comments, variable names, object names.
While converting assume the DB objects exists already. Output should be optimized for performance.
INCLUDE THE ENTIRE CODE CHUNK IN THE RESPONSE.`
	},
	'Sybase_SQL Server': {
		'Complex Procedure':
`Convert the Sybase stored procedure into a SQL Server stored procedure while ensuring that the functionality remains consistent.

Formatting Considerations:
    Comments: Comments, denoted by -- or ** blocks, should be preserved across the conversion.
    Naming Conventions: Ensure that all table names, column names, variables, and other identifiers are properly converted and retained.
    Descriptions: Ensure all descriptions, comments, and metadata are properly converted and strictly retained.
    Newline Characters: Handle newline characters appropriately.
    Indentation: Maintain proper indentation for readability and consistency.

Conversion Considerations:
    Stored procedure syntax: Convert Sybase procedure syntax to SQL Server T-SQL.
    Data types: Convert Sybase-specific data types to SQL Server equivalents.
    Error handling: Convert Sybase error handling to SQL Server TRY...CATCH.
    Transaction control: Ensure proper transaction handling conversion.
    Variable declarations: Convert Sybase variable syntax to SQL Server.`,
		'Default': 
`You are an expert SQL developer, familiar with both Sybase and SQL Server.
You have been tasked with converting Sybase SQL code into SQL Server SQL code.
While converting retain the business logic, name, order, comments, variable names, object names.
While converting assume the DB objects exists already. Output should be optimized for performance.
INCLUDE THE ENTIRE CODE CHUNK IN THE RESPONSE.`
	}
};

export interface LanguageConfigPromptStore {
	[key: string]: {
		original: { [key: string]: string };
		current: string;
	};
}

export function createLanguageConfigPromptStore(): LanguageConfigPromptStore {
	const store: LanguageConfigPromptStore = {};
	
	for (const inputLang of availableLanguages) {
		for (const targetLang of availableLanguages) {
			if (inputLang.name !== targetLang.name) {
				const key = `${inputLang.name}_${targetLang.name}`;
				const prompts = conversionPrompts[key] || conversionPrompts['Default'];
				store[key] = {
					original: prompts,
					current: Object.entries(prompts)[0][1]
				};
			}
		}
	}
	
	return store;
}
