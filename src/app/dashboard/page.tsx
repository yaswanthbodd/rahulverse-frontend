
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">RahulVerse</h1>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-700 px-5 py-2 hover:bg-gray-900"
          >
            Logout
          </button>
        </div>

        <section className="mt-12 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-2xl font-semibold">
            Welcome, {user?.displayName}
          </h2>

          <p className="mt-3 text-gray-400">
            Username: @{user?.username}
          </p>

          <p className="mt-1 text-gray-400">
            Email: {user?.email}
          </p>

          <p className="mt-8 text-gray-400">
            Your RahulVerse dashboard is ready.
          </p>
        </section>
      </div>
    </main>
  );
}
