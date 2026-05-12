import type { GNewsArticle } from "./gnews";

const CHARS_MARKER_REGEX = /\[\d+\s+chars\]/i;
const CHARS_MARKER_GLOBAL_REGEX = /\s*\[\d+\s+chars\]\s*/gi;
const TRAILING_ELLIPSIS_REGEX = /(\.\.\.|\u2026)\s*$/;

export interface NormalizedNewsArticle {
  external_id: string | null;
  title: string;
  title_normalized: string;
  summary: string | null;
  content_excerpt: string | null;
  url: string;
  image_url: string | null;
  published_at: string | null;
  language: string | null;
  country: string;
  category: "sports";
  source_id: string | null;
  source_name: string | null;
  source_url: string | null;
  source_country: string | null;
  search_query: string;
  endpoint: "search";
  updated_at: string;
}

export function cleanGNewsText(text: string | null | undefined): string | null {
  if (text == null) {
    return null;
  }

  const baseText = text.replace(/\r\n/g, "\n").trim();

  if (!baseText) {
    return null;
  }

  const paragraphs = baseText
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  let cleanedText = "";

  if (paragraphs.length > 1) {
    cleanedText = paragraphs
      .filter((paragraph) => !CHARS_MARKER_REGEX.test(paragraph))
      .join("\n\n");
  } else {
    cleanedText = paragraphs[0]
      .replace(/\s*\.\.\.\s*\[\d+\s+chars\]\s*$/i, "")
      .replace(/\s*\[\d+\s+chars\]\s*$/i, "");
  }

  cleanedText = cleanedText
    .replace(CHARS_MARKER_GLOBAL_REGEX, " ")
    .replace(/[ \t]+/g, " ")
    .replace(TRAILING_ELLIPSIS_REGEX, "")
    .trim();

  return cleanedText.length > 0 ? cleanedText : null;
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeArticle(
  article: GNewsArticle,
  query: string,
): NormalizedNewsArticle {
  const source = article.source ?? null;
  const title = (article.title ?? "").trim();
  const sourceCountry = source?.country?.trim() || null;

  return {
    external_id: article.id ?? null,
    title,
    title_normalized: normalizeTitle(title),
    summary: cleanGNewsText(article.description),
    content_excerpt: cleanGNewsText(article.content),
    url: (article.url ?? "").trim(),
    image_url: article.image ?? null,
    published_at: article.publishedAt ?? null,
    language: article.lang ?? null,
    country: sourceCountry || "br",
    category: "sports",
    source_id: source?.id ?? null,
    source_name: source?.name ?? null,
    source_url: source?.url ?? null,
    source_country: sourceCountry,
    search_query: query,
    endpoint: "search",
    updated_at: new Date().toISOString(),
  };
}
