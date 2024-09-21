"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Check, Copy, UserRound, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Agent } from "@prisma/client";

type Chat = {
    input: string
    prompt: string
    output: string
    approved?: boolean
    rejected?: boolean
}

const fixedData: Chat[] = [
    {
        input: "What's the weather like today?",
        prompt: "Provide a detailed weather forecast",
        output: "Today's weather forecast shows partly cloudy skies with a high of 72°F (22°C) and a low of 58°F (14°C). There's a 20% chance of light rain in the afternoon. Winds will be gentle, coming from the southwest at 5-10 mph. Overall, it's a pleasant day with comfortable temperatures and minimal precipitation expected."
    },
    {
        input: "Can you recommend a good Italian restaurant?",
        prompt: "Suggest a highly-rated Italian restaurant with details",
        output: "I'd recommend 'La Trattoria Bella', a highly-rated Italian restaurant known for its authentic cuisine and warm atmosphere. Located in the heart of downtown, it offers a diverse menu featuring hand-made pasta, wood-fired pizzas, and a selection of fine Italian wines. Their signature dish is the 'Osso Buco alla Milanese'. The restaurant has a 4.5-star rating on popular review sites, with patrons praising the food quality, attentive service, and charming decor. Reservations are recommended, especially for weekend dinners."
    },
    {
        input: "How do I change a flat tire?",
        prompt: "Provide step-by-step instructions for changing a flat tire",
        output: "Here's a step-by-step guide to changing a flat tire:\n\n1. Ensure you're in a safe location, away from traffic.\n2. Turn on your hazard lights and engage the parking brake.\n3. Locate the spare tire, jack, and lug wrench in your vehicle.\n4. Use the wrench to loosen the lug nuts on the flat tire (don't remove them completely).\n5. Place the jack under the vehicle's frame near the flat tire.\n6. Raise the vehicle until the flat tire is off the ground.\n7. Remove the lug nuts and the flat tire.\n8. Mount the spare tire onto the wheel hub.\n9. Replace the lug nuts and tighten them by hand.\n10. Lower the vehicle and remove the jack.\n11. Use the wrench to fully tighten the lug nuts in a star pattern.\n12. Store the flat tire and all tools back in your vehicle.\n\nRemember, a spare tire is usually a temporary solution. Get your regular tire repaired or replaced as soon as possible."
    }
]

export default function Component() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

    const [userInput, setUserInput] = useState("")
    const [aiPrompt, setAiPrompt] = useState("")

    const [chat, setChat] = useState<Chat[]>(fixedData)

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const handleSubmit = async () => {
        const response = await fetch('/api/rewrite/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agentId: selectedAgent?.id,
                original: userInput,
                prompt: aiPrompt,
                isChat: true
            })
        })

        if (response == null) {
            return null
        }

        const suggestion = await response.json()

        console.log(suggestion)

        const newConversation: Chat = {
            input: userInput,
            prompt: aiPrompt,
            output: suggestion.suggestion
        }
        setChat([...chat, newConversation])
        setUserInput("")
        setAiPrompt("")
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
    }

    const handleApprove = (index: number) => {
        setChat(chat.map((conv, i) =>
            i === index ? { ...conv, result: conv.approved, rejected: false } : conv
        ))
    }

    const handleReject = (index: number) => {
        setChat(chat.map((conv, i) =>
            i === index ? { ...conv, rejected: conv.rejected, result: false } : conv
        ))
    }

    const handleChangeSelectedAgent = (agentId: string) => {
        const selectedAgent = agents.find((agent) => agent.id == parseInt(agentId));
        setSelectedAgent(selectedAgent || null);
    }

    // Get chat when agent is selected
    useEffect(() => {
        const fetchChats = async () => {
            if (!selectedAgent) {
                return
            }
            const response = await fetch(`/api/agents/chat-activities?agentId=${selectedAgent?.id}`, {
                method: 'GET'
            })
            const data = await response.json()
            setChat(data)
        }

        fetchChats().then()
    }, [selectedAgent]);

    // Init agent list
    useEffect(() => {
        const fetchAgents = async () => {
            const response = await fetch('/api/agents', { method: 'GET' })
            if (!response.ok) {
                console.error('Failed to fetch agents');
                return;
            }
            const data = await response.json()
            setAgents(data)
            if (data.length > 0) {
                setSelectedAgent(data[0])
            }
        }

        fetchAgents()
    }, [])

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Chat with AI</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <Card className="w-full md:w-1/3">
                    <CardHeader>
                        <CardTitle>Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="agent-select" className="block text-sm font-medium mb-1">
                                Select agent
                            </label>
                            <Select value={selectedAgent?.id.toString()} onValueChange={(newAgentId) => {
                                handleChangeSelectedAgent(newAgentId)
                            }}>
                                <SelectTrigger id="agent-select">
                                    <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    { agents.map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id.toString()}>{agent.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="user-input" className="block text-sm font-medium mb-1">
                                Text to rewrite
                            </label>
                            <Textarea
                                id="user-input"
                                placeholder="Enter your text here"
                                rows={4}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                                Extra note
                            </label>
                            <Input
                                id="prompt"
                                placeholder="Enter prompt for AI"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSubmit} className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Submit
                        </Button>
                    </CardContent>
                </Card>
                <Card className="w-full md:w-2/3">
                    <CardHeader>
                        <CardTitle>{selectedAgent?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            {chat.map((conv, index) => (
                                <div key={index} className="mb-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <Avatar>
                                            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocJCZtaOcOwDWEJ0Gro0VBFu_cZ9WfvDqXO3PAp6Ga8_QSgZvF-H=s96-c" alt="User" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-grow">
                                            <p className="text-sm font-medium">Text to rewrite:</p>
                                            <p className="text-sm text-muted-foreground">{conv.input}</p>
                                            {
                                                conv.prompt ? <>
                                                    <p className="text-sm font-medium mt-2">Extra note:</p>
                                                    <p className="text-sm text-muted-foreground">{conv.prompt}</p>
                                                </> : <></>
                                            }

                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <Avatar>
                                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                                            <AvatarFallback><UserRound className="text-primary" /></AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-grow">
                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                            <p className="text-sm font-medium">{selectedAgent?.name}'s response:</p>
                                            <p className="text-sm bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">{conv.output}</p>
                                            <div className="flex justify-end space-x-2 mt-2">
                                                <Button
                                                    variant={conv.rejected ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleApprove(index)}
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    {conv.approved ? "Approved" : "Approve"}
                                                </Button>
                                                <Button
                                                    variant={conv.rejected ? "default" : "outline"}
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleReject(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">Reject response</span>
                                                </Button>
                                                <TooltipProvider>
                                                    <Tooltip open={copiedIndex === index}>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleCopy(conv.output, index)}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                                <span className="sr-only">Copy response</span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copied</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}