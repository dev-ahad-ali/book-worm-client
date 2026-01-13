'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchUsers, updateUserRole } from '@/lib/slices/usersSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UsersIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function ManageUsersPage() {
  const { users, isLoading, error } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
    } catch (error) {
      alert(error || 'Failed to update user role');
    }
  };

  if (isLoading) return <div className='p-8 text-center'>Loading users...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>Error: {error}</div>;

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <main className='bg-background min-h-screen'>
        <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='mb-4 flex items-center gap-3'>
              <UsersIcon className='text-primary h-6 w-6' />
              <div>
                <h1 className='text-foreground text-3xl font-bold'>Manage Users</h1>
                <p className='text-muted-foreground mt-1'>View and change user roles</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <Card className='bg-card border-border/50'>
            <CardContent className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-border border-b'>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Name</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Email</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Role</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Joined</th>
                    <th className='text-foreground px-4 py-4 text-left font-semibold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((appUser) => (
                    <tr key={appUser._id} className='border-border hover:bg-muted/50 border-b'>
                      <td className='text-foreground px-4 py-4 font-medium'>{appUser.name}</td>
                      <td className='text-muted-foreground px-4 py-4'>{appUser.email}</td>
                      <td className='px-4 py-4'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            appUser.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {appUser.role}
                        </span>
                      </td>
                      <td className='text-muted-foreground px-4 py-4 text-xs'>
                        {new Date(appUser.createdDate).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-4'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm' className='bg-transparent'>
                              Change Role
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleChangeRole(appUser._id, 'user')}>
                              Make User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(appUser._id, 'admin')}
                            >
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
            <div className='mt-8 flex justify-center gap-2'>
              <Button
                variant='outline'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className='bg-transparent'
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={page !== currentPage ? 'bg-transparent' : ''}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant='outline'
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className='bg-transparent'
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
