import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";

const consent = z.union([z.boolean(), z.string()]).transform((value) =>
  value === true || value === "yes" || value === "true",
);

const leadSchema = z.object({
  leadType: z.enum(["trial", "consultation", "contact", "newsletter"]).default("trial"),
  name: z.string().max(120).optional().default(""),
  email: z.union([z.string().email().max(254), z.literal("")]).optional().default(""),
  phone: z.string().max(30).optional().default(""),
  interest: z.string().max(120).optional().default("Tư vấn chung"),
  preferredTime: z.string().max(120).optional().default(""),
  goal: z.string().max(120).optional().default(""),
  experienceLevel: z.string().max(80).optional().default(""),
  ageRange: z.string().max(40).optional().default(""),
  preferredContact: z.string().max(40).optional().default(""),
  sourceChannel: z.string().max(80).optional().default(""),
  note: z.string().max(1500).optional().default(""),
  source: z.string().max(300).optional().default("Website"),
  policy: consent.optional().default(false),
  marketing: consent.optional().default(false),
  website: z.string().max(200).optional().default(""),
}).superRefine((lead, context) => {
  if (!lead.email && !lead.phone) context.addIssue({ code: "custom", message: "Thiếu thông tin liên hệ" });
  if (lead.leadType !== "newsletter" && !lead.policy) context.addIssue({ code: "custom", message: "Thiếu đồng ý xử lý dữ liệu" });
});

// ponytail: in-memory limiter is per process; replace with shared Redis/edge limit at multi-instance deploy.
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Chưa cấu hình dữ liệu" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const rate = attempts.get(ip);
  if (rate && rate.resetAt > now && rate.count >= 5) {
    return NextResponse.json({ error: "Vui lòng thử lại sau" }, { status: 429, headers: { "Retry-After": "600" } });
  }
  attempts.set(ip, rate && rate.resetAt > now ? { ...rate, count: rate.count + 1 } : { count: 1, resetAt: now + 600_000 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 202 });

  const { url, key } = getSupabaseEnv();
  const supabase = createSupabaseClient(url, key, { auth: { persistSession: false } });
  // ponytail: keep CRM qualifiers in the existing note field until the final CRM/schema is chosen.
  const note = `Mục tiêu: ${parsed.data.goal}\nKinh nghiệm: ${parsed.data.experienceLevel}\nNhóm tuổi: ${parsed.data.ageRange}\nKênh liên hệ: ${parsed.data.preferredContact}\nNguồn biết đến: ${parsed.data.sourceChannel}\nGhi chú: ${parsed.data.note}`.slice(0, 2000);
  const { error } = await supabase.rpc("submit_lead", {
    p_lead_type: parsed.data.leadType,
    p_full_name: parsed.data.name,
    p_email: parsed.data.email,
    p_phone: parsed.data.phone,
    p_interest: parsed.data.interest,
    p_preferred_time: parsed.data.preferredTime,
    p_note: note,
    p_source_path: parsed.data.source,
    p_marketing_consent: parsed.data.marketing,
  });

  if (error) return NextResponse.json({ error: "Không thể lưu thông tin" }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
