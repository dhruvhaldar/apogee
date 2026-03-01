import type { Metadata } from "next";
import "./globals.css";

// ⚡ Performance: Removed unused `next/font/google` initializations (Geist and Geist_Mono).
// Since the application explicitly overrides font-family to system fonts (Arial, Helvetica, sans-serif) in globals.css,
// downloading and injecting @font-face and preload tags for these web fonts added unnecessary network latency and HTML payload size.
// Relying on system fonts improves First Contentful Paint (FCP) and Largest Contentful Paint (LCP) by freeing up the critical rendering path.

export const metadata: Metadata = {
  title: "Apogee - Spaceflight Calculator",
  description: "Mission planning and analysis tool for KTH SD2905",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-white text-black font-bold rounded outline-none ring-2 ring-cyan-500 shadow-xl transition-transform"
        >
          Skip to content
        </a>
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
      </body>
    </html>
  );
}
