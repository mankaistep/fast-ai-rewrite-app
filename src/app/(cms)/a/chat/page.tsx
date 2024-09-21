"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Check, Copy, UserRound, X, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Agent } from "@prisma/client"

type Chat = {
    id: string
    input: string
    prompt: string
    output: string
    approved: boolean | null
    rejected: boolean | null
    timestamp: string
    agentId: number
}

export default function ChatPage() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
    const [userInput, setUserInput] = useState("")
    const [aiPrompt, setAiPrompt] = useState("")
    const [chat, setChat] = useState<Chat[]>([])
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const suggestion = await response.json()

            const newConversation: Chat = {
                id: Date.now().toString(),
                input: userInput,
                prompt: aiPrompt,
                output: suggestion.suggestion,
                approved: null,
                rejected: null,
                timestamp: new Date().toISOString(),
                agentId: selectedAgent?.id || 0
            }
            setChat(prevChat => [...prevChat, newConversation])
            setUserInput("")
            setAiPrompt("")
        } catch (error) {
            console.error("Error in handleSubmit:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleApprove = (index: number) => {
        setChat(prevChat => prevChat.map((conv, i) =>
            i === index ? { ...conv, approved: !conv.approved, rejected: false } : conv
        ))
    }

    const handleReject = (index: number) => {
        setChat(prevChat => prevChat.map((conv, i) =>
            i === index ? { ...conv, rejected: !conv.rejected, approved: false } : conv
        ))
    }

    const handleChangeSelectedAgent = (agentId: string) => {
        const selectedAgent = agents.find((agent) => agent.id === parseInt(agentId))
        setSelectedAgent(selectedAgent || null)
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        const fetchChats = async () => {
            if (!selectedAgent) {
                return
            }
            try {
                const response = await fetch(`/api/agents/chat-activities?agentId=${selectedAgent.id}`, {
                    method: 'GET'
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setChat(data)
            } catch (error) {
                console.error("Error fetching chats:", error)
            }
        }

        fetchChats()
    }, [selectedAgent])

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch('/api/agents', { method: 'GET' })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setAgents(data)
                if (data.length > 0) {
                    setSelectedAgent(data[0])
                }
            } catch (error) {
                console.error("Error fetching agents:", error)
            }
        }

        fetchAgents()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [chat])

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-hidden">
                <Card className="w-full lg:w-1/3 flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>Input</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow overflow-hidden">
                        <div className="space-y-4 flex flex-col flex-grow">
                            <div>
                                <label htmlFor="agent-select" className="block text-sm font-medium mb-1">
                                    Select agent
                                </label>
                                <Select value={selectedAgent?.id.toString()} onValueChange={handleChangeSelectedAgent}>
                                    <SelectTrigger id="agent-select">
                                        <SelectValue placeholder="Select an agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id.toString()}>{agent.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-grow flex flex-col">
                                <label htmlFor="user-input" className="block text-sm font-medium mb-1">
                                    Text to rewrite
                                </label>
                                <Textarea
                                    id="user-input"
                                    placeholder="Enter your text here"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="flex-grow resize-none"
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
                            <Button onClick={handleSubmit} className="w-full mt-auto" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full lg:w-2/3 flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>{selectedAgent?.name || "Select an Agent"}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-16rem)]">
                            <div className="space-y-6 pr-4" ref={chatContainerRef}>
                                {chat.length > 0 ? (
                                    chat.map((conv, index) => (
                                        <div key={conv.id} className="mb-6">
                                            <div className="flex items-start space-x-4 mb-4 relative">
                                                <Avatar>
                                                    <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocJCZtaOcOwDWEJ0Gro0VBFu_cZ9WfvDqXO3PAp6Ga8_QSgZvF-H=s96-c" alt="User" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 flex-grow">
                                                    <p className="text-sm font-medium">Text to rewrite:</p>
                                                    <p className="text-sm text-muted-foreground">{conv.input}</p>
                                                    {conv.prompt && (
                                                        <>
                                                            <p className="text-sm font-medium mt-2">Extra note:</p>
                                                            <p className="text-sm text-muted-foreground">{conv.prompt}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground absolute top-0 right-0">
                                                    {new Date(conv.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <Avatar>
                                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                                                    <AvatarFallback><UserRound className="text-primary" /></AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 flex-grow">
                                                    <p className="text-sm font-medium">{selectedAgent?.name || "AI"}&apos;s response:</p>
                                                    <p className="text-sm bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">{conv.output}</p>
                                                    <div className="flex justify-end space-x-2 mt-2">
                                                        <Button
                                                            variant={conv.approved ? "default" : "outline"}
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
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-muted-foreground">No chat history available.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}