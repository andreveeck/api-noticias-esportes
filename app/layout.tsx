import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API Noticias Esportes",
  description: "Backend Next.js para ingestao de noticias esportivas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

