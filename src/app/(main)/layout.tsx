
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="rv-background flex min-h-screen items-center justify-center">
        <div className="rv-fade-in text-center">
          <h1 className="text-3xl font-black tracking-tight rv-text">
            Rahul<span className="rv-accent">Verse</span>
          </h1>

          <div className="mx-auto mt-5 h-1 w-32 overflow-hidden rounded-full bg-[var(--surface-hover)]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--accent)]" />
          </div>

          <p className="mt-4 text-sm rv-secondary">
            Loading your world...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rv-background min-h-screen overflow-x-clip">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] items-start gap-4 px-3 sm:gap-5 sm:px-5 xl:gap-7 xl:px-8">

        {/* LEFT SIDEBAR */}
        <div className="sticky top-0 hidden h-screen shrink-0 self-start lg:block">
          <Sidebar />
        </div>

        {/* CENTER FEED */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="min-w-0 flex-1 px-1 py-5 pb-24 sm:px-2 sm:py-6 lg:pb-8">
            <div className="rv-fade-in mx-auto w-full max-w-[780px]">
              {children}
            </div>
          </main>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sticky top-6 hidden max-h-[calc(100vh-3rem)] w-[250px] shrink-0 self-start overflow-y-auto xl:block 2xl:w-[270px]">
          <RightSidebar />
        </div>

        {/* MOBILE NAVIGATION */}
        <MobileNavigation />
      </div>
    </div>
  );
}
