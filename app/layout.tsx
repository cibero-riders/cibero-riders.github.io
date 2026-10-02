import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const title = "CibeRO | Flotă parteneră";
const description = "CibeRO — flotă parteneră pentru curieri Bolt Food, Wolt și Glovo.";
const socialImage = "https://cibero.delivery/assets/cibero-social-logo-20261002.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://cibero-riders.github.io"),
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/assets/cibero-favicon.png?v=6", type: "image/png" }],
    apple: [{ url: "/assets/cibero-favicon.png?v=6" }],
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "CibeRO",
    title,
    description: "Flotă parteneră pentru curieri Bolt Food, Wolt și Glovo.",
    url: "/",
    images: [{ url: socialImage, width: 1254, height: 1254, type: "image/png", alt: "Logo CibeRO — Bolt Food, Glovo și Wolt" }],
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
        <meta property="og:image:secure_url" content={socialImage} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/main-page.css?v=40" />
        <link rel="stylesheet" href="/site-navigation.css?v=31" />
        <link rel="stylesheet" href="/smooth-typography.css?v=1" />
        <link rel="stylesheet" href="/site-theme.css?v=12" />
        <link rel="stylesheet" href="/site-footer.css?v=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
