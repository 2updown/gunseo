"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/grid');
  }, [router]);

  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/grid" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">
            If not redirected, <a href="/grid" className="text-blue-600 underline">click here</a>
          </p>
        </div>
      </div>
    </>
  );
}
