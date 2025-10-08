import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware() {
        const res = NextResponse.next();
        // Add security headers
        res.headers.set("X-Frame-Options", "DENY");
        res.headers.set("X-Content-Type-Options", "nosniff");
        res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        return res;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/passwordgenerator/:path*", "/passwordvault/:path*"],
};