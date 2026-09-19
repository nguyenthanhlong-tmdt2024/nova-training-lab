import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { requireAdmin } from "@/lib/admin";
import {
  logoutAdmin,
  saveBlogPost,
  updateClassSession,
  updateLeadStatus,
} from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin | NOVA TRAINING LAB" };

type Tab = "overview" | "leads" | "classes" | "content" | "audit";
type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  interest: string;
  source_path: string;
  status: LeadStatus;
  created_at: string;
};
type Session = {
  id: string;
  program: string;
  format: string;
  starts_at: string;
  capacity: number;
  status: "scheduled" | "cancelled" | "completed";
  coach_id: string;
};
type Coach = { id: string; name: string };
type Booking = { session_id: string; status: string };
type Post = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  hero_image_path: string;
  author_name: string;
  status: "draft" | "published" | "archived";
  updated_at: string;
};
type Audit = {
  id: number;
  action: string;
  target_table: string;
  target_id: string;
  created_at: string;
};
type Kpi = {
  new_leads_30d: number;
  conversion_rate: number;
  bookings_30d: number;
  average_occupancy: number;
};

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Tổng quan" },
  { id: "leads", label: "Lead" },
  { id: "classes", label: "Lớp" },
  { id: "content", label: "Nội dung" },
  { id: "audit", label: "Nhật ký" },
];

const leadLabels: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  closed: "Đã chốt",
  spam: "Spam",
};

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

