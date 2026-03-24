import type { MetadataRoute } from "next";

const siteUrl = "https://fivfold.fivexlabs.com";

const routes: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/docs/getting-started/introduction", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/getting-started/installation", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/getting-started/cli", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/getting-started/how-it-works", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/getting-started/background", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/kits/overview", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/kits/auth", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/kits/chat", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/kits/email", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/kits/kanban", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/kits/media-uploader", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/kits/push", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/api/setup", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/api/express", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/api/nestjs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${siteUrl}${path}` : siteUrl,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
