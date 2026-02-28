"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/javascript", label: "JavaScript" },
    { href: "/react", label: "React" },
    { href: "/typescript", label: "TypeScript" },
    { href: "/playground", label: "练习场" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <MobileNav onOpenSearch={onOpenSearch} />

        <Link href="/" className="mr-6 flex items-center gap-2 font-bold">
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline">前端面试宝典</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
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
