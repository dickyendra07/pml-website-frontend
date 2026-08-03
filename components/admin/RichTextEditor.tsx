"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { resolveMediaUrl } from "@/lib/media";

const MediaImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mediaId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-id"),
        renderHTML: (attributes) =>
          attributes.mediaId
            ? { "data-media-id": attributes.mediaId }
            : {},
      },
      variant: {
        default: "original",
        parseHTML: (element) =>
          element.getAttribute("data-variant") || "original",
        renderHTML: (attributes) => ({
          "data-variant": attributes.variant || "original",
        }),
      },
    };
  },
  addNodeView() {
    return ({ node }) => {
      const element = document.createElement("img");

      const render = (attributes: Record<string, unknown>) => {
        const source = resolveMediaUrl(
          typeof attributes.src === "string" ? attributes.src : "",
        );

        element.src = source;
        element.alt =
          typeof attributes.alt === "string" ? attributes.alt : "Article image";
        element.draggable = true;

        if (typeof attributes.title === "string") {
          element.title = attributes.title;
        } else {
          element.removeAttribute("title");
        }

        if (typeof attributes.mediaId === "string") {
          element.dataset.mediaId = attributes.mediaId;
        } else {
          delete element.dataset.mediaId;
        }

        element.dataset.variant =
          typeof attributes.variant === "string"
            ? attributes.variant
            : "original";
      };

      render(node.attrs);

      return {
        dom: element,
        update: (updatedNode) => {
          if (updatedNode.type.name !== node.type.name) return false;

          render(updatedNode.attrs);
          return true;
        },
      };
    };
  },
});

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  mediaFolder?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center rounded-xl border px-3 text-xs font-black transition ${
        active
          ? "border-[#039147] bg-[#039147] text-white shadow-[0_10px_24px_rgba(3,145,71,0.18)]"
          : "border-black/10 bg-white text-black/65 hover:border-[#039147]/40 hover:bg-[#eaf8f0] hover:text-[#039147]"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-black/5 bg-white/80 p-1.5 shadow-sm">
      {children}
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  mediaFolder = "content",
}: RichTextEditorProps) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [linkEditorOpen, setLinkEditorOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPreviewText, setLinkPreviewText] = useState("");
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false);
  const [linkSelection, setLinkSelection] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [linkError, setLinkError] = useState("");
  const [linkSuccessVisible, setLinkSuccessVisible] = useState(false);
  const linkSuccessTimeoutRef = useRef<number | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
        underline: false,
      }),
      MediaImage.configure({
        inline: false,
        allowBase64: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder:
          "Start writing your SEO article here. Use headings, paragraph, internal links, lists, and quotes...",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-[#039147] underline underline-offset-4 decoration-[#039147]/40",
          rel: null,
          target: null,
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "pml-rich-editor min-h-[720px] bg-white px-6 py-7 text-base leading-8 text-black outline-none md:px-12 md:py-10 xl:px-16",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const nextHtml = value || "";

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    return () => {
      if (linkSuccessTimeoutRef.current !== null) {
        window.clearTimeout(linkSuccessTimeoutRef.current);
      }
    };
  }, []);

  const wordCount = useMemo(() => {
    if (!editor) return 0;

    return editor.getText().trim().split(/\s+/).filter(Boolean).length;
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-[26px] border border-black/5 bg-white px-5 py-8 text-sm font-bold text-black/50">
        Loading article editor...
      </div>
    );
  }

  const currentFormat = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "paragraph";

  const setFormat = (format: string) => {
    if (format === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }

    if (format === "h1") {
      editor.chain().focus().setHeading({ level: 1 }).run();
      return;
    }

    if (format === "h2") {
      editor.chain().focus().setHeading({ level: 2 }).run();
      return;
    }

    if (format === "h3") {
      editor.chain().focus().setHeading({ level: 3 }).run();
    }
  };

  const openLinkEditor = () => {
    const editingExistingLink = editor.isActive("link");

    if (editingExistingLink) {
      editor.chain().focus().extendMarkRange("link").run();
    }

    const { from, to } = editor.state.selection;
    const linkAttributes = editor.getAttributes("link");
    const selectedText = editor.state.doc
      .textBetween(from, to, " ")
      .trim();

    setLinkSelection({ from, to });
    setLinkPreviewText(selectedText);
    setLinkUrl(
      typeof linkAttributes.href === "string" ? linkAttributes.href : "",
    );
    setLinkOpenInNewTab(linkAttributes.target === "_blank");
    setLinkError(
      selectedText
        ? ""
        : "Highlight text in the editor before inserting a link.",
    );
    setLinkEditorOpen(true);
  };

  const closeLinkEditor = () => {
    if (linkSelection) {
      editor.commands.setTextSelection(linkSelection);
      editor.commands.focus();
    }

    setLinkEditorOpen(false);
    setLinkError("");
  };

  const isSupportedLinkUrl = (url: string) => {
    if (url.startsWith("/") && !url.startsWith("//")) return true;
    if (url.startsWith("#")) return true;

    return /^(https?:\/\/|mailto:|tel:)/i.test(url);
  };

  const showLinkSuccess = () => {
    if (linkSuccessTimeoutRef.current !== null) {
      window.clearTimeout(linkSuccessTimeoutRef.current);
    }

    setLinkSuccessVisible(true);
    linkSuccessTimeoutRef.current = window.setTimeout(() => {
      setLinkSuccessVisible(false);
      linkSuccessTimeoutRef.current = null;
    }, 2500);
  };

  const saveLink = () => {
    const normalizedUrl = linkUrl.trim();

    if (!linkSelection || !linkPreviewText) {
      setLinkError("Highlight text in the editor before inserting a link.");
      return;
    }

    if (!normalizedUrl) {
      setLinkError("Enter an internal or external URL.");
      return;
    }

    if (!isSupportedLinkUrl(normalizedUrl)) {
      setLinkError(
        "Use an internal path such as /services/clinical-trial or a full https:// URL.",
      );
      return;
    }

    const linkInserted = editor
      .chain()
      .focus()
      .setTextSelection(linkSelection)
      .setLink({
        href: normalizedUrl,
        target: linkOpenInNewTab ? "_blank" : null,
        rel: linkOpenInNewTab ? "noopener noreferrer" : null,
      })
      .run();

    if (!linkInserted) {
      setLinkError("Unable to insert the link. Please try again.");
      return;
    }

    setLinkEditorOpen(false);
    setLinkError("");
    showLinkSuccess();
  };

  return (
    <>
      <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm transition focus-within:border-[#039147] focus-within:ring-4 focus-within:ring-[#039147]/10">
      <div className="sticky top-0 z-10 border-b border-black/5 bg-[#f6faf7]/95 p-3 backdrop-blur">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                Article Editor
              </p>
              <p className="mt-1 text-xs font-bold text-black/45">
                Format seperti WordPress untuk artikel SEO dan internal linking.
              </p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-xs font-black text-black/45 shadow-sm">
              {wordCount} words
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarGroup>
              <select
                value={currentFormat}
                onChange={(event) => setFormat(event.target.value)}
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-xs font-black text-black/70 outline-none transition hover:border-[#039147]/40 focus:border-[#039147]"
              >
                <option value="paragraph">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
              >
                B
              </ToolbarButton>

              <ToolbarButton
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
              >
                I
              </ToolbarButton>

              <ToolbarButton
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
              >
                U
              </ToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet list"
              >
                • List
              </ToolbarButton>

              <ToolbarButton
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered list"
              >
                1. List
              </ToolbarButton>

              <ToolbarButton
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Quote"
              >
                Quote
              </ToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton
                active={editor.isActive("link")}
                onClick={openLinkEditor}
                title="Insert link"
              >
                Insert Link
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
                title="Remove link"
              >
                Remove Link
              </ToolbarButton>

              <ToolbarButton
                onClick={() => setImagePickerOpen(true)}
                title="Insert image"
              >
                Insert Image
              </ToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                Undo
              </ToolbarButton>

              <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                Redo
              </ToolbarButton>
            </ToolbarGroup>
          </div>
        </div>
      </div>

      {linkSuccessVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-[#039147]/15 bg-[#eaf8f0] px-4 py-3 text-[#027a3c] shadow-[0_12px_32px_rgba(3,145,71,0.10)] sm:mx-5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#039147] text-xs font-black text-white">
            ✓
          </span>
          <div>
            <p className="text-sm font-black">Link inserted successfully</p>
            <p className="mt-0.5 text-xs font-semibold text-[#027a3c]/70">
              Click Save Insight when you are ready to save the article.
            </p>
          </div>
        </div>
      ) : null}

      <EditorContent editor={editor} />

      {imagePickerOpen ? (
        <MediaLibraryModal
          folder={mediaFolder}
          onClose={() => setImagePickerOpen(false)}
          onSelect={(reference) => {
            const filename = decodeURIComponent(
              reference.url.split("?")[0].split("/").pop() || "Article image",
            );

            editor
              .chain()
              .focus()
              .insertContent({
                type: "image",
                attrs: {
                  src: reference.url,
                  alt: filename,
                  mediaId: reference.mediaId,
                  variant: reference.variant,
                },
              })
              .run();

            setImagePickerOpen(false);
          }}
        />
      ) : null}

        <div className="border-t border-black/5 bg-white px-5 py-4 text-xs font-bold leading-6 text-black/45">
          Tips: untuk internal link SEO, highlight kata tertentu seperti “bioequivalence study”
          lalu klik <span className="font-black text-[#039147]">Insert Link</span>.
        </div>
      </div>

      {linkEditorOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="link-editor-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLinkEditor();
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveLink();
            }}
            className="w-full max-w-xl rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_30px_100px_rgba(0,0,0,0.24)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Rich Text Link
                </p>
                <h3
                  id="link-editor-title"
                  className="mt-2 text-2xl font-black tracking-tight text-black"
                >
                  Insert Link
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-black/45">
                  Connect selected text to a PML page or an external website.
                </p>
              </div>

              <button
                type="button"
                onClick={closeLinkEditor}
                aria-label="Close link editor"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-black text-black/45 transition hover:border-black/20 hover:bg-black/[0.03] hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-[#039147]/10 bg-[#f2faf5] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#039147]">
                Selected Text
              </p>
              <p className="mt-2 break-words text-sm font-black leading-6 text-black">
                {linkPreviewText || "No text selected"}
              </p>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-black text-black">Link URL</span>
              <input
                type="text"
                value={linkUrl}
                onChange={(event) => {
                  setLinkUrl(event.target.value);
                  setLinkError("");
                }}
                autoFocus
                placeholder="/services/clinical-trial or https://example.com"
                aria-invalid={Boolean(linkError)}
                aria-describedby={linkError ? "link-editor-error" : undefined}
                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm font-semibold text-black outline-none transition placeholder:text-black/30 ${
                  linkError
                    ? "border-red-300 ring-4 ring-red-50"
                    : "border-black/10 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                }`}
              />
            </label>

            <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-black/5 bg-[#fafcfb] p-4">
              <span>
                <span className="block text-sm font-black text-black">
                  Open in new tab
                </span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-black/40">
                  Recommended for links to external websites.
                </span>
              </span>
              <input
                type="checkbox"
                checked={linkOpenInNewTab}
                onChange={(event) =>
                  setLinkOpenInNewTab(event.target.checked)
                }
                className="h-5 w-5 shrink-0 accent-[#039147]"
              />
            </label>

            {linkError ? (
              <p
                id="link-editor-error"
                className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-700"
              >
                {linkError}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeLinkEditor}
                className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black text-black/60 transition hover:border-black/20 hover:bg-black/[0.03] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!linkPreviewText}
                className="rounded-full bg-[#039147] px-7 py-3 text-sm font-black text-white shadow-[0_16px_40px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 hover:bg-[#027a3c] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
