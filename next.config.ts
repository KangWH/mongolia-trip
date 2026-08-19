import type { NextConfig } from "next";

function resolveBasePath() {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "");
  }

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (process.env.GITHUB_ACTIONS && repo && !repo.endsWith(".github.io")) {
    return `/${repo}`;
  }

  return "";
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: basePath || undefined,
};

export default nextConfig;
