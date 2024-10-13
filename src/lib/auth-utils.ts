import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import prisma from "@/lib/prisma";
import type {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export async function getUser(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const userEmail = token.email

    return prisma.user.findFirst({
        where: {email: userEmail},
    });
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        async signIn({ user, email }) {
            if (!email?.verificationRequest) {
                await prisma.user.upsert({
                    where: {
                        googleId: user.id
                    },
                    create: {
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        googleId: user.id
                    },
                    update: {
                        name: user.name,
                        email: user.email,
                        image: user.image
                    }
                })
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}
