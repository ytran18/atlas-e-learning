---
trigger: always_on
glob: "**/*"
description: Rules regarding the project structure, architecture, and technology stack.
---

# Project Structure & Architecture

## Overview

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, PostCSS, Mantine v8, Ant Design
- **State Management**: React Query (`@tanstack/react-query`)
- **Forms**: React Hook Form, Zod
- **Icons**: Tabler Icons (`@tabler/icons-react`)

## Directory Structure (`src`)

### `src/app`

- Follows Next.js App Router conventions.
- Organized with Route Groups:
    - `(authorized)`: Protected routes requiring authentication.
    - `(unauthorized)`: Public routes (e.g., login, register).
- Contains global `layout.tsx`, `globals.css`, and `provider.tsx`.

### `src/features`

- **Pattern**: Feature-based architecture. This is the core of the application logic.
- Each feature directory (e.g., `auth`, `course`, `users`) typically contains:
    - `_components/`: Components interaction _private_ to this feature.
    - `components/`: (Optional) Components exported for use by other features.
    - `hooks/`: Feature-specific hooks.
    - `api/`: API handlers or query options.
    - `services/`: API service calls (axios wrappers).
    - `pages/`: The main page components that are imported by `src/app`.
    - `validations/`: Zod schemas for forms and data.
    - `types/`: Feature-specific type definitions.

### `src/components`

- Contains **Global** or **Shared** components only.
- Examples: `GlobalHeader`, `Loader`, `ErrorBoundary`, `SEO`.
- **Note**: Atomic UI components (Buttons, Inputs) are typically imported directly from `@mantine/core` and styled with Tailwind, or found in feature-specific `_components`. There is no global atomic UI library folder in `src/components/ui` at this time.

### `src/libs`

- Configuration and wrappers for third-party libraries.
- Examples: `drizzle` (if used), `firebase`, `axios`, `i18n`, `growthbook`, `mixpanel`.

### `src/utils` & `src/constants`

- `utils`: Generic helper functions (non-feature specific).
- `constants`: Global constants, environment variables configuration.

## Coding Conventions

### Styling

- **Primary**: Use Tailwind CSS classes.
- **Components**: Use `@mantine/core` components as the base.
- **Overriding**: Use Tailwind classes on Mantine components. Use the `!` modifier if necessary to override Mantine defaults (e.g., `className="w-full!"`).

### Components

- **Naming**: PascalCase for files and components (e.g., `SignInPage.tsx`).
- **Structure**: Functional components with named exports or `export default`.
- **Props**: explicit interfaces for props.

### Architecture Guidelines

1.  **Feature Isolation**: Keep logic related to a specific domain within `src/features/[feature-name]`.
2.  **Pages**: `src/app` files should normally be thin wrappers that import a "Page" component from `src/features/[feature]/pages`.
3.  **Data Fetching**: Use React Query hooks (custom hooks in `features/[feature]/hooks`) for server state.
4.  **Forms**: Use `react-hook-form` combined with `zod` for validation.

## Path Aliases

- `@/*` -> `./src/*`
- `@/features/*` -> `./src/features/*`
- `@/components/*` -> `./src/components/*`
- `@/libs/*` -> `./src/libs/*`
- `@/utils/*` -> `./src/utils/*`
