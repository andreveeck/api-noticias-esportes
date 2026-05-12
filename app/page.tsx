import { getSupabaseAdmin } from "../lib/supabase-admin";

type NewsRow = {
  title: string | null;
  summary: string | null;
  url: string | null;
  source_name: string | null;
  published_at: string | null;
  category: string | null;
};

export const dynamic = "force-dynamic";

async function getLatestNews(): Promise<{ data: NewsRow[]; error: string | null }> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("news_articles")
      .select("title, summary, url, source_name, published_at, category")
      .eq("category", "sports")
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Erro interno ao buscar noticias para home:", error.message);
      return { data: [], error: "Nao foi possivel carregar as noticias" };
    }

    return { data: (data as NewsRow[]) ?? [], error: null };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro interno ao buscar noticias para home:", error.message);
      return { data: [], error: "Nao foi possivel carregar as noticias" };
    }

    console.error("Erro interno ao buscar noticias para home: desconhecido");
    return { data: [], error: "Nao foi possivel carregar as noticias" };
  }
}

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export default async function HomePage() {
  const { data: news, error } = await getLatestNews();

  return (
    <main className="news-page">
      <header className="news-header">
        <h1>Noticias Esportivas Salvas</h1>
        <p>Ultimas 50 noticias da ingestao GNews + Supabase.</p>
        <a href="/api/news?page=1&limit=50" target="_blank" rel="noreferrer">
          Ver JSON da API
        </a>
      </header>

      {error ? (
        <section className="error-box">
          <strong>Erro ao carregar noticias:</strong> {error}
        </section>
      ) : null}

      <section className="table-wrap">
        <table className="news-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Fonte</th>
              <th>Publicado em</th>
              <th>Resumo</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-cell">
                  Nenhuma noticia encontrada.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.url ?? `${item.title}-${item.published_at}`}>
                  <td>{item.title ?? "-"}</td>
                  <td>{item.source_name ?? "-"}</td>
                  <td>{formatDate(item.published_at)}</td>
                  <td>{item.summary ?? "-"}</td>
                  <td>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        Abrir
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
