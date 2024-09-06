'use client';

import { signOut } from "next-auth/react";

export default function LeaderPage() {
  return (
    <div>
      <h1>Leader Dashboard</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
