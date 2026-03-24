import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/graphql",
          destination: `${process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000"}/graphql`,
        },
      ],
    };
  },
};

export default nextConfig;
