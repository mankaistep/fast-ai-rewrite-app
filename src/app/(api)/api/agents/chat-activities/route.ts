import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get('agentId');

        // Validate agentId
        if (!agentId) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        // Fetch activities
        const activities = await prisma.chatActivity.findMany({
            where: {
                agentId: parseInt(agentId, 10),
            },
            orderBy: {
                timestamp: 'asc',
            }
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching activities' },
            { status: 500 }
        );
    }
}