'use client';

import { signOut } from "next-auth/react";

export default function MemberPage() {
  return (
    <div>
      <h1>Member Dashboard</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
