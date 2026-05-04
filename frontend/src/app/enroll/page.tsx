'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EnrollmentWizard } from '@/components/enrollment/EnrollmentWizard';
import { enrollmentsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [courseId, setCourseId] = useState<string | undefined>();
  const [courseTitle, setCourseTitle] = useState<string | undefined>();
  const [courseCredits, setCourseCredits] = useState<number | undefined>();
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('courseId');
    const title = searchParams.get('courseTitle');
    const credits = searchParams.get('credits');

    if (id) setCourseId(id);
    if (title) setCourseTitle(decodeURIComponent(title));
    if (credits) setCourseCredits(parseInt(credits, 10));

    async function loadUserData() {
      if (user?.id) {
        try {
          const enrollments = await enrollmentsAPI.getByStudentId(user.id);
          const completed = enrollments
            .filter((e) => e.status === 'completed')
            .map((e) => e.courseId);
          setCompletedCourses(completed);
        } catch (error) {
          console.error('Failed to load user enrollments:', error);
        }
      }
      setIsLoading(false);
    }

    loadUserData();
  }, [searchParams, user]);

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.push('/courses');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-600/30 border-t-red-600" />
          <p className="font-mono text-sm tracking-widest text-red-500 uppercase">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black">
        <div className="mx-4 max-w-md rounded-2xl border border-red-500/50 bg-zinc-950 p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <svg
              className="h-8 w-8 text-red-500"
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
          <h2 className="mb-4 text-2xl font-black tracking-widest text-white uppercase">
            Authentication Required
          </h2>
          <p className="mb-8 text-zinc-400">
            Please sign in to enroll in courses and track your progress.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-4 font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Courses
          </Link>
        </div>

        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Multi-Step Enrollment
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white uppercase md:text-5xl">
            Course Enrollment
          </h1>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Complete the 5-step wizard to customize your learning experience. Your progress is
            automatically saved every 30 seconds.
          </p>
        </div>

        <EnrollmentWizard
          initialCourseId={courseId}
          initialCourseTitle={courseTitle}
          initialCourseCredits={courseCredits}
          coursePrerequisites={[]}
          completedCourseIds={completedCourses}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default function EnrollmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-600/30 border-t-red-600" />
            <p className="font-mono text-sm tracking-widest text-red-500 uppercase">Loading...</p>
          </div>
        </div>
      }
    >
      <EnrollmentContent />
    </Suspense>
  );
}
