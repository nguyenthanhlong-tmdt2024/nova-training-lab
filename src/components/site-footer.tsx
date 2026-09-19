export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/images/nova-logo-full.svg" alt="NOVA TRAINING LAB" />
            <p>Stronger Every Round — tiến bộ qua từng buổi tập, với coaching rõ ràng và một cộng đồng cùng giữ nhịp.</p>
          </div>
          <div className="footer-col">
            <h4>Train</h4>
            <a href="programs.html">Tất cả bộ môn</a>
            <a href="boxing.html">Boxing</a>
            <a href="conditioning.html">Strength &amp; Conditioning</a>
            <a href="bjj-groupx.html">BJJ &amp; GroupX</a>
            <a href="recovery.html">Recovery</a>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="classes.html">Lịch lớp</a>
            <a href="first-timers.html">First Timers</a>
            <a href="blog.html">NOVA Journal</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="pricing.html">Gói tập</a>
            <a href="policies.html#membership">Chính sách hội viên</a>
            <a href="policies.html#classes">Đăng ký và hủy lớp</a>
            <a href="policies.html#privacy">Quyền riêng tư</a>
            <a href="trial.html">Nhận tư vấn</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NOVA TRAINING LAB.</span>
          <span>Địa chỉ và giờ hoạt động sẽ được cập nhật.</span>
        </div>
      </div>
    </footer>
  );
}
