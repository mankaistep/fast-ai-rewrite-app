import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
        // Redirect to login page if there's no token (user is not authenticated)
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    // If user is authenticated, continue to the requested page
    return NextResponse.next()
}

// Specify which routes should be protected by this middleware
export const config = {
    matcher: ['/a/:path*']
}