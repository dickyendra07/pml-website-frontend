import sanitizeHtml from "sanitize-html";

import { resolveMediaUrl } from "@/lib/media";
import { normalizeHeadingMistakes } from "@/lib/rich-text-normalization";

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
        p: ["style"],
        h1: ["style"],
        h2: ["style"],
        h3: ["style"],
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
      allowedStyles: {
        p: {
          "text-align": [/^(?:left|center|right|justify)$/],
        },
        h1: {
          "text-align": [/^(?:left|center|right|justify)$/],
        },
        h2: {
          "text-align": [/^(?:left|center|right|justify)$/],
        },
        h3: {
          "text-align": [/^(?:left|center|right|justify)$/],
        },
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
