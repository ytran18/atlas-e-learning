# API Update User Info - Implementation Summary

## Overview

Hệ thống API để cập nhật thông tin user với tính năng tự động cập nhật password khi thay đổi CCCD hoặc birthDate.

## Architecture

### 1. API Endpoint

**File:** `src/app/api/v1/user/update-info/route.ts`

**Method:** `PATCH`

**Request Body:**

```typescript
{
    userId: string;           // Required
    fullName?: string;        // Optional
    birthDate?: string;       // Optional (Format: YYYY-MM-DD)
    jobTitle?: string;        // Optional
    companyName?: string;     // Optional
    cccd?: string;            // Optional (12 digits for CCCD or 6-9 chars for Passport)
}
```

**Response:**

```typescript
{
    success: boolean;
    message: string;
    data: {
        userId: string;
        updated: string[];           // List of updated fields
        passwordUpdated: boolean;    // True if password was updated
    }
}
```

### 2. Update Logic

#### Clerk Updates

- Updates `unsafeMetadata` with new values
- If CCCD or birthDate changed:
    - Regenerates password with format: `YYYY-MM-DD_IDENTIFIER`
    - Updates username if CCCD changed (prefix: `CC` for CCCD, `PP` for Passport)

#### Firestore Updates

- Updates user document in `users` collection
- Adds `updatedAt` timestamp

### 3. Password Generation

When CCCD or birthDate changes, password is regenerated following this logic:

```typescript
// Format birthDate to YYYY-MM-DD
const birthDateString = `${yyyy}-${mm}-${dd}`;

// Normalize identifier
const identifier = /^\d{12}$/u.test(cccd) ? cccd : cccd.toUpperCase();

// Generate password
const password = `${birthDateString}_${identifier}`;

// Example: 1990-01-01_012345678901
```

### 4. Username Format

```typescript
const isCCCD = /^\d{12}$/u.test(cccd);
const usernamePrefix = isCCCD ? "CC" : "PP";
const username = `${usernamePrefix}${identifier}`;

// Examples:
// - CCCD: CC012345678901
// - Passport: PPAB123456
```

## Frontend Implementation

### 1. Custom Hook

**File:** `src/api/user/useUpdateUserInfo.ts`

```typescript
import { useUpdateUserInfo } from "@/api/user";

const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

updateUserInfo(
    {
        userId: "user123",
        fullName: "Nguyễn Văn A",
    },
    {
        onSuccess: (data) => {
            console.log("Updated:", data);
        },
        onError: (error) => {
            console.error("Error:", error);
        },
    }
);
```

### 2. Modal Components

#### Modal Edit Name

**File:** `src/features/users/components/modal-edit-info/modal-edit-name.tsx`

Updates: `fullName`

#### Modal Edit Birthday

**File:** `src/features/users/components/modal-edit-info/modal-edit-birthday.tsx`

Updates: `birthDate` (triggers password update)

#### Modal Edit Job Title

**File:** `src/features/users/components/modal-edit-info/modal-edit-job-title.tsx`

Updates: `jobTitle`

#### Modal Edit Company Name

**File:** `src/features/users/components/modal-edit-info/modal-edit-company-name.tsx`

Updates: `companyName`

#### Modal Edit ID Card

**File:** `src/features/users/components/modal-edit-info/modal-edit-id-card.tsx`

Updates: `cccd` (triggers password and username update)

Validation:

- CCCD: Must be 12 digits
- Passport: Must be 6-9 alphanumeric characters

### 3. Usage in User Detail Page

```typescript
import { useUpdateUserInfo } from "@/api/user";

const UserDetailPage = () => {
    const { data: userDetail } = useGetUserInfo(userId);

    // Modals automatically use useUpdateUserInfo hook
    return (
        <UserRightSection user={userDetail} />
    );
};
```

## Database Updates

### Clerk (unsafeMetadata)

```typescript
{
    fullName: string,
    birthDate: string,      // YYYY-MM-DD
    cccd: string,
    jobTitle: string,
    companyName: string
}
```

### Firestore (users collection)

```typescript
{
    fullName: string,
    birthDate: string,      // YYYY-MM-DD
    cccd: string,
    jobTitle: string,
    companyName: string,
    updatedAt: Timestamp
}
```

## Important Notes

1. **Password Updates**: Automatically triggered when `cccd` or `birthDate` changes
2. **Username Updates**: Only triggered when `cccd` changes
3. **Data Consistency**: Both Clerk and Firestore are updated atomically
4. **Cache Invalidation**: React Query cache is automatically invalidated after successful update
5. **User Notification**: Success/error notifications are shown using Mantine notifications

## Security

- Authentication required via `requireAuth()` middleware
- Only authenticated users can update their own information
- Input validation on both frontend and backend
- CCCD/Passport format validation

## Error Handling

API handles the following errors:

- Missing userId
- User not found
- Invalid CCCD/Passport format
- Clerk API errors
- Firestore update errors

All errors return appropriate HTTP status codes and error messages.
