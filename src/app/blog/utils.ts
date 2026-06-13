import fs from "fs";
import path from "path";
import { db } from "@/lib/firebase-admin";

type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match?.[1] ?? "";
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n").filter(Boolean);
  const metadata: Partial<PostMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    metadata[key.trim() as keyof PostMetadata] = value;
  });

  return { metadata: metadata as PostMetadata, content };
}

function getLocalMDXData() {
  const dir = path.join(process.cwd(), "src", "app", "blog", "posts");
  if (!fs.existsSync(dir)) return [];
  const mdxFiles = fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  return mdxFiles.map((file) => {
    const rawContent = fs.readFileSync(path.join(dir, file), "utf-8");
    const { metadata, content } = parseFrontmatter(rawContent);
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

export async function getBlogPosts() {
  try {
    const snap = await db.collection("blogs").orderBy("publishedAt", "desc").get();
    
    if (!snap.empty) {
      return snap.docs.map(doc => {
        const data = doc.data();
        return {
          slug: doc.id,
          metadata: {
            title: data.title || "",
            publishedAt: data.publishedAt || "",
            summary: data.summary || "",
            image: data.image || undefined,
          },
          content: data.content || "",
        };
      });
    }

    // Auto-seed from local MDX files
    console.log("[Auto-Seed] Firestore collection 'blogs' is empty. Seeding from local MDX...");
    const localPosts = getLocalMDXData();
    if (localPosts.length > 0) {
      try {
        const batch = db.batch();
        localPosts.forEach(post => {
          const ref = db.collection("blogs").doc(post.slug);
          batch.set(ref, {
            title: post.metadata.title,
            publishedAt: post.metadata.publishedAt,
            summary: post.metadata.summary,
            image: post.metadata.image || null,
            content: post.content,
            createdAt: new Date().toISOString()
          });
        });
        await batch.commit();
        console.log(`[Auto-Seed] Seeded ${localPosts.length} posts to Firestore.`);
      } catch (seedErr) {
        console.error("[Auto-Seed Error] Failed to write seed posts:", seedErr);
      }
    }
    return localPosts;
  } catch (error: any) {
    console.warn("[Firebase Error] Failed to fetch blog posts:", error?.message || error);
    console.log("[Fallback] Reading local MDX files...");
    return getLocalMDXData();
  }
}

export { formatDate } from "./formatDate";

