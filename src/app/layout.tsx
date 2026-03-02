import type { Metadata } from "next";
import "./globals.css";

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
        {/* ⚡ Performance: Removed unused next/font/google imports (Geist, Geist_Mono) since the app relies on system fonts in globals.css. This prevents Next.js from injecting redundant @font-face styles and preload tags, reducing HTML payload and network requests to improve FCP/LCP. */}
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
