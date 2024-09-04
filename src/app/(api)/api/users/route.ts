import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust this import based on your project structure

// GET users (all users or a single user by ID)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch a single user by ID
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
                include: {
                    agents: true,
                },
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            return NextResponse.json(user);
        } else {
            // Fetch all users
            const users = await prisma.user.findMany({
                include: {
                    agents: true,
                },
            });
            return NextResponse.json(users);
        }
    } catch (error) {
        console.error('Error fetching user(s):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST a new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, image, googleId } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                image,
                googleId
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT (update) a user
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, email, image, googleId } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, image, googleId },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE a user
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}