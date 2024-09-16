import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import prisma from "@/lib/prisma";

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