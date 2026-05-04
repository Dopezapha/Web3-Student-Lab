'use client';

import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { usePrefetch } from '@/hooks/usePrefetch';
import { NotificationBell } from '../notifications/NotificationBell';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleMouseEnter, handleMouseLeave } = usePrefetch();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { name: 'MODULES', path: '/courses' },
    { name: 'ROADMAP', path: '/roadmap' },
    { name: 'QUIZ', path: '/quiz' },
    { name: 'PLAYGROUND', path: '/playground' },
    { name: 'REVIEWS', path: '/peer-review' },
    { name: 'SIMULATOR', path: '/simulator' },
    { name: 'IDEAS', path: '/ideas' },
    { name: 'VERIFY', path: '/verify' },
    { name: 'AIRDROP', path: '/airdrop' },
    { name: 'JOURNAL', path: '/blog' },
    { name: 'DEVTOOLS', path: '/devtools/events' },
    { name: t('nav.modules'), path: '/courses' },
    { name: t('nav.roadmap'), path: '/roadmap' },
    { name: t('nav.quiz'), path: '/quiz' },
    { name: t('nav.playground'), path: '/playground' },
    { name: t('nav.reviews'), path: '/peer-review' },
    { name: t('nav.simulator'), path: '/simulator' },
    { name: t('nav.ideas'), path: '/ideas' },
    { name: t('nav.verify'), path: '/verify' },
    { name: t('nav.subscriptions'), path: '/subscriptions' },
    { name: t('nav.notarization'), path: '/notarization' },
    { name: t('nav.devtools'), path: '/devtools/events' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="Web3 Lab - Go to homepage"
            >
              <div
                className="flex h-10 w-10 transform items-center justify-center rounded-lg bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform duration-300 group-hover:rotate-12"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-widest text-white uppercase">
                Web3 <span className="text-red-600">Lab</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden items-center gap-6 xl:flex"
            role="menubar"
            aria-label="Site navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                role="menuitem"
                onMouseEnter={() => handleMouseEnter(link.path)}
                onMouseLeave={handleMouseLeave}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors ${
                  isActive(link.path) ? 'text-red-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSelector />
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  onMouseEnter={() => handleMouseEnter('/dashboard')}
                  onMouseLeave={handleMouseLeave}
                  aria-current={isActive('/dashboard') ? 'page' : undefined}
                  className={`rounded border px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                    isActive('/dashboard')
                      ? 'border-red-500 bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'border-white/10 text-gray-400 hover:border-red-500/50 hover:text-white'
                  }`}
                >
                  DASHBOARD
                </Link>
                <Link
                  href="/certificates"
                  onMouseEnter={() => handleMouseEnter('/certificates')}
                  onMouseLeave={handleMouseLeave}
                  aria-current={isActive('/certificates') ? 'page' : undefined}
                  className={`rounded border px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                    isActive('/certificates')
                      ? 'border-red-500 bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'border-white/10 text-gray-400 hover:border-red-500/50 hover:text-white'
                  }`}
                >
                  VAULT
                </Link>
                <NotificationBell />
                <button
                  onClick={logout}
                  aria-label="Logout from your account"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-900 transition-colors hover:border-red-500/50"
                >
                  <svg
                    className="h-5 w-5 text-gray-500 transition-colors group-hover:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-white"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded border border-red-500 bg-red-600 px-6 py-2.5 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]"
                >
                  INITIALIZE
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="rounded text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="space-y-2 border-b border-white/10 bg-black px-4 pt-2 pb-6 shadow-2xl xl:hidden"
          role="menu"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              role="menuitem"
              aria-current={isActive(link.path) ? 'page' : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-3 text-sm font-black tracking-widest uppercase transition-colors ${
                isActive(link.path)
                  ? 'bg-red-500/10 text-red-500'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="my-2 h-px w-full bg-white/10" role="separator"></div>
          {user ? (
            <>
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md bg-red-600 px-3 py-3 text-sm font-black tracking-widest text-white uppercase"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                role="menuitem"
                className="block w-full rounded-md px-3 py-3 text-left text-sm font-black tracking-widest text-red-500 uppercase hover:bg-red-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                role="menuitem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm font-black tracking-widest text-gray-400 uppercase hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                role="menuitem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm font-black tracking-widest text-red-500 uppercase hover:text-red-400"
              >
                Initialize
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
