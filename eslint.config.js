import js from '@eslint/js';
    import tseslint from 'typescript-eslint';
    import react from 'eslint-plugin-react';
    import reactHooks from 'eslint-plugin-react-hooks';
    import reactRefresh from 'eslint-plugin-react-refresh';
    
    export default tseslint.config({
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      plugins: {
        react,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        'react-refresh/only-export-components': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        ...reactHooks.configs.recommended.rules,
      },
      languageOptions: {
        globals: {
          // Add browser globals
          window: 'readonly',
          document: 'readonly',
          navigator: 'readonly',
          // Add other browser-specific globals as needed
        },
      },
    });
    
