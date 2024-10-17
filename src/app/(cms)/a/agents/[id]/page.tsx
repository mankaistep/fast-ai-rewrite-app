"use client"

import {useState, useEffect, useCallback} from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter} from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function AgentPage({ params }: { params: { id: string } }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const isCreateMode = params.id === 'create'
    const { data: session } = useSession()
    const { toast } = useToast()
    const router = useRouter()

    const [agent, setAgent] = useState({
        id: params.id,
        name: "",
        role: "",
        tone: "",
        description: "",
        status: "active",
    })

    const fetchAgent = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/agents?id=${params.id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch agent')
            }
            const data = await response.json()
            setAgent(data)
        } catch (error) {
            console.error('Error fetching agent:', error)
        } finally {
            setIsLoading(false)
        }
    }, [params.id])

    useEffect(() => {
        if (!isCreateMode) {
            fetchAgent()
        }
    }, [fetchAgent, isCreateMode])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setAgent(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setAgent(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const url = isCreateMode ? '/api/agents' : `/api/agents`
            const method = isCreateMode ? 'POST' : 'PUT'

            const bodyData = isCreateMode
                ? { ...agent, userEmail: session?.user?.email }
                : agent

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save agent')
            }

            toast({
                title: "Success",
                description: isCreateMode ? "Agent created successfully" : "Agent updated successfully",
            })

            if (isCreateMode) {
                setTimeout(() => {
                    router.push("/a/agents?created=true");
                }, 1000)
            }

        } catch (error) {
            console.error('Error saving agent:', error)
            setError(error instanceof Error ? error.message : 'Failed to save agent. Please try again.')
        }
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/agents?id=${agent.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete agent')
            }

            setIsDeleteDialogOpen(false)
            toast({
                title: "Success",
                description: "Agent deleted successfully",
            })

            setTimeout(() => {
                router.push("/a/agents");
            }, 1000)

        } catch (error) {
            console.error('Error deleting agent:', error)
            setError(error instanceof Error ? error.message : 'Failed to delete agent. Please try again.')
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0" asChild>
                        <Link href="/a/agents">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{isCreateMode ? "Create agent" : "Edit agent"}</h1>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input
                                id="name"
                                name="name"
                                value={agent.name}
                                onChange={handleInputChange}
                                placeholder="Enter agent name"
                                required
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input
                                id="role"
                                name="role"
                                value={agent.role}
                                onChange={handleInputChange}
                                placeholder="Enter agent role"
                                required
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tone">Tone</Label>
                        {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input
                                id="tone"
                                name="tone"
                                value={agent.tone}
                                onChange={handleInputChange}
                                placeholder="Enter agent tone"
                                required
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Customized description</Label>
                        {isLoading ? (
                            <Skeleton className="h-24 w-full" />
                        ) : (
                            <Textarea
                                id="description"
                                name="description"
                                value={agent.description}
                                onChange={handleInputChange}
                                placeholder="Enter a customized description for the agent"
                                rows={4}
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Select
                                name="status"
                                value={agent.status}
                                onValueChange={(value) => handleSelectChange("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select agent status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isCreateMode ? "Create agent" : "Update agent"}
                        </Button>
                        {!isCreateMode && (
                            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" disabled={isLoading}>
                                        Delete agent
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the agent
                                            and remove their data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}