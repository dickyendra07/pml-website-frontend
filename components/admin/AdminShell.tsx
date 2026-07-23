"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  AdminUser,
  clearAdminToken,
  getAdminToken,
  getCurrentAdmin,
  logoutAdmin,
} from "@/lib/admin-api";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "D" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "I" },
  { label: "Homepage", href: "/admin/homepage-features", icon: "H" },
  { label: "Catalogues", href: "/admin/catalogues", icon: "C" },
  { label: "Insights", href: "/admin/insights", icon: "N" },
  { label: "Careers", href: "/admin/careers", icon: "J" },
  { label: "Facilities", href: "/admin/facilities", icon: "F" },
  { label: "Media", href: "/admin/media", icon: "M" },
  { label: "Popups", href: "/admin/popups", icon: "P" },
  { label: "Settings", href: "/admin/settings", icon: "S" },
  { label: "System Health", href: "/admin/health", icon: "+" },
];

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const token = getAdminToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const user = await getCurrentAdmin(token);

        if (!mounted) return;

        setAdmin(user);
        setChecking(false);
      } catch {
        clearAdminToken();

        if (!mounted) return;

        router.replace("/admin/login");
      }
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    const token = getAdminToken();

    try {
      if (token) {
        await logoutAdmin(token);
      }
    } catch {
      // Ignore logout API failure and clear local session.
    }

    clearAdminToken();
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-[#f6faf7] text-black">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-[28px] border border-black/5 bg-white px-8 py-6 text-sm font-bold text-black/60 shadow-xl">
            Checking CMS session...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6faf7] text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,145,71,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(3,145,71,0.08),transparent_34%)]" />
      <div className="pml-hex-pattern fixed inset-0 opacity-[0.035]" />

      <div className="relative grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-black/5 bg-white/80 p-5 shadow-[12px_0_50px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center gap-3 rounded-[24px] border border-black/5 bg-[#f6faf7] p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
              <Image src="/images/LOGO-PML.png" alt="PML" width={74} height={44} className="h-7 w-auto" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
                PML CMS
              </p>
              <h1 className="text-lg font-black leading-tight text-black">
                Admin Panel
              </h1>
            </div>
          </div>

          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                    active
                      ? "bg-[#039147] text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)]"
                      : "text-black/58 hover:bg-[#eaf8f0] hover:text-[#039147]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs ${
                      active ? "bg-white/18 text-white" : "bg-[#eaf8f0] text-[#039147]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">
              Signed in as
            </p>
            <p className="mt-2 text-sm font-black text-black">{admin?.name}</p>
            <p className="mt-1 break-all text-xs font-semibold text-black/45">{admin?.email}</p>
            <span className="mt-3 inline-flex rounded-full border border-[#039147]/20 bg-[#eaf8f0] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#039147]">
              {admin?.role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full rounded-full border border-black/5 bg-white px-5 py-3 text-sm font-extrabold text-black/60 shadow-sm transition hover:bg-[#039147] hover:text-white"
          >
            Logout
          </button>
        </aside>

        <section className="min-w-0 p-5 lg:p-8">{children}</section>
      </div>
    </main>
  );
}
