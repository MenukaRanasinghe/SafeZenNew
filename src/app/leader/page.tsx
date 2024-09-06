'use client';

import { signOut } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div>
        <h1>Leader Dashboard</h1>
      </div>
    </DashboardLayout>
  );
}
