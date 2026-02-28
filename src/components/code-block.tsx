import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export async function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  return (
    <div className="relative my-4 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-xs text-muted-foreground">
        <span>{language}</span>
      </div>
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
