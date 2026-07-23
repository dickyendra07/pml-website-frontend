"use client";

import { useEffect, useMemo } from "react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
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

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
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
          rel: "noopener noreferrer",
          target: "_blank",
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

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    if (!selectedText && !previousUrl) {
      window.alert("Highlight kata atau kalimat dulu, lalu klik Insert Link.");
      return;
    }

    const url = window.prompt(
      "Masukkan URL internal/external. Contoh: /services/babe-studies",
      previousUrl
    );

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
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
              <ToolbarButton active={editor.isActive("link")} onClick={setLink} title="Insert link">
                Insert Link
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
                title="Remove link"
              >
                Remove Link
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

      <EditorContent editor={editor} />

      <div className="border-t border-black/5 bg-white px-5 py-4 text-xs font-bold leading-6 text-black/45">
        Tips: untuk internal link SEO, highlight kata tertentu seperti “bioequivalence study”
        lalu klik <span className="font-black text-[#039147]">Insert Link</span>.
      </div>
    </div>
  );
}
