"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react'
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

// Comprehensive type definitions
type Agent = {
    name: string;
    tone: string;
    user: {
        name: string;
        email: string;
        image?: string;
    };
};

type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    googleId?: string;
};

type ChatActivity = {
    id: string;
    agentId: string;
    agent: Agent;
    prompt: string;
    input: string;
    output: string;
    timestamp: string;
    approved: boolean;
    rejected: boolean;
};

type RewriteHistory = {
    id: string;
    agentId: string;
    agent: Agent;
    prompt: string;
    input: string;
    output: string;
    timestamp: string;
    result: boolean;
};

type SortField = 'id' | 'agentId' | 'userId' | 'userEmail' | 'userName' | 'timestamp' | 'name' | 'email' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [chatActivities, setChatActivities] = useState<ChatActivity[]>([]);
    const [rewriteHistory, setRewriteHistory] = useState<RewriteHistory[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState<SortField>('timestamp');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [activeTab, setActiveTab] = useState<'chat' | 'rewrite' | 'users'>('chat');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const itemsPerPage = 30;

    useEffect(() => {
        fetchData();
    }, [activeTab, currentPage, sortField, sortOrder]);

    useEffect(() => {
        const user = session?.user;
        if (user?.email) {
            if (!user || !['hhoang21vn@gmail.com', 'hoangnh1@bsscommerce.com'].includes(user.email as string)) {
                router.push('/a/dashboard')
            }
        }
    }, [session])

    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            let url = `/api/admin/${activeTab === 'chat' ? 'chat-activities' : activeTab === 'rewrite' ? 'rewrite-history' : 'users'}?page=${currentPage}&limit=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            switch (activeTab) {
                case 'chat':
                    setChatActivities(data.chatActivities);
                    break;
                case 'rewrite':
                    setRewriteHistory(data.rewriteHistory);
                    break;
                case 'users':
                    setUsers(data.users);
                    break;
            }
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError('An error occurred while fetching data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const renderChatActivities = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">
                        <Button variant="ghost" onClick={() => handleSort('id')}>
                            ID
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('agentId')}>
                            User avatar
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('userName')}>
                            User Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('userEmail')}>
                            User Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('timestamp')}>
                            Timestamp
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {chatActivities.map((activity) => (
                    <TableRow key={activity.id}>
                        <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={activity.agent.user.image} alt={activity.agent.user.name} />
                                <AvatarFallback>{activity.agent.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>{activity.agent.user.name}</TableCell>
                        <TableCell>{activity.agent.user.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.prompt}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.input}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.output}</TableCell>
                        <TableCell>
                            {activity.approved ? (
                                <Badge variant="default">Approved</Badge>
                            ) : activity.rejected ? (
                                <Badge variant="destructive">Rejected</Badge>
                            ) : (
                                <Badge variant="outline">Pending</Badge>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const renderRewriteHistory = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">
                        <Button variant="ghost" onClick={() => handleSort('id')}>
                            ID
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('agentId')}>
                            User avatar
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('userName')}>
                            User Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('userEmail')}>
                            User Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('timestamp')}>
                            Timestamp
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rewriteHistory.map((activity) => (
                    <TableRow key={activity.id}>
                        <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={activity.agent.user.image} alt={activity.agent.user.name} />
                                <AvatarFallback>{activity.agent.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>{activity.agent.user.name}</TableCell>
                        <TableCell>{activity.agent.user.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.prompt}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.input}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.output}</TableCell>
                        <TableCell>
                            <Badge variant={activity.result ? "default" : "destructive"}>
                                {activity.result ? "Success" : "Failure"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const renderUsers = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('name')}>
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('email')}>
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                            Created At
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Google ID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                        <TableCell>{user.googleId}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="chat" onValueChange={(value) => setActiveTab(value as 'chat' | 'rewrite' | 'users')}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="chat">Chat Activities</TabsTrigger>
                            <TabsTrigger value="rewrite">Rewrite History</TabsTrigger>
                            <TabsTrigger value="users">Users</TabsTrigger>
                        </TabsList>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading...</p>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : (
                            <>
                                <TabsContent value="chat">
                                    {renderChatActivities()}
                                </TabsContent>
                                <TabsContent value="rewrite">
                                    {renderRewriteHistory()}
                                </TabsContent>
                                <TabsContent value="users">
                                    {renderUsers()}
                                </TabsContent>
                            </>
                        )}
                    </Tabs>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}