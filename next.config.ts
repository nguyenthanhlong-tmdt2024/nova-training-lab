import type { NextConfig } from "next";
import { legacySlugs } from "./src/lib/legacy-routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/index.html", destination: "/" },
      ...legacySlugs.map((slug) => ({
        source: `/${slug}.html`,
        destination: `/${slug}`,
      })),
    ];
  },
};

export default nextConfig;
