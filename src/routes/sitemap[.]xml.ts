import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { careers, streams } from "@/lib/data";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "https://aspire-future-ai.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

function createPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        storage: undefined,
      },
    },
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          { path: "/careers", changefreq: "weekly", priority: "0.9" },
          { path: "/colleges", changefreq: "weekly", priority: "0.9" },
          { path: "/scholarships", changefreq: "weekly", priority: "0.9" },
          { path: "/streams", changefreq: "weekly", priority: "0.8" },
          { path: "/skills", changefreq: "weekly", priority: "0.8" },
          { path: "/quiz", changefreq: "monthly", priority: "0.8" },
          { path: "/mentor", changefreq: "weekly", priority: "0.8" },
          { path: "/roadmap", changefreq: "weekly", priority: "0.8" },
          { path: "/success-stories", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/auth", changefreq: "monthly", priority: "0.3" },
          { path: "/reset-password", changefreq: "yearly", priority: "0.1" },
        ];

        // Static career detail pages
        for (const career of careers) {
          entries.push({ path: `/careers/${career.slug}`, changefreq: "monthly", priority: "0.7" });
        }

        // Static stream detail pages
        for (const stream of streams) {
          entries.push({ path: `/streams/${stream.slug}`, changefreq: "monthly", priority: "0.7" });
        }

        // Dynamic college and scholarship pages from the database
        const supabase = createPublicClient();
        const [{ data: colleges }, { data: scholarships }] = await Promise.all([
          supabase.from("colleges").select("slug").returns<{ slug: string }[]>(),
          supabase.from("scholarships").select("slug").returns<{ slug: string }[]>(),
        ]);

        for (const college of colleges ?? []) {
          if (college.slug) {
            entries.push({ path: `/colleges/${college.slug}`, changefreq: "monthly", priority: "0.6" });
          }
        }

        for (const scholarship of scholarships ?? []) {
          if (scholarship.slug) {
            entries.push({ path: `/scholarships/${scholarship.slug}`, changefreq: "monthly", priority: "0.6" });
          }
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
