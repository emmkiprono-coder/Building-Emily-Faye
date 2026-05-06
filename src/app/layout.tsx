import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emily Faye Restoration · TMarK Charters",
  description:
    "Project management for the Emily Faye 1979 C&C 29 sailboat restoration, bound for the July 4, 2026 launch at Montrose Harbor.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display text-parchment">{children}</body>
    </html>
  );
}
