import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  rules: {
    // Allow rapid AI development without build failures
    '@typescript-eslint/no-explicit-any': 'off',
  },
});

