# Pickup 🏐

Pickup is a modern sports facility and game management platform designed to help organizers and players streamline volleyball events. It facilitates payment collection, balanced team generation based on ratings, and court promotion for facilities.

## 🏗️ Tech Stack

### Monorepo Structure
This project uses **NPM Workspaces** to manage multiple packages:
- **`client/`**: React frontend web application.
- **`server/`**: Node.js Express backend API.
- **`packages/shared/`**: Shared TypeScript types, Zod schemas, and DTOs.

### Frontend (`client/`)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **UI Library**: [Material UI (MUI)](https://mui.com/) + Emotion
- **State/Data**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Testing**: Vitest + React Testing Library

### Backend (`server/`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: MongoDB Atlas + [Mongoose](https://mongoosejs.com/)
- **Validation**: Zod (Input validation at API boundary)
- **Auth**: JWT + Cookies (HttpOnly, Secure)
- **Logging**: Winston + MongoDB transport
- **Testing**: Jest + Supertest (Configured for ESM)

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ recommended (Project uses strict ESM)
- **MongoDB**: A running MongoDB instance or Atlas URI

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd pickup
    ```

2.  **Install dependencies (Workspaces):**
    Use the root script to install dependencies for all workspaces.
    ```bash
    npm run install:all
    ```

3.  **Environment Setup:**
    Create a `.env` file in the **root** directory (NOT in `server/`).
    ```env
    PORT=3000
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/pickup
    JWT_SECRET=your_super_secret_key
    NODE_ENV=development
    ```

### Development

Start the entire stack (Shared, Server, and Client) concurrently:

```bash
npm run dev
```

- **Client**: [http://localhost:5173](http://localhost:5173)
- **Server**: [http://localhost:3000](http://localhost:3000)

> **Note**: The shared package runs in watch mode (`tsc --watch`), ensuring changes to types/schemas are immediately available to both client and server.

## 🛠️ Development Guidelines

### 1. Shared-First Workflow
If a Type, Interface, or Validation Schema is needed by both Client and Server (e.g., `User` interface, `LoginSchema`):
1.  Define it in `packages/shared/src/`.
2.  Export it in `packages/shared/src/index.ts`.
3.  Server runs `npm run dev` (which watches shared).
4.  Import directly via `@pickup/shared`.

### 2. Strict Quality Gates
This project enforces strict typescript and testing standards via **Git Hooks (Husky + lint-staged)**.

- **No `any`**: The use of `any` is explicitly forbidden.
- **Test Co-location**: Tests must sit next to the file they text (e.g., `ComponentName.test.tsx` next to `ComponentName.tsx`).
- **Sync Tests**: If you change code, you **MUST** update the test in the same commit.

### 3. Server ESM
The server runs in pure ESM mode.
- **Imports**: All relative imports **must** end with `.js`.
- **Global**: Use `import.meta.url` instead of `__dirname`.
- **Execution**: Use `tsx` for local dev scripts.

### 4. Client Atomic Design
Components are organized by [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/):
- `atoms/`: Buttons, Inputs (Single responsibility)
- `molecules/`: Search bars, Form fields (Combinations of atoms)
- `organisms/`: Headers, Forms (Complex distinct sections)
- `templates/`: Page layouts
- `pages/`: Route handlers (Connects templates to data)

## 🧪 Testing

**Client**:
```bash
npm run test --prefix client
```

**Server**:
```bash
npm run test --prefix server
```

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts Client, Server, and Shared watch modes concurrently. |
| `npm run install:all` | Installs dependencies for root and all workspaces. |
| `npm run build --workspace=@pickup/shared` | Builds the shared package. |
