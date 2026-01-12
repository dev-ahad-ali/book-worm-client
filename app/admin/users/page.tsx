"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setUsers, updateUserRole } from "@/lib/slices/usersSlice"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UsersIcon } from "lucide-react"

const ITEMS_PER_PAGE = 5

const MOCK_USERS = [
  { _id: "user1", name: "John Reader", email: "user@example.com", role: "user" as const, createdDate: "2024-01-01" },
  { _id: "user2", name: "Jane Smith", email: "jane@example.com", role: "user" as const, createdDate: "2024-01-05" },
  { _id: "user3", name: "Robert Brown", email: "robert@example.com", role: "user" as const, createdDate: "2024-02-01" },
  { _id: "user4", name: "Sarah Davis", email: "sarah@example.com", role: "user" as const, createdDate: "2024-02-15" },
  { _id: "user5", name: "Michael Lee", email: "michael@example.com", role: "user" as const, createdDate: "2024-03-01" },
  { _id: "user6", name: "Emily Wilson", email: "emily@example.com", role: "user" as const, createdDate: "2024-03-10" },
  { _id: "admin1", name: "Admin User", email: "admin@example.com", role: "admin" as const, createdDate: "2024-01-01" },
]

export default function ManageUsersPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { users } = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    if (users.length === 0) {
      dispatch(setUsers(MOCK_USERS as any))
    }
  }, [dispatch, users.length])

  const handleChangeRole = (userId: string, newRole: "user" | "admin") => {
    dispatch(updateUserRole({ userId, role: newRole }))
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <UsersIcon className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
                <p className="text-muted-foreground mt-1">View and change user roles</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <Card className="bg-card border-border/50">
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Joined</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((appUser) => (
                    <tr key={appUser._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4 font-medium text-foreground">{appUser.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{appUser.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appUser.role === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {appUser.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">
                        {new Date(appUser.createdDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Change Role
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleChangeRole(appUser._id, "user")}>
                              Make User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(appUser._id, "admin")}>
                              Make Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="bg-transparent"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={page !== currentPage ? "bg-transparent" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-transparent"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
