"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Plus, Edit, Activity } from "lucide-react"

type Agent = {
    id: string
    name: string
    status: "active" | "inactive"
    role: string
    tone: string
    rewrites: number
    avatarUrl: string
}

const agents: Agent[] = [
    { id: "1", name: "Agent Smith", status: "active", role: "Support agent", tone: "Friendly", rewrites: 1234, avatarUrl: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "Agent Johnson", status: "inactive", role: "Email writer", tone: "Professional", rewrites: 987, avatarUrl: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Agent Brown", status: "active", role: "Content creator", tone: "Optimistic", rewrites: 2345, avatarUrl: "/placeholder.svg?height=40&width=40" },
    { id: "4", name: "Agent Davis", status: "active", role: "Social media manager", tone: "Casual", rewrites: 1567, avatarUrl: "/placeholder.svg?height=40&width=40" },
    { id: "5", name: "Agent Wilson", status: "active", role: "Technical writer", tone: "Informative", rewrites: 789, avatarUrl: "/placeholder.svg?height=40&width=40" },
]

export default function AgentsPage() {
    const router = useRouter()

    const sortedAgents = [...agents].sort((a, b) => b.rewrites - a.rewrites)

    const handleRowClick = (agentId: string) => {
        router.push(`/a/agents/${agentId}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
                <Button onClick={() => {
                    router.push("/a/agents/create")
                }}>
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
                        <TableHead>Rewrites</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedAgents.map((agent) => (
                        <TableRow
                            key={agent.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleRowClick(agent.id)}
                        >
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                                    <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{agent.name}</TableCell>
                            <TableCell>
                                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                                    {agent.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{agent.role}</TableCell>
                            <TableCell>{agent.tone}</TableCell>
                            <TableCell>{agent.rewrites.toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/a/dashboard/agents/${agent.id}`}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/a/dashboard/agents/${agent.id}/activities`}>
                                            <Activity className="h-4 w-4" />
                                            <span className="sr-only">View activities</span>
                                        </Link>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}