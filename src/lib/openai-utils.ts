import prisma from "./prisma"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ORGANIZATION_ID = process.env.OPENAI_ORGANIZATION_ID
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID

export async function sendRewriteRequest(agentId: number, original: string, prompt: string) {
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

    const agentDescription = agent.description;
    const agentActivities = agent.activities;

    const messages: {
        role: string,
        content: string
    }[] = []
    for (let i = 0; i < agentActivities.length; i++) {
        const currentActivity = agentActivities[i];

        // Get previous activity
        let previousActivity = null;
        if (i > 0) {
            previousActivity = agentActivities[i - 1];
        }

        // Get later activities
        let laterActivity = null;
        if (i < agentActivities.length - 1) {
            laterActivity = agentActivities[i + 1];
        }

        // Check if approved activity
        let approved = false
        if (previousActivity == null) {
            // Only 1
            if (laterActivity == null) {
                approved = currentActivity.input !=
            }
        }
        else if (previousActivity?.input == currentActivity.input && laterActivity?.input != currentActivity.input) {
            approved = true
        }

        const approvalMessage = approved ? "and I think it's good, approved" : " and I don't think it's good"

        const message = {
            role: "user",
            content: `
                you generated from ${currentActivity.input} to ${currentActivity.output}
                with the additional prompt: ${prompt}
                ${approvalMessage}
            `
        }

        messages.push(message);
    }

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
                        ${agentDescription}
                        if note when rewrite empty, please ignore
                        if previous generated response is empty, please ignore
                    `
                },
                {
                    role: "user",
                    content: `
                        based on the activities above, rewrite as the requirement below
                        message to rewrite: ${original}.
                        note when rewrite: ${prompt}.
                    `
                }
            ],
            temperature: 0.3
        })
    }
}