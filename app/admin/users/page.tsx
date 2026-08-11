"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  CmsRole,
  createAdminUser,
  getAssignableAdminRoles,
  getAdminToken,
  getAdminUsers,
  ManagedAdminUser,
  updateManagedAdminUser,
} from "@/lib/admin-api";

type UserForm = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  password: string;
};

const emptyForm: UserForm = {
  id: "",
  name: "",
  email: "",
  roleId: "",
  isActive: true,
  password: "",
};

function formatDate(value: string | null) {
  if (!value) return "Belum pernah login";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedAdminUser[]>([]);
  const [roles, setRoles] = useState<CmsRole[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [userItems, roleItems] = await Promise.all([
        getAdminUsers(token),
        getAssignableAdminRoles(token),
      ]);
      setUsers(userItems);
      setRoles(roleItems);
      setForm((current) => ({
        ...current,
        roleId: current.roleId || roleItems[0]?.id || "",
      }));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat user management.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const resetForm = () => {
    setForm({ ...emptyForm, roleId: roles[0]?.id || "" });
    setMessage("");
    setError("");
  };

  const editUser = (user: ManagedAdminUser) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId || roles[0]?.id || "",
      isActive: user.isActive,
      password: "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (form.id) {
        await updateManagedAdminUser(token, form.id, {
          name: form.name,
          email: form.email,
          roleId: form.roleId,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        });
        setMessage("User berhasil diperbarui.");
      } else {
        await createAdminUser(token, {
          name: form.name,
          email: form.email,
          roleId: form.roleId,
          isActive: form.isActive,
          password: form.password,
        });
        setMessage("User berhasil dibuat.");
      }

      await loadData();
      setForm({ ...emptyForm, roleId: roles[0]?.id || "" });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "User tidak dapat disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: ManagedAdminUser) => {
    const token = getAdminToken();
    if (!token) return;

    setMessage("");
    setError("");

    try {
      await updateManagedAdminUser(token, user.id, {
        isActive: !user.isActive,
      });
      setMessage(
        user.isActive ? "User berhasil dinonaktifkan." : "User berhasil diaktifkan.",
      );
      await loadData();
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Status user tidak dapat diubah.",
      );
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
          Access Administration
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
          User Management
        </h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-black/55">
          Buat akun CMS, tetapkan role, atur status aktif, dan perbarui password tanpa menghapus riwayat user.
        </p>
      </div>

      <section className="mb-8 rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              {form.id ? "Edit User" : "New User"}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {form.id ? "Perbarui akun CMS" : "Tambahkan akun CMS"}
            </h2>
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-black text-black/55"
            >
              Batal Edit
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Nama</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold outline-none focus:border-[#039147]"
              minLength={2}
              maxLength={120}
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold outline-none focus:border-[#039147]"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Role</span>
            <select
              value={form.roleId}
              onChange={(event) => setForm({ ...form, roleId: event.target.value })}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#039147]"
              required
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
              {form.id ? "Password baru (opsional)" : "Password"}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold outline-none focus:border-[#039147]"
              minLength={12}
              maxLength={128}
              required={!form.id}
              autoComplete="new-password"
            />
            <span className="text-xs font-semibold text-black/40">Minimal 12 karakter.</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#f6faf7] px-4 py-3 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
              className="h-5 w-5 accent-[#039147]"
            />
            <span className="text-sm font-black">Akun aktif dan dapat login</span>
          </label>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving || !form.roleId}
              className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Buat User"}
            </button>
            {message ? <p className="text-sm font-bold text-[#039147]">{message}</p> : null}
            {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
          </div>
        </form>
      </section>

      <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">CMS Accounts</p>
            <h2 className="mt-2 text-2xl font-black">Daftar User</h2>
          </div>
          <span className="rounded-full bg-[#f6faf7] px-4 py-2 text-xs font-black text-black/50">{users.length} user</span>
        </div>

        {loading ? <AdminState title="Memuat user" description="Mohon tunggu." /> : null}
        {!loading && error && users.length === 0 ? <AdminState title="User tidak dapat dimuat" description={error} tone="error" /> : null}
        {!loading && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-black/5 text-xs font-black uppercase tracking-[0.12em] text-black/40">
                <tr>
                  <th className="px-3 py-4">User</th>
                  <th className="px-3 py-4">Role</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="px-3 py-4">Last Login</th>
                  <th className="px-3 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-black/5 last:border-0">
                    <td className="px-3 py-4">
                      <p className="font-black">{user.name}</p>
                      <p className="mt-1 text-xs font-semibold text-black/45">{user.email}</p>
                    </td>
                    <td className="px-3 py-4 font-bold">{user.assignedRole?.name || user.role.replaceAll("_", " ")}</td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${user.isActive ? "bg-[#eaf8f0] text-[#039147]" : "bg-black/5 text-black/45"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs font-semibold text-black/50">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => editUser(user)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-black">Edit</button>
                        <button type="button" onClick={() => void toggleStatus(user)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-black text-black/55">
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
