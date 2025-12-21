"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Masuk / Daftar</h1>
          <p className="mt-2 text-sm text-gray-600">
            Login pertama kali otomatis membuat akun.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/learn" })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
            >
              Continue with Google
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/learn" })}
              className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Continue with GitHub
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
