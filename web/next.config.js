const path = require("path");

const fontStubRelative = "./src/app/font-stub.css";

/** @type {import('next').NextConfig} */
const fontAliases = {
  "next/internal/font/google/geist_a71539c9.module.css": fontStubRelative,
  "next/internal/font/google/geist_mono_8d43a2aa.module.css": fontStubRelative,
};

const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...Object.fromEntries(
        Object.entries(fontAliases).map(([key, value]) => [
          key,
          path.resolve(__dirname, value),
        ])
      ),
    };
    return config;
  },
};

module.exports = nextConfig;