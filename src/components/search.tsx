"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DifficultyBadge } from "@/components/difficulty-badge";
import type { Difficulty } from "@/types";

interface SearchItem {
  title: string;
  description: string;
  category: string;
  slug: string;
  difficulty: Difficulty;
  categoryName: string;
}

export function SearchCommand({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
}) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = useCallback(
    (category: string, slug: string) => {
      onOpenChange(false);
      router.push(`/${category}/${slug}`);
    },
    [router, onOpenChange]
  );

  const grouped = items.reduce<Record<string, SearchItem[]>>((acc, item) => {
    const key = item.categoryName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="搜索面试题..." />
      <CommandList>
        <CommandEmpty>没有找到相关内容</CommandEmpty>
        {Object.entries(grouped).map(([categoryName, categoryItems]) => (
          <CommandGroup key={categoryName} heading={categoryName}>
            {categoryItems.map((item) => (
              <CommandItem
                key={`${item.category}-${item.slug}`}
                value={`${item.title} ${item.description}`}
                onSelect={() => handleSelect(item.category, item.slug)}
              >
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <DifficultyBadge difficulty={item.difficulty} />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
