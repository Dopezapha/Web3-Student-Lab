'use client';

import { Course, coursesAPI } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await coursesAPI.getAll();
        setCourses(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-zinc-950">
        <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[80px]"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium tracking-widest text-red-500 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
                Active Curriculum
              </div>
              <h1 className="mb-2 text-4xl font-black tracking-tighter text-white uppercase md:text-5xl">
                Modules
              </h1>
              <p className="text-lg font-light text-gray-400">
                Master Soroban and Stellar via hands-on progression
              </p>
            </div>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition-all hover:border-red-500/50 hover:bg-white/10 hover:text-red-500"
            >
              <span className="transform transition-transform group-hover:-translate-x-1">←</span>{' '}
              Access Control
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Abstract Glow */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[100px]"></div>

        {/* Search Bar */}
        <div className="relative z-10 mb-12">
          <div className="relative max-w-xl">
            <label htmlFor="course-search" className="sr-only">
              Search courses
            </label>
            <input
              id="course-search"
              type="search"
              placeholder="SEARCH NODE DIRECTORY..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black px-5 py-4 pl-14 font-mono tracking-wide text-white uppercase placeholder-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
              aria-label="Search courses by title or description"
            />
            <svg
              className="absolute top-1/2 left-5 h-6 w-6 -translate-y-1/2 transform text-red-600"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="relative z-10">
          {filteredCourses.length === 0 ? (
            <div
              className="rounded-2xl border border-white/10 bg-zinc-950/50 py-20 text-center backdrop-blur-sm"
              role="status"
            >
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-900/20"
                aria-hidden="true"
              >
                <svg
                  className="h-10 w-10 text-red-500"
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
              <h3 className="mt-2 text-xl font-black tracking-widest text-white uppercase">
                No Modules Found
              </h3>
              <p className="mt-2 font-light text-gray-500">
                {searchTerm ? 'Adjust query parameters' : 'Environment uninitialized'}
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              aria-live="polite"
              aria-label={`${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`}
            >
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
                  aria-label={`${course.title} - ${course.credits} credits, taught by ${course.instructor}`}
                >
                  <div
                    className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-[100px] bg-red-600/5 transition-colors group-hover:bg-red-600/10"
                    aria-hidden="true"
                  ></div>

                  <div className="relative z-10 mb-8 flex items-start justify-between">
                    <div
                      className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black transition-colors group-hover:border-red-500/50 group-hover:bg-red-500/10"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-7 w-7 text-white transition-colors group-hover:text-red-500"
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
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 font-mono text-xs font-bold tracking-widest text-red-500 uppercase">
                      {course.credits} Cr
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-black tracking-tight text-white uppercase transition-colors group-hover:text-red-50">
                    {course.title}
                  </h3>
                  <p className="mb-8 line-clamp-2 flex-grow text-sm font-light text-gray-400">
                    {course.description || 'System metadata missing'}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                      {course.instructor}
                    </span>
                    <span
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-red-500 uppercase transition-colors group-hover:text-red-400"
                      aria-hidden="true"
                    >
                      Enter Node{' '}
                      <span className="transform transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
