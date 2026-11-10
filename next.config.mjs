
import bundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";
import { PUBLIC_ASSET_TRACING_GLOBS } from "./config/public-assets.cjs";
import frontendDemo from "./config/frontend-demo.cjs";

frontendDemo.applyFrontendDemoEnvironment();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const enableCaching =
  process.env.DISABLE_CACHING !== "true" &&
  process.env.NODE_ENV === "production";

const withSerwist = withSerwistInit({
  swSrc: "sw.ts",
  swDest: "public/sw.js",
  disable: !enableCaching,
  globPublicPatterns: ["**/*.{js,css,html,json,webmanifest,png,svg,ico}"],
});

const nextConfig = withSerwist({
  env: {
    FRONTEND_DEMO_MODE: frontendDemo.frontendDemoEnabled ? "true" : "false",
  },
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },

  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  experimental: {
    inlineCss: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "assets.ctfassets.net",
      },
    ],
  },

  outputFileTracingIncludes: {
    "/backend/api/verify-and-generate-badge": [
      "./app/backend/badges/assets/**/*",
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },

  outputFileTracingExcludes: {
    "/*": PUBLIC_ASSET_TRACING_GLOBS,
  },

  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.js\.map$/,
      use: "ignore-loader",
    });

    return config;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://app.contentful.com",
          },
        ],
      },
      {
        source: "/images/:all*.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/images/:all*(jpg|jpeg|png|gif|webp|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  generateBuildId: async () => {
    return String(Date.now());
  },
});

export default withBundleAnalyzer(nextConfig);
