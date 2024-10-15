"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {Users, Menu, LayoutDashboard, LogOut, MessageSquare, PenTool} from "lucide-react"
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, status } = useSession()

    // Profile
    const [userDisplayName, setUserDisplayName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userAvatar, setUserAvatar] = useState("")

    useEffect(() => {
        if (status === 'authenticated' && session) {
            setUserDisplayName(session.user?.name || "Mirai Kuriyama")
            setUserEmail(session.user?.email || "yourfemai@gmail.com")
            setUserAvatar(session.user?.image || "https://i.pravatar.cc/300")
        }
    }, [session, status])

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/a/dashboard" })
    }

    const handleNavigation = (href: string) => {
        router.push(href)
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar for larger screens */}
            <aside className="hidden flex-col overflow-y-auto border-r bg-gray-100/40 lg:flex">
                <SidebarContent pathname={pathname} onLogout={handleLogout} onNavigation={handleNavigation} />
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
                    <div className="flex items-center">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-6 w-6"/>
                                    <span className="sr-only">Toggle sidebar</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0">
                                <SheetHeader>
                                    <SheetTitle></SheetTitle>
                                </SheetHeader>
                                <SidebarContent pathname={pathname} onLogout={handleLogout}
                                                onNavigation={handleNavigation}/>
                            </SheetContent>
                        </Sheet>
                        <div className="ml-4 lg:ml-0 flex items-center space-x-2">
                            <PenTool className="h-6 w-6"/>
                            <h3 className="text-xl font-bold">Fast AI Rewrite</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={userAvatar} alt="User" />
                                            <AvatarFallback>
                                                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">{userDisplayName}</p>
                                            <p className="text-xs text-muted-foreground">{userEmail}</p>
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

function SidebarContent({ pathname, onLogout, onNavigation }: {
    pathname: string;
    onLogout: () => void;
    onNavigation: (href: string) => void
}) {
    const navItems = [
        { href: "/a/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/a/agents", label: "Agents", icon: Users },
        { href: "/a/chat", label: "Chat", icon: MessageSquare },
    ]

    return (
        <div className="flex h-full flex-col py-4">
            <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight invisible">
                    Fast AI Rewrite
                </h2>
            </div>
            <ScrollArea className="flex-1">
                <nav className="flex flex-col space-y-1 px-2">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            onClick={() => onNavigation(item.href)}
                            className={cn(
                                "inline-flex items-center rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 cursor-pointer whitespace-nowrap",
                                {
                                    "bg-gray-200": pathname === item.href ||
                                        (item.href !== "/a" && pathname.startsWith(item.href))
                                }
                            )}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </a>
                    ))}
                </nav>
            </ScrollArea>
            <div className="mt-auto px-4 py-2">
                <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Button>
            </div>
        </div>
    )
}