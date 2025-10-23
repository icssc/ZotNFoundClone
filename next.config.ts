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
  experimental: {
    cacheComponents: true,
    browserDebugInfoInTerminal: true,
    optimizePackageImports: ["leaflet"],
  },
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { nextRuntime }) => {
    const { NormalModuleReplacementPlugin } = require("webpack");

    config.resolve = config.resolve || {};
    // Only alias the exact 'leaflet' import to the bundled JS entry so that
    // subpath imports like 'leaflet/dist/leaflet.css' continue to resolve
    // normally. Using 'leaflet$' ensures that imports of 'leaflet/...'
    // are not rewritten incorrectly.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      leaflet$: "leaflet/dist/leaflet.js",
    };

    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /leaflet\/dist\/leaflet-src\.js$/,
        "leaflet/dist/leaflet.js"
      )
    );

    return config;
  },
};
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);

export default nextConfig;
