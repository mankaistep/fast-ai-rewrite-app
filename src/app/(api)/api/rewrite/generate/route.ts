import { NextRequest, NextResponse } from 'next/server';
import { sendRewriteRequest } from '@/lib/openai-utils';
import {getToken} from "next-auth/jwt";
import prisma from "@/lib/prisma";
import {getUser} from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
    try {
        const user = await getUser(req);

        // If fails => user ~ error
        if (user instanceof NextResponse) {
            return user; // or throw an error, depending on your use case
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Parse the JSON body of the request
        const body = await req.json();

        // Extract the required fields from the request body
        const { agentId, original, prompt, isChat } = body;

        const agent = await prisma.agent.findUnique({
            where: { id: agentId, userId: user.id },
        });

        // Validate the input
        if (!agent) {
            return NextResponse.json({ error: 'Invalid agentId' }, { status: 400 });
        }
        if (!original || typeof original !== 'string') {
            return NextResponse.json({ error: 'Invalid original text' }, { status: 400 });
        }
        if (typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
        }
        if (typeof isChat !== 'boolean') {
            return NextResponse.json({ error: 'Invalid isChat' }, { status: 400 });
        }

        // Call the sendRewriteRequest function
        const result = await sendRewriteRequest(agent, original, prompt, isChat);

        // Return the result
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in rewrite API:', error);

        // Check if the error is an instance of Error
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}