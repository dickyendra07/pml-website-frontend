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


type LegalPageForm = {
  id: string;

  type: LegalPageType;

  titleEn: string;
  contentEn: string;
  seoTitleEn: string;
  metaDescriptionEn: string;

  titleId: string;
  contentId: string;
  seoTitleId: string;
  metaDescriptionId: string;

  status: string;
};


const emptyForm: LegalPageForm = {
  id: "",
  type: "PRIVACY_POLICY",

  titleEn: "",
  contentEn: "",
  seoTitleEn: "",
  metaDescriptionEn: "",

  titleId: "",
  contentId: "",
  seoTitleId: "",
  metaDescriptionId: "",

  status: "DRAFT",
};


const pageLabels: Record<LegalPageType, string> = {
  PRIVACY_POLICY: "Privacy Policy",
  COOKIE_POLICY: "Cookie Policy",
};


function mapLegalPageToForm(item: LegalPage): LegalPageForm {
  return {
    id: item.id,
    type: item.type,

    titleEn: item.titleEn || "",
    contentEn: item.contentEn || "",
    seoTitleEn: item.seoTitleEn || "",
    metaDescriptionEn: item.metaDescriptionEn || "",

    titleId: item.titleId || "",
    contentId: item.contentId || "",
    seoTitleId: item.seoTitleId || "",
    metaDescriptionId: item.metaDescriptionId || "",

    status: item.status,
  };
}


export default function AdminLegalPagesPage() {
  const [items, setItems] = useState<LegalPage[]>([]);
  const [form, setForm] = useState<LegalPageForm>(emptyForm);

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedPage = useMemo(() => {
    return (
      items.find(
        (item) => item.id === form.id,
      ) || null
    );
  }, [items, form.id]);


  const loadPages = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage(
        "Admin token not found. Please login again.",
      );
      return;
    }


    try {
      const data = await getAdminLegalPages(token);

      setItems(data);
      setStatus("success");


      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapLegalPageToForm(data[0]);
        }

        return current;
      });


    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load legal pages.",
      );
    }

  }, []);


  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPages();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadPages]);


  function updateField(
    key: keyof LegalPageForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }


  function selectPage(item: LegalPage) {
    setForm(
      mapLegalPageToForm(item),
    );

    setMessage("");
  }


  async function save() {
    const token = getAdminToken();

    if (!token || !form.type) {
      return;
    }


    setSaving(true);
    setMessage("");


    try {
      const updated =
        await updateAdminLegalPage(
          token,
          form.type,
          {
            titleEn: form.titleEn,
            contentEn: form.contentEn,
            seoTitleEn: form.seoTitleEn,
            metaDescriptionEn:
              form.metaDescriptionEn,

            titleId: form.titleId,
            contentId: form.contentId,
            seoTitleId: form.seoTitleId,
            metaDescriptionId:
              form.metaDescriptionId,
          },
        );


      setItems((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );


      setForm(
        mapLegalPageToForm(updated),
      );


      setMessage(
        `${pageLabels[form.type]} saved successfully.`,
      );


    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save legal page.",
      );

    } finally {
      setSaving(false);
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



        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">


          <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">

            <h2 className="px-2 text-sm font-semibold text-gray-500">
              Pages
            </h2>


            {items.map((item) => (

              <button
                key={item.id}
                onClick={() => selectPage(item)}
                className={`
                  w-full rounded-xl border p-4 text-left transition
                  ${
                    form.id === item.id
                      ? "border-black bg-black text-white"
                      : "hover:bg-gray-50"
                  }
                `}
              >

                <div className="font-medium">
                  {pageLabels[item.type]}
                </div>


                <div className="mt-1 text-xs opacity-70">
                  {item.status}
                </div>

              </button>

            ))}

          </div>



          {selectedPage ? (

            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-8">


              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-semibold">
                    {pageLabels[selectedPage.type]}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Type: {selectedPage.type}
                  </p>
                </div>


                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                  {form.status}
                </span>

              </div>




              <section className="space-y-4">

                <h3 className="font-semibold">
                  English Content
                </h3>


                <input
                  className="w-full rounded-xl border px-4 py-3"
                  value={form.titleEn}
                  onChange={(e) =>
                    updateField(
                      "titleEn",
                      e.target.value,
                    )
                  }
                  placeholder="English title"
                />


                <RichTextEditor
                  value={form.contentEn}
                  onChange={(value) =>
                    updateField(
                      "contentEn",
                      value,
                    )
                  }
                />

              </section>




              <section className="space-y-4">

                <h3 className="font-semibold">
                  Indonesia Content
                </h3>


                <input
                  className="w-full rounded-xl border px-4 py-3"
                  value={form.titleId}
                  onChange={(e) =>
                    updateField(
                      "titleId",
                      e.target.value,
                    )
                  }
                  placeholder="Indonesia title"
                />


                <RichTextEditor
                  value={form.contentId}
                  onChange={(value) =>
                    updateField(
                      "contentId",
                      value,
                    )
                  }
                />

              </section>




              <section className="grid gap-6 md:grid-cols-2">

                <div className="space-y-3">

                  <h3 className="font-semibold">
                    SEO English
                  </h3>


                  <input
                    className="w-full rounded-xl border px-4 py-3"
                    value={form.seoTitleEn}
                    onChange={(e)=>
                      updateField(
                        "seoTitleEn",
                        e.target.value,
                      )
                    }
                    placeholder="SEO Title"
                  />


                  <textarea
                    className="min-h-[120px] w-full rounded-xl border px-4 py-3"
                    value={form.metaDescriptionEn}
                    onChange={(e)=>
                      updateField(
                        "metaDescriptionEn",
                        e.target.value,
                      )
                    }
                    placeholder="Meta Description"
                  />

                </div>



                <div className="space-y-3">

                  <h3 className="font-semibold">
                    SEO Indonesia
                  </h3>


                  <input
                    className="w-full rounded-xl border px-4 py-3"
                    value={form.seoTitleId}
                    onChange={(e)=>
                      updateField(
                        "seoTitleId",
                        e.target.value,
                      )
                    }
                    placeholder="SEO Title"
                  />


                  <textarea
                    className="min-h-[120px] w-full rounded-xl border px-4 py-3"
                    value={form.metaDescriptionId}
                    onChange={(e)=>
                      updateField(
                        "metaDescriptionId",
                        e.target.value,
                      )
                    }
                    placeholder="Meta Description"
                  />

                </div>


              </section>



              <button
                onClick={save}
                disabled={saving}
                className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>


              {message ? (
                <p className="text-sm text-gray-600">
                  {message}
                </p>
              ) : null}


            </div>

          ) : (

            <AdminState
              title="No legal page selected"
              description="Select a page to edit."
              tone="default"
            />

          )}

        </div>

      </div>

    </AdminShell>
  );
}
