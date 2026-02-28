import type { Post } from "@/types";

export interface SearchResult {
  title: string;
  description: string;
  category: string;
  slug: string;
  difficulty: string;
}

export function searchPosts(posts: Post[], query: string): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  return posts
    .filter((post) => {
      const { title, description, tags } = post.frontmatter;
      return (
        title.toLowerCase().includes(lowerQuery) ||
        description.toLowerCase().includes(lowerQuery) ||
        tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        post.category.toLowerCase().includes(lowerQuery)
      );
    })
    .map((post) => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      category: post.category,
      slug: post.slug,
      difficulty: post.frontmatter.difficulty,
    }));
}
