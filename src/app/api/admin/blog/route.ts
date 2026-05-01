import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";
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

function listPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const slug = path.basename(file, ".mdx");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { metadata } = parseFrontmatter(raw);
    return { slug, metadata };
  });
}

export async function GET() {
  if (!(await verifyAuth())) return unauthorized();
  try {
    return NextResponse.json({ posts: listPosts() });
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

    fs.mkdirSync(POSTS_DIR, { recursive: true });
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Post already exists" }, { status: 409 });
    }

    const mdx = toMdxFile({ title, publishedAt, summary, image }, content);
    fs.writeFileSync(filePath, mdx, "utf-8");

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

