import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {getToken} from "next-auth/jwt";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        const userEmail = token.email as string;
        if (!['hhoang21vn@gmail.com', 'hoangnh1@bsscommerce.com'].includes(userEmail)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const skip = (page - 1) * limit;

        const rewriteHistory = await prisma.activity.findMany({
            orderBy: {
                timestamp: 'desc',
            },
            include: {
                agent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true
                            },
                        },
                    },
                },
            },
            skip,
            take: limit,
        });

        const totalCount = await prisma.activity.count();
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            rewriteHistory,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching rewrite history:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching rewrite history' },
            { status: 500 }
        );
    }
}