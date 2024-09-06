'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const redirectUrl = session.user?.role === 'Admin'
        ? '/admin'
        : session.user?.role === 'Leader'
        ? '/leader'
        : session.user?.role === 'Member'
        ? '/member'
        : '/';
      
      router.push(redirectUrl);
    }
  }, [session, router]);

  if (!session) {
    return (
      <div>
        <p>You are not logged in</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return null;
}
