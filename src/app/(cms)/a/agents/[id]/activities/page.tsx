"use client"

import {useCallback, useEffect, useState} from "react"
import Link from "next/link"
import { Activity, ArrowLeft, Check, ChevronLeft, ChevronRight, Inbox, X } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

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

type ActivityType = {
    id: string
    prompt: string | null
    input: string
    output: string
    result: boolean
    timestamp: string
    agentId: number
}

type Pagination = {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

function TruncateWithTooltip({ content, maxLength }: { content: string, maxLength: number }) {
    const truncated = content.length > maxLength ? content.slice(0, maxLength) + '...' : content;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help">{truncated}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs break-words">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function AgentActivitiesPage({ params }: { params: { id: string } }) {
    const [agent, setAgent] = useState<Agent>({
        id: -1,
        name: "AI Agent",
        status: "active",
        role: "Agent",
        tone: "professional",
        createdAt: "",
        description: "",
        updatedAt: "",
        userId: -1
    })

    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    })
    const [activities, setActivities] = useState<ActivityType[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null)
    const { toast } = useToast()
    const [error, setError] = useState<string | null>(null)

    const fetchActivities = useCallback(async (page: number) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/agents/activities?agentId=${params.id}&page=${page}&limit=15`)
            if (!response.ok) {
                throw new Error('Failed to fetch activities')
            }
            const data = await response.json()
            setActivities(data.activities)
            setPagination(data.pagination)
            setIsLoading(false)
        } catch (error) {
            // ...
        }
    }, [params.id, setIsLoading, setActivities, setPagination]);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/agents?id=${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch agent')
                }
                const data = await response.json()
                setAgent(data)
            } catch (error) {
                setError('An error occurred while fetching agent')
                console.error('Error fetching agent:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAgent().then(() => fetchActivities(1))
    }, [fetchActivities, params.id])

    const handleAction = async (activityId: string, action: 'approve' | 'reject') => {
        try {
            const endpoint = action === 'approve' ? 'mark-as-approved' : 'mark-as-rejected'
            setIsActionLoading(activityId)
            const response = await fetch(`/api/rewrite/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityId }),
            })
            if (!response.ok) {
                throw new Error(`Failed to ${action} activity`)
            }
            setActivities(activities.map(activity =>
                activity.id === activityId ? { ...activity, result: action === 'approve' } : activity
            ))
            toast({
                title: `Activity ${action}ed`,
                description: action === 'approve'
                    ? `${agent.name} will generate more suggestions like this`
                    : `${agent.name} will avoid generating suggestions like this`,
                duration: 2000
            })
        } catch (error) {
            console.error(`Error ${action}ing activity:`, error)
            toast({
                title: "Error",
                description: `Failed to ${action} the activity. Please try again.`,
                variant: "destructive",
                duration: 4000
            })
        } finally {
            setIsActionLoading(null)
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchActivities(newPage)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0" asChild>
                        <Link href="/a/agents">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to agents</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{agent ? agent.name : 'Agent'}&apos;s activities</h1>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {isLoading ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Input</TableHead>
                                <TableHead>Prompt</TableHead>
                                <TableHead>Output</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Inbox className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This agent hasn&apos;t performed any activities. Start using the agent to see its activities here.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Input</TableHead>
                                <TableHead>Prompt</TableHead>
                                <TableHead>Output</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                                    <TableCell className="max-w-xs">
                                        <TruncateWithTooltip content={activity.input} maxLength={150} />
                                    </TableCell>
                                    <TableCell>
                                        <TruncateWithTooltip content={activity.prompt || 'N/A'} maxLength={50} />
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                        <TruncateWithTooltip content={activity.output} maxLength={150} />
                                    </TableCell>
                                    <TableCell>
                                        {activity.result ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                                Approved
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                                Rejected
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {activity.result ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAction(activity.id, 'reject')}
                                                disabled={isActionLoading === activity.id}
                                                className="flex items-center space-x-1"
                                            >
                                                {isActionLoading === activity.id ? (
                                                    <Skeleton className="h-4 w-4 rounded-full" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                                <span>{isActionLoading === activity.id ? '...' : 'Reject'}</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAction(activity.id, 'approve')}
                                                disabled={isActionLoading === activity.id}
                                                className="flex items-center space-x-1"
                                            >
                                                {isActionLoading === activity.id ? (
                                                    <Skeleton className="h-4 w-4 rounded-full" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                                <span>{isActionLoading === activity.id ? '...' : 'Approve'}</span>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {!isLoading && activities.length > 0 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <Button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPreviousPage || isLoading}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage || isLoading}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}