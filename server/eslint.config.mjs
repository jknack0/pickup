import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    { ignores: ['dist', 'node_modules'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
    },
);
