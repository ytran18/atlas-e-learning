---
trigger: always_on
description: Coding standards, component patterns, and styling guidelines.
---

# Coding Conventions

## 1. General Architecture

- **Feature-Driven**: Logic is encapsulated per feature in `src/features/[feature-name]`.
- **Separation of Concerns**:
    - `pages/`: Entry points (Route handlers).
    - `components/`: Private, feature-specific UI.
    - `hooks/`: Business logic and View Models.
    - `services/`: API calls.
    - `types/`: feature-specific types.
    - etc...

## 2. Component Patterns

### Presentation vs. Container (Composition)

We strictly follow the **Container/Presentation** pattern to separate logic from UI.

#### **Container Components (Smart)**

- **Role**: Handle data fetching, state management, and business logic.
- **Location**: Typically `pages/` or top-level components in `features`.
- **Responsibilities**:
    - Call React Query hooks (`useQuery`, `useMutation`).
    - Manage local state (`useState`, `useForm`).
    - Pass data and event handlers down to Presentation components.
    - **No complex UI rendering**: Should mostly compose Presentation components.

#### **Presentation Components (Dumb)**

- **Role**: Render UI based _only_ on props. Stateless (or UI-state only).
- **Location**: `components/`.
- **Responsibilities**:
    - Receive data via `props`.
    - Emit events via callback props (e.g., `onSubmit`, `onClick`).
    - **No side effects**: Should not fetch data directly.
    - **Reusable**: Generic enough to be used in different contexts within the feature.

#### **Composition**

- Use **Component Composition** (`children` prop) over excessive prop drilling.
- Layouts (like `SignInFormLayout`) should accept content as `children` rather than hardcoded sections.

## 3. Styling Strategy

- **Framework**: **Tailwind CSS v4** is the primary styling engine.
- **Mantine Integration**:
    - Use `@mantine/core` for base atomic components (Button, Input, Modal).
    - **Override** Mantine styles using Tailwind classes.
    - Use the `!` modifier to force overrides when necessary (e.g., `className="w-full!"`).
- **No CSS-in-JS**: Avoid `styled-components` or `createStyles`.

## 4. Code Quality & Formatting

- **Indentation**: **4 Spaces**.
- **Quotes**: Double quotes `"`.
- **Semicolons**: Always used.
- **Import Order**:
    1. External Libraries (`react`, `next`)
    2. UI Libraries (`@mantine/core`)
    3. Internal Libs (`@/libs`, `@/utils`)
    4. Feature-local Imports (`../components`, `./styles`)
- **Naming Conventions**:
    - **Files**: PascalCase for Components (`UserProfile.tsx`), camelCase for hooks/utils (`useUser.ts`).
    - **Variables**: Descriptive, full words (e.g., `submitButtonText` not `btnTxt`).
    - **Boolean Props**: Prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`).

## 5. State Management

- **Server State**: Use **React Query** (`@tanstack/react-query`).
- **Form State**: Use **React Hook Form** + **Zod**.
- **Local State**: `useState` / `useReducer` for UI toggles only.

## 6. Internationalization (i18n)

- **Always** use `useI18nTranslate` hook.
- **Never** hardcode user-facing strings.
- Example: `const { t } = useI18nTranslate();` -> `{t("sign_in_title")}`.
