import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientLayout } from "@/components/client-layout";
import { Footer } from "@/components/layout/footer";
import { getAllPosts, getCategoryMeta } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "前端面试宝典 - 资深/高级前端工程师面试准备",
    template: "%s | 前端面试宝典",
  },
  description:
    "面向资深/高级前端工程师的面试准备资料，涵盖 JavaScript、TypeScript、React、Vue、CSS、工程化、性能优化、网络安全、浏览器原理、算法与系统设计。",
  keywords: [
    "前端面试",
    "高级前端",
    "JavaScript",
    "React",
    "TypeScript",
    "面试题",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPosts = getAllPosts();
  const searchItems = allPosts.map((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    category: post.category,
    slug: post.slug,
    difficulty: post.frontmatter.difficulty,
    categoryName: getCategoryMeta(post.category)?.name ?? post.category,
  }));

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <ClientLayout searchItems={searchItems}>
              <main className="flex-1">{children}</main>
            </ClientLayout>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
