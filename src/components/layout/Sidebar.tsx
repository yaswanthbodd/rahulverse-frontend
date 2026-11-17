
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  UserRound,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { label: "Home", href: "/home", icon: Home },
    {
      label: "Profile",
      href: user ? `/profile/${user.username}` : "/login",
      icon: UserRound,
    },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initial =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() || "R";

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col py-5 xl:w-[240px]">

      {/* BRANDING */}
      <Link
        href="/home"
        className="group mb-10 ml-3 inline-block w-fit"
      >
        <h1 className="text-[26px] font-black tracking-tight transition-transform duration-300 group-hover:scale-[1.02] rv-text">
          Rahul<span className="rv-accent">Verse</span>
        </h1>

        <p className="mt-1.5 text-[9px] font-semibold tracking-[0.28em] rv-muted">
          THE GAME GOES ON
        </p>
      </Link>

      {/* SECTION LABEL */}
      <div className="mb-4 flex items-center gap-2 px-3">
        <Sparkles size={14} className="rv-accent" />

        <span className="text-[10px] font-bold uppercase tracking-[0.18em] rv-muted">
          Your community
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            pathname === link.href ||
            (link.label === "Profile" &&
              pathname.startsWith("/profile/"));

          return (
            <Link
              key={link.label}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3.5 transition-all duration-200 ease-out hover:translate-x-1 ${
                active
                  ? "bg-[var(--accent-soft)] font-bold rv-accent shadow-[inset_3px_0_0_var(--accent)]"
                  : "rv-secondary hover:bg-[var(--surface-hover)] hover:rv-text"
              }`}
            >
              <Icon
                size={19}
                strokeWidth={active ? 2.5 : 2}
                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  active ? "rv-accent" : ""
                }`}
              />

              <span className="flex-1 text-sm">
                {link.label}
              </span>

              {active && (
                <ChevronRight
                  size={15}
                  className="opacity-70 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              )}
            </Link>
          );
        })}

        {/* EXPLORE FEED */}
        <Link
          href="/home"
          className="rv-button-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        >
          Explore Feed
          <Sparkles size={16} />
        </Link>
      </nav>

      {/* USER PROFILE */}
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-3 transition-colors duration-200 hover:bg-[var(--surface-hover)]">
        <Link
          href={user ? `/profile/${user.username}` : "/login"}
          className="flex min-w-0 items-center gap-2.5"
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.displayName || "Profile"}
              referrerPolicy="no-referrer"
              className="h-10 w-10 shrink-0 rounded-full border border-[var(--accent)]/40 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-sm font-bold rv-accent">
              {initial}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold rv-text">
              {user?.displayName ?? "RahulVerse User"}
            </p>

            <p className="truncate text-[11px] rv-muted">
              @{user?.username ?? "user"}
            </p>
          </div>
        </Link>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-xs rv-secondary transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
