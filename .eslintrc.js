module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: 'xo',
	overrides: [
		{
			extends: [
				'plugin:@typescript-eslint/recommended',
				'xo-typescript/space',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'max-len': ['error', {code: 80}],
		'no-console': ['error'],
	},
};
