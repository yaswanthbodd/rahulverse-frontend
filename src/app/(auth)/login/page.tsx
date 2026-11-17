
"use client";

import { FormEvent, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login({
                username: username.trim().toLowerCase(),
                password,
            });

            router.replace("/home");
        } catch (err: unknown) {
            const message =
                (err as {
                    response?: { data?: { message?: string } };
                })?.response?.data?.message;

            setError(message || "Invalid username or password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 pb-8 pt-24 text-[var(--text-primary)]">

            {/* Top navigation */}
            <header className="absolute inset-x-0 top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
                <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight sm:text-xl">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-lg font-black text-slate-950">R</span>
                        <span>Rahul<span className="text-amber-400">Verse</span></span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-amber-400 sm:px-4">
                            Home
                        </Link>
                        <Link href="/login" className={"rounded-full bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 sm:px-4"}>
                            Login
                        </Link>
                        <Link href="/register" className={"rounded-full px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-amber-400 sm:px-4"}>
                            Register
                        </Link>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                            title={`Switch to ${isDark ? "light" : "dark"} mode`}
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl lg:grid-cols-2">

                {/* Left visual section */}
                <section className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#18263B] via-[#101827] to-[#090E18] p-12 text-white lg:flex">

                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/40" />
                        <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/30" />
                        <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/20" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="text-2xl font-black tracking-wider">
                            RAHUL<span className="text-amber-400">VERSE</span>
                        </Link>

                        <p className="mt-2 text-xs tracking-[0.35em] text-slate-300">
                            THE CRICKET COMMUNITY
                        </p>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold tracking-widest text-amber-300">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            WELCOME BACK
                        </div>

                        <h1 className="text-5xl font-black leading-tight">
                            The game
                            <span className="block text-amber-400">
                                never stops.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-sm leading-7 text-slate-300">
                            Your cricket community is waiting.
                            Catch up on conversations, share your
                            thoughts and stay connected with fans.
                        </p>

                        <div className="mt-10 flex items-center gap-3">
                            <div className="h-1 w-12 rounded-full bg-amber-400" />
                            <span className="text-sm font-medium tracking-widest text-slate-300">
                                YOUR GAME. YOUR PEOPLE.
                            </span>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-slate-400">
                        © 2026 RahulVerse. Built for the cricket community.
                    </p>
                </section>

                {/* Login form */}
                <section className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-12">
                    <div className="w-full max-w-md">

                        <div className="mb-10 lg:hidden">
                            <Link href="/" className="text-2xl font-black tracking-wider">
                                RAHUL<span className="text-amber-400">VERSE</span>
                            </Link>
                        </div>

                        <div className="mb-9">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                                Welcome back
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight">
                                Sign in to RahulVerse
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                                Continue where you left off. Your cricket
                                community is just a login away.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Username */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    required
                                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3.5 pr-20 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-amber-400 hover:text-amber-300"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 font-bold text-[#111827] shadow-lg shadow-amber-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                                New to RahulVerse?
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <Link
                            href="/register"
                            className="block w-full rounded-xl border border-amber-400/40 bg-amber-400/5 py-3.5 text-center text-sm font-semibold text-amber-300 transition hover:border-amber-400 hover:bg-amber-400/10"
                        >
                            Create an account
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
