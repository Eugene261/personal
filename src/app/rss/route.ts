import { getBlogPosts } from "@/app/blog/utils";

export const runtime = "nodejs";

function escapeXml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = getBlogPosts().sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
  );

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `
<item>
  <title>${escapeXml(post.metadata.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(post.metadata.summary)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Portfolio Blog</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Portfolio blog RSS feed.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

