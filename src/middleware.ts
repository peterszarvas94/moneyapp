import { authMiddleware } from "@clerk/nextjs";

// define public routes
export default authMiddleware({
  publicRoutes: [
    "/",
    "/(api|trpc)(.*)",
    "/api/webhooks/user",
    "/migrate",
  ]
});

// use clerk in these paths
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
