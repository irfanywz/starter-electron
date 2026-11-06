import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['out', 'release', 'dist', 'node_modules', '.dev-data', '.electron-cache'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Main process + preload + config + scripts: Node
    files: [
      'src/main/**/*.ts',
      'src/preload/**/*.ts',
      'electron.vite.config.ts',
      'scripts/**/*.mjs',
      'eslint.config.mjs'
    ],
    languageOptions: { globals: globals.node }
  },
  {
    // Renderer: browser + React hooks rules
    files: ['src/renderer/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules }
  },
  // Taruh paling akhir: matiin rule yang bentrok sama Prettier
  prettier
)
