"use client"

import React, {useEffect, useState} from "react"
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
import { toast, Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { Users, Menu, LayoutDashboard, LogOut, MessageSquare } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        console.log("Logging out...")
        // Add your logout logic here
    }

    const handleNavigation = (href: string) => {
        if (href === "/a/chat") {
            toast("Coming soon!", {
                description: "This feature is not yet available.",
                duration: 3000,
            })
        } else {
            // Navigate to the clicked route
            router.push(href)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar for larger screens */}
            <aside className="hidden w-64 flex-col overflow-y-auto border-r bg-gray-100/40 lg:flex">
                <SidebarContent pathname={pathname} onLogout={handleLogout} onNavigation={handleNavigation} />
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
                    <div className="flex items-center">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle sidebar</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <SheetHeader>
                                    <SheetTitle>Navigation</SheetTitle>
                                </SheetHeader>
                                <SidebarContent pathname={pathname} onLogout={handleLogout} onNavigation={handleNavigation} />
                            </SheetContent>
                        </Sheet>
                        <div className="ml-4 lg:ml-0">
                            <h3 className="text-xl font-bold">Fast AI Rewrite ✦</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/favicon.ico?height=32&width=32" alt="User" />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">John Doe</p>
                                            <p className="text-xs text-muted-foreground">john.doe@example.com</p>
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
            <Toaster />
        </div>
    )
}

function SidebarContent({ pathname, onLogout, onNavigation }: { pathname: string; onLogout: () => void; onNavigation: (href: string) => void }) {
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
            <ScrollArea className="flex-1 px-2">
                <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            onClick={() => onNavigation(item.href)}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 cursor-pointer",
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