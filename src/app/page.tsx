'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // if (session) {
    //   const redirectUrl = session.user?.role === 'Admin'
    //     ? '/admin'
    //     : session.user?.role === 'Leader'
    //     ? '/leader'
    //     : session.user?.role === 'Member'
    //     ? '/member'
    //     : '/';
      
    //   router.push(redirectUrl);
    // }
  }, [session, router]);

  if (!session) {
    return (
      <div className="h-screen w-full flex bg-white">
        <div className="flex flex-col justify-center items-start w-1/3 p-12">
          <h1 className="text-5xl font-bold mb-6">SafeZen</h1>
          <p className="text-xl mb-6">Effortlessly manage and secure your tasks, ensuring peace of mind.</p>
          <button
            onClick={() => signIn()}
            className="px-6 py-3 bg-[#3742fa] text-white rounded hover:bg-blue-600"
          >
            Sign in
          </button>
        </div>

        <div
          className="w-2/3 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://img.freepik.com/free-vector/isometric-time-management-concept-illustrated_52683-55734.jpg?ga=GA1.1.709617803.1722429350')",
          }}
        ></div>
      </div>
    );
  }

  return null;
}
