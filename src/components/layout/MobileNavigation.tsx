
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, UserRound, Settings } from "lucide-react";

export default function MobileNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { label: "Home", href: "/home", icon: Home },
    {
      label: "Profile",
      href: user ? `/profile/${user.username}` : "/login",
      icon: UserRound,
    },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <div className="mx-auto flex w-full max-w-[440px] items-center justify-around rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl">

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
              className={`group relative flex min-w-[76px] flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200 active:scale-95 ${
                active
                  ? "bg-[var(--accent-soft)] rv-accent"
                  : "rv-muted hover:bg-[var(--surface-hover)] hover:rv-text"
              }`}
            >
              <Icon
                size={21}
                strokeWidth={active ? 2.5 : 2}
                className={`transition-transform duration-200 ${
                  active
                    ? "scale-110"
                    : "group-hover:-translate-y-0.5"
                }`}
              />

              <span className="text-[10px] font-semibold">
                {link.label}
              </span>

              {active && (
                <span className="absolute -bottom-0.5 h-1 w-5 animate-[scale-in_200ms_ease-out] rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
