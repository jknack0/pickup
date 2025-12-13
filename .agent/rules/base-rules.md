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
- **Validation:** (Planned: Zod or express-validator)
- **Environment:** `dotenv` (Root .env)

### Client (`client/`)
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** (Planned: Tailwind or CSS Modules)
- **HTTP:** (Planned: Axios or fetch)

## 3) Coding/Planning Guidelines

**Architecture & Patterns**
- **Strict Separation:** `server` for data/logic, `client` for UI.
- **Config-First:** Use environment variables for connections and secrets.

**Database Conventions (Mongoose)**
- Models locaton: `server/src/models/`
- Naming: PascalCase for models (e.g., `User.ts`), camelCase for instances.
- Schema: Strong typing with TypeScript interfaces matching Mongoose schemas.
- **Logging:** Do NOT use `console.log` on the server. Use [server/src/utils/logger.ts](cci:7://file:///c:/Dev/pickup/server/src/utils/logger.ts:0:0-0:0).

## 4) Project Structure

**Root**
- `.env`: Shared environment variables.
- [package.json](cci:7://file:///c:/Dev/pickup/package.json:0:0-0:0): Root scripts for concurrent execution (`dev`, `install:all`).

**Server (`server/src/`)**
- `index.ts`: Entry point.
- `utils/`: Helpers (Logger, etc.).
- `models/`: Mongoose Schemas (To be created).
- `routes/`: Express Routes (To be created).

**Client (`client/src/`)**
- `main.tsx`: Entry point.
- `App.tsx`: Main component/router.

## 5) Workflow & Phase Guidance

### Phase 1: Context Gathering
- Check `task.md` and `implementation_plan.md` in `brain/` folder before starting.
- Review `server/src/models` to understand data shape.

### Phase 2: Planning
- **Do not write code in planning docs.**
- Create/Update `implementation_plan.md` for every non-trivial task.
- Validate assumptions: Check existing Mongoose schemas.

### Phase 3: Implementation
- **Server:** Follow patterns in `index.ts`. Use `async/await` and proper error handling in routes.
- **Client:** Component composition. Keep components small.
- **Docs:** Update `walkthrough.md` after completion.

## 6) Security & Compliance
- **Secrets:** Never log PII or credentials.
- **Env:** Use `process.env` (typed if possible).
- **Validation:** Validate all inputs at the API boundary.

## 7) any time a library is installed or something new is added update this file to reflect that