"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const categories = [
  { slug: "javascript", name: "JavaScript 深度" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "react", name: "React" },
  { slug: "vue", name: "Vue" },
  { slug: "css", name: "CSS 布局" },
  { slug: "engineering", name: "工程化" },
  { slug: "performance", name: "性能优化" },
  { slug: "network", name: "网络与安全" },
  { slug: "browser", name: "浏览器原理" },
  { slug: "algorithm", name: "算法与系统设计" },
];

export function MobileNav({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">导航菜单</SheetTitle>
          <div className="flex h-14 items-center gap-2 border-b px-4 font-bold">
            <BookOpen className="h-5 w-5" />
            前端面试宝典
          </div>
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="p-4">
              <Link
                href="/"
                className={cn(
                  "mb-2 block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  pathname === "/" && "bg-accent"
                )}
                onClick={() => setOpen(false)}
              >
                首页
              </Link>
              <p className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">
                分类
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    pathname.startsWith(`/${cat.slug}`) && "bg-accent font-medium"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/playground"
                className={cn(
                  "mt-2 block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  pathname === "/playground" && "bg-accent"
                )}
                onClick={() => setOpen(false)}
              >
                练习场
              </Link>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Button variant="ghost" size="icon" onClick={onOpenSearch}>
        <Search className="h-5 w-5" />
        <span className="sr-only">搜索</span>
      </Button>
    </div>
  );
}
