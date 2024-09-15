import { NextResponse } from "next/server"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

async function middleware(req: NextRequestWithAuth) {
    console.log("Middleware running on:", req.nextUrl.pathname);

    // Allow CORS for /api/agents for testing
    if (req.nextUrl.pathname === '/api/agents') {
        const response = NextResponse.next()
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return response
        }
    }

    // Verify session
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (session) {
        req.nextauth = { token: session }
    }

    // Always return NextResponse.next() to allow withAuth to make the final decision
    return NextResponse.next()
}

export default withAuth(middleware, {
    callbacks: {
        authorized: ({ token }) => {
            return !!token; // Return true if a token exists
        },
    },
})

export const config = {
    // matcher: ["/a/:path*", "/api/:path*"]
    matcher: ["/a/:path*"]
}