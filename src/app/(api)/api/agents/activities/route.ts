import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get('agentId');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        // Validate agentId
        if (!agentId) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch activities
        const activities = await prisma.activity.findMany({
            where: {
                agentId: parseInt(agentId, 10),
            },
            orderBy: {
                timestamp: 'desc',
            },
            skip,
            take: limit,
        });

        // Get total count for pagination
        const totalCount = await prisma.activity.count({
            where: {
                agentId: parseInt(agentId, 10),
            },
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            activities,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching activities' },
            { status: 500 }
        );
    }
}