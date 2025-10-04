# Clerk Authentication Setup Guide

## Overview

This project uses [Clerk](https://clerk.com) for authentication and user management.

## Prerequisites

- A Clerk account (sign up at https://clerk.com)
- Node.js and npm installed

## Setup Instructions

### 1. Install Dependencies

The Clerk package is already installed in `package.json`:

```json
"@clerk/nextjs": "^6.33.1"
```

### 2. Get Your Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select an existing one
3. Navigate to **API Keys** in the sidebar
4. Copy your **Publishable Key** and **Secret Key**

### 3. Configure Environment Variables

1. Copy the example environment file:

    ```bash
    cp .env.local.example .env.local
    ```

2. Add your Clerk keys to `.env.local`:

    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
    CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
    ```

3. (Optional) Customize redirect URLs:
    ```env
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
    ```

### 4. Verify Setup

The following files have been configured for Clerk:

#### ✅ Middleware (`src/middleware.ts`)

Protects routes automatically:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

#### ✅ Provider (`src/app/provider.tsx`)

Wraps the app with `ClerkProvider`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function Provider({ children }: { children: React.ReactNode }) {
    return <ClerkProvider>{children}</ClerkProvider>;
}
```

#### ✅ Layout (`src/app/layout.tsx`)

Already uses the Provider component.

## Next Steps (Implementation)

Once you're ready to implement authentication, you can:

### 1. Create Auth Pages

Create sign-in and sign-up pages using Clerk's pre-built components:

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignIn />
        </div>
    );
}
```

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <SignUp />
        </div>
    );
}
```

### 2. Protect Routes

Update middleware to protect specific routes:

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/camera-capture(.*)",
    "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
});
```

### 3. Access User Data in Server Components

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Page() {
    const { userId } = await auth();
    const user = await currentUser();

    return <div>Hello, {user?.firstName}!</div>;
}
```

### 4. Access User Data in Client Components

```typescript
"use client";
import { useUser } from "@clerk/nextjs";

export default function ClientComponent() {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return <div>Loading...</div>;
    if (!isSignedIn) return <div>Not signed in</div>;

    return <div>Hello, {user.firstName}!</div>;
}
```

### 5. Add User Button Component

```typescript
"use client";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header>
            <nav>
                <UserButton afterSignOutUrl="/" />
            </nav>
        </header>
    );
}
```

## Useful Clerk Components

- `<SignIn />` - Pre-built sign-in form
- `<SignUp />` - Pre-built sign-up form
- `<UserButton />` - User profile button with dropdown
- `<UserProfile />` - Full user profile management
- `<SignInButton />` - Custom sign-in button
- `<SignUpButton />` - Custom sign-up button
- `<SignOutButton />` - Custom sign-out button

## Useful Clerk Hooks

- `useUser()` - Get current user data
- `useAuth()` - Get auth state and helpers
- `useSignIn()` - Sign-in functionality
- `useSignUp()` - Sign-up functionality
- `useClerk()` - Access Clerk instance

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Clerk Components](https://clerk.com/docs/components/overview)

## Security Notes

- ⚠️ Never commit `.env.local` to version control
- ⚠️ Keep your `CLERK_SECRET_KEY` secret and secure
- ✅ Only `NEXT_PUBLIC_*` variables are exposed to the browser
- ✅ The middleware automatically protects your API routes

## Troubleshooting

### "Clerk: Missing publishable key"

- Make sure `.env.local` exists and contains `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Restart your development server after adding environment variables

### Authentication not working

- Verify your Clerk application is properly configured in the dashboard
- Check that your domain is added to "Allowed Origins" in Clerk Dashboard
- Ensure middleware is properly configured

### Styling issues with Clerk components

- Clerk components respect your global CSS
- You can customize appearance in Clerk Dashboard under "Appearance"
- Or use the `appearance` prop on Clerk components

## Support

For issues or questions:

- Check [Clerk Documentation](https://clerk.com/docs)
- Visit [Clerk Discord](https://clerk.com/discord)
- Contact Clerk Support through the dashboard
