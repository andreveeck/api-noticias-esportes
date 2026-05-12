import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../lib/supabase-admin";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Erro inesperado ao buscar noticias";
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  const page = Math.max(1, parsePositiveInteger(request.nextUrl.searchParams.get("page"), 1));
  const requestedLimit = parsePositiveInteger(
    request.nextUrl.searchParams.get("limit"),
    50,
  );
  const limit = Math.min(100, Math.max(1, requestedLimit));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error } = await supabaseAdmin
      .from("news_articles")
      .select(
        "title, summary, content_excerpt, url, image_url, published_at, source_name, category",
      )
      .eq("category", "sports")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      page,
      limit,
      data: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: toErrorMessage(error) },
      { status: 500 },
    );
  }
}
