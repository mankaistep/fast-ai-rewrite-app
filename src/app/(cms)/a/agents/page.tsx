"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Activity, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import OnboardingModal2 from "@/components/custom/OnboardingModal2";

type Agent = {
    id: number
    name: string
    status: "active" | "inactive"
    role: string
    tone: string
    description: string
    userId: number
    createdAt: string
    updatedAt: string
}

export default function AgentsPage() {
    const router = useRouter()
    const [agents, setAgents] = useState<Agent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showOnboardingModal, setShowOnboardingModal] = useState(false)

    useEffect(() => {
        fetchAgents()
    }, [])

    const SearchParamsHandler = () => {
        const searchParams = useSearchParams()

        useEffect(() => {
            const created = searchParams.get('created')
            if (created === 'true' && agents.length === 1) {
                setShowOnboardingModal(true)
            }
        }, [agents, searchParams])

        return null
    }

    const fetchAgents = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/agents')
            if (!response.ok) {
                throw new Error('Failed to fetch agents')
            }
            const data = await response.json()
            setAgents(data)
        } catch (error) {
            setError('An error occurred while fetching agents')
            console.error('Error fetching agents:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRowClick = (agentId: number) => {
        router.push(`/a/agents/${agentId}`)
    }

    const sortedAgents = [...agents].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const renderContent = () => {
        if (isLoading) {
            return (
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            )
        }

        if (error) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-red-500">
                            Error: {error}
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        }

        if (agents.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={7} className="h-[400px] text-center">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Users className="h-16 w-16 text-gray-400" />
                                <h3 className="text-lg font-medium">No agents found</h3>
                                <p className="text-sm text-gray-500">Get started by creating a new agent.</p>
                                <Button onClick={() => router.push("/a/agents/create")}>
                                    <Plus className="mr-2 h-4 w-4" /> Create agent
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        }

        return (
            <TableBody>
                {sortedAgents.map((agent) => (
                    <TableRow
                        key={agent.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={(e) => {
                            if (!(e.target as HTMLElement).closest('button')) {
                                handleRowClick(agent.id)
                            }
                        }}
                    >
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={agent.name} />
                                <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>
                            <Badge
                                variant={agent.status === "active" ? "default" : "secondary"}
                                className={agent.status === "active" ? "bg-green-100 text-green-800" : ""}
                            >
                                {agent.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{agent.role}</TableCell>
                        <TableCell>{agent.tone}</TableCell>
                        <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/a/agents/${agent.id}`}>
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/a/agents/${agent.id}/activities`)
                                    }}
                                >
                                    <Activity className="h-4 w-4" />
                                    <span className="sr-only">View activities</span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
                <Button onClick={() => router.push("/a/agents/create")}>
                    <Plus className="mr-2 h-4 w-4" /> Create agent
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Tone</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {renderContent()}
            </Table>
            <Suspense fallback={null}>
                <SearchParamsHandler />
            </Suspense>
            <OnboardingModal2
                isOpen={showOnboardingModal}
                onClose={() => setShowOnboardingModal(false)}
            />
        </div>
    )
}