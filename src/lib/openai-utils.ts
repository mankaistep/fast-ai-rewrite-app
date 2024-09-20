import prisma from "./prisma";
import { Agent as PrismaAgent } from "@prisma/client";
import {randomUUID} from "node:crypto";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ORGANIZATION_ID = process.env.OPENAI_ORGANIZATION_ID
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID

export async function sendRewriteRequest(agent: any, original: string, prompt: string, isChat: boolean) : Promise<{
    activityId: string,
    agentId: number,
    original: string,
    prompt: string,
    suggestion: string
}> {
    if (!agent) {
        throw new Error("Agent not found")
    }

    const agentActivities = agent.activities ? agent.activities : [];

    // Create instruction messages based on activities
    const messages: {
        role: string,
        content: string
    }[] = []
    for (let i = 0; i < agentActivities.length; i++) {
        const currentActivity = agentActivities[i]
        const approved = currentActivity.result

        const approvalMessage = approved ?
            "I like it, please continue next time" :
            "No, I don't like it, please improve next time and don't generate the same response if input and prompt are the same"

        const additionalMessages = [
            {
                role: "user",
                content: `
                    input: ${currentActivity.input}.
                    prompt: ${currentActivity.prompt}.
                `
            },
            {
                role: "assistant",
                content: `${currentActivity.output}`
            },
            {
                role: "user",
                content: `${approvalMessage}`
            },
            {
                role: "assistant",
                content: `okay`
            }
        ]

        messages.push(...additionalMessages);
    }

    const newActivityId = randomUUID().toString()
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Organization': `${OPENAI_ORGANIZATION_ID}`,
            'OpenAI-Project': `${OPENAI_PROJECT_ID}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                        you are a ${agent.role} with ${agent.tone} tone
                        also additional description of you: ${agent.description}
                        the prompt will include the message to rewrite and any notes for the rewrite.
                        if note when rewrite empty, please ignore
                        if previous generated response is empty, please ignore
                    `
                },
                ...messages,
                {
                    role: "user",
                    content: `
                        input: ${original}.
                        prompt: ${prompt}
                        (if the latest request has the same input, the prompt is for the latest response, not input)
                    `
                }
            ],
            temperature: 1.2
        })
    }

    // Send the request
    try {
        const sentAt = Date.now();
        const response = await fetch('https://api.openai.com/v1/chat/completions', request);
        const data = await response.json();
        const receivedAt = Date.now();
        const suggestion = data.choices[0].message.content;

        const usageToken = data.usage?.total_tokens ?? 0

        console.log(`[FastAI Rewrite] ${receivedAt - sentAt}ms, ${usageToken} tokens, generated <<${suggestion}>>`)

        // Save to activity if it's rewrite, chatActivity if it's chat
        setTimeout(async () => {
            if (isChat) {
                await prisma.chatActivity.create({
                    data: {
                        id: newActivityId,
                        agentId: agent.id,
                        input: original,
                        prompt: prompt,
                        output: suggestion,
                        result: false
                    }
                })
            }
            else {
                await prisma.activity.create({
                    data: {
                        id: newActivityId,
                        agentId: agent.id,
                        input: original,
                        prompt: prompt,
                        output: suggestion,
                        result: false
                    }
                })
            }
        }, 10)

        return {
            activityId: newActivityId,
            agentId: agent.id,
            original: original,
            prompt: prompt,
            suggestion: suggestion
        };
    } catch (error) {
        console.log(error);
        return {
            activityId: newActivityId,
            agentId: agent.id,
            original: original,
            prompt: prompt,
            suggestion: "Oops, some error happened :("
        }
    }
}

export async function markActivityAsApproved(activityId: string) {
    return prisma.activity.update({
        where: {
            id: activityId
        },
        data: {
            result: true
        }
    });
}