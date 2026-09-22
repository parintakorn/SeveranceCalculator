import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/คำนวณ-คาชดเชย-เลกจาง",
        destination: "/calculator",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
