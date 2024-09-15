import { NextRequest, NextResponse } from 'next/server';
import { sendRewriteRequest } from '@/lib/openai-utils';

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON body of the request
        const body = await req.json();

        // Extract the required fields from the request body
        const { agentId, original, prompt } = body;

        // Validate the input
        if (!agentId || typeof agentId !== 'number') {
            return NextResponse.json({ error: 'Invalid agentId' }, { status: 400 });
        }
        if (!original || typeof original !== 'string') {
            return NextResponse.json({ error: 'Invalid original text' }, { status: 400 });
        }
        if (typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
        }

        // Call the sendRewriteRequest function
        const result = await sendRewriteRequest(agentId, original, prompt);

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