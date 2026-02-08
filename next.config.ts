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
      "leaflet.markercluster",
      "react-day-picker",
    ],
    serverSourceMaps: true,
    // turbopackTreeShaking: true,
  },
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    removeConsole: false,
  },
  turbopack: {
    resolveAlias: {
      leaflet: "leaflet/dist/leaflet.js",
    },
  },
  // webpack: (config, _options) => {
  //   config.resolve = config.resolve || {};
  //   config.resolve.alias = {
  //     ...(config.resolve.alias || {}),
  //     leaflet: "leaflet/dist/leaflet.js",
  //   };
  //   return config;
  // },
  // PostHog rewrites for ingest routes
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
