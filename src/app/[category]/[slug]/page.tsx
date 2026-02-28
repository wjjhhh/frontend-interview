import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { Toc } from "@/components/toc";
import { mdxComponents } from "@/components/mdx-components";
import {
  getPost,
  getAdjacentPosts,
  extractToc,
  getCategoryMeta,
  getCategories,
  getPostsByCategory,
} from "@/lib/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; slug: string }[] = [];
  for (const cat of categories) {
    const posts = getPostsByCategory(cat.slug);
    for (const post of posts) {
      params.push({ category: cat.slug, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) notFound();

  const categoryMeta = getCategoryMeta(category);
  const { prev, next } = getAdjacentPosts(category, slug);
  const toc = extractToc(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/${category}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回{categoryMeta?.name ?? "列表"}
          </Button>
        </Link>
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <DifficultyBadge difficulty={post.frontmatter.difficulty} />
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-2 text-3xl font-bold">
              {post.frontmatter.title}
            </h1>
            <p className="text-muted-foreground">
              {post.frontmatter.description}
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <Separator className="my-8" />

          {/* Prev/Next navigation */}
          <nav className="flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/${category}/${prev.slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                <div>
                  <p className="text-xs">上一篇</p>
                  <p className="font-medium text-foreground">
                    {prev.frontmatter.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/${category}/${next.slug}`}
                className="flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <div>
                  <p className="text-xs">下一篇</p>
                  <p className="font-medium text-foreground">
                    {next.frontmatter.title}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>

        {/* TOC sidebar */}
        {toc.length > 0 && (
          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-20">
              <Toc items={toc} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
