import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow pdf-parse to run in the Node.js runtime (not Edge)
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
