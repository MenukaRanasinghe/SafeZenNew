'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@/types';
import CreateUserForm from '@/components/CreateUserForm';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.users || []);
        setUserCount(data.userCount || 0);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
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

  const handleDeleteUser = async (id: number) => {
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update user role');
      setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleCreateUser = async (email: string, role: string) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) throw new Error('Failed to create user');
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setIsCreatingUser(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => setIsCreatingUser(true)}
          className="bg-[#3742fa] text-white px-4 py-2 rounded"
        >
          Create User
        </button>
        {isCreatingUser && (
          <div className="mt-4 p-4 border rounded">
            <CreateUserForm onSubmit={handleCreateUser} />
            <button
              onClick={() => setIsCreatingUser(false)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-left text-sm border-x-gray-400">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border px-2 py-1"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Leader">Leader</option>
                        <option value="Member">Member</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p>Total Users: {userCount}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
