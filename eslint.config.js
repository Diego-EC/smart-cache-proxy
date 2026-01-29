import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...configPrettier.rules, // Desactiva reglas de conflicto
      'prettier/prettier': 'error', // Prettier ahora avisa como error de ESLint
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
