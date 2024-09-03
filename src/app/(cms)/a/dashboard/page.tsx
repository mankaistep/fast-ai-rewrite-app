import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, CheckCircle, BarChart } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Agents
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25</div>
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
                        <div className="text-2xl font-bold">1,234</div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
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
                        <div className="text-2xl font-bold">12,345</div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            +15% from last week
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}