type AdminStateProps = {
  title: string;
  description?: string;
  tone?: "default" | "error";
};

const previewDescriptions: Record<string, string> = {
  "Unable to load dashboard":
    "Dashboard data will be available after the production API and database are connected.",
  "Unable to load inquiries":
    "Inquiry data will be available after the production API and database are connected.",
  "Unable to load homepage features":
    "Homepage CMS data will be available after the production API and database are connected.",
  "Unable to load catalogues":
    "Catalogue data will be available after the production API and database are connected.",
  "Unable to load insights":
    "Insight content data will be available after the production API and database are connected.",
  "Unable to load media library":
    "Media library data will be available after the production API and database are connected.",
  "Unable to load popups":
    "Popup data will be available after the production API and database are connected.",
  "Unable to load settings":
    "Website settings data will be available after the production API and database are connected.",
};

export default function AdminState({
  title,
  description,
  tone = "default",
}: AdminStateProps) {
  const isPreviewNotice = tone === "error";
  const displayTitle = isPreviewNotice ? "CMS Preview Mode Active" : title;
  const displayDescription = isPreviewNotice
    ? previewDescriptions[title] ||
      "This CMS section is available as a preview. Live data will be connected after the production API and database environment are ready."
    : description;

  return (
    <div
      className={`rounded-[28px] border p-8 text-center shadow-sm ${
        isPreviewNotice
          ? "border-[#039147]/12 bg-[#f6faf7] text-black"
          : "border-black/5 bg-white text-black"
      }`}
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black ${
          isPreviewNotice
            ? "bg-[#eaf8f0] text-[#039147]"
            : "bg-[#f6faf7] text-black/45"
        }`}
      >
        {isPreviewNotice ? "✓" : "i"}
      </div>

      <p
        className={`mt-5 text-xs font-black uppercase tracking-[0.18em] ${
          isPreviewNotice ? "text-[#039147]" : "text-black/40"
        }`}
      >
        {isPreviewNotice ? "Preview Environment" : "Information"}
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-[-0.02em] text-black">
        {displayTitle}
      </h3>

      {displayDescription ? (
        <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-8 text-black/58">
          {displayDescription}
        </p>
      ) : null}

      {isPreviewNotice ? (
        <p className="mx-auto mt-5 inline-flex rounded-full border border-[#039147]/12 bg-white px-5 py-3 text-sm font-black text-[#039147] shadow-sm">
          API production and database connection pending
        </p>
      ) : null}
    </div>
  );
}
