"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  CmsRole,
  createAdminRole,
  getAdminRoles,
  getAdminToken,
  getPermissionCatalogue,
  PermissionCatalogue,
  updateAdminRole,
} from "@/lib/admin-api";

type RoleForm = {
  id: string;
  key: string;
  name: string;
  description: string;
  permissions: string[];
};

const emptyForm: RoleForm = {
  id: "",
  key: "",
  name: "",
  description: "",
  permissions: [],
};

function permissionLabel(permission: string) {
  const action = permission.endsWith(".write")
    ? "Kelola"
    : permission.endsWith(".read")
      ? "Lihat"
      : "Kelola";
  return `${action} (${permission})`;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<CmsRole[]>([]);
  const [catalogue, setCatalogue] = useState<PermissionCatalogue | null>(null);
  const [form, setForm] = useState<RoleForm>(emptyForm);
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
      const [roleItems, permissionItems] = await Promise.all([
        getAdminRoles(token),
        getPermissionCatalogue(token),
      ]);
      setRoles(roleItems);
      setCatalogue(permissionItems);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Role management tidak dapat dimuat.",
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

  const editRole = (role: CmsRole) => {
    setForm({
      id: role.id,
      key: role.key,
      name: role.name,
      description: role.description || "",
      permissions: [...role.permissions],
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePermission = (permission: string) => {
    if (form.key === "SUPER_ADMIN") return;
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const toggleGroup = (permissions: string[]) => {
    if (form.key === "SUPER_ADMIN") return;
    const complete = permissions.every((permission) =>
      form.permissions.includes(permission),
    );
    setForm((current) => ({
      ...current,
      permissions: complete
        ? current.permissions.filter(
            (permission) => !permissions.includes(permission),
          )
        : [...new Set([...current.permissions, ...permissions])],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        permissions: form.permissions,
      };

      if (form.id) {
        await updateAdminRole(token, form.id, payload);
        setMessage("Role berhasil diperbarui.");
      } else {
        await createAdminRole(token, payload);
        setMessage("Role baru berhasil dibuat.");
      }

      await loadData();
      setForm(emptyForm);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Role tidak dapat disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
          Access Administration
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
          Role Management
        </h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-black/55">
          Kelompokkan permission per modul. Perubahan berlaku pada request API berikutnya tanpa perlu membuat ulang akun.
        </p>
      </div>

      <section className="mb-8 rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              {form.id ? "Edit Role" : "New Role"}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {form.id ? form.name : "Buat role tambahan"}
            </h2>
          </div>
          {form.id ? (
            <button type="button" onClick={() => setForm(emptyForm)} className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-black text-black/55">
              Batal Edit
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Nama Role</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold outline-none focus:border-[#039147]"
                minLength={2}
                maxLength={80}
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Deskripsi</span>
              <input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold outline-none focus:border-[#039147]"
                maxLength={240}
              />
            </label>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black">Permission per Module</p>
                <p className="mt-1 text-xs font-semibold text-black/45">
                  Permission baca menampilkan modul; permission kelola mengizinkan perubahan data.
                </p>
              </div>
              <span className="rounded-full bg-[#f6faf7] px-4 py-2 text-xs font-black text-black/50">
                {form.permissions.length} dipilih
              </span>
            </div>

            {form.key === "SUPER_ADMIN" ? (
              <div className="mt-4 rounded-2xl border border-[#039147]/15 bg-[#eaf8f0] px-4 py-3 text-sm font-bold text-[#02763a]">
                Permission Super Admin dilindungi dan tidak dapat dikurangi.
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {catalogue?.groups.map((group) => {
                const complete = group.permissions.every((permission) =>
                  form.permissions.includes(permission),
                );
                return (
                  <fieldset key={group.module} className="rounded-[22px] border border-black/5 bg-[#f9fbfa] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <legend className="text-sm font-black">{group.module}</legend>
                      <button
                        type="button"
                        disabled={form.key === "SUPER_ADMIN"}
                        onClick={() => toggleGroup(group.permissions)}
                        className="text-xs font-black text-[#039147] disabled:opacity-40"
                      >
                        {complete ? "Clear" : "All"}
                      </button>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {group.permissions.map((permission) => (
                        <label key={permission} className="flex items-start gap-3 rounded-xl bg-white px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={form.permissions.includes(permission)}
                            disabled={form.key === "SUPER_ADMIN"}
                            onChange={() => togglePermission(permission)}
                            className="mt-0.5 h-4 w-4 accent-[#039147]"
                          />
                          <span className="text-xs font-bold leading-5 text-black/60">{permissionLabel(permission)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white disabled:opacity-50">
              {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Buat Role"}
            </button>
            {message ? <p className="text-sm font-bold text-[#039147]">{message}</p> : null}
            {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
          </div>
        </form>
      </section>

      <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">Access Profiles</p>
            <h2 className="mt-2 text-2xl font-black">Daftar Role</h2>
          </div>
          <span className="rounded-full bg-[#f6faf7] px-4 py-2 text-xs font-black text-black/50">{roles.length} role</span>
        </div>

        {loading ? <AdminState title="Memuat role" description="Mohon tunggu." /> : null}
        {!loading && error && roles.length === 0 ? <AdminState title="Role tidak dapat dimuat" description={error} tone="error" /> : null}
        {!loading && roles.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {roles.map((role) => (
              <article key={role.id} className="rounded-[24px] border border-black/5 bg-[#f9fbfa] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black">{role.name}</h3>
                      {role.isSystem ? <span className="rounded-full bg-[#eaf8f0] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#039147]">Default</span> : null}
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-black/50">{role.description || "Tanpa deskripsi."}</p>
                  </div>
                  <button type="button" onClick={() => editRole(role)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black">Edit</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black/55">{role.permissions.length} permissions</span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black/55">{role._count?.users || 0} users</span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black/40">{role.key}</span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
