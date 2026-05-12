import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { fetchGNewsArticles, GNEWS_QUERY } from "../../../../lib/gnews";
import { normalizeArticle } from "../../../../lib/news-normalizer";
import { getSupabaseAdmin } from "../../../../lib/supabase-admin";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Erro inesperado durante a ingestao";
}

async function createFetchLog(payload: {
  supabaseAdmin: SupabaseClient | null;
  endpoint: "search";
  query: string;
  status: "success" | "error";
  total_articles_api?: number;
  articles_received?: number;
  articles_saved?: number;
  articles_skipped?: number;
  error_message?: string;
}) {
  const { supabaseAdmin, ...rest } = payload;
  if (!supabaseAdmin) {
    return;
  }

  const { error } = await supabaseAdmin.from("gnews_fetch_logs").insert(rest);

  if (error) {
    console.error("Falha ao registrar log da ingestao GNews:", error.message);
  }
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Acesso não autorizado" },
      { status: 401 },
    );
  }

  let supabaseAdmin: SupabaseClient | null = null;

  try {
    supabaseAdmin = getSupabaseAdmin();
    const data = await fetchGNewsArticles();
    const articles = Array.isArray(data.articles) ? data.articles : [];
    const totalArticlesApi =
      typeof data.totalArticles === "number" ? data.totalArticles : 0;

    let savedCount = 0;
    let skippedCount = 0;

    for (const article of articles) {
      if (!article?.title || !article?.url) {
        skippedCount += 1;
        continue;
      }

      const normalizedArticle = normalizeArticle(article, GNEWS_QUERY);

      const { error } = await supabaseAdmin
        .from("news_articles")
        .upsert([normalizedArticle] as never[], { onConflict: "url" });

      if (error) {
        skippedCount += 1;
        continue;
      }

      savedCount += 1;
    }

    await createFetchLog({
      supabaseAdmin,
      endpoint: "search",
      query: GNEWS_QUERY,
      status: "success",
      total_articles_api: totalArticlesApi,
      articles_received: articles.length,
      articles_saved: savedCount,
      articles_skipped: skippedCount,
    });

    return NextResponse.json({
      success: true,
      total_articles_api: totalArticlesApi,
      articles_received: articles.length,
      articles_saved: savedCount,
      articles_skipped: skippedCount,
    });
  } catch (error) {
    const errorMessage = toErrorMessage(error);

    try {
      if (!supabaseAdmin) {
        supabaseAdmin = getSupabaseAdmin();
      }

      await createFetchLog({
        supabaseAdmin,
        endpoint: "search",
        query: GNEWS_QUERY,
        status: "error",
        error_message: errorMessage,
      });
    } catch {
      // Ignore logging failures to keep API error response stable.
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
