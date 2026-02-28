export type Difficulty = "初级" | "中级" | "高级";

export interface PostFrontmatter {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  category: string;
  order: number;
}

export interface Post {
  slug: string;
  category: string;
  frontmatter: PostFrontmatter;
  content: string;
}

export interface CategoryMeta {
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface CategoryInfo {
  slug: string;
  meta: CategoryMeta;
  postCount: number;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}
