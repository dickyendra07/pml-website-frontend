"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  getAdminLegalPages,
  getAdminToken,
  LegalPage,
  LegalPageType,
  updateAdminLegalPage,
} from "@/lib/admin-api";

const pageLabels: Record<LegalPageType, string> = {
  PRIVACY_POLICY: "Privacy Policy",
  COOKIE_POLICY: "Cookie Policy",
};

export default function AdminLegalPagesPage() {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [forms, setForms] = useState<Record<string, LegalPage>>({});
  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    getAdminLegalPages(token)
      .then((data) => {
        setPages(data);

        setForms(
          data.reduce<Record<string, LegalPage>>(
            (result, item) => {
              result[item.type] = item;
              return result;
            },
            {},
          ),
        );

        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load legal pages.",
        );
      });
  }, []);

  function updateField(
    type: LegalPageType,
    key: keyof LegalPage,
    value: string,
  ) {
    setForms((current) => ({
      ...current,
      [type]: {
        ...current[type],
        [key]: value,
      },
    }));
  }

  async function save(type: LegalPageType) {
    const token = getAdminToken();
    const form = forms[type];

    if (!token || !form) return;

    setSaving(type);
    setMessage("");

    try {
      const updated = await updateAdminLegalPage(
        token,
        type,
        {
          titleEn: form.titleEn,
          contentEn: form.contentEn,
          titleId: form.titleId,
          contentId: form.contentId,
          seoTitleEn: form.seoTitleEn,
          metaDescriptionEn: form.metaDescriptionEn,
          seoTitleId: form.seoTitleId,
          metaDescriptionId: form.metaDescriptionId,
        },
      );

      setForms((current) => ({
        ...current,
        [type]: updated,
      }));

      setPages((current) =>
        current.map((item) =>
          item.type === updated.type
            ? updated
            : item,
        ),
      );

      setMessage(
        `${pageLabels[type]} saved successfully.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save legal page.",
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">
            Legal Pages
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage Privacy Policy and Cookie Policy content.
          </p>
        </div>

        {status === "error" ? (
          <AdminState
            title="Unable to load legal pages"
            description={message}
            tone="error"
          />
        ) : null}

        {pages.map((page) => {
          const form = forms[page.type];

          if (!form) return null;

          return (
            <div
              key={page.type}
              className="rounded-xl border bg-white p-6 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {pageLabels[page.type]}
                </h2>

                <p className="text-sm text-gray-500">
                  Type: {page.type}
                </p>
              </div>


              <div className="grid gap-6 md:grid-cols-2">

                <div className="space-y-4">
                  <h3 className="font-medium">
                    English
                  </h3>

                  <input
                    className="w-full rounded border px-3 py-2"
                    value={form.titleEn}
                    onChange={(e) =>
                      updateField(
                        page.type,
                        "titleEn",
                        e.target.value,
                      )
                    }
                    placeholder="Title EN"
                  />

                  <textarea
                    className="min-h-[240px] w-full rounded border px-3 py-2"
                    value={form.contentEn}
                    onChange={(e) =>
                      updateField(
                        page.type,
                        "contentEn",
                        e.target.value,
                      )
                    }
                    placeholder="Content EN"
                  />
                </div>


                <div className="space-y-4">
                  <h3 className="font-medium">
                    Indonesia
                  </h3>

                  <input
                    className="w-full rounded border px-3 py-2"
                    value={form.titleId || ""}
                    onChange={(e) =>
                      updateField(
                        page.type,
                        "titleId",
                        e.target.value,
                      )
                    }
                    placeholder="Title ID"
                  />

                  <textarea
                    className="min-h-[240px] w-full rounded border px-3 py-2"
                    value={form.contentId || ""}
                    onChange={(e) =>
                      updateField(
                        page.type,
                        "contentId",
                        e.target.value,
                      )
                    }
                    placeholder="Content ID"
                  />
                </div>

              </div>


              <button
                onClick={() => save(page.type)}
                disabled={saving === page.type}
                className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
              >
                {saving === page.type
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
