import sanitizeHtml from "sanitize-html";

import { resolveMediaUrl } from "@/lib/media";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeLegacyPlainText(value: string) {
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return value;

  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function normalizeHeadingMistakes(value: string) {
  return value.replace(
    /<h3>([\s\S]*?)<\/h3>/gi,
    (_match, content) => {
      const cleanText = content.replace(/<[^>]+>/g, "").trim();

      if (cleanText.length > 120) {
        return `<p>${content}</p>`;
      }

      return `<h3>${content}</h3>`;
    },
  );
}

export function sanitizeRichTextHtml(value: string | null | undefined) {
  const content = value?.trim();

  if (!content) return "";

  return sanitizeHtml(
    normalizeHeadingMistakes(normalizeLegacyPlainText(content)),
    {
      allowedTags: [
        ...sanitizeHtml.defaults.allowedTags,
        "img",
        "u",
        "h1",
        "h2",
        "h3",
      ],
      allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        img: [
          "src",
          "alt",
          "title",
          "width",
          "height",
          "loading",
          "decoding",
          "data-media-id",
          "data-variant",
        ],
      },
      allowedSchemes: ["http", "https", "mailto", "tel"],
      allowProtocolRelative: false,
      transformTags: {
        a: (_tagName, attributes) => ({
          tagName: "a",
          attribs: {
            ...attributes,
            ...(attributes.target === "_blank"
              ? { rel: "noopener noreferrer" }
              : {}),
          },
        }),
        img: (_tagName, attributes) => {
          const source = resolveMediaUrl(attributes.src);

          if (!source) {
            return { tagName: "span", attribs: {} };
          }

          return {
            tagName: "img",
            attribs: {
              ...attributes,
              src: source,
              loading: "lazy",
              decoding: "async",
            },
          };
        },
      },
    },
  );
}
