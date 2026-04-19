import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let withSentryConfig = (config) => config;

try {
  ({ withSentryConfig } = require("@sentry/nextjs"));
} catch {
  withSentryConfig = (config) => config;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { webpack }) {
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: ['**/.next/**', '**/node_modules/**', '**/public/**']
    };

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/]
      },

      use: [{ loader: '@svgr/webpack' }]
    });
    // Temporary fix until the following fix is merged into our NextJS version: https://github.com/vercel/next.js/pull/65248
    // Should be included in NextJS >= 14.2.6
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_URL': JSON.stringify(
          process.env.NEXT_PUBLIC_URL ?? ''
        )
      })
    );

    return config;
  }
};

const sentryWebpackPluginOptions = {
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  ...(process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
    ? {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }
    : {}),
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
