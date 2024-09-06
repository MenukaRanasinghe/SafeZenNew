'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users'); 
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }    

    fetchUsers();
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    } else if (session.user.role !== 'Admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
