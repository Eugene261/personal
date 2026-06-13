import { getBlogPosts } from "@/app/blog/utils";
import BlogPostAccordion from "./BlogPostAccordion";

export function BlogPosts() {
  const allBlogs = getBlogPosts();

  // Sort blogs by published date descending
  const sortedBlogs = [...allBlogs].sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return <BlogPostAccordion posts={sortedBlogs} />;
}

