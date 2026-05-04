'use client';

import AuditLogList from '@/components/dashboard/AuditLogList';
import LayoutGrid from '@/components/dashboard/LayoutGrid';
import { useAuth } from '@/contexts/AuthContext';
import { useLayoutPersistence } from '@/hooks/useLayoutPersistence';
import {
  Certificate,
  certificatesAPI,
  Course,
  coursesAPI,
  Enrollment,
  enrollmentsAPI,
} from '@/lib/api';
import Link from 'next/link';
import { WithSkeleton } from '@/components/ui/WithSkeleton';
import {
  StatCardSkeleton,
  CourseCardSkeleton,
  CertCardSkeleton,
} from '@/components/ui/skeletons/CardSkeleton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [_enrollments, setEnrollments] = useState<Enrollment[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
  });

  const { layout, saveLayout, resetLayout } = useLayoutPersistence(user?.id);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [coursesData, certificatesData, enrollmentsData] = await Promise.all([
          coursesAPI.getAll(),
          user ? certificatesAPI.getByStudentId(user.id) : Promise.resolve([]),
          user ? enrollmentsAPI.getByStudentId(user.id) : Promise.resolve([]),
        ]);

        setCourses(coursesData);
        setCertificates(certificatesData);
        setEnrollments(enrollmentsData);

        setStats({
          totalCourses: coursesData.length,
          enrolledCourses: enrollmentsData.length,
          completedCourses: certificatesData.length,
          certificates: certificatesData.length,
        });
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  // --- Panel content definitions ---

  const statsPanel = (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {[
        { label: 'Available Nodes', value: stats.totalCourses },
        { label: 'Active Uplinks', value: stats.enrolledCourses },
        { label: 'Executed Modules', value: stats.completedCourses },
        { label: 'Cryptographic Tokens', value: stats.certificates },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
        >
          <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-white/5 transition-colors group-hover:bg-red-500/10"></div>
          <p className="font-mono text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-xs font-bold tracking-widest text-gray-500 uppercase">{label}</p>
        </div>
      ))}
    </div>
  );

  const coursesPanel = (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-3 text-xl font-black tracking-widest text-white uppercase">
          <span className="inline-block h-4 w-4 rounded-sm bg-red-600"></span>
          Directory Nodes
        </h3>
        <Link
          href="/courses"
          className="group flex items-center gap-1 text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-white"
        >
          Scan All{' '}
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {courses.slice(0, 4).map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group relative block border border-white/5 bg-zinc-950 p-8 transition-all hover:border-red-500/30 hover:bg-zinc-900"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-transparent transition-colors group-hover:bg-red-600"></div>
            <h4 className="mb-3 text-xl font-black tracking-tight text-white uppercase group-hover:text-red-50">
              {course.title}
            </h4>
            <p className="mb-6 line-clamp-2 text-sm font-light text-gray-400">
              {course.description || 'System metadata missing'}
            </p>
            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <span className="rounded border border-white/10 bg-black px-2 py-1 font-mono text-xs text-gray-500">
                {course.credits} UNIT
              </span>
              <span className="text-xs font-bold tracking-widest text-red-500 uppercase group-hover:text-red-400">
                Connect
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const certificatesPanel = (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-3 text-xl font-black tracking-widest text-white uppercase">
          <span className="inline-block h-4 w-4 rounded-sm bg-red-600"></span>
          Issued Credentials
        </h3>
        <Link
          href="/certificates"
          className="group flex items-center gap-1 text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-white"
        >
          Vault <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {certificates.length === 0 ? (
          <p className="font-mono text-sm text-gray-600">No credentials issued yet.</p>
        ) : (
          certificates.slice(0, 3).map((cert) => (
            <Link
              key={cert.id}
              href={`/certificates/${cert.id}`}
              className="group block rounded-xl border border-red-500/20 bg-black p-6 transition-all hover:border-red-500/60"
            >
              <h4 className="text-base font-bold tracking-wide text-white uppercase group-hover:text-red-100">
                {cert.course?.title || 'Soroban Protocol'}
              </h4>
              <p className="mt-1 text-xs font-light text-red-500/80">
                {new Date(cert.issuedAt).toLocaleDateString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );

  const auditPanel = (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-3 text-xl font-black tracking-widest text-white uppercase">
          <span className="inline-block h-4 w-4 rounded-sm bg-red-600"></span>
          Audit Trails <span className="text-gray-600">[Admin Only]</span>
        </h3>
        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-red-500 uppercase">
          Live Monitoring
        </span>
      </div>
      <div className="rounded-2xl border border-white/5 bg-zinc-950/50 p-8 backdrop-blur-sm">
        <AuditLogList />
      </div>
    </div>
  );

  const panelDefs = [
    { id: 'stats', content: statsPanel },
    { id: 'courses', content: coursesPanel },
    { id: 'certificates', content: certificatesPanel },
    { id: 'audit', content: auditPanel },
  ];

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden pb-20 transition-colors duration-200 selection:bg-red-600 selection:text-white">
      {/* Abstract Background Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-red-600/5 blur-[150px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-red-600/5 blur-[120px]"></div>

      {/* Navigation Layer */}
      {/* Background glows */}
      <div className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-red-600/5 blur-[150px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-red-600/5 blur-[120px]"></div>

      {/* Nav */}
      <nav className="relative sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                Control <span className="text-red-600">Center</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Analytics Link */}
              <Link
                href="/analytics"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:border-red-500/50 hover:text-white"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics
              </Link>

              {/* Layout edit controls */}
              {editMode ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetLayout}
                    className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:border-white/30"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-red-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:border-red-500/50 hover:text-white"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Edit Layout
                </button>
              )}

              <div className="hidden flex-col items-end md:flex">
                <span className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                  Active Operator
                </span>
                <span className="text-text-secondary font-mono text-sm">
                  {user?.name || 'Unknown Entity'}
                </span>
              </div>
              <ThemeToggle />
              <button
                onClick={logout}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold tracking-widest text-red-500 uppercase transition-all hover:bg-red-500 hover:text-white"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Edit mode banner */}
      {editMode && (
        <div className="relative z-10 border-b border-red-500/30 bg-red-600/10 px-4 py-2 text-center">
          <p className="text-xs font-bold tracking-widest text-red-400 uppercase">
            Layout Edit Mode — Drag panels to reorder · Click 1/2/3 to resize columns · Changes are
            saved automatically
          </p>
        </div>
      )}

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 border-l-4 border-red-600 py-2 pl-6">
          <h2 className="text-foreground mb-3 text-4xl font-black tracking-tight uppercase md:text-5xl">
            Terminal <span className="text-text-secondary">Access Granted</span>
          </h2>
          <p className="text-text-secondary text-lg font-light tracking-wide">
            Operator{' '}
            <span className="text-foreground font-mono">
              {user?.name?.split(' ')[0] || 'Student'}
            </span>{' '}
            — Metrics and module connections active.
          </p>
        </div>

        {/* Stats Grid */}
        <WithSkeleton
          isLoading={isLoading}
          skeleton={
            <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          }
        >
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-bg-secondary border-border-theme group relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
            >
              <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-white/5 transition-colors group-hover:bg-red-500/10"></div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black transition-colors group-hover:border-white/30">
                  <svg
                    className="h-6 w-6 text-white group-hover:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <p className="font-mono text-3xl font-black text-white">{stats.totalCourses}</p>
              </div>
              <p className="text-text-secondary mt-2 text-xs font-bold tracking-widest uppercase">
                Available Nodes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-bg-secondary border-border-theme group relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
            >
              <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-white/5 transition-colors group-hover:bg-red-500/10"></div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black transition-colors group-hover:border-white/30">
                  <svg
                    className="h-6 w-6 text-white group-hover:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-mono text-3xl font-black text-white">{stats.enrolledCourses}</p>
              </div>
              <p className="text-text-secondary mt-2 text-xs font-bold tracking-widest uppercase">
                Active Uplinks
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-bg-secondary border-border-theme group relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
            >
              <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-white/5 transition-colors group-hover:bg-red-500/10"></div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black transition-colors group-hover:border-white/30">
                  <svg
                    className="h-6 w-6 text-white group-hover:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <p className="font-mono text-3xl font-black text-white">{stats.completedCourses}</p>
              </div>
              <p className="text-text-secondary mt-2 text-xs font-bold tracking-widest uppercase">
                Executed Modules
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-bg-secondary border-border-theme group relative overflow-hidden rounded-2xl border p-6 transition-all hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
            >
              <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-white/5 transition-colors group-hover:bg-red-500/10"></div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black transition-colors group-hover:border-white/30">
                  <svg
                    className="h-6 w-6 text-white group-hover:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <p className="font-mono text-3xl font-black text-white">{stats.certificates}</p>
              </div>
              <p className="text-text-secondary mt-2 text-xs font-bold tracking-widest uppercase">
                Cryptographic Tokens
              </p>
            </motion.div>
          </div>
        </WithSkeleton>

        {/* Recent Courses */}
        <div className="mb-16 [contain-intrinsic-size:1px_500px] [content-visibility:auto]">
          <div className="border-border-theme mb-8 flex items-center justify-between border-b pb-4">
            <h3 className="text-foreground flex items-center gap-3 text-xl font-black tracking-widest uppercase">
              <span className="inline-block h-4 w-4 rounded-sm bg-red-600"></span> Directory Nodes
            </h3>
            <Link
              href="/courses"
              className="text-text-secondary hover:text-foreground group flex items-center gap-1 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Scan All{' '}
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <WithSkeleton
            isLoading={isLoading}
            skeleton={
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course, index) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-bg-secondary border-border-theme/50 hover:bg-bg-tertiary group relative block h-full border p-8 transition-all hover:border-red-500/30"
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-transparent transition-colors group-hover:bg-red-600"></div>
                    <h4 className="text-foreground mb-3 text-xl font-black tracking-tight uppercase transition-colors group-hover:text-red-500">
                      {course.title}
                    </h4>
                    <p className="text-text-secondary mb-6 line-clamp-2 text-sm font-light">
                      {course.description || 'System metadata missing'}
                    </p>
                    <div className="border-border-theme/50 mt-auto flex items-center justify-between border-t pt-6">
                      <span className="text-text-secondary bg-background border-border-theme rounded border px-2 py-1 font-mono text-xs">
                        {course.credits} UNIT
                      </span>
                      <span className="text-xs font-bold tracking-widest text-red-500 uppercase group-hover:text-red-400">
                        Connect
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </WithSkeleton>
        </div>

        {/* My Certificates */}
        {(isLoading || certificates.length > 0) && (
          <div className="mb-16 [contain-intrinsic-size:1px_500px] [content-visibility:auto]">
            <div className="border-border-theme mb-8 flex items-center justify-between border-b pb-4">
              <h3 className="text-foreground flex items-center gap-3 text-xl font-black tracking-widest uppercase">
                <span className="inline-block h-4 w-4 rounded-sm bg-red-600"></span> Issued
                Credentials
              </h3>
              <Link
                href="/certificates"
                className="text-text-secondary hover:text-foreground group flex items-center gap-1 text-xs font-bold tracking-widest uppercase transition-colors"
              >
                Vault{' '}
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <WithSkeleton
              isLoading={isLoading}
              skeleton={
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <CertCardSkeleton />
                  <CertCardSkeleton />
                  <CertCardSkeleton />
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificates.slice(0, 3).map((cert, index) => (
                  <Link key={cert.id} href={`/certificates/${cert.id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-background group relative block h-full overflow-hidden rounded-xl border border-red-500/20 p-8 shadow-[0_0_20px_rgba(220,38,38,0.05)] transition-all hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                    >
                      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-red-900/10 transition-colors group-hover:bg-red-900/20"></div>
                      <div className="relative z-10 mb-6 flex items-start justify-between">
                        <div className="bg-bg-secondary flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30">
                          <svg
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                        <span className="bg-bg-secondary border-border-theme text-text-secondary rounded border px-3 py-1 font-mono text-xs">
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-foreground mb-2 text-xl font-bold tracking-wide uppercase transition-colors group-hover:text-red-500">
                        {cert.course?.title || 'Soroban Protocol'}
                      </h4>
                      <p className="text-sm font-light text-red-500/80">On-Chain Certification</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </WithSkeleton>
          </div>
        )}

        {/* Audit Logs Section */}
        <div className="mt-20 [contain-intrinsic-size:1px_500px] [content-visibility:auto]">
          <div className="border-border-theme mb-8 flex items-center justify-between border-b pb-4">
            <h3 className="text-foreground flex items-center gap-3 text-xl font-black tracking-widest uppercase">
              <span className="inline-block h-4 w-4 rounded-sm bg-red-600"></span> Audit Trails{' '}
              <span className="text-text-secondary">[Admin Only]</span>
            </h3>
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-red-500 uppercase">
              Live Monitoring
            </span>
          </div>
          <div className="bg-bg-secondary/50 border-border-theme/50 rounded-2xl border p-8 backdrop-blur-sm">
            <AuditLogList />
          </div>
        </div>
        <LayoutGrid
          layout={layout}
          editMode={editMode}
          panels={panelDefs}
          onLayoutChange={saveLayout}
        />
      </main>
    </div>
  );
}
