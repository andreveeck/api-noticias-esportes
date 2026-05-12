import "server-only";

export const GNEWS_QUERY =
  '"campeonato brasileiro" OR libertadores OR "Copa do Brasil" OR "champions league" OR "copa do mundo"';

const GNEWS_ENDPOINT = "https://gnews.io/api/v4/search";

export interface GNewsArticleSource {
  id?: string | null;
  name?: string | null;
  url?: string | null;
  country?: string | null;
}

export interface GNewsArticle {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  lang?: string | null;
  source?: GNewsArticleSource | null;
}

export interface GNewsResponse {
  totalArticles?: number;
  articles?: GNewsArticle[];
  information?: unknown;
}

export async function fetchGNewsArticles(): Promise<GNewsResponse> {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNEWS_API_KEY nao esta configurada");
  }

  const params = new URLSearchParams({
    q: GNEWS_QUERY,
    lang: "pt",
    country: "br",
    max: "10",
    in: "title",
    sortby: "publishedAt",
    nullable: "description,content,image",
    apikey: apiKey,
  });

  const response = await fetch(`${GNEWS_ENDPOINT}?${params.toString()}`, {
    cache: "no-store",
  });

  const responseJson = (await response.json()) as GNewsResponse;

  if (!response.ok) {
    throw new Error(
      `Erro na GNews API (${response.status}): ${JSON.stringify(responseJson)}`,
    );
  }

  return responseJson;
}
