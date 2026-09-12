import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const title = "CibeRO | Flotă parteneră";
const description = "CibeRO — flotă parteneră pentru curieri Bolt Food, Wolt și Glovo.";
const socialImage = "https://cibero-riders.github.io/assets/cibero-social-preview.png?v=1";

export const metadata: Metadata = {
  metadataBase: new URL("https://cibero-riders.github.io"),
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/assets/cibero-favicon.png?v=4", type: "image/png" }],
    apple: [{ url: "/assets/cibero-favicon.png?v=4" }],
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "CibeRO",
    title,
    description: "Flotă parteneră pentru curieri Bolt Food, Wolt și Glovo.",
    url: "/",
    images: [{ url: socialImage, width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Flotă parteneră pentru curieri Bolt Food, Wolt și Glovo.",
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const themeBootstrap = `
try {
  var savedTheme = localStorage.getItem("cibero-public-theme");
  document.documentElement.dataset.theme = ["light", "midday", "night"].includes(savedTheme) ? savedTheme : "midday";
} catch (_) {
  document.documentElement.dataset.theme = "midday";
}`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ro" data-theme="midday" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/main-page.css?v=22" />
        <link rel="stylesheet" href="/site-navigation.css?v=10" />
        <link rel="stylesheet" href="/smooth-typography.css?v=1" />
        <link rel="stylesheet" href="/site-theme.css?v=4" />
      </head>
      <body>{children}</body>
    </html>
  );
}
