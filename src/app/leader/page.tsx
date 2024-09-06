'use client';

import { signOut, useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LeaderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    } else if (session.user.role !== 'Leader') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        <h1>Leader Dashboard</h1>
      </div>
    </DashboardLayout>
  );
}
