
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun, Sparkles } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initial =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() || "R";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/85 px-3 backdrop-blur-xl transition-colors duration-300 sm:px-5 lg:px-6">

      {/* BRANDING / WELCOME */}
      <div className="min-w-0">
        <Link
          href="/home"
          className="inline-block transition-transform duration-200 hover:scale-[1.02] lg:hidden"
        >
          <h1 className="text-xl font-black tracking-tight rv-text">
            Rahul<span className="rv-accent">Verse</span>
          </h1>
        </Link>

        <div className="hidden lg:block">
          <div className="flex items-center gap-2 text-[11px] font-medium rv-secondary">
            <Sparkles size={14} className="rv-accent" />
            Welcome to your community
          </div>

          <h2 className="mt-1 text-base font-bold tracking-tight rv-text">
            The game never stops.
          </h2>
        </div>
      </div>

      {/* USER ACTIONS */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* THEME TOGGLE */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="rv-icon-button group h-10 w-10 rounded-full transition-all duration-200 hover:rotate-6 hover:scale-105"
        >
          {theme === "dark" ? (
            <Sun
              size={18}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          ) : (
            <Moon
              size={18}
              className="transition-transform duration-300 group-hover:-rotate-12"
            />
          )}
        </button>

        {/* USER DETAILS */}
        <div className="hidden max-w-[150px] text-right sm:block">
          <p className="truncate text-xs font-bold rv-text">
            {user?.displayName ?? "User"}
          </p>

          <p className="truncate text-[11px] rv-muted">
            @{user?.username ?? "user"}
          </p>
        </div>

        {/* PROFILE AVATAR */}
        <Link
          href={user ? `/profile/${user.username}` : "/login"}
          aria-label="Open your profile"
          className="group block shrink-0 rounded-full"
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.displayName || "Profile"}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border-2 border-[var(--accent)]/40 object-cover transition-all duration-200 group-hover:scale-105 group-hover:border-[var(--accent)] group-hover:shadow-md"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--accent)]/40 bg-[var(--accent-soft)] text-sm font-bold rv-accent transition-all duration-200 group-hover:scale-105 group-hover:border-[var(--accent)]">
              {initial}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
