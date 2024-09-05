import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/route";

// GET all agents or a single agent
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = session.user.email;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const user = await prisma.user.findFirst({
            where: { email: userEmail },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (id) {
            const agent = await prisma.agent.findUnique({
                where: { id: Number(id), userId: user.id },
                include: { user: true, prompts: true, activities: true },
            });

            if (!agent) {
                return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
            }

            return NextResponse.json(agent);
        } else {
            const agents = await prisma.agent.findMany({
                where: { userId: user.id },
                include: { user: true },
            });
            return NextResponse.json(agents);
        }
    } catch (error) {
        console.error('Error fetching agent(s):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST a new agent
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, role, tone, description, status, userEmail } = body;

        if (!name || !role || !userEmail) {
            return NextResponse.json({ error: 'Name, role, and userEmail are required' }, { status: 400 });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newAgent = await prisma.agent.create({
            data: {
                name,
                role,
                tone,
                description,
                status,
                userId: user.id
            },
        });

        return NextResponse.json(newAgent, { status: 201 });
    } catch (error) {
        console.error('Error creating agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT (update) an agent
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, role, tone, description, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        const updatedAgent = await prisma.agent.update({
            where: { id: Number(id) },
            data: { name, role, tone, description, status },
        });

        return NextResponse.json(updatedAgent);
    } catch (error) {
        console.error('Error updating agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE an agent
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        await prisma.agent.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        console.error('Error deleting agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}