"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { parsePostContent } from "@/lib/blog-content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

const leadSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "closed", "spam"]),
});

const sessionSchema = z.object({
  sessionId: z.string().min(1).max(100),
  status: z.enum(["scheduled", "cancelled", "completed"]),
  capacity: z.coerce.number().int().min(1).max(500),
});

const postSchema = z.object({
  id: z.union([z.string().uuid(), z.literal("")]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  category: z.string().min(2).max(80),
  title: z.string().min(3).max(180),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20).max(20000),
  heroImagePath: z.string().regex(/^\/assets\/images\/[a-zA-Z0-9_./-]+$/),
  authorName: z.string().min(2).max(120),
  status: z.enum(["draft", "published", "archived"]),
});

export async function loginAdmin(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/login?error=invalid");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) redirect("/admin/login?error=credentials");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,status")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateLeadStatus(formData: FormData) {
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin?tab=leads&error=invalid");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("admin_update_lead_status", {
    p_lead_id: parsed.data.leadId,
    p_status: parsed.data.status,
  });
  if (error) redirect("/admin?tab=leads&error=save");
  revalidatePath("/admin");
  redirect("/admin?tab=leads&saved=1");
}

export async function updateClassSession(formData: FormData) {
  const parsed = sessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin?tab=classes&error=invalid");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("admin_update_class_session", {
    p_session_id: parsed.data.sessionId,
    p_status: parsed.data.status,
    p_capacity: parsed.data.capacity,
  });
  if (error) redirect("/admin?tab=classes&error=save");
  revalidatePath("/admin");
  redirect("/admin?tab=classes&saved=1");
}

export async function saveBlogPost(formData: FormData) {
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || parsePostContent(parsed.data.content).length === 0) {
    redirect("/admin?tab=content&error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("admin_save_blog_post", {
    p_id: parsed.data.id || null,
    p_slug: parsed.data.slug,
    p_category: parsed.data.category,
    p_title: parsed.data.title,
    p_excerpt: parsed.data.excerpt,
    p_content: parsed.data.content,
    p_hero_image_path: parsed.data.heroImagePath,
    p_author_name: parsed.data.authorName,
    p_status: parsed.data.status,
  });
  if (error) redirect("/admin?tab=content&error=save");

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/article");
  redirect("/admin?tab=content&saved=1");
}
