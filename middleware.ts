import { auth } from "@/auth";

export default auth((req) => {
    // Allow access to home page and signin page without authentication
    if (!req.auth && !["/", "/sign-in"].includes(req.nextUrl.pathname)) {
        const newUrl = new URL("/sign-in", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});

// Define which routes to run the middleware on
export const config = {
    // Matches all routes except for excluded ones
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
