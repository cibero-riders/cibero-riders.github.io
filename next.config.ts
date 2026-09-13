import type { NextConfig } from "next";

const legacyDirectoryRoutes = [
  "admin",
  "campanii",
  "inregistrare",
  "locuri",
  "onboarding",
  "orase",
  "ticket",
  "tickete",
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      { source: "/index.html", destination: "/" },
      ...legacyDirectoryRoutes.map((route) => ({
        source: `/${route}/`,
        destination: `/${route}/index.html`,
      })),
    ];
  },
};

export default nextConfig;
