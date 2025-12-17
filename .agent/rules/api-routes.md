---
trigger: model_decision
description: Rules for implementing Next.js API Routes.
---

# API Route Guidelines

## 1. Directory Structure

- Follow Next.js App Router conventions: `src/app/api/v1/[resource]/[action]/route.ts`.
- Use the `v1` version prefix for all API routes.
- Group routes by resource name and action.

## 2. Response & Error Handling

**Strictly** use the utilities from `@/utils/api.utils.ts` to ensure consistent response shapes.

### Success Response

Always return data using `successResponse`.

```typescript
import { successResponse } from "@/utils/api.utils";
return successResponse(data);
```

### Error Handling

Wrap the entire handler logic in a `try/catch` block and pass the error to `handleApiError`.

```typescript
import { handleApiError } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        // ... logic
    } catch (error) {
        return handleApiError(error);
    }
}
```

## 3. Authentication & Validation

- **Authentication**: Use `requireAuth()` at the start of protected routes.
- **Validation**:
    - Use `validateRequiredFields(body, ["field1", "field2"])` for simple checks.
    - Throw specific errors with the "VALIDATION:" prefix if custom validation fails (e.g., `throw new Error("VALIDATION: Invalid email")`), as `handleApiError` automatically formats these as 400 Bad Request.

## 4. Example Pattern

```typescript
import { NextRequest } from "next/server";

import {
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
    validateRequiredFields,
} from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        // 1. Auth Check
        const { userId } = await requireAuth();

        // 2. Parse & Validate
        const body = await parseJsonBody(request);
        validateRequiredFields(body, ["title"]);

        // 3. Logic...
        const result = { id: 1, ...body, createdBy: userId };

        // 4. Return
        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}
```
