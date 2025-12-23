import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "react-native": false,
    };
    return config;
  },
  // Disable COEP/COOP headers to allow RainbowKit/WalletConnect to work properly
  // FHEVM doesn't strictly require these headers for basic functionality
  headers() {
    return Promise.resolve([]);
  }
};

export default nextConfig;
