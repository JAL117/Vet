"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const FULL_SIDEBAR_ROUTES = ["/", "/referencia"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const isCollapsed = !isAuthRoute && !FULL_SIDEBAR_ROUTES.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main
        className={`min-h-screen pt-12 pb-20 lg:pt-0 lg:pb-0 transition-all ${
          isCollapsed ? "lg:pl-16" : "lg:pl-72"
        }`}
      >
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </>
  );
}
