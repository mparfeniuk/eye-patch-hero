import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eye Patch Hero - Тренування зору для дітей",
  description:
    "Інтерактивні ігри для тренування зору дітей з occlusion patch. Catch the Dot, Focus Grid, Moving Contrast.",
  keywords: [
    "eye patch",
    "vision training",
    "children",
    "occlusion patch",
    "eye exercises",
    "amblyopia",
  ],
  authors: [{ name: "Eye Patch Hero" }],
  openGraph: {
    title: "Eye Patch Hero - Тренування зору для дітей",
    description:
      "Інтерактивні ігри для тренування зору дітей з occlusion patch",
    type: "website",
    locale: "uk_UA",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eye Patch Hero",
    description: "Інтерактивні ігри для тренування зору дітей",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <footer className="w-full border-t border-gray-200 bg-transparent px-6 py-4 text-center text-sm text-gray-700">
            Day 2. Vibe coding marathon. Author{" "}
            <a
              href="https://www.linkedin.com/in/mparfeniuk/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-blue-600 underline underline-offset-4"
            >
              Max Parfeniuk
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
