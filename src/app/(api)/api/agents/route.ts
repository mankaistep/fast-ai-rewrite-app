import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/route";
import {getToken} from "next-auth/jwt";

// GET all agents or a single agent
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
                include: { user: true, activities: true },
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
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log(token)

        // @ts-ignore
        const userEmail = token.email

        const body = await request.json();
        const { name, role, tone, description, status} = body;

        if (!name || !role || !userEmail) {
            return NextResponse.json({ error: `Name, role, and userEmail are required. Current values: ${name}, ${role}, ${userEmail}` }, { status: 400 });
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
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        const userEmail = token.email
        if (!userEmail) {
            return NextResponse.json({ error: 'Unauthorized, no email?' }, { status: 401 });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { id, name, role, tone, description, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        const updatedAgent = await prisma.agent.update({
            where: { id: Number(id), userId: user.id },
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
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // @ts-ignore
        const userEmail = token.email
        if (!userEmail) {
            return NextResponse.json({ error: 'Unauthorized, no email?' }, { status: 401 });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
        }

        await prisma.agent.delete({
            where: { id: Number(id), userId: user.id },
        });

        return NextResponse.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        console.error('Error deleting agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}