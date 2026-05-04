'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
    if (localError) setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-black px-4 py-12">
      {/* Abstract Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 -rotate-6 transform items-center justify-center rounded-xl bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-wide text-white uppercase">
            Initialize <span className="text-red-600">Session</span>
          </h1>
          <p className="font-medium text-gray-400">Access your secure Web3 learning node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || localError) && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-center text-sm font-bold text-red-500">{error || localError}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold tracking-wider text-gray-300 uppercase"
            >
              Network ID (Email)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-bold tracking-wider text-gray-300 uppercase"
              >
                Passphrase
              </label>
              <a
                href="#"
                className="text-xs font-bold text-red-500 transition-colors hover:text-red-400"
              >
                Recover Key?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg py-4 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all ${
              isSubmitting
                ? 'cursor-not-allowed bg-red-900 text-gray-400'
                : 'transform bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]'
            }`}
          >
            {isSubmitting ? 'Authenticating...' : 'Connect node'}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-gray-400">
            Node uninitialized?{' '}
            <Link
              href="/auth/register"
              className="font-bold tracking-wide text-red-500 uppercase hover:text-red-400"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
