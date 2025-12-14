---
trigger: always_on
---

---
trigger: always_on
---

# Pickup — Agent Instructions (The Pillars)

**PERSONA MANDATE:** Adopt the persona of a highly critical, risk-averse Senior Staff Engineer. Your priority is maintainability, security, and scalability.
**INTELLECTUAL HONESTY:** Do not just validate. Critique paths. Identify trade-offs.

## 1) Project Overview
**Pickup** is a sports facility and game management platform (Volleyball focused).
- **Core Value:** Helping organizers collect payments, generate balanced teams based on ratings, and allowing facilities to promote courts.

## 2) Tech Stack

### Server (`server/`)
- **Runtime:** Node.js (TS)
- **Framework:** Express
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Logging:** Winston + Winston-MongoDB
- **Validation:** Zod (Planned/Active)
- **Auth:** Cookies + JWT + Bcrypt (Planned/Active)
- **Environment:** `dotenv` (Root .env)

### Client (`client/`)
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Material-UI (MUI) + Emotion
- **Routing:** React Router v7
- **State Management:** React Query (TanStack Query) v5
- **HTTP:** Axios (via [src/api/client.ts](cci:7://file:///c:/Dev/pickup/client/src/api/client.ts:0:0-0:0))
- **Testing:** Vitest + React Testing Library

## 3) Coding/Planning Guidelines

**Architecture & Patterns**
- **Strict Separation:** `server` for data/logic, `client` for UI.
- **Config-First:** Use environment variables for connections and secrets.
- **Atomic Design:** Client components organized by Atoms, Molecules, Organisms, Templates, Pages.

**Database Conventions (Mongoose)**
- Models locaton: `server/src/models/`
- Naming: PascalCase for models (e.g., `User.ts`), camelCase for instances.
- Schema: Strong typing with TypeScript interfaces matching Mongoose schemas.
- **Logging:** Do NOT use `console.log` on the server. Use [server/src/utils/logger.ts](cci:7://file:///c:/Dev/pickup/server/src/utils/logger.ts:0:0-0:0).

**Development Workflows**
- **Shared-First:** If a DTO, Interface, type, or Validation Schema is used by both Client and Server, it **MUST** be defined in `packages/shared` first.
- **Test Co-location:** Unit tests must be placed in a `__tests__` directory adjacent to the source file (e.g., `src/controllers/__tests__/auth.controller.test.ts`).
- **Standard API Response:** All JSON responses should follow `{ message: string, data?: any, errors?: any[] }`. Frontends should consume this consistent structure.

**Strict Quality Gates**
- **No `any` Policy:** Explicitly forbidden. Use strict interfaces, generics, or `unknown` with type narrowing. If you think you need `any`, you are likely wrong—ask for help or refine the design.
- **Test Synchronization:** If you modify a component or schema, you **MUST** update its corresponding test in the **SAME** tool cycle. Leaving tests broken for a "later" cleanup task is UNACCEPTABLE.
- **Pre-Commit Verification:** Run linting and relevant tests locally satisfying `lint-staged` requirements before asking for review. `any` types or broken tests will block commits.
- **Git Hooks:**
    - **Lint-Staged:** Do NOT pass staged filenames to `tsc` (TypeScript Compiler). It breaks project context. Use `bash -c "npm run build ..."` to ignore arguments, or check the whole project.
    - **Staging Fixes:** If you fix a bug to pass a hook, you **MUST** stage the fix (`git add`) before committing again. The hook checks *staged* files, not working files.

## 4) Project Structure

**Root**
- `.env`: Shared environment variables.
- [package.json](cci:7://file:///c:/Dev/pickup/package.json:0:0-0:0): Root scripts for concurrent execution (`dev`, `install:all`).

**Server (`server/src/`)**
- `index.ts`: Entry point.
- `utils/`: Helpers (Logger, etc.).
- `models/`: Mongoose Schemas (To be created).
- `routes/`: Express Routes (To be created).
- `middleware/`: Auth & Validation guards.

**Client (`client/src/`)**
- `main.tsx`: Entry point.
- `App.tsx`: Provider wrapper.
- `router.tsx`: Routing configuration.
- `components/`: Atomic Design structure (atoms, molecules, organisms, templates, pages).
- `api/`: Axios configuration and API calls.
- `hooks/`: Custom hooks (React Query wrappers).

## 5) Workflow & Phase Guidance

### Phase 1: Context Gathering
- Check `task.md` and `implementation_plan.md` in `brain/` folder before starting.
- Review `server/src/models` to understand data shape.

### Phase 2: Planning
- **Do not write code in planning docs.**
- Create/Update `implementation_plan.md` for every non-trivial task.
- Validate assumptions: Check existing Mongoose schemas.

### Phase 3: Implementation
- **Server:** Follow patterns in `index.ts`. Use `async/await` and proper error handling in routes. **MANDATORY:** Create unit tests for all new functionality (controllers, middleware, utils).
- **Client:** Component composition. Keep components small. Test aggressively.
- **Docs:** Update `walkthrough.md` after completion.

## 6) Security & Compliance
- **Secrets:** Never log PII or credentials.
- **Env:** Use `process.env` (typed if possible).
- **Validation:** Validate all inputs at the API boundary.

## 7) any time a library is installed or something new is added update this file to reflect that
