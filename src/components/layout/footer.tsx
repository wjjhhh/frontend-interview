import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>前端面试宝典</span>
          </div>
          <p className="text-sm text-muted-foreground">
            专为资深/高级前端工程师打造的面试准备资料
          </p>
        </div>
      </div>
    </footer>
  );
}
