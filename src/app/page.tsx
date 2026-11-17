
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Trophy,
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Target,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";

const achievements = [
  {
    value: "2014",
    title: "Test Debut",
    description: "Began his international Test journey.",
  },
  {
    value: "2016",
    title: "ODI & T20I Debut",
    description: "Expanded his journey across formats.",
  },
  {
    value: "2023",
    title: "World Cup Final",
    description: "Represented India on cricket's biggest stage.",
  },
  {
    value: "2025",
    title: "Champions Trophy",
    description: "Part of India's Champions Trophy-winning team.",
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "Share Your Thoughts",
    description:
      "Share your cricket opinions, match reactions, stories and experiences with fellow fans.",
  },
  {
    icon: Heart,
    title: "Connect With Fans",
    description:
      "Follow other fans, discover interesting posts and build meaningful connections.",
  },
  {
    icon: Users,
    title: "One Cricket Community",
    description:
      "Be part of a community united by admiration for KL Rahul and the game of cricket.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/home");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
          <p className="text-sm text-[var(--text-secondary)]">
            Loading RahulVerse...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-xl font-black text-black">
              R
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Rahul<span className="text-[var(--accent)]">Verse</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
            <a href="#about" className="transition hover:text-[var(--accent)]">
              About KL Rahul
            </a>
            <a
              href="#journey"
              className="transition hover:text-[var(--accent)]"
            >
              His Journey
            </a>
            <a
              href="#community"
              className="transition hover:text-[var(--accent)]"
            >
              Community
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href="/login"
              className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-105 hover:bg-[var(--accent-hover)]"
            >
              Join Now
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--background)] to-[var(--background)]" />

        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[var(--accent-soft)] blur-[120px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div className="z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              <Sparkles size={16} />
              A Community For KL Rahul Fans
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              More Than
              <br />
              Just Cricket.
              <br />
              <span className="text-[var(--accent)]">
                It's A Community.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Welcome to RahulVerse — a place where passion for KL Rahul
              brings fans together. Share your thoughts, celebrate
              unforgettable moments and connect with people who love
              cricket just like you.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-bold text-black transition hover:scale-105 hover:bg-[var(--accent-hover)]"
              >
                Join the Community
                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-7 py-4 font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                Explore RahulVerse
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-[var(--border)] pt-8">
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">One</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Passion</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">One</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Community</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">Infinite</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Memories</p>
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-5 rounded-full bg-yellow-500/20 blur-[90px]" />

            <div className="relative overflow-hidden rounded-[35px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl shadow-black/50">
              <img
                src="/images/rahul-cricket.jpg"
                alt="KL Rahul playing cricket"
                className="h-[480px] w-full object-cover object-top sm:h-[570px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  The Inspiration
                </p>
                <h2 className="mt-2 text-4xl font-black">
                  KL RAHUL
                </h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                  Elegance. Determination. Excellence.
                </p>
              </div>

              <div className="absolute right-5 top-5 rounded-2xl border border-[var(--border)] bg-black/40 p-4 backdrop-blur-md">
                <Trophy className="text-[var(--accent)]" size={26} />
                <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
                  Indian Cricket
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[var(--accent-soft)] p-3">
                  <Heart className="text-[var(--accent)]" size={22} />
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">One Big Family</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    United by cricket
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-[var(--text-muted)] transition hover:text-[var(--accent-hover)] md:flex"
        >
          Discover More
          <ChevronDown className="animate-bounce" size={20} />
        </a>
      </section>

      {/* ABOUT KL RAHUL */}
      <section id="about" className="relative border-t border-[var(--border)] py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />

            <div className="relative grid grid-cols-2 gap-4">
              <img
                src="/images/rahul-community.jpg"
                alt="KL Rahul cricket moment"
                className="mt-10 h-64 w-full rounded-3xl object-cover"
              />
              <img
                src="/images/rahul-profile.jpg"
                alt="KL Rahul portrait"
                className="h-64 w-full rounded-3xl object-cover"
              />
              <div className="col-span-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  The Man Behind The Inspiration
                </p>
                <p className="mt-2 text-xl font-bold text-[var(--text-primary)]">
                  Calm Mind. Strong Character. Beautiful Cricket.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
              Know The Cricketer
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              The Journey of
              <span className="block text-[var(--accent)]">KL Rahul</span>
            </h2>

            <p className="mt-6 leading-8 text-[var(--text-secondary)]">
              Kannaur Lokesh Rahul, popularly known as KL Rahul, is an
              Indian international cricketer admired for his elegant
              batting, adaptability and wicketkeeping skills.
            </p>

            <p className="mt-4 leading-8 text-[var(--text-secondary)]">
              From his Test debut in 2014 to representing India in
              major international tournaments, his journey reflects
              dedication, discipline and determination.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
                <p className="text-sm text-[var(--text-muted)]">Full Name</p>
                <p className="mt-2 font-bold text-[var(--text-primary)]">
                  Kannaur Lokesh Rahul
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
                <p className="text-sm text-[var(--text-muted)]">Date of Birth</p>
                <p className="mt-2 font-bold text-[var(--text-primary)]">
                  18 April 1992
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
                <p className="text-sm text-[var(--text-muted)]">Role</p>
                <p className="mt-2 font-bold text-[var(--text-primary)]">
                  Wicketkeeper-Batter
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
                <p className="text-sm text-[var(--text-muted)]">Batting Style</p>
                <p className="mt-2 font-bold text-[var(--text-primary)]">
                  Right-Handed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY AND MILESTONES */}
      <section
        id="journey"
        className="border-y border-[var(--border)] bg-[var(--surface)] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
              Every Moment Matters
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              A Journey Worth <span className="text-[var(--accent)]">Celebrating</span>
            </h2>

            <p className="mt-5 leading-7 text-[var(--text-secondary)]">
              Every milestone adds another chapter to an inspiring
              cricket journey.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item, index) => (
              <div
                key={item.value}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-7 transition hover:-translate-y-2 hover:border-[var(--accent)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  {index === 0 ? (
                    <Target size={23} />
                  ) : index === 1 ? (
                    <Trophy size={23} />
                  ) : index === 2 ? (
                    <ShieldCheck size={23} />
                  ) : (
                    <Sparkles size={23} />
                  )}
                </div>

                <p className="mt-7 text-4xl font-black text-[var(--accent)]">
                  {item.value}
                </p>

                <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section id="community" className="relative py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-[35px] border border-[var(--border)] bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface)] p-8 sm:p-14 lg:p-16">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[var(--accent-soft)] blur-[100px]" />

            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
                  Welcome To RahulVerse
                </p>

                <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                  Cricket Connects Us.
                  <span className="block text-[var(--accent)]">
                    RahulVerse Unites Us.
                  </span>
                </h2>

                <p className="mt-6 leading-8 text-[var(--text-secondary)]">
                  RahulVerse is more than a social platform. It is a
                  place for fans to express their passion, share
                  unforgettable cricket moments and connect with a
                  community that shares the same admiration.
                </p>

                <Link
                  href="/register"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-bold text-black transition hover:scale-105 hover:bg-[var(--accent-hover)]"
                >
                  Become A Part Of Us
                  <ArrowRight size={19} />
                </Link>
              </div>

              <div className="relative">
                <img
                  src="/images/rahul-register.jpg"
                  alt="KL Rahul cricket inspiration"
                  className="h-[360px] w-full rounded-3xl object-cover object-top shadow-2xl sm:h-[420px]"
                />

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-[var(--border)] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
              Why RahulVerse?
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Built For The Fans
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[var(--text-secondary)]">
              Everything you need to connect, share and celebrate
              your passion for cricket.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-8 transition hover:-translate-y-2 hover:border-[var(--accent)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-7 text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-5xl rounded-[35px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-6 py-16 text-center sm:px-12">
          <Sparkles className="mx-auto text-[var(--accent)]" size={35} />

          <h2 className="mt-6 text-3xl font-black sm:text-5xl">
            Your Cricket Community
            <span className="block text-[var(--accent)]">
              Starts Here.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[var(--text-secondary)]">
            Don't just watch the game. Be a part of the conversation.
            Join RahulVerse and connect with fellow KL Rahul fans.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-8 py-4 font-bold text-black transition hover:scale-105 hover:bg-[var(--accent-hover)]"
          >
            Create Your Account
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] font-black text-black">
              R
            </div>
            <span className="text-lg font-extrabold">
              Rahul<span className="text-[var(--accent)]">Verse</span>
            </span>
          </Link>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Built with passion for cricket and its fans.
          </p>

          <p className="text-sm text-[var(--text-muted)]">
            © 2026 RahulVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
