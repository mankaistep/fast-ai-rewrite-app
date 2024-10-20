"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function PrivacyPolicy() {
    const router = useRouter()
    const handleOpenApp = () => {
        router.push('/a/dashboard')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <header className="py-4 px-4 border-b">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/favicon.webp"
                                width="32"
                                height="32"
                                alt="app logo"
                                className="h-6 w-6"
                            />
                            <div className="text-2xl font-bold text-indigo-600">FastAI Rewrite</div>
                        </div>
                    </Link>
                    <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                            onClick={handleOpenApp}>
                        Open app
                    </Button>
                </nav>
            </header>

            <Card className="w-full my-6 max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Privacy Policy for FastAI Rewrite</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <p className="mb-4">
                        At FastAI Rewrite, we are committed to protecting your privacy and ensuring the security of your
                        personal information.
                        This Privacy Policy explains how we collect, use, and safeguard your data when you use our
                        Chrome extension.
                    </p>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="information-collection">
                            <AccordionTrigger>Information Collection and Use</AccordionTrigger>
                            <AccordionContent>
                                <p>We collect and use the following information to provide and improve our service:</p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>Authentication data (including session tokens)</li>
                                    <li>Usage data (how you interact with the extension)</li>
                                    <li>Content you input for rewriting (temporarily processed and not stored)</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="cookie-usage">
                            <AccordionTrigger>Cookie Usage</AccordionTrigger>
                            <AccordionContent>
                                <p>
                                    FastAI Rewrite uses cookies for authentication purposes. Specifically, we use the
                                    following cookie:
                                </p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>
                                        <strong>next-auth.session-token</strong> or <strong>__Secure-next-auth.session-token</strong>:
                                        This cookie is essential for maintaining your authenticated session and ensuring
                                        secure access to our services.
                                    </li>
                                </ul>
                                <p className="mt-2">
                                    This cookie is set when you log in and is used to keep you authenticated as you use
                                    the extension.
                                    It does not contain any personal information and is securely encrypted.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="data-security">
                            <AccordionTrigger>Data Security</AccordionTrigger>
                            <AccordionContent>
                                <p>
                                    We implement robust security measures to protect your personal information:
                                </p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>All data transmissions are encrypted using SSL technology</li>
                                    <li>We do not store your original or rewritten content on our servers</li>
                                    <li>Authentication tokens are securely handled and encrypted</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="third-party-access">
                            <AccordionTrigger>Third-Party Access</AccordionTrigger>
                            <AccordionContent>
                                <p>
                                    We do not sell, trade, or otherwise transfer your personal information to outside
                                    parties.
                                    This does not include trusted third parties who assist us in operating our
                                    extension,
                                    conducting our business, or servicing you, as long as those parties agree to keep
                                    this information confidential.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="user-rights">
                            <AccordionTrigger>Your Rights</AccordionTrigger>
                            <AccordionContent>
                                <p>You have the right to:</p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>Access the personal information we hold about you</li>
                                    <li>Request correction of any inaccurate information</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of any future communications from us</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="policy-changes">
                            <AccordionTrigger>Changes to This Policy</AccordionTrigger>
                            <AccordionContent>
                                <p>
                                    We may update our Privacy Policy from time to time. We will notify you of any
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    changes by posting the new Privacy Policy on this page and updating the "Last
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    updated" date at the top of this policy.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="contact-us">
                            <AccordionTrigger>Contact Us</AccordionTrigger>
                            <AccordionContent>
                                <p>
                                    If you have any questions about this Privacy Policy, please contact us at:
                                </p>
                                <p className="mt-2">
                                    Email: privacy@fastai-rewrite.com<br/>
                                    Address: 123 AI Street, Tech City, TC 12345, Country
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}