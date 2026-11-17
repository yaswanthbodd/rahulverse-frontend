"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun, UserRound, Palette, ShieldCheck } from "lucide-react";

export default function SettingsClient() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="mx-auto w-full max-w-[660px] space-y-7 pb-10">
      {/* Page Heading */}
      <section className="rv-fade-in">
        <div className="flex items-center gap-2">
          <span className="h-1 w-7 rounded-full bg-[var(--accent)]" />
          <p className="text-xs font-bold tracking-[0.2em] rv-accent">
            PREFERENCES
          </p>
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-tight rv-text">
          Settings
        </h1>

        <p className="mt-2 text-sm rv-secondary">
          Manage your RahulVerse account and preferences.
        </p>
      </section>

      {/* Account Information */}
      <section className="rv-fade-in overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <UserRound size={19} className="rv-accent" />
          </div>

          <div>
            <h2 className="text-base font-bold rv-text">
              Account Information
            </h2>
            <p className="mt-0.5 text-xs rv-secondary">
              Your registered account details
            </p>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)] px-5 sm:px-6">
          <div className="py-4">
            <p className="text-xs font-medium rv-muted">Display Name</p>
            <p className="mt-1.5 text-sm font-semibold rv-text">
              {user?.displayName || "Not available"}
            </p>
          </div>

          <div className="py-4">
            <p className="text-xs font-medium rv-muted">Username</p>
            <p className="mt-1.5 text-sm font-semibold rv-text">
              @{user?.username || "Not available"}
            </p>
          </div>

          <div className="py-4">
            <p className="text-xs font-medium rv-muted">Email Address</p>
            <p className="mt-1.5 break-all text-sm font-semibold rv-text">
              {user?.email || "Not available"}
            </p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="rv-fade-in overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Palette size={19} className="rv-accent" />
          </div>

          <div>
            <h2 className="text-base font-bold rv-text">Appearance</h2>
            <p className="mt-0.5 text-xs rv-secondary">
              Customize how RahulVerse looks
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]">
              {isDark ? (
                <Moon size={19} className="rv-accent" />
              ) : (
                <Sun size={19} className="rv-accent" />
              )}
            </div>

            <div>
              <p className="text-sm font-bold rv-text">
                {isDark ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="mt-1 text-xs rv-secondary">
                {isDark
                  ? "Dark appearance is currently active."
                  : "Light appearance is currently active."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-bold rv-accent transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            Switch to {isDark ? "Light" : "Dark"} Mode
          </button>
        </div>
      </section>

      {/* Account Security Information */}
      <section className="rv-fade-in rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <ShieldCheck size={19} className="rv-accent" />
          </div>

          <div>
            <h2 className="text-sm font-bold rv-text">
              Account Security
            </h2>
            <p className="mt-2 text-xs leading-6 rv-secondary">
              Your RahulVerse account is protected by the application's
              authentication system. Keep your login credentials private.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}