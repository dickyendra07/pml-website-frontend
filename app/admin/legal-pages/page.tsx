"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import RichTextEditor from "@/components/admin/RichTextEditor";
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
  const [selectedType, setSelectedType] =
    useState<LegalPageType | null>(null);

  const [forms, setForms] =
    useState<Record<string, LegalPage>>({});

  const [language, setLanguage] =
    useState<"en" | "id">("en");

  const [status, setStatus] =
    useState<"loading" | "success" | "error">("loading");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");


  const loadPages = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found.");
      return;
    }

    try {
      const data = await getAdminLegalPages(token);

      setPages(data);

      setForms(
        data.reduce<Record<string, LegalPage>>(
          (acc, item) => {
            acc[item.type] = item;
            return acc;
          },
          {},
        ),
      );

      if (data.length > 0) {
        setSelectedType(data[0].type);
      }

      setStatus("success");

    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed loading legal pages.",
      );
    }

  }, []);


  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPages();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPages]);


  const selectedPage = useMemo(() => {
    if (!selectedType) return null;

    return forms[selectedType] || null;
  }, [forms, selectedType]);


  function updateField(
    key: keyof LegalPage,
    value: string,
  ) {

    if (!selectedType) return;

    setForms((current) => ({
      ...current,
      [selectedType]: {
        ...current[selectedType],
        [key]: value,
      },
    }));

  }


  async function save() {

    if (!selectedPage || !selectedType) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      return;
    }


    setSaving(true);
    setMessage("");

    try {

      const updated =
        await updateAdminLegalPage(
          token,
          selectedType,
          selectedPage,
        );


      setForms((current) => ({
        ...current,
        [selectedType]: updated,
      }));

      setMessage(
        "Legal page saved successfully.",
      );

    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed saving page.",
      );

    } finally {

      setSaving(false);

    }

  }


  if (status === "error") {
    return (
      <AdminShell>
        <AdminState
          title="Unable to load legal pages"
          description={message}
          tone="error"
        />
      </AdminShell>
    );
  }


  return (
    <AdminShell>

      <div className="space-y-8">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
              Legal / CMS
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Legal Pages
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-semibold text-black/45">
              Manage privacy policy, cookie policy,
              multilingual content, and SEO metadata.
            </p>

          </div>


          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[#039147] px-7 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)] transition hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>


        {message ? (
          <div className="rounded-2xl bg-[#eaf8f0] px-5 py-3 text-sm font-bold text-[#039147]">
            {message}
          </div>
        ) : null}



        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">


          <div className="rounded-[32px] bg-white p-5 shadow-sm">

            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              Pages
            </p>


            <div className="mt-5 space-y-3">

              {pages.map((page)=> {

                const active =
                  selectedType === page.type;


                return (

                  <button
                    key={page.type}
                    onClick={() =>
                      setSelectedType(page.type)
                    }
                    className={`w-full rounded-2xl p-4 text-left transition ${
                      active
                        ? "bg-[#039147] text-white shadow-[0_15px_30px_rgba(3,145,71,0.2)]"
                        : "bg-[#f6faf7] hover:bg-[#eaf8f0]"
                    }`}
                  >

                    <p className="font-black">
                      {pageLabels[page.type]}
                    </p>


                    <p
                      className={`mt-1 text-xs font-bold ${
                        active
                          ? "text-white/70"
                          : "text-black/40"
                      }`}
                    >
                      {page.status}
                    </p>


                  </button>

                );

              })}

            </div>

          </div>




          {selectedPage ? (

            <div className="rounded-[32px] bg-white p-6 shadow-sm space-y-7">


              <div className="flex justify-between">

                <div>

                  <h2 className="text-2xl font-black">
                    {pageLabels[selectedPage.type]}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-black/45">
                    Type: {selectedPage.type}
                  </p>

                </div>


                <span className="rounded-full bg-[#eaf8f0] px-4 py-2 text-xs font-black text-[#039147]">
                  {selectedPage.status}
                </span>

              </div>




              <div className="flex gap-3">

                {(["en","id"] as const).map((item)=>(
                  <button
                    key={item}
                    onClick={()=>setLanguage(item)}
                    className={`rounded-full px-5 py-2 text-xs font-black ${
                      language===item
                      ? "bg-[#039147] text-white"
                      : "bg-[#f6faf7] text-black/50"
                    }`}
                  >
                    {item==="en"
                      ? "English"
                      : "Indonesia"}
                  </button>
                ))}

              </div>




              <div className="space-y-4">

                <label className="text-sm font-black">
                  Title
                </label>

                <input
                  value={
                    language==="en"
                    ? selectedPage.titleEn
                    : selectedPage.titleId || ""
                  }
                  onChange={(e)=>
                    updateField(
                      language==="en"
                      ? "titleEn"
                      : "titleId",
                      e.target.value,
                    )
                  }
                  className="w-full rounded-2xl bg-[#f6faf7] px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#039147]/20"
                />


              </div>




              <RichTextEditor

                value={
                  language==="en"
                  ? selectedPage.contentEn
                  : selectedPage.contentId || ""
                }

                onChange={(value)=>
                  updateField(
                    language==="en"
                    ? "contentEn"
                    : "contentId",
                    value,
                  )
                }

                mediaFolder="legal"

              />





              <div className="rounded-[28px] bg-[#f6faf7] p-6 space-y-5">

                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  SEO Settings
                </p>


                <input
                  placeholder="SEO Title"
                  value={
                    language==="en"
                    ? selectedPage.seoTitleEn || ""
                    : selectedPage.seoTitleId || ""
                  }
                  onChange={(e)=>
                    updateField(
                      language==="en"
                      ? "seoTitleEn"
                      : "seoTitleId",
                      e.target.value,
                    )
                  }
                  className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold"
                />


                <textarea
                  placeholder="Meta Description"
                  value={
                    language==="en"
                    ? selectedPage.metaDescriptionEn || ""
                    : selectedPage.metaDescriptionId || ""
                  }
                  onChange={(e)=>
                    updateField(
                      language==="en"
                      ? "metaDescriptionEn"
                      : "metaDescriptionId",
                      e.target.value,
                    )
                  }
                  className="min-h-[120px] w-full rounded-2xl bg-white px-5 py-4 text-sm font-bold"
                />


              </div>


            </div>

          ) : (

            <AdminState
              title="No legal page selected"
              description="Select a page to edit."
            />

          )}


        </div>

      </div>


    </AdminShell>
  );
}
