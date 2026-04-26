'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  if (isLogin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] min-w-0 flex flex-col transition-all duration-300 max-md:ml-0">
        <TopBar />
        <main className="flex-1 relative z-[1]">
          {children}
        </main>
      </div>
    </div>
  );
}

