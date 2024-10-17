"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, CheckCircle, BarChart } from "lucide-react"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import OnboardingModal from "@/components/custom/OnboardingModal1";
import {useRouter} from "next/navigation";

type Metric = {
    current: number;
    previous: number;
    unit: 'month' | 'week' | 'day';
};

type DashboardMetrics = {
    activeAgents: Metric;
    successfulRewrites: Metric;
    totalRequests: Metric;
};

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false)

    const checkForAgents = async () => {
        try {
            const response = await fetch('/api/agents')
            if (!response.ok) {
                throw new Error('Failed to fetch agents')
            }
            const agents = await response.json()
            if (agents.length === 0) {
                setShowOnboarding(true)
            }
        } catch (error) {
            console.error('Error checking for agents:', error)
        }
    }

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const response = await fetch('/api/metrics');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard metrics');
                }
                const data = await response.json();
                setMetrics(data);
            } catch (err) {
                setError('An error occurred while fetching dashboard metrics');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMetrics();
        checkForAgents();
    }, []);

    function calculatePercentageChange(current: number, previous: number) {
        if (current === 0) return "--";
        return ((current - previous) / previous * 100).toFixed(1);
    }

    function calculateSuccessRate(successfulRewrites: number, totalRequests: number) {
        if (totalRequests === 0) {
            return "--";
        }
        return ((successfulRewrites / totalRequests) * 100).toFixed(1);
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const percentageChange = calculatePercentageChange(metrics?.totalRequests.current || 0, metrics?.totalRequests.previous || 1);
    const changePrefix = percentageChange !== "--" && parseFloat(percentageChange) > 0 ? '+' : '';

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
                Dashboard
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Agents
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{metrics?.activeAgents.current}</div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/a/agents">
                                View agents
                                <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Successful Rewrites
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{metrics?.successfulRewrites.current}</div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            Success rate: {isLoading ? "--" : calculateSuccessRate(metrics?.successfulRewrites.current || 0, metrics?.totalRequests.current || 0)}%
                        </p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Requests
                        </CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{metrics?.totalRequests.current}</div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "--%" : `${changePrefix}${percentageChange}%`} from last {metrics?.totalRequests.unit}
                        </p>
                    </CardFooter>
                </Card>
            </div>

            {/* Onboarding Modal */}
            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </div>
    )
}