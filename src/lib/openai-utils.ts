import prisma from "./prisma";
import {randomUUID} from "node:crypto";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ORGANIZATION_ID = process.env.OPENAI_ORGANIZATION_ID
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID

export async function sendRewriteRequest(agentId: number, original: string, prompt: string) : Promise<{
    activityId: string,
    agentId: number,
    original: string,
    prompt: string,
    suggestion: string
}> {
    // Check valid agent
    const agent = await prisma.agent.findFirst({
        where: {
            id: agentId
        },
        include: {
            activities: true
        }
    })

    if (!agent) {
        throw new Error("Agent not found")
    }

    const agentActivities = agent.activities;

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
            "No, I don't like it, please improve next time"

        const additionalMessages = [
            {
                role: "user",
                content: `
                    message to rewrite: ${currentActivity.input}.
                    note when rewrite: ${currentActivity.prompt}.
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
                        please rewrite the chat I provide in the last message
                        the prompt will include the message to rewrite and any notes for the rewrite.
                        if note when rewrite empty, please ignore
                        if previous generated response is empty, please ignore
                    `
                },
                ...messages,
                {
                    role: "user",
                    content: `
                        based on the messages you've written. rewrite better and different suggestion
                        message to rewrite: ${original}.
                        note when rewrite: ${prompt}.
                    `
                }
            ],
            temperature: 0.5
        })
    }

    // Send the request
    try {
        const sentAt = Date.now();
        const response = await fetch('https://api.openai.com/v1/chat/completions', request);
        const data = await response.json();
        const receivedAt = Date.now();
        const suggestion = data.choices[0].message.content;

        console.log(`[FastAI Rewrite] <${agent.name}> + <${prompt}> + <${original}> => <<${suggestion}>>`)
        console.log(`[FastAI Rewrite] Took ${receivedAt - sentAt}ms`)

        setTimeout(async () => {
            await prisma.activity.create({
                data: {
                    id: newActivityId,
                    agentId: agentId,
                    input: original,
                    prompt: prompt,
                    output: suggestion,
                    result: false
                }
            })
        }, 10)

        return {
            activityId: newActivityId,
            agentId: agentId,
            original: original,
            prompt: prompt,
            suggestion: suggestion
        };
    } catch (error) {
        console.log(error);
        return {
            activityId: newActivityId,
            agentId: agentId,
            original: original,
            prompt: prompt,
            suggestion: "Oops, some error happened :("
        }
    }
}