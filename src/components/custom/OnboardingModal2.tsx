import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"

interface OnboardingModal2Props {
    isOpen: boolean
    onClose: () => void
}

interface Agent {
    id: number
    name: string
    // Add other properties as needed
}

export default function OnboardingModal2({ isOpen, onClose }: OnboardingModal2Props) {
    const router = useRouter()
    const [agentName, setAgentName] = useState<string>('')

    useEffect(() => {
        const fetchFirstAgent = async () => {
            try {
                const response = await fetch('/api/agents')
                if (!response.ok) {
                    throw new Error('Failed to fetch agents')
                }
                const agents: Agent[] = await response.json()
                if (agents.length > 0) {
                    setAgentName(agents[0].name)
                }
            } catch (error) {
                console.error('Error fetching first agent:', error)
            }
        }

        fetchFirstAgent()
    }, [])

    const handleStartChatting = () => {
        router.push('/a/chat')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                <div className="flex flex-col items-center gap-6 py-6 px-4 text-center">
                    <motion.div
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Congratulations on creating your first agent!
                    </motion.div>
                    <motion.div
                        className="text-lg text-gray-700 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="mb-4">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Great job on creating your first AI agent! Now it's time to challenge your agent with your prompts and see how it can enhance your writing.
                        </p>
                    </motion.div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleStartChatting}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 text-lg"
                    >
                        Chat with {agentName || 'your agent'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}