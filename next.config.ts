import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  async redirects() {
    // Consolidate public pages while leaving application API requests untouched.
    return ["/", "/book", "/privacy"].map((path) => ({
      source: path,
      has: [{ type: "host" as const, value: "www.approvalagents.ca" }],
      destination: `https://approvalagents.ca${path}`,
      permanent: true,
    }));
  },
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
