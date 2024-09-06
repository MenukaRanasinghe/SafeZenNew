'use client';

import { signOut } from "next-auth/react";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
