import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  cacheComponents: true,

  experimental: {
    inlineCss: true,
    browserDebugInfoInTerminal: true,
    optimizePackageImports: [
      "leaflet",
      "react-leaflet",
      "react-leaflet-cluster-4-next",
      "leaflet.markercluster",
    ],
  },
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  turbopack: {
    resolveAlias: {
      leaflet: "leaflet/dist/leaflet.js",
    },
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
