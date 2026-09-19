import { NextResponse } from "next/server";
import { parsePostContent } from "@/lib/blog-content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type PublishedPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  hero_image_path: string;
  published_at: string;
};

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Chưa cấu hình dữ liệu" }, { status: 503 });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug,category,title,excerpt,content,hero_image_path,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "Không thể tải bài viết" }, { status: 500 });
  const formatter = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const posts = ((data || []) as PublishedPost[]).map((post) => ({
    slug: post.slug,
    category: post.category,
    title: post.title,
    excerpt: post.excerpt,
    image: post.hero_image_path,
    date: formatter.format(new Date(post.published_at)),
    sections: parsePostContent(post.content),
  }));
  return NextResponse.json(posts, { headers: { "Cache-Control": "no-store" } });
}
