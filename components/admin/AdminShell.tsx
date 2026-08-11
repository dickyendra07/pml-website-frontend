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
import {
  ADMIN_NAV_ITEMS,
  hasAdminPermission,
  permissionForAdminPath,
} from "@/lib/admin-rbac";

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

  const requiredPermission = permissionForAdminPath(pathname);

  if (
    admin &&
    requiredPermission &&
    !hasAdminPermission(admin, requiredPermission)
  ) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#f6faf7] px-6 text-black">
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.035]" />
        <section className="relative w-full max-w-2xl rounded-[34px] border border-black/5 bg-white p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.10)] md:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-xl font-black text-red-700">
            403
          </span>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Akses dibatasi
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Anda tidak memiliki permission untuk halaman ini
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-black/55">
            Menu dan URL CMS hanya dapat dibuka sesuai role yang ditetapkan. Hubungi Super Admin jika akses ini diperlukan.
          </p>
          <Link
            href="/admin"
            className="mt-7 inline-flex rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white"
          >
            Kembali ke Dashboard
          </Link>
        </section>
      </main>
    );
  }

  const visibleNavItems = admin
    ? ADMIN_NAV_ITEMS.filter((item) =>
        hasAdminPermission(admin, item.permission),
      )
    : [];

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
            {visibleNavItems.map((item) => {
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
              {admin?.roleName}
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
