"use client";
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  const isHome = pathname === '/';
  const disableTransforms = isDashboard || isHome;

  return (
    <div key={pathname} className={disableTransforms ? "page-fade-only" : "page-transition-wrapper"}>
      <div className={disableTransforms ? "" : "page-slide-up"}>
        {children}
      </div>
    </div>
  );
}
