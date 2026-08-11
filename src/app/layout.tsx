import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import DesignToggle from "@/components/DesignToggle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Portfolio | Game + AI + Infrastructure Engineer",
  description: "Unity 게임, AI 시스템, 자체 서버 운영까지 전 스택을 다루는 프로덕트 엔지니어 포트폴리오",
  metadataBase: new URL("https://portfolio.olivilo.shop"),
  openGraph: {
    type: "website",
    title: "Portfolio | Game + AI + Infrastructure Engineer",
    description: "Unity 게임 8종, RAG AI 챗봇, Docker 기반 자체 서버 운영 — 전 스택을 직접 다루는 프로덕트 엔지니어",
    images: ["/images/resonance.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Game + AI + Infrastructure Engineer",
    description: "Unity 게임 8종, RAG AI 챗봇, Docker 기반 자체 서버 운영 — 전 스택을 직접 다루는 프로덕트 엔지니어",
    images: ["/images/resonance.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-[#0D0D0E]">
        <ThemeProvider>
          <Providers>
            <Header />
            <main>{children}</main>
            <Footer />
            <DesignToggle />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
