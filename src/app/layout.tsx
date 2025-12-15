"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Determine sidebar state for hydration safety or initial render
  // Since useStore is client-side, we wrap the dynamic margin in a component or use a specialized client wrapper.
  // For simplicity in this iteration, we'll make RootLayout a client component (as indicated by "use client" addition)
  // or better, create a LayoutClient component.
  // However, the original layout was not "use client", but Sidebar was.
  // To properly handle the margin transition based on store state without hydration mismatch,
  // we should ideally move the layout logic to a client component.
  // But since `Sidebar` is already `use client` and has fixed positioning, `main` needs to know the margin.

  // Let's use a ClientLayout wrapper instead of converting RootLayout entirely effectively
  // But wait, RootLayout needs to export metadata which can't be done in "use client" file.
  // So we must split this.

  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering default state until mounted
  // Or just accept a small flash. For a better UX, we could use a cookie, but store is local storage.
  const sidebarWidth = mounted && isSidebarCollapsed ? 'pl-20' : 'pl-64';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={clsx(
            "flex-1 flex flex-col min-h-screen transition-all duration-300",
            sidebarWidth
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
