import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=config");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,status")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  return { supabase, profile };
}
