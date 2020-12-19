module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	plugins: ['@typescript-eslint'],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint'
	],
	rules: {
		'no-reserved-keywords': 0,
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'no-prototype-builtins': 'off',
		'@typescript-eslint/ban-types': 'off'
	}
};
