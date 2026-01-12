"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/slices/authSlice"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, BookOpen } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const userLinks = [
    { label: "Home", href: "/home" },
    { label: "Library", href: "/library" },
    { label: "Browse Books", href: "/browse" },
    { label: "Tutorials", href: "/tutorials" },
  ]

  const adminLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Books", href: "/admin/books" },
    { label: "Genres", href: "/admin/genres" },
    { label: "Users", href: "/admin/users" },
    { label: "Reviews", href: "/admin/reviews" },
    { label: "Tutorials", href: "/admin/tutorials" },
  ]

  const navLinks = user?.role === "admin" ? adminLinks : userLinks

  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={isAuthenticated ? (user?.role === "admin" ? "/admin/dashboard" : "/home") : "/"}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground">BookWorm</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href) ? "bg-muted text-foreground" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full w-10 h-10 p-0 bg-transparent">
                    {user?.name?.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href) ? "bg-muted text-foreground" : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            <div className="px-3 py-2 border-t border-border mt-2 pt-4 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              ) : (
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
