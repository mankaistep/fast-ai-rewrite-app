"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ArrowLeft } from "lucide-react"

export default function AgentPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const isCreateMode = params.id === 'create'

    const [agent, setAgent] = useState({
        id: params.id,
        name: "",
        role: "",
        tone: "",
        description: "",
        status: "active",
    })

    useEffect(() => {
        if (!isCreateMode) {
            // Fetch agent data if in edit mode
            // This is a mock fetch, replace with actual API call
            setAgent({
                id: params.id,
                name: "Agent Smith",
                role: "Support agent",
                tone: "Friendly",
                description: "A helpful support agent with a friendly demeanor.",
                status: "active",
            })
        }
    }, [isCreateMode, params.id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setAgent(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setAgent(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(isCreateMode ? "Created agent:" : "Updated agent:", agent)
        router.push("/a/agents")
    }

    const handleDelete = () => {
        console.log("Deleting agent:", agent.id)
        setIsDeleteDialogOpen(false)
        router.push("/a/agents")
    }

    const handleBack = () => {
        router.push("/a/agents")
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 p-0">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Agents</span>
                    </Button>
                    <h1 className="text-2xl font-bold">{isCreateMode ? "Create agent" : "Edit agent"}</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={agent.name}
                            onChange={handleInputChange}
                            placeholder="Enter agent name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            name="role"
                            value={agent.role}
                            onChange={handleInputChange}
                            placeholder="Enter agent role"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tone">Tone</Label>
                        <Input
                            id="tone"
                            name="tone"
                            value={agent.tone}
                            onChange={handleInputChange}
                            placeholder="Enter agent tone"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Customized description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={agent.description}
                            onChange={handleInputChange}
                            placeholder="Enter a customized description for the agent"
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
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
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <Button type="submit">{isCreateMode ? "Create agent" : "Update agent"}</Button>
                        {!isCreateMode && (
                            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">Delete Agent</Button>
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