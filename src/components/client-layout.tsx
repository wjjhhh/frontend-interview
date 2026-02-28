"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { SearchCommand } from "@/components/search";
import type { Difficulty } from "@/types";

interface SearchItem {
  title: string;
  description: string;
  category: string;
  slug: string;
  difficulty: Difficulty;
  categoryName: string;
}

export function ClientLayout({
  children,
  searchItems,
}: {
  children: React.ReactNode;
  searchItems: SearchItem[];
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Header onOpenSearch={() => setSearchOpen(true)} />
      {children}
      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={searchItems}
      />
    </>
  );
}
