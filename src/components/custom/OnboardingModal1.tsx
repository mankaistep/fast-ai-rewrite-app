import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"
import { Zap, Sparkles, Rocket } from 'lucide-react'

interface OnboardingModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const router = useRouter()

    const handleCreateAgent = () => {
        router.push('/a/agents/create')
        onClose()
    }

    const iconVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                <div className="flex flex-col items-center gap-6 py-6">
                    <motion.div
                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 whitespace-nowrap"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Welcome to Fast AI Rewrite!
                    </motion.div>
                    <div className="flex justify-center space-x-12">
                        <motion.div
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <Zap className="h-16 w-16 text-yellow-500" />
                            <p className="mt-2 font-semibold text-gray-700">Lightning Fast</p>
                        </motion.div>
                        <motion.div
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <Sparkles className="h-16 w-16 text-blue-500" />
                            <p className="mt-2 font-semibold text-gray-700">AI-Powered</p>
                        </motion.div>
                        <motion.div
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.6 }}
                            className="flex flex-col items-center"
                        >
                            <Rocket className="h-16 w-16 text-red-500" />
                            <p className="mt-2 font-semibold text-gray-700">Boost Productivity</p>
                        </motion.div>
                    </div>
                    <motion.div
                        className="text-center text-lg text-gray-700 font-medium max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <p className="mb-4">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            FastAI Rewrite is a platform that allows you to create your own AI writing assistant that can learn from each rewrite activity
                        </p>
                    </motion.div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleCreateAgent}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 text-lg"
                    >
                        Create new agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}