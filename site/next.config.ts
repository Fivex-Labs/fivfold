import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, ".."),
  async redirects() {
    return [
      { source: "/docs/appkits", destination: "/docs/kits/overview", permanent: true },
      { source: "/docs/appkits/overview", destination: "/docs/kits/overview", permanent: true },
      { source: "/docs/appkits/email", destination: "/docs/kits/email", permanent: true },
      { source: "/docs/appkits/kanban", destination: "/docs/kits/kanban", permanent: true },
      { source: "/docs/api", destination: "/docs/kits/overview", permanent: true },
      { source: "/docs/api/setup", destination: "/docs/kits/overview", permanent: true },
      { source: "/docs/api/express", destination: "/docs/kits/email", permanent: true },
      { source: "/docs/api/nestjs", destination: "/docs/kits/email", permanent: true },
    ];
  },
};

export default nextConfig;
