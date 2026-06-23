"use client";
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <div key={pathname} className={isDashboard ? "page-fade-only" : "page-transition-wrapper"}>
      <div className={isDashboard ? "" : "page-slide-up"}>
        {children}
      </div>
    </div>
  );
}
