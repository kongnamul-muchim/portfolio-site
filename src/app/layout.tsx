import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Portfolio | Game Developer",
  description: "Game Developer Portfolio - Unity Games, Web Applications, and Tools",
  openGraph: {
    type: "website",
    title: "Portfolio | Game Developer",
    description: "Game Developer Portfolio - Unity Games, Web Applications, and Tools",
    images: ["/images/shotfire.png"],
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
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
