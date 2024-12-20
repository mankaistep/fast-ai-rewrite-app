"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Check, Copy, UserRound, X, Loader2, MessageSquare } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Agent } from "@prisma/client"
import { useSession } from "next-auth/react"
import OnboardingModal3 from "@/components/custom/OnboardingModal3";

type Chat = {
    id: string
    input: string
    prompt: string
    output: string
    approved: boolean | null
    rejected: boolean | null
    timestamp: string
    agentId: number
    isLoading?: boolean
    isActionLoading?: boolean
}

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl font-semibold text-gray-700 mb-2">No messages yet</p>
        <p className="text-sm text-gray-500">{message}</p>
    </div>
)

const ParagraphRenderer = ({ text }: { text: string }) => {
    return (
        <>
            {text.split('\n').map((line, index) => (
                <p key={index} className="mb-1 last:mb-0">
                    {line || <br />}
                </p>
            ))}
        </>
    )
}

export default function ChatPage() {
    const { data: session, status } = useSession()
    const [userAvatar, setUserAvatar] = useState("")
    const { toast } = useToast()

    const [agents, setAgents] = useState<Agent[]>([])
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

    const [userInput, setUserInput] = useState("")
    const [aiPrompt, setAiPrompt] = useState("")

    const [chat, setChat] = useState<Chat[]>([])

    const [showOnboardingModal3, setShowOnboardingModal3] = useState(false)

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [chatFetchError, setChatFetchError] = useState<string | null>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const handleSubmit = async () => {
        setIsLoading(true)
        const newConversation: Chat = {
            id: Date.now().toString(),
            input: userInput,
            prompt: aiPrompt,
            output: "",
            approved: false,
            rejected: false,
            timestamp: new Date().toISOString(),
            agentId: selectedAgent?.id || 0,
            isLoading: true
        }
        setChat(prevChat => [...prevChat, newConversation])
        setTimeout(() => {
            scrollToBottom()
        }, 5)

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

            setChat(prevChat => [
                ...prevChat.filter(conv => conv.id !== newConversation.id),
                { ...newConversation, id: suggestion.activityId, output: suggestion.suggestion, isLoading: false }
            ])

            // Show onboarding modal
            setTimeout(() => {
                if (chat.length == 1 && agents.length == 1) {
                    setShowOnboardingModal3(true)
                }
            }, 1500)
        } catch (error) {
            console.error("Error in handleSubmit:", error)
            setChat(prevChat => prevChat.map(conv =>
                conv.id === newConversation.id
                    ? { ...conv, output: "Error occurred while generating response.", isLoading: false }
                    : conv
            ))
        } finally {
            setIsLoading(false)
            setUserInput("")
            setAiPrompt("")
            setTimeout(() => {
                scrollToBottom()
            }, 5)
        }
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleAction = async (index: number, action: 'approve' | 'reject') => {
        const chatToUpdate = chat[index]
        const isCurrentlyMarked = action === 'approve' ? chatToUpdate.approved : chatToUpdate.rejected

        setChat(prevChat => prevChat.map((conv, i) =>
            i === index ? { ...conv, isActionLoading: true } : conv
        ))

        await sendMarkRequest(action, chatToUpdate.id)

        setChat(prevChat => prevChat.map((conv, i) =>
            i === index ? {
                ...conv,
                approved: action === 'approve' ? !isCurrentlyMarked : false,
                rejected: action === 'reject' ? !isCurrentlyMarked : false,
                isActionLoading: false
            } : conv
        ))

        if (!isCurrentlyMarked && selectedAgent) {
            toast({
                title: `Activity ${action}ed`,
                description: action === 'approve'
                    ? `${selectedAgent.name} will generate more suggestions like this`
                    : `${selectedAgent.name} will avoid generating suggestions like this`,
                duration: 2000
            })
        }
    }

    const handleChangeSelectedAgent = (agentId: string) => {
        const selectedAgent = agents.find((agent) => agent.id === parseInt(agentId))
        setSelectedAgent(selectedAgent || null)
        setChatFetchError(null)
    }

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }

    const sendMarkRequest = async (action: 'approve' | 'reject', chatId: string) => {
        try {
            await fetch('/api/rewrite/mark-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatActivityId: chatId,
                    action: action
                })
            })
        } catch (error) {
            console.error("Error in sendMarkRequest:", error)
        }
    }

    // Get user avatar image
    useEffect(() => {
        if (status === 'authenticated' && session) {
            setUserAvatar(session.user?.image || "https://i.pravatar.cc/300")
        }
    }, [session, status])

    // Get chat
    useEffect(() => {
        const fetchChats = async () => {
            if (!selectedAgent) {
                setChat([])
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
                setChatFetchError(null)
                setTimeout(() => {
                    scrollToBottom()
                }, 5)
            } catch (error) {
                console.error("Error fetching chats:", error)
                setChatFetchError("Failed to fetch chat history. Please try again.")
                setChat([])
            }
        }

        fetchChats()
    }, [selectedAgent])

    // Get agents
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

    return (
        <>
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
                                        Agent
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
                                        placeholder="Enter note here (optional)"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                    />
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    className={`w-full mt-auto ${isLoading ? 'animate-pulse' : ''} text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700`}
                                    disabled={isLoading || !selectedAgent}
                                >
                                    {isLoading ? (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                                            <span className="animate-pulse">Thinking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Rewrite
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full lg:w-2/3 flex flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle>{selectedAgent ? "Chat with " + selectedAgent?.name : "Select an agent to chat"}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden">
                            <ScrollArea className="h-[calc(100vh-16rem)] flex flex-col" ref={scrollAreaRef}>
                                {!selectedAgent || chatFetchError || chat.length === 0 ? (
                                    <div className="flex-grow flex items-center justify-center">
                                        <EmptyState
                                            message={
                                                !selectedAgent
                                                    ? "Select an agent to start chatting"
                                                    : chatFetchError
                                                        ? chatFetchError
                                                        : "No chat history available. Start a new conversation!"
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6 pr-4" ref={chatContainerRef}>
                                        {chat.map((conv, index) => (
                                            <div key={conv.id} className="mb-6">
                                                <div className="flex items-start space-x-4 mb-4 relative">
                                                    <Avatar>
                                                        <AvatarImage src={userAvatar} alt="User" />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1 flex-grow">
                                                        <p className="text-sm font-medium">Text to rewrite:</p>
                                                        <div className="text-sm text-muted-foreground">
                                                            <ParagraphRenderer text={conv.input} />
                                                        </div>
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
                                                        {conv.isLoading ? (
                                                            <div className="space-y-2">
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-4/5" />
                                                                <Skeleton className="h-4 w-3/5" />
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                                                                <ParagraphRenderer text={conv.output} />
                                                            </div>
                                                        )}
                                                        {!conv.isLoading && (
                                                            <div className="flex justify-end space-x-2 mt-2">
                                                                <Button
                                                                    variant={conv.approved ? "default" : "outline"}
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={() => handleAction(index, 'approve')}
                                                                    disabled={conv.isActionLoading}
                                                                >
                                                                    {conv.isActionLoading ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        <Check className="h-3 w-3" />
                                                                    )}
                                                                    <span className="sr-only">
                                                                        {conv.approved ? "Approved" : "Approve"}
                                                                    </span>
                                                                </Button>
                                                                <Button
                                                                    variant={conv.rejected ? "default" : "outline"}
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={() => handleAction(index, 'reject')}
                                                                    disabled={conv.isActionLoading}
                                                                >
                                                                    {conv.isActionLoading ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        <X className="h-3 w-3" />
                                                                    )}
                                                                    <span className="sr-only">Reject response</span>
                                                                </Button>
                                                                <TooltipProvider>
                                                                    <Tooltip open={copiedIndex === index}>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                className="h-6 w-6"
                                                                                onClick={() => handleCopy(conv.output, index)}
                                                                            >
                                                                                <Copy className="h-3 w-3" />
                                                                                <span className="sr-only">Copy response</span>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Copied</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <OnboardingModal3
                isOpen={showOnboardingModal3}
                onClose={() => setShowOnboardingModal3(false)}
            />
            <Toaster />
        </>
    )
}