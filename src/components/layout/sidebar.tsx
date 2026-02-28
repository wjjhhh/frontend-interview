"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface SidebarItem {
  slug: string;
  name: string;
  icon: string;
  postCount: number;
}

export function Sidebar({ categories }: { categories: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r lg:block">
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-6">
        <div className="px-4">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            面试分类
          </h2>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] ?? Braces;
              const isActive = pathname.startsWith(`/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    isActive && "bg-accent font-medium"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.postCount}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
