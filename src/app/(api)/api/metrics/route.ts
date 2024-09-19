import {NextRequest, NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

type Metric = {
    current: number;
    previous: number;
    unit: 'month' | 'week' | 'day';
};

type DashboardMetrics = {
    activeAgents: Metric;
    successfulRewrites: Metric;
    totalRequests: Metric;
};

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
        const userEmail = token.email

        const user = await prisma.user.findFirst({
            where: { email: userEmail },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const activeAgents = await prisma.agent.count({
            where: {
                status: 'active',
                userId: user.id,
            },
        });

        const activeAgentsLastMonth = await prisma.agent.count({
            where: {
                status: 'active',
                userId: user.id,
                createdAt: {
                    lt: oneMonthAgo,
                },
            },
        });

        const successfulRewrites = await prisma.activity.count({
            where: {
                result: true,
                agent: {
                    userId: user.id,
                },
            },
        });

        const successfulRewritesLastWeek = await prisma.activity.count({
            where: {
                result: true,
                agent: {
                    userId: user.id,
                },
                timestamp: {
                    lt: oneWeekAgo,
                },
            },
        });

        const totalRequests = await prisma.activity.count({
            where: {
                agent: {
                    userId: user.id,
                },
            },
        });

        const totalRequestsLastDay = await prisma.activity.count({
            where: {
                agent: {
                    userId: user.id,
                },
                timestamp: {
                    lt: oneDayAgo,
                },
            },
        });

        const metrics: DashboardMetrics = {
            activeAgents: {
                current: activeAgents,
                previous: activeAgentsLastMonth,
                unit: 'month',
            },
            successfulRewrites: {
                current: successfulRewrites,
                previous: successfulRewritesLastWeek,
                unit: 'week',
            },
            totalRequests: {
                current: totalRequests,
                previous: totalRequestsLastDay,
                unit: 'day',
            },
        };

        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}