'use client';

import { signOut, useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    } else if (session.user.role !== 'Admin') {
      router.push('/'); 
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    </DashboardLayout>
  );
}
