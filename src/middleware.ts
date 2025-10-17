import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { navigationPaths, publicPaths } from "./utils/navigationPaths";

const isPublicRoute = createRouteMatcher(publicPaths);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    const { pathname } = req.nextUrl;

    // If user is signed in and trying to access sign-in or sign-up pages, redirect to ATLD
    if (userId && (pathname === navigationPaths.SIGN_IN || pathname === navigationPaths.SIGN_UP)) {
        const atldUrl = new URL(navigationPaths.LANDING_PAGE, req.url);

        return Response.redirect(atldUrl);
    }

    // Protect non-public routes
    if (!isPublicRoute(req)) {
        const signInUrl = new URL("/sign-in", req.url);

        await auth.protect({
            unauthenticatedUrl: signInUrl.toString(),
            unauthorizedUrl: signInUrl.toString(),
        });
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
