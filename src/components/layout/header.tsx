"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { href: "/javascript", label: "JavaScript" },
  { href: "/react", label: "React" },
  { href: "/typescript", label: "TypeScript" },
  { href: "/nextjs", label: "Next.js" },
  { href: "/vue", label: "Vue" },
];

const moreNavItems = [
  { href: "/css", label: "CSS 布局" },
  { href: "/engineering", label: "工程化" },
  { href: "/performance", label: "性能优化" },
  { href: "/network", label: "网络与安全" },
  { href: "/browser", label: "浏览器原理" },
  { href: "/algorithm", label: "算法与系统设计" },
  { href: "/web3", label: "Web3 开发" },
];

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();
  const isMoreActive = moreNavItems.some((item) => pathname.startsWith(item.href));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <MobileNav onOpenSearch={onOpenSearch} />

        <Link href="/" className="mr-6 flex items-center gap-2 font-bold">
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline">前端面试宝典</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          <Link href="/">
            <Button variant={pathname === "/" ? "secondary" : "ghost"} size="sm">
              首页
            </Button>
          </Link>
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={isMoreActive ? "secondary" : "ghost"} size="sm" className="gap-1">
                更多
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {moreNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/playground">
            <Button variant={pathname === "/playground" ? "secondary" : "ghost"} size="sm">
              练习场
            </Button>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-2 text-muted-foreground md:flex"
            onClick={onOpenSearch}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">搜索</span>
            <kbd className="pointer-events-none rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
