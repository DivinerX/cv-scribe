"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { FileText, BarChart4, Clock, LogOut, User } from "lucide-react"
import { useUser } from "@/components/user-provider"

export default function Header() {
  const pathname = usePathname()
  const { user, isAdmin, isLoading, logout } = useUser()

  const isLoggedIn = !!user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <span className="font-bold text-xl">CV Scribe</span>
        </Link>
        {
          isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <nav className="hidden md:flex gap-6 mr-4">
                    <Link
                      href="/dashboard"
                      className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/resume/create"
                      className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/resume") ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      Create Resume
                    </Link>
                    {/* <Link
                      href="/applications"
                      className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/applications") ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      Applications
                    </Link> */}
                    <Link
                      href="/profile"
                      className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                          }`}
                      >
                        Admin
                      </Link>
                    )}
                  </nav>

                  <ModeToggle />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                          <AvatarFallback>{user.user_metadata?.full_name[0]}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem asChild>
                        <Link href="/applications" className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Applications</span>
                        </Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center">
                            <BarChart4 className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/" onClick={logout} className="flex items-center text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <ModeToggle />
                  {pathname !== "/signin" && (
                    <Button asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  )}
                </>
              )}
            </div>
          )
        }
      </div>
    </header>
  )
}
