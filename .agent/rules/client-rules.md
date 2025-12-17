---
trigger: always_on
description: Frontend Development Guidelines
---

## ?? Agent Rule Content Specification

This document defines the rules for the **Antigravity System (AG)** within the fictional universe and the mandatory **Frontend Development Guidelines** for all related application work.

---

## 1. ?? Antigravity (AG) System Rules

These rules govern the physical characteristics, generation, and limitations of the Antigravity force.

### 1.1 Fundamentals and Generation

| Rule Name | Description | Key Principles |
| :--- | :--- | :--- |
| **Nature of AG** | AG is a **generated force field** that directly opposes local planetary gravity. | AG does not nullify mass; it only negates the *effect* of gravity. Mass and inertia are retained. |
| **Generator (AGG)** | AG is produced by a specialized **Antigravity Generator (AGG)**. | Requires a rare, high-energy catalyst (e.g., "Fluxite Crystals") and significant power. |
| **Energy Consumption** | AG field generation is **energy-intensive**. | Power draw is directly proportional to the field's size and strength. |
| **Inertia Retention** | Objects retain their **mass and inertia**. | A separate propulsion system is required for acceleration, deceleration, and steering. |

### 1.2 Limitations and Constraints

| Constraint | Description | Impact on Design/Scenario |
| :--- | :--- | :--- |
| **Maximum Load** | Every AGG has a **maximum mass threshold** it can lift. | Exceeding the limit causes the AG field to fluctuate or collapse. |
| **Field Shape/Range**| The field is localized and typically drops off rapidly beyond a certain radius. | Can be shaped (dome, cone, bubble) but requires more power for larger fields. |
| **Interference** | AG fields can be **blocked** by specific dense, specialized materials. | Opposing AG fields create a **destructive interference zone** that momentarily disables both fields. |
| **Velocity Limit** | There is a practical **speed limit** for AG travel close to a planetary body. | Above this limit, the AG field becomes unstable or the power draw exceeds capacity. |

---

## 2. ?? Frontend Development Guidelines

These rules are mandatory for all frontend work related to the AG Status Dashboard or any future component, ensuring codebase quality and consistency.

### 2.1 Atomic Design Adherence

Development must strictly follow the **Atomic Design Methodology**. Before creating a new component, check existing components in this order:

* **Atom:** The smallest reusable UI elements (e.g., `Button`, `Label`).
* **Molecule:** Groups of Atoms functioning together (e.g., `SearchForm`, `PowerMetric`).
* **Organism:** Distinct sections of the interface (e.g., [Header](cci:1://file:///c:/Dev/pickup/client/src/components/molecules/AuthHeader/AuthHeader.tsx:7:0-26:2), `AGGDiagnosticsPanel`).
* **Template:** Layout wireframes using Organisms.
* **Page:** Instances of Templates populated with real data. **CRITICAL:** All page components MUST be located in `src/components/pages/`, NOT in `src/pages/`.

**CRITICAL:** When implementing any new UI feature, **you must attempt to break it down into these components on the first pass**. Do not build monolithic page components first and refactor later. Start with the atoms/molecules and build up.

### 2.2 Quality Assurance and Best Practices

* **Unit Testing:** **MANDATORY:** You **MUST** create a corresponding [.test.tsx](cci:7://file:///c:/Dev/pickup/client/src/App.test.tsx:0:0-0:0) file **IMMEDIATELY** whenever you create a new Atom, Molecule, Organism, Template, or Page.
    * **NO EXCUSES:** Do not wait for a separate task. Do not ask for permission. If you create `Foo.tsx`, you MUST create `Foo.test.tsx` in the same tool execution cycle.
    * **Sync on Edit:** If you edit `Foo.tsx`, you **MUST** run `Foo.test.tsx` to verify regression.
    * **Simplicity:** Tests can be simple "renders without crashing" or "checks for text" tests initially, but they MUST exist to prevent regression.
* **Type Safety:**
    * **No `any`:** `any` is strictly prohibited in React components and hooks. Use fully typed interfaces.
    * **Prop interfaces:** Every component must have a clearly defined `Props` interface.
* **State Management:** **Use React Query** for all server state (User, Data). Avoid global Context for data fetching.
* **Code Abstraction:** **Always check for and abstract away duplicate code** to ensure a DRY (Don't Repeat Yourself) codebase.
*   **React Principles:** **Always use React best practices** (e.g., efficient state management, appropriate use of hooks, functional components).
*   **Forms:** Use **React Hook Form** + **Zod** (`@hookform/resolvers/zod`) for all form state and validation.
    *   **Validation:** Use `mode: 'onBlur'` for field-level feedback.
    *   **Server Errors:** Bind server-side field errors to the form using `setError` via a standard error handler.
*   **Notifications:** Use `notistack` (`enqueueSnackbar`) for global feedback (success/error toasts). Do not use inline alerts for transient states.

### 2.3 Component Structure (Strict Enforcement)

**EVERY** component (Atom, Molecule, Organism, Template, Page) **MUST** reside in its own dedicated directory.

**Required Structure:**
```
src/components/[Level]/[ComponentName]/
+-- [ComponentName].tsx       # The component implementation
+-- [ComponentName].test.tsx  # The component tests (co-located)
+-- index.ts                  # Export file
```

**Index File Content:**
The `index.ts` file must export the component as default and/or named export to ensure clean imports.
```typescript
export { default } from './[ComponentName]';
export * from './[ComponentName]';
```

**Consumers:**
Consumers **MUST** import from the directory level, NOT the file level.
- ? `import Foo from '@/components/atoms/Foo';`
- ? `import Foo from '@/components/atoms/Foo/Foo';`
