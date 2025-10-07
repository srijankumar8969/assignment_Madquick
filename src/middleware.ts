// middleware.ts (in root directory)
export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/passwordgenerator/:path*", "/passwordvault/:path*"],
};