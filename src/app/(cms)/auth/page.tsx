"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
    const [error, setError] = useState("")
    const router = useRouter()

    const handleGoogleLogin = async () => {
        const url = new URL(window.location.href);
        const callbackUrl = url.searchParams.get('callbackUrl');

        try {
            if (callbackUrl) {
                await signIn("google", {
                    callbackUrl: callbackUrl
                })
            } else {
                await signIn("google", {
                    callbackUrl: "/a/dashboard"
                })
            }
        } catch (error) {
            console.error("Login failed", error)
            setError("Failed to login. Please try again.")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
                <div className="text-center">
                    <Image
                        src="/favicon.ico"
                        alt="Fast AI Rewrite Logo"
                        width={64}
                        height={64}
                        className="mx-auto"
                    />
                    <h1 className="mt-6 text-3xl font-bold text-gray-900">Fast AI Rewrite ✦</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Where AI writes faster than you can say "writer's block"
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 gap-3">
                        <Button variant="default" onClick={handleGoogleLogin} className="w-full">
                            <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" aria-hidden="true">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}