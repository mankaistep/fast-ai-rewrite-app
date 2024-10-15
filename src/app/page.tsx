import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Sparkles, Rocket, Check, Chrome, Globe, PenTool } from 'lucide-react'

export default function Component() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="py-6 px-4 border-b">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <PenTool className="h-6 w-6 text-indigo-600" />
                        <div className="text-2xl font-bold text-indigo-600">FastAI Rewrite</div>
                    </div>
                    <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                        Open app
                    </Button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <Image
                            src="/placeholder.svg?height=400&width=400"
                            alt="AI Writing Assistant"
                            width={400}
                            height={400}
                            className="mx-auto lg:mx-0"
                        />
                    </div>
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-600">
                            AI-Powered Writing
                        </Badge>
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight text-gray-900">
                            Revolutionize Your Writing with AI-Powered Magic
                        </h1>
                        <p className="text-xl mb-8 text-gray-600">
                            Transform your content instantly with our cutting-edge AI technology. Say goodbye to writer's block and hello to limitless creativity!
                        </p>
                        <Button size="lg" className="text-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                            Open FastAI Rewrite <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Supercharge Your Writing Process</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap className="h-8 w-8 text-yellow-500" />, title: "Lightning Fast", description: "Get results in seconds, not hours" },
                            { icon: <Sparkles className="h-8 w-8 text-blue-500" />, title: "AI-Powered Creativity", description: "Unlock new levels of originality" },
                            { icon: <Rocket className="h-8 w-8 text-red-500" />, title: "Boost Productivity", description: "10x your content output effortlessly" }
                        ].map((feature, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    {feature.icon}
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Use Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How to Use FastAI Rewrite</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <Card>
                            <CardHeader>
                                <Globe className="h-8 w-8 text-indigo-500 mb-2" />
                                <CardTitle className="text-xl">Web App</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                    <li>Create your own AI agents</li>
                                    <li>Customize each agent's writing style and tone</li>
                                    <li>Input your content directly in the app</li>
                                    <li>Get instant AI-powered rewrites</li>
                                    <li>Edit and refine the results as needed</li>
                                </ol>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Chrome className="h-8 w-8 text-indigo-500 mb-2" />
                                <CardTitle className="text-xl">Chrome Extension</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                    <li>Install our Chrome extension</li>
                                    <li>Select text on any webpage</li>
                                    <li>Click the FastAI Rewrite extension icon</li>
                                    <li>Choose your preferred AI agent</li>
                                    <li>Get instant rewrites without leaving the page</li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Unbeatable Value</h2>
                    <Card className="w-full max-w-md mx-auto border-2 border-indigo-200">
                        <CardHeader>
                            <CardTitle className="text-2xl text-indigo-600">Unlimited Plan</CardTitle>
                            <CardDescription>Get started with FastAI Rewrite at no cost</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold mb-4 text-gray-900">$0 <span className="text-lg font-normal text-gray-600">/ month</span></p>
                            <ul className="space-y-2 mb-6">
                                {["Unlimited rewrites", "Advanced AI model", "Priority support", "Early access to new features"].map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm text-gray-600 mb-4">
                                It's free because I haven't figured out how to charge yet 😉
                            </p>
                            <Button className="w-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                                Let's go
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">See the Magic in Action</h2>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="FastAI Rewrite Demo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 text-center bg-gray-50">
                <h2 className="text-4xl font-extrabold mb-6 text-gray-900">Ready to Transform Your Writing?</h2>
                <p className="text-xl mb-8 text-gray-600">Join thousands of satisfied users and start rewriting smarter, not harder.</p>
                <Button size="lg" className="text-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    Start Rewriting <ArrowRight className="ml-2" />
                </Button>
            </section>

            {/* Footer */}
            <footer className="py-6 px-4 bg-gray-100 text-center">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} FastAI Rewrite. All rights reserved. Made with ❤️ by AI enthusiasts.
                </p>
            </footer>
        </div>
    )
}