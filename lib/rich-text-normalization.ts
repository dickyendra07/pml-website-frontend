import sanitizeHtml from "sanitize-html";

export function normalizeHeadingMistakes(value: string) {
  const lowerValue = value.toLowerCase();
  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const openingIndex = lowerValue.indexOf("<h3>", cursor);

    if (openingIndex === -1) {
      chunks.push(value.slice(cursor));
      break;
    }

    const contentStart = openingIndex + 4;
    const closingIndex = lowerValue.indexOf("</h3>", contentStart);

    if (closingIndex === -1) {
      chunks.push(value.slice(cursor));
      break;
    }

    chunks.push(value.slice(cursor, openingIndex));
    const content = value.slice(contentStart, closingIndex);
    const cleanText = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
    const tagName = cleanText.length > 120 ? "p" : "h3";
    chunks.push(`<${tagName}>${content}</${tagName}>`);
    cursor = closingIndex + 5;
  }

  return chunks.join("");
}
