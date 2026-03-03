import React from "react";
import { codeToHtml } from "shiki";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createHeading(level: number) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return function Heading({ children }: { children?: React.ReactNode }) {
    const text = typeof children === "string" ? children : "";
    const id = slugify(text);
    return (
      <Tag id={id} className="scroll-mt-20 group">
        {children}
        <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground">
          #
        </a>
      </Tag>
    );
  };
}

async function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactElement<{ children?: string; className?: string }> }) {
  const codeEl = children;
  if (!codeEl || typeof codeEl !== "object" || !("props" in codeEl)) {
    return <pre {...props}>{children}</pre>;
  }

  const code = (codeEl.props.children as string)?.trim() ?? "";
  const className = codeEl.props.className ?? "";
  const langMatch = className.match(/language-(\w+)/);
  const language = langMatch ? langMatch[1] : "text";

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

function Blockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote className="my-4 border-l-4 border-primary/50 bg-muted/50 py-2 pl-4 italic">
      {children}
    </blockquote>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  pre: Pre as unknown as React.ComponentType<React.HTMLAttributes<HTMLPreElement>>,
  blockquote: Blockquote,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-primary underline underline-offset-4 hover:text-primary/80" target={href?.startsWith("http") ? "_blank" : undefined}>
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="transition-colors hover:bg-muted/30">{children}</tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-muted-foreground">{children}</td>
  ),
};
