import { NextResponse } from "next/server"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

const CORS_PATHS = ["/api/agents", "/api/rewrite/generate", "/api/rewrite/mark-as-approved"]

async function middleware(req: NextRequestWithAuth) {
    console.log("Middleware running on:", req.method, req.nextUrl.pathname);

    if (CORS_PATHS.includes(req.nextUrl.pathname)) {
        if (req.method === 'OPTIONS') {
            const response = new NextResponse(null, {
                status: 204
            });
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            return response;
        } else {
            const response = NextResponse.next();
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            return response;
        }
    }

    // Verify session for non-CORS paths
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (session) {
        req.nextauth = { token: session }
        console.log("Session verified for:", req.nextUrl.pathname);
    } else {
        console.log("No session for:", req.nextUrl.pathname);
    }

    return NextResponse.next()
}

export default withAuth(middleware, {
    callbacks: {
        authorized: ({ token, req }) => {
            console.log("Authorizing request for:", req.nextUrl.pathname);
            if (req.method === 'OPTIONS' || CORS_PATHS.includes(req.nextUrl.pathname)) {
                return true;
            }
            return !!token;
        },
    },
})

export const config = {
    matcher: ["/a/:path*", "/api/:path*"]
}