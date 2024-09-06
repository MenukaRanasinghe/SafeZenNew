'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    } else if (session.user.role !== 'Admin') {
      router.push('/');
    } else {
      const fetchUserCount = async () => {
        try {
          const response = await fetch('/api/users');
          const data = await response.json();
          setUserCount(data.userCount);
        } catch (error) {
          console.error('Failed to fetch user count', error);
        }
      };

      fetchUserCount();
      const fetchTaskCount = async () => {
        try {
          const response = await fetch('/api/tasks');
          const data = await response.json();
          setTaskCount(data.taskCount);
        } catch (error) {
          console.error('Failed to fetch task count', error);
        }
      };

      fetchTaskCount();
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Total Users" count={userCount} />
          <Card title="Total Tasks" count={taskCount} />
        </div>
      </div>
    </DashboardLayout>
  );
}
