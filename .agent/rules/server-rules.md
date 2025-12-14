---
trigger: always_on
description: Server Development Guidelines
---

# Server Development Guidelines

## 1. Runtime Environment (ESM)
- **Module System**: The server MUST be strictly **ES Modules (ESM)** (`"type": "module"`).
- **File Extensions**: All relative imports MUST include the `.js` extension (e.g., `import Foo from './Foo.js';`).
- **Globals**: `__dirname` and `__filename` are NOT available. Use `import.meta.url` with `path.dirname` and `fileURLToPath` if needed.
- **Execution**: Use `tsx` (TypeScript Execute) for local development (`tsx watch`). `ts-node` is deprecated for this project due to ESM instability.

## 2. Testing Configuration (Jest + ESM)
- **Config Format**: `jest.config.js` MUST use ESM syntax (`export default`).
- **Extensions**: Configure `extensionsToTreatAsEsm: ['.ts']` to handle TypeScript files as modules.
- **Transform**: use `ts-jest` with `{ useESM: true }`.
- **Mappings**: Ensure `.js` extensions are mapped correctly in `moduleNameMapper` (e.g., `^(\\.{1,2}/.*)\\.js$': '$1'`).

## 2. Configuration & Environment
- **Dotenv**: The `.env` file is located at the **project root**. `dotenv.config()` must explicitly point to it if running from a subdirectory: `path.resolve(__dirname, '../../.env')`.
- **Static Assets**: The server MUST ONLY serve client static files when `process.env.NODE_ENV === 'production'`. Do not verify or serve frontend builds during development.

## 3. Shared Packages
- **Exports**: If consuming a local shared package, ensure it exports explicit entry points with extensions in its `package.json` (e.g., `exports: { ".": "./dist/index.js" }`).
- **Types**: Ensure declaration files (`.d.ts`) in shared packages also use `.js` extension in their re-exports if `moduleResolution` is `NodeNext`.
