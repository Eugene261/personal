import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
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

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match?.[1] ?? "";
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const lines = frontMatterBlock.trim().split("\n").filter(Boolean);
  const metadata: Partial<PostMetadata> = {};

  lines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    metadata[key.trim() as keyof PostMetadata] = value;
  });

  return { metadata: metadata as PostMetadata, content };
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAuth())) return unauthorized();

  const { slug } = await params;

  // 1. Try Firestore first
  try {
    const docSnap = await db.collection("blogs").doc(slug).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      return NextResponse.json({
        slug,
        metadata: {
          title: data?.title || "",
          publishedAt: data?.publishedAt || "",
          summary: data?.summary || "",
          image: data?.image || undefined,
        },
        content: data?.content || "",
      });
    }
  } catch (dbErr) {
    console.warn("[Firebase Error] GET blog post failed:", dbErr);
  }

  // 2. Fallback to local files
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { metadata, content } = parseFrontmatter(raw);
  return NextResponse.json({ slug, metadata, content });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAuth())) return unauthorized();

  const { slug } = await params;

  // Verify post exists in Firestore or locally
  const docRef = db.collection("blogs").doc(slug);
  const docSnap = await docRef.get();
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!docSnap.exists && !fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const publishedAt = String(body?.publishedAt ?? "").trim();
    const summary = String(body?.summary ?? "").trim();
    const content = String(body?.content ?? "");
    const image = body?.image ? String(body.image).trim() : undefined;

    if (!title || !publishedAt || !summary) {
      return NextResponse.json(
        { error: "title, publishedAt, and summary are required" },
        { status: 400 }
      );
    }

    // 1. Save to Firestore
    await docRef.set({
      title,
      publishedAt,
      summary,
      image: image || null,
      content,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 2. Optional local sync (fails gracefully on read-only filesystems like Vercel)
    try {
      const mdx = toMdxFile({ title, publishedAt, summary, image }, content);
      fs.writeFileSync(filePath, mdx, "utf-8");
    } catch (fsErr) {
      console.warn("[Local Sync Error] Failed to update local MDX file:", fsErr);
    }

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAuth())) return unauthorized();

  const { slug } = await params;

  try {
    // 1. Delete from Firestore
    await db.collection("blogs").doc(slug).delete();

    // 2. Optional local sync delete (fails gracefully on Vercel)
    try {
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsErr) {
      console.warn("[Local Sync Error] Failed to delete local MDX file:", fsErr);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

