'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    console.log('SignIn Result:', result);

    if (result?.error) {
      console.error(result.error);
    } else if (result?.ok && result.url) {
      router.push(result.url || '/');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff] items-center justify-center px-4">
      <div className="flex flex-col md:flex-row bg-[#868da7] shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 bg-black text-white p-6 md:p-10 flex flex-col items-center justify-center rounded-br-lg rounded-bl-lg md:rounded-br-lg md:rounded-tr-lg md:rounded-bl-none">
          <h1 className="text-3xl md:text-4xl leading-tight tracking-tight">
            <div>Safeguard</div>
            <div>Your</div>
            <div><span className="text-[#3742fa]">Tasks</span></div>
            <div>with</div>
            <div>Ease.</div>
          </h1>
        </div>
        <div className="w-full md:w-1/2 bg-[#f0f1f5] p-6 md:p-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Welcome to SafeZen!</h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">Enter your credentials to access your account.</p>
          <form onSubmit={handleSignIn} className="mt-8 space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-800 mb-1 text-sm">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className="border-gray-300 text-sm p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-800 mb-1 text-sm">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="border-gray-300 text-sm p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#3742fa] text-white font-semibold py-2 px-4 rounded"
            >
              Sign In
            </button>
            <div className="text-left mt-2">
              <a href="#" className="text-xs text-gray-600 hover:text-[#3742fa]">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
