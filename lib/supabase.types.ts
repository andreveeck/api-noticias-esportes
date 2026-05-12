export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      news_articles: {
        Row: {
          id: string;
          external_id: string | null;
          title: string;
          title_normalized: string | null;
          summary: string | null;
          content_excerpt: string | null;
          url: string;
          image_url: string | null;
          published_at: string | null;
          language: string | null;
          country: string | null;
          category: string | null;
          source_id: string | null;
          source_name: string | null;
          source_url: string | null;
          source_country: string | null;
          search_query: string | null;
          endpoint: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          external_id?: string | null;
          title: string;
          title_normalized?: string | null;
          summary?: string | null;
          content_excerpt?: string | null;
          url: string;
          image_url?: string | null;
          published_at?: string | null;
          language?: string | null;
          country?: string | null;
          category?: string | null;
          source_id?: string | null;
          source_name?: string | null;
          source_url?: string | null;
          source_country?: string | null;
          search_query?: string | null;
          endpoint?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          external_id?: string | null;
          title?: string;
          title_normalized?: string | null;
          summary?: string | null;
          content_excerpt?: string | null;
          url?: string;
          image_url?: string | null;
          published_at?: string | null;
          language?: string | null;
          country?: string | null;
          category?: string | null;
          source_id?: string | null;
          source_name?: string | null;
          source_url?: string | null;
          source_country?: string | null;
          search_query?: string | null;
          endpoint?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      gnews_fetch_logs: {
        Row: {
          id: string;
          endpoint: string | null;
          query: string;
          status: string;
          total_articles_api: number | null;
          articles_received: number | null;
          articles_saved: number | null;
          articles_skipped: number | null;
          error_message: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          endpoint?: string | null;
          query: string;
          status: string;
          total_articles_api?: number | null;
          articles_received?: number | null;
          articles_saved?: number | null;
          articles_skipped?: number | null;
          error_message?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          endpoint?: string | null;
          query?: string;
          status?: string;
          total_articles_api?: number | null;
          articles_received?: number | null;
          articles_saved?: number | null;
          articles_skipped?: number | null;
          error_message?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

