import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        console.log("Middleware running on:", req.nextUrl.pathname)
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: ["/a/:path*", "/api/:path*"]
}