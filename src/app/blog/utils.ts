import fs from "fs";
import path from "path";

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

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "src", "app", "blog", "posts"));
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  const normalized = date.includes("T") ? date : `${date}T00:00:00`;
  const targetDate = new Date(normalized);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "Today";
  if (yearsAgo > 0) formattedDate = `${yearsAgo}y ago`;
  else if (monthsAgo > 0) formattedDate = `${monthsAgo}mo ago`;
  else if (daysAgo > 0) formattedDate = `${daysAgo}d ago`;

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return includeRelative ? `${fullDate} (${formattedDate})` : fullDate;
}

