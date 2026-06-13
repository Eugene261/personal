import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { getBlogPosts } from "@/app/blog/utils";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

const POSTS_DIR = path.join(process.cwd(), "src", "app", "blog", "posts");

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function toMdxFile(metadata: PostMetadata, content: string) {
  const fm = [
    "---",
    `title: "${metadata.title.replaceAll('"', '\\"')}"`,
    `publishedAt: "${metadata.publishedAt}"`,
    `summary: "${metadata.summary.replaceAll('"', '\\"')}"`,
    metadata.image ? `image: "${metadata.image.replaceAll('"', '\\"')}"` : null,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${fm}\n${(content ?? "").trim()}\n`;
}

export async function GET() {
  if (!(await verifyAuth())) return unauthorized();
  try {
    const posts = await getBlogPosts();
    // Return posts mapped to slug and metadata format expected by UI
    const mapped = posts.map(p => ({
      slug: p.slug,
      metadata: p.metadata
    }));
    return NextResponse.json({ posts: mapped });
  } catch (e) {
    return NextResponse.json({ error: "Failed to list posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) return unauthorized();

  try {
    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const publishedAt = String(body?.publishedAt ?? "").trim();
    const summary = String(body?.summary ?? "").trim();
    const content = String(body?.content ?? "");
    const image = body?.image ? String(body.image).trim() : undefined;
    const providedSlug = body?.slug ? String(body.slug).trim() : "";

    if (!title || !publishedAt || !summary) {
      return NextResponse.json(
        { error: "title, publishedAt, and summary are required" },
        { status: 400 }
      );
    }

    const slug = slugify(providedSlug || title);
    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // 1. Check if post exists in Firestore
    const docRef = db.collection("blogs").doc(slug);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return NextResponse.json({ error: "Post already exists" }, { status: 409 });
    }

    // 2. Save to Firestore
    await docRef.set({
      title,
      publishedAt,
      summary,
      image: image || null,
      content,
      createdAt: new Date().toISOString(),
    });

    // 3. Optional local sync (fails gracefully on read-only filesystems like Vercel)
    try {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      const mdx = toMdxFile({ title, publishedAt, summary, image }, content);
      fs.writeFileSync(filePath, mdx, "utf-8");
    } catch (fsErr) {
      console.warn("[Local Sync Error] Failed to write local MDX file:", fsErr);
    }

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

