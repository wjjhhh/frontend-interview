import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter, CategoryInfo, CategoryMeta } from "@/types";

const contentDir = path.join(process.cwd(), "src/content");

const defaultCategoryMeta: Record<string, CategoryMeta> = {
  javascript: { name: "JavaScript 深度", description: "闭包、原型链、Event Loop、Promise、手写代码", icon: "braces", order: 1 },
  typescript: { name: "TypeScript", description: "类型体操、泛型、装饰器、类型推导", icon: "file-type", order: 2 },
  react: { name: "React", description: "Fiber架构、Hooks原理、性能优化、并发模式", icon: "atom", order: 3 },
  vue: { name: "Vue", description: "响应式原理、Diff算法、Composition API", icon: "layout-template", order: 4 },
  css: { name: "CSS 布局", description: "BFC、Flex/Grid、响应式、CSS变量、动画", icon: "palette", order: 5 },
  engineering: { name: "工程化", description: "Webpack/Vite原理、Tree Shaking、Module Federation", icon: "settings", order: 6 },
  performance: { name: "性能优化", description: "首屏优化、懒加载、缓存策略、Web Vitals", icon: "zap", order: 7 },
  network: { name: "网络与安全", description: "HTTP/2/3、HTTPS、跨域、XSS/CSRF", icon: "globe", order: 8 },
  browser: { name: "浏览器原理", description: "渲染流程、V8引擎、内存管理、Web API", icon: "monitor", order: 9 },
  algorithm: { name: "算法与系统设计", description: "常见算法题、前端系统设计", icon: "binary", order: 10 },
  nextjs: { name: "Next.js", description: "App Router、缓存体系、渲染策略、Server Actions、性能优化", icon: "triangle", order: 11 },
  "micro-frontend": { name: "微前端", description: "Module Federation、qiankun/single-spa、沙箱隔离、应用通信", icon: "layers", order: 12 },
  miniprogram: { name: "小程序", description: "双线程模型、生命周期、setData优化、分包加载、跨端框架", icon: "smartphone", order: 13 },
  "ai-agent": { name: "AI Agent", description: "LLM集成、流式响应、Tool Calling、RAG、Prompt工程、MCP协议", icon: "bot", order: 14 },
  web3: { name: "Web3 开发", description: "区块链基础、钱包连接、ethers.js/viem、wagmi、智能合约交互", icon: "link", order: 15 },
};

export function getCategories(): CategoryInfo[] {
  const categories: CategoryInfo[] = [];

  for (const [slug, meta] of Object.entries(defaultCategoryMeta)) {
    const categoryDir = path.join(contentDir, slug);
    let postCount = 0;
    if (fs.existsSync(categoryDir)) {
      postCount = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".mdx")).length;
    }
    categories.push({ slug, meta, postCount });
  }

  return categories.sort((a, b) => a.meta.order - b.meta.order);
}

export function getCategoryMeta(category: string): CategoryMeta | undefined {
  return defaultCategoryMeta[category];
}

export function getPostsByCategory(category: string): Post[] {
  const categoryDir = path.join(contentDir, category);
  if (!fs.existsSync(categoryDir)) return [];

  const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(categoryDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        category,
        frontmatter: data as PostFrontmatter,
        content,
      };
    })
    .sort((a, b) => (a.frontmatter.order ?? 0) - (b.frontmatter.order ?? 0));
}

export function getPost(category: string, slug: string): Post | null {
  const filePath = path.join(contentDir, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    category,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export function getAllPosts(): Post[] {
  const categories = Object.keys(defaultCategoryMeta);
  return categories.flatMap((category) => getPostsByCategory(category));
}

export function getAdjacentPosts(
  category: string,
  slug: string
): { prev: Post | null; next: Post | null } {
  const posts = getPostsByCategory(category);
  const index = posts.findIndex((p) => p.slug === slug);

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function extractToc(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: { id: string; title: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");
    toc.push({ id, title, level });
  }

  return toc;
}
