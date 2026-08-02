import { sanitizeRichTextHtml } from "@/lib/rich-text";

type RichTextContentProps = {
  content: string | null | undefined;
  className?: string;
};

export default function RichTextContent({
  content,
  className = "",
}: RichTextContentProps) {
  const html = sanitizeRichTextHtml(content);

  if (!html) return null;

  return (
    <div
      className={`pml-rich-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
