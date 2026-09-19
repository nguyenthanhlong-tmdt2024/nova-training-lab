"use client";

import { useEffect, useState } from "react";

type Toast = { title: string; message?: string; error?: boolean };
type ActiveNav = "home" | "programs" | "classes" | "first-timers" | "blog" | "none";

export function SiteChrome({
  active = "home",
  authHref = "login.html",
  authLabel = "Đăng nhập",
  showNotification = true,
}: {
  active?: ActiveNav;
  authHref?: string;
  authLabel?: string;
  showNotification?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowCookie(!localStorage.getItem("hype_cookie_choice"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function chooseCookie(choice: "essential" | "all") {
    localStorage.setItem("hype_cookie_choice", JSON.stringify(choice));
    setShowCookie(false);
    setToast({ title: "Đã lưu lựa chọn cookie" });
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setToast({
        title: "Thiết bị chưa hỗ trợ thông báo",
        message: "Bạn vẫn có thể xem thông tin trong My NOVA.",
        error: true,
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("NOVA TRAINING LAB", {
          body: "Thông báo lịch lớp và sự kiện đã được bật.",
        });
        setToast({ title: "Đã bật thông báo NOVA" });
      } else {
        setToast({
          title: "Thông báo chưa được bật",
          message: "Bạn có thể thay đổi quyền trong cài đặt trình duyệt.",
          error: true,
        });
      }
    } catch {
      setToast({
        title: "Không thể bật thông báo",
        message: "Hãy chạy website bằng localhost hoặc HTTPS.",
        error: true,
      });
    }
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="index.html" aria-label="NOVA TRAINING LAB">
            <img src="/assets/images/nova-logo-full.svg" alt="NOVA TRAINING LAB" />
          </a>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <a className={active === "home" ? "active" : undefined} href="index.html">Trang chủ</a>
            <a className={active === "programs" ? "active" : undefined} href="programs.html">Bộ môn</a>
            <a className={active === "classes" ? "active" : undefined} href="classes.html">Lịch lớp</a>
            <a className={active === "first-timers" ? "active" : undefined} href="first-timers.html">First Timers</a>
            <a className={active === "blog" ? "active" : undefined} href="blog.html">Journal</a>
          </nav>
          <div className="header-actions">
            <a className="btn ghost small" href={authHref}>{authLabel}</a>
            <a className="btn primary small" href="trial.html">Bắt đầu</a>
            <button
              className="menu-toggle"
              aria-label="Mở menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Điều hướng di động">
        <a href="index.html" onClick={closeMenu}>Trang chủ</a>
        <a href="programs.html" onClick={closeMenu}>Bộ môn</a>
        <a href="classes.html" onClick={closeMenu}>Lịch lớp</a>
        <a href="first-timers.html" onClick={closeMenu}>First Timers</a>
        <a href="about.html" onClick={closeMenu}>Về NOVA</a>
        <a href="pricing.html" onClick={closeMenu}>Gói tập</a>
        <a href="blog.html" onClick={closeMenu}>NOVA Journal</a>
        <div className="mobile-actions">
          <a className="btn ghost" href={authHref}>{authLabel}</a>
          <a className="btn primary" href="trial.html">Bắt đầu trải nghiệm</a>
        </div>
      </nav>

      {showCookie && (
        <div className="cookie-banner show">
          <p>
            NOVA sử dụng cookie cần thiết để duy trì đăng nhập và ghi nhớ lựa chọn.
            Cookie phân tích hoặc marketing chỉ được bật khi bạn đồng ý. {" "}
            <a className="text-lime" href="policies.html#cookies">Xem chính sách cookie</a>.
          </p>
          <div className="cookie-actions">
            <button className="btn small" onClick={() => chooseCookie("essential")}>Chỉ cookie cần thiết</button>
            <button className="btn primary small" onClick={() => chooseCookie("all")}>Đồng ý tất cả</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-stack" role="status" aria-live="polite">
          <div className={`toast${toast.error ? " error" : ""}`}>
            <strong>{toast.title}</strong>
            {toast.message && <span>{toast.message}</span>}
          </div>
        </div>
      )}

      {showNotification && (
        <button
          className="notification-fab"
          title="Bật thông báo NOVA"
          aria-label="Bật thông báo NOVA"
          onClick={enableNotifications}
        >
          <img src="/assets/images/hype-icon.png" alt="" />
        </button>
      )}
    </>
  );
}
