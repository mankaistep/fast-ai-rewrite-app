import NextAuth, {Account, Profile, User} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { PrismaClient } from "@prisma/client"
import {AdapterUser} from "next-auth/adapters";

const prisma = new PrismaClient()

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
        async signIn({ user, account, profile, email, credentials }) {
            // After auth
            if (!email?.verificationRequest) {
                // Save to db
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
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }