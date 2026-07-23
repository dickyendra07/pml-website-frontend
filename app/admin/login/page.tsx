"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, setAdminToken } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@pharmametriclabs.com");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await loginAdmin(email, password);
      setAdminToken(result.accessToken);
      router.replace("/admin");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed. Please try again.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6faf7] px-6 text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,145,71,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(3,145,71,0.10),transparent_34%)]" />
      <div className="pml-hex-pattern absolute inset-0 opacity-[0.04]" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[460px] rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_28px_90px_rgba(0,0,0,0.10)] md:p-9"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f6faf7] shadow-sm">
            <Image src="/images/LOGO-PML.png" alt="PML" width={86} height={52} className="h-9 w-auto" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
              PML CMS
            </p>
            <h1 className="text-2xl font-black leading-tight text-black">
              Admin Login
            </h1>
          </div>
        </div>

        <p className="mt-6 text-sm font-medium leading-7 text-black/58">
          Login to manage website settings, page SEO, insights, catalogues, media, popups, and inquiries.
        </p>

        <div className="mt-7 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              placeholder="Enter admin password"
              required
            />
          </label>
        </div>

        {status === "error" ? (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-7 w-full rounded-full bg-[#039147] px-6 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Signing in..." : "Login to CMS"}
        </button>
      </form>
    </main>
  );
}
