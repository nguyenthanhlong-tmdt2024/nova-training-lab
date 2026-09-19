import type { Metadata } from "next";
import "../admin.css";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { loginAdmin } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Admin Login | NOVA TRAINING LAB" };

const errors: Record<string, string> = {
  config: "Chưa có cấu hình Supabase. Điền hai biến trong .env.local trước khi đăng nhập.",
  invalid: "Email hoặc mật khẩu không hợp lệ.",
  credentials: "Email hoặc mật khẩu không đúng.",
  forbidden: "Tài khoản này không có quyền admin.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <>
      <SiteChrome active="none" showNotification={false} />
      <main>
        <section className="hero medium">
          <div className="hero-media">
            <img src="/assets/images/nova/boxing-power.jpg" alt="NOVA TRAINING LAB" />
          </div>
          <div className="container hero-content">
            <div className="hero-copy">
              <span className="eyebrow">ADMIN STUDIO</span>
              <h1 className="page-title">NOVA CONTROL CENTER.</h1>
              <p className="lead">Đăng nhập để quản lý nội dung và dữ liệu vận hành.</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container narrow">
            <div className="form-panel">
              <h2 className="en-title">ADMIN LOGIN.</h2>
              {(error || !configured) && (
                <p className="form-message error" role="alert">
                  {errors[error || "config"] || errors.invalid}
                </p>
              )}
              <form className="form-grid" action={loginAdmin}>
                <div className="form-group full">
                  <label htmlFor="admin-email">Email</label>
                  <input id="admin-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="form-group full">
                  <label htmlFor="admin-password">Mật khẩu</label>
                  <input id="admin-password" name="password" type="password" required minLength={8} autoComplete="current-password" />
                </div>
                <div className="form-group full">
                  <button className="btn primary block" type="submit" disabled={!configured}>Đăng nhập admin</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
