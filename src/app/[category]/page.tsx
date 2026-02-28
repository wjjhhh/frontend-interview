import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { getCategoryMeta, getPostsByCategory, getCategories } from "@/lib/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) return {};
  return {
    title: meta.name,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{meta.name}</h1>
        <p className="text-muted-foreground">{meta.description}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {posts.length} 道题目
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">该分类暂无内容，敬请期待...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${category}/${post.slug}`}
            >
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {post.frontmatter.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {post.frontmatter.description}
                      </CardDescription>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.frontmatter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <DifficultyBadge difficulty={post.frontmatter.difficulty} />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
