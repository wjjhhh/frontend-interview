import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getCategories, getAllPosts } from "@/lib/content";
import {
  Braces, FileType, Atom, LayoutTemplate, Palette,
  Settings, Zap, Globe, Monitor, Binary,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  braces: Braces,
  "file-type": FileType,
  atom: Atom,
  "layout-template": LayoutTemplate,
  palette: Palette,
  settings: Settings,
  zap: Zap,
  globe: Globe,
  monitor: Monitor,
  binary: Binary,
};

export default function HomePage() {
  const categories = getCategories();
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalCategories = categories.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="mx-auto max-w-3xl py-12 text-center md:py-20">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          前端面试宝典
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          面向资深/高级前端工程师的面试准备资料，涵盖 {totalCategories} 大核心领域、
          {totalPosts} 道高频面试题，配合交互式代码练习，助你拿到心仪 Offer。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={categories[0] ? `/${categories[0].slug}` : "/javascript"}>
            <Button size="lg">
              开始学习
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/playground">
            <Button size="lg" variant="outline">
              代码练习场
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto mb-12 grid max-w-2xl grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border p-4">
          <p className="text-3xl font-bold">{totalCategories}</p>
          <p className="text-sm text-muted-foreground">核心分类</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-3xl font-bold">{totalPosts}</p>
          <p className="text-sm text-muted-foreground">面试题目</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-3xl font-bold">
            {allPosts.filter((p) => p.frontmatter.difficulty === "高级").length}
          </p>
          <p className="text-sm text-muted-foreground">高级题目</p>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">面试分类</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.meta.icon] ?? Braces;
            return (
              <Link key={cat.slug} href={`/${cat.slug}`}>
                <Card className="h-full transition-colors hover:bg-accent/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {cat.meta.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {cat.postCount} 题
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{cat.meta.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