function formatDate(input: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(input));
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const requestedTab = value(query.tab);
  const tab: Tab = tabs.some((item) => item.id === requestedTab) ? (requestedTab as Tab) : "overview";
  const leadFilter = value(query.status);
  const { supabase, profile } = await requireAdmin();

  let leadsQuery = supabase
    .from("leads")
    .select("id,full_name,phone,email,interest,source_path,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (leadFilter && Object.hasOwn(leadLabels, leadFilter)) leadsQuery = leadsQuery.eq("status", leadFilter);

  const [kpiResult, leadsResult, sessionsResult, coachesResult, bookingsResult, postsResult, auditResult] =
    await Promise.all([
      supabase.rpc("admin_kpis"),
      leadsQuery,
      supabase.from("class_sessions").select("id,program,format,starts_at,capacity,status,coach_id").order("starts_at").limit(100),
      supabase.from("coaches").select("id,name"),
      supabase.from("bookings").select("session_id,status").neq("status", "cancelled"),
      supabase.from("blog_posts").select("id,slug,category,title,excerpt,content,hero_image_path,author_name,status,updated_at").order("updated_at", { ascending: false }).limit(100),
      supabase.from("admin_audit_logs").select("id,action,target_table,target_id,created_at").order("created_at", { ascending: false }).limit(25),
    ]);

  if ([kpiResult, leadsResult, sessionsResult, coachesResult, bookingsResult, postsResult, auditResult].some((result) => result.error)) {
    throw new Error("Không tải được dữ liệu admin");
  }

  const kpi = ((kpiResult.data?.[0] || {}) as Kpi);
  const leads = (leadsResult.data || []) as Lead[];
  const sessions = (sessionsResult.data || []) as Session[];
  const coaches = (coachesResult.data || []) as Coach[];
  const bookings = (bookingsResult.data || []) as Booking[];
  const posts = (postsResult.data || []) as Post[];
  const audits = (auditResult.data || []) as Audit[];
  const coachNames = new Map(coaches.map((coach) => [coach.id, coach.name]));
  const bookingCounts = new Map<string, number>();
  bookings.forEach((booking) => bookingCounts.set(booking.session_id, (bookingCounts.get(booking.session_id) || 0) + 1));
  const editPost = posts.find((post) => post.id === value(query.edit));
  const saved = value(query.saved) === "1";
  const hasError = Boolean(value(query.error));

  return (
    <>
      <SiteChrome active="none" authHref="/admin" authLabel="Admin" showNotification={false} />
      <main>
        <section className="dashboard">
          <aside className="dashboard-sidebar">
            <div className="dashboard-user">
              <strong>{profile.full_name || "NOVA Admin"}</strong>
              <span>Admin production</span>
            </div>
            <nav className="dashboard-nav" aria-label="Quản trị">
              {tabs.map((item) => (
                <Link key={item.id} className={tab === item.id ? "active" : undefined} href={`/admin?tab=${item.id}`}>
                  {item.label}
                </Link>
              ))}
              <form action={logoutAdmin}><button type="submit">Đăng xuất</button></form>
            </nav>
          </aside>
          <div className="dashboard-main">
            <div className="dashboard-top">
              <div><span className="eyebrow">ADMIN STUDIO</span><h1 className="en-title">NOVA CONTROL CENTER.</h1></div>
              <a className="btn" href="index.html">Xem website</a>
            </div>

            {saved && <p className="form-message" role="status">Đã lưu thay đổi.</p>}
            {hasError && <p className="form-message error" role="alert">Không thể lưu. Kiểm tra dữ liệu và thử lại.</p>}

            {tab === "overview" && (
              <section>
                <div className="metric-grid">
                  <div className="metric"><div className="value">{Number(kpi.new_leads_30d || 0)}</div><span>Lead mới / 30 ngày</span></div>
                  <div className="metric"><div className="value">{Number(kpi.conversion_rate || 0)}%</div><span>Tỷ lệ chốt lead</span></div>
                  <div className="metric"><div className="value">{Number(kpi.bookings_30d || 0)}</div><span>Booking / 30 ngày</span></div>
                  <div className="metric"><div className="value">{Number(kpi.average_occupancy || 0)}%</div><span>Lấp đầy lớp TB</span></div>
                </div>
                <div className="panel-grid">
                  <div className="panel">
                    <div className="panel-head"><h3>Việc cần xử lý</h3></div>
                    <div className="notice-list">
                      <div className="notice"><strong>{leads.filter((lead) => lead.status === "new").length} lead mới</strong><p>Liên hệ và cập nhật trạng thái tại tab Lead.</p></div>
                      <div className="notice"><strong>{posts.filter((post) => post.status === "draft").length} bài nháp</strong><p>Kiểm tra trước khi publish lên NOVA Journal.</p></div>
                      <div className="notice"><strong>{sessions.filter((session) => session.status === "scheduled").length} lớp đang lên lịch</strong><p>Capacity và trạng thái được quản lý tại tab Lớp.</p></div>
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-head"><h3>Định nghĩa KPI</h3></div>
                    <div className="notice-list">
                      <div className="notice"><strong>Tỷ lệ chốt</strong><p>Lead “Đã chốt” / tất cả lead không phải spam trong 30 ngày.</p></div>
                      <div className="notice"><strong>Lấp đầy lớp</strong><p>Booking confirmed hoặc attended / capacity của lớp trong 30 ngày.</p></div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {tab === "leads" && (
              <section className="panel">
                <div className="panel-head">
                  <h3>Dữ liệu lead</h3>
                  <form method="get"><input type="hidden" name="tab" value="leads" /><select name="status" defaultValue={leadFilter || ""} aria-label="Lọc trạng thái lead"><option value="">Tất cả trạng thái</option>{Object.entries(leadLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="btn small" type="submit">Lọc</button></form>
                </div>
                <div className="data-table-wrap">
                  <table className="data-table"><thead><tr><th>Ngày</th><th>Tên</th><th>Liên hệ</th><th>Quan tâm</th><th>Nguồn</th><th>Trạng thái</th></tr></thead>
                    <tbody>{leads.length ? leads.map((lead) => <tr key={lead.id}><td>{formatDate(lead.created_at)}</td><td>{lead.full_name || "—"}</td><td>{lead.phone}<br />{lead.email}</td><td>{lead.interest}</td><td>{lead.source_path || "—"}</td><td><form className="admin-inline-form" action={updateLeadStatus}><input type="hidden" name="leadId" value={lead.id} /><select name="status" defaultValue={lead.status} aria-label={`Trạng thái ${lead.full_name || lead.email}`}>{Object.entries(leadLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="btn small" type="submit">Lưu</button></form></td></tr>) : <tr><td colSpan={6}>Chưa có lead.</td></tr>}</tbody>
                  </table>
                </div>
              </section>
            )}

            {tab === "classes" && (
              <section className="panel">
                <div className="panel-head"><h3>Lớp, coach và sức chứa</h3></div>
                <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Ngày giờ</th><th>Lớp</th><th>Coach</th><th>Đã đặt</th><th>Capacity / trạng thái</th></tr></thead><tbody>
                  {sessions.map((session) => <tr key={session.id}><td>{formatDate(session.starts_at)}</td><td>{session.program}<br /><strong>{session.format}</strong></td><td>{coachNames.get(session.coach_id) || "—"}</td><td>{bookingCounts.get(session.id) || 0}/{session.capacity}</td><td><form className="admin-inline-form" action={updateClassSession}><input type="hidden" name="sessionId" value={session.id} /><input aria-label={`Capacity ${session.format}`} name="capacity" type="number" min={1} max={500} defaultValue={session.capacity} /><select aria-label={`Trạng thái ${session.format}`} name="status" defaultValue={session.status}><option value="scheduled">Đang lên lịch</option><option value="completed">Hoàn thành</option><option value="cancelled">Đã hủy</option></select><button className="btn small" type="submit">Lưu</button></form></td></tr>)}
                </tbody></table></div>
              </section>
            )}

            {tab === "content" && (
              <section className="admin-layout">
                <form className="editor-card" action={saveBlogPost}>
                  <h4>{editPost ? "Chỉnh sửa bài viết" : "Bài viết mới"}</h4>
                  <input type="hidden" name="id" value={editPost?.id || ""} />
                  <div className="form-group"><label htmlFor="post-slug">Slug</label><input id="post-slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={editPost?.slug || ""} /></div>
                  <div className="form-group"><label htmlFor="post-category">Chuyên mục</label><input id="post-category" name="category" required defaultValue={editPost?.category || "Training"} /></div>
                  <div className="form-group"><label htmlFor="post-title">Tiêu đề</label><input id="post-title" name="title" required maxLength={180} defaultValue={editPost?.title || ""} /></div>
                  <div className="form-group"><label htmlFor="post-excerpt">Mô tả ngắn</label><textarea id="post-excerpt" name="excerpt" required maxLength={500} defaultValue={editPost?.excerpt || ""} /></div>
                  <div className="form-group"><label htmlFor="post-image">Đường dẫn ảnh đã duyệt</label><input id="post-image" name="heroImagePath" required defaultValue={editPost?.hero_image_path || "/assets/images/nova/boxing-drill.jpg"} /></div>
                  <div className="form-group"><label htmlFor="post-author">Tác giả</label><input id="post-author" name="authorName" required defaultValue={editPost?.author_name || "NOVA TRAINING LAB"} /></div>
                  <div className="form-group"><label htmlFor="post-content">Nội dung</label><textarea id="post-content" name="content" rows={16} required defaultValue={editPost?.content || "## Tiêu đề phần\nNội dung phần."} /><p className="form-note">Mỗi phần bắt đầu bằng “## Tiêu đề”, sau đó là nội dung.</p></div>
                  <div className="form-group"><label htmlFor="post-status">Trạng thái</label><select id="post-status" name="status" defaultValue={editPost?.status || "draft"}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option><option value="archived">Lưu trữ</option></select></div>
                  <button className="btn primary small" type="submit">Lưu bài viết</button>
                  {editPost && <Link className="btn small" href="/admin?tab=content">Tạo bài mới</Link>}
                </form>
                <div className="panel">
                  <div className="panel-head"><h3>NOVA Journal</h3></div>
                  <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Bài viết</th><th>Trạng thái</th><th>Cập nhật</th><th></th></tr></thead><tbody>{posts.map((post) => <tr key={post.id}><td><strong>{post.title}</strong><br />/{post.slug}</td><td><span className={`status-pill ${post.status === "published" ? "open" : ""}`}>{post.status}</span></td><td>{formatDate(post.updated_at)}</td><td><Link className="card-link" href={`/admin?tab=content&edit=${post.id}`}>Sửa</Link></td></tr>)}</tbody></table></div>
                </div>
              </section>
            )}

            {tab === "audit" && (
              <section className="panel"><div className="panel-head"><h3>Nhật ký thay đổi</h3></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Thời gian</th><th>Hành động</th><th>Đối tượng</th><th>ID</th></tr></thead><tbody>{audits.length ? audits.map((audit) => <tr key={audit.id}><td>{formatDate(audit.created_at)}</td><td>{audit.action}</td><td>{audit.target_table}</td><td>{audit.target_id}</td></tr>) : <tr><td colSpan={4}>Chưa có thay đổi được ghi nhận.</td></tr>}</tbody></table></div></section>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
