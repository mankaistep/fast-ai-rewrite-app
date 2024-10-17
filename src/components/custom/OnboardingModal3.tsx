import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"

interface OnboardingModal3Props {
    isOpen: boolean
    onClose: () => void
}

export default function OnboardingModal3({ isOpen, onClose }: OnboardingModal3Props) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowModal(true)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [isOpen])

    const handleGetExtension = () => {
        // Replace with actual Chrome extension URL when available
        window.open('https://chrome.google.com/webstore/category/extensions', '_blank')
        onClose()
    }

    return (
        <Dialog open={showModal} onOpenChange={() => {
            setShowModal(false)
            onClose()
        }}>
            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                <div className="flex flex-col items-center gap-6 py-6 px-4 text-center">
                    <motion.div
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Now you know how it works!
                    </motion.div>
                    <motion.div
                        className="text-lg text-gray-700 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="mb-4">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Great job on your first chat! It's time to get our Chrome extension to rewrite on nearly every page you visit.
                        </p>
                    </motion.div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleGetExtension}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 text-lg"
                    >
                        Get Chrome Extension
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}