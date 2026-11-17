
"use client";

import { FormEvent, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const [form, setForm] = useState({
        username: "",
        email: "",
        displayName: "",
        password: "",
        bio: "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!profileImage) {
            setPreview("");
            return;
        }

        const imageUrl = URL.createObjectURL(profileImage);
        setPreview(imageUrl);

        return () => URL.revokeObjectURL(imageUrl);
    }, [profileImage]);

    const handleImageChange = (file?: File) => {
        setError("");

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a JPG, PNG or WebP image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Profile picture must not exceed 5 MB.");
            return;
        }

        setProfileImage(file);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/;

        if (!passwordPattern.test(form.password)) {
            setError(
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
            );
            return;
        }

        setSubmitting(true);

        try {
            await register(
                {
                    ...form,
                    username: form.username.trim().toLowerCase(),
                    email: form.email.trim().toLowerCase(),
                    displayName: form.displayName.trim(),
                    bio: form.bio.trim(),
                },
                profileImage
            );

            router.push("/login");
        } catch (err: unknown) {
            const message =
                (err as {
                    response?: { data?: { message?: string } };
                })?.response?.data?.message;

            setError(message || "Registration failed. Please try again.");
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
                        <Link href="/login" className={"rounded-full px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-amber-400 sm:px-4"}>
                            Login
                        </Link>
                        <Link href="/register" className={"rounded-full bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 sm:px-4"}>
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
                <section className="relative hidden min-h-[760px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#18263B] via-[#101827] to-[#090E18] p-12 text-white lg:flex">

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
                            YOUR COMMUNITY. YOUR GAME.
                        </div>

                        <h1 className="text-5xl font-black leading-tight">
                            Every fan has
                            <span className="block text-amber-400">
                                a story.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-sm leading-7 text-slate-300">
                            Join RahulVerse — connect with cricket fans,
                            share your thoughts, celebrate the game and
                            be part of every conversation.
                        </p>

                        <div className="mt-10 flex items-center gap-3">
                            <div className="h-1 w-12 rounded-full bg-amber-400" />
                            <span className="text-sm font-medium tracking-widest text-slate-300">
                                FROM FANS, FOR FANS
                            </span>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-slate-400">
                        © 2026 RahulVerse. Built for the cricket community.
                    </p>
                </section>

                {/* Registration form */}
                <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
                    <div className="w-full max-w-md">

                        <div className="mb-8 lg:hidden">
                            <Link href="/" className="text-2xl font-black tracking-wider">
                                RAHUL<span className="text-amber-400">VERSE</span>
                            </Link>
                        </div>

                        <div className="mb-7">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                                Join the community
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                Your place in the cricket conversation starts here.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Profile picture */}
                            <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/50 bg-[#1D293B]">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Profile preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl text-amber-400">
                                            +
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold">
                                        Profile picture
                                        <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">
                                            Optional
                                        </span>
                                    </p>

                                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                                        JPG, PNG or WebP · Maximum 5 MB
                                    </p>

                                    <label className="mt-2 inline-block cursor-pointer text-sm font-semibold text-amber-400 hover:text-amber-300">
                                        {profileImage ? "Change image" : "Upload image"}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageChange(e.target.files?.[0])
                                            }
                                        />
                                    </label>

                                    {profileImage && (
                                        <button
                                            type="button"
                                            onClick={() => setProfileImage(null)}
                                            className="ml-4 text-xs text-red-400 hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Display name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    Display name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your display name"
                                    value={form.displayName}
                                    onChange={(e) =>
                                        setForm({ ...form, displayName: e.target.value })
                                    }
                                    minLength={2}
                                    maxLength={80}
                                    required
                                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            username: e.target.value.replace(/\s/g, ""),
                                        })
                                    }
                                    minLength={3}
                                    maxLength={30}
                                    pattern="[a-zA-Z0-9_]+"
                                    title="Use only letters, numbers and underscores."
                                    required
                                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    required
                                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                        minLength={8}
                                        maxLength={100}
                                        required
                                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-amber-400"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-[var(--text-muted)]">
                                    At least 8 characters, including uppercase,
                                    lowercase and a number.
                                </p>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    About you
                                    <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">
                                        Optional
                                    </span>
                                </label>

                                <textarea
                                    placeholder="Tell the community a little about yourself..."
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm({ ...form, bio: e.target.value })
                                    }
                                    maxLength={500}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-amber-400"
                                />

                                <p className="mt-1 text-right text-xs text-[var(--text-muted)]">
                                    {form.bio.length}/500
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 font-bold text-[#111827] shadow-lg shadow-amber-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-[var(--text-secondary)]">
                            Already part of RahulVerse?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-amber-400 hover:text-amber-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
