import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/types";

const difficultyConfig: Record<Difficulty, { variant: "default" | "secondary" | "destructive"; label: string }> = {
  "初级": { variant: "secondary", label: "初级" },
  "中级": { variant: "default", label: "中级" },
  "高级": { variant: "destructive", label: "高级" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty] ?? difficultyConfig["中级"];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
