import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

const posts = [
  {
    slug: "vao-nhip-boxing",
    date: "31/07/2026",
    category: "Training",
    title: "Vào nhịp Boxing mà không bị quá tải",
    excerpt: "Cách phân bổ kỹ thuật, conditioning và recovery trong tuần đầu tại NOVA.",
    image: "/assets/images/nova/boxing-drill.jpg",
  },
  {
    slug: "recovery-la-ky-luat",
    date: "28/07/2026",
    category: "Recovery",
    title: "Recovery không phải nghỉ — đó là một phần của kỷ luật",
    excerpt: "Khi nào nên ngâm đá, sauna và cách theo dõi phản ứng của cơ thể.",
    image: "/assets/images/recovery-action.webp",
  },
  {
    slug: "hyper-community",
    date: "25/07/2026",
    category: "Community",
    title: "Một cộng đồng mạnh được xây từ những buổi tập đều",
    excerpt: "Workshop, run club và thử thách nội bộ giúp cộng đồng NOVA tiến xa hơn cùng nhau.",
    image: "/assets/images/nova/bjj-throw-blur.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteChrome />
    <main>
      <section className="hero home-hero">
        <div className="hero-media">
          <video autoPlay muted loop playsInline poster="/assets/images/hero-action.webp">
            <source src="/assets/video/nova-hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container hero-content">
          <div className="hero-copy home-hero-copy">
            <div className="hero-badge">
              <span className="bolt-badge"><img src="/assets/images/hype-bolt-black.png" alt="" /></span>
              NOVA TRAINING LAB
            </div>
            <h1 className="page-title home-title">STRONGER<br />EVERY ROUND.</h1>
            <p className="lead">Boxing, Strength, Functional, HYROX, Cross Training, BJJ, GroupX và Recovery — cùng một hệ thống coaching rõ ràng để bạn tiến bộ qua từng buổi tập.</p>
            <div className="cta-row">
              <a className="btn primary" href="trial.html">Bắt đầu trải nghiệm</a>
              <a className="btn ghost" href="programs.html">Khám phá bộ môn</a>
            </div>
          </div>
        </div>
        <div className="hero-rail" aria-hidden="true">
          <span>BOXING</span><span>STRENGTH</span><span>CONDITIONING</span><span>RECOVERY</span>
        </div>
      </section>

      <section className="home-action-bar">
        <div className="container home-action-grid">
          <a href="classes.html"><span className="action-index">01</span><strong>Xem lịch lớp</strong><small>Coach, số chỗ và khung giờ</small></a>
          <a href="first-timers.html"><span className="action-index">02</span><strong>First Timers</strong><small>Bắt đầu rõ ràng, không áp lực</small></a>
        </div>
      </section>

      <section className="section home-intro-section">
        <div className="container">
          <div className="section-head home-section-head">
            <div>
              <span className="eyebrow">ONE LAB. MANY DISCIPLINES.</span>
              <h2 className="en-title">CHOOSE THE WAY<br />YOU WANT TO GROW.</h2>
            </div>
            <p className="lead">NOVA TRAINING LAB kết nối nhiều bộ môn trong một hệ thống tập luyện. Chọn mục tiêu, chọn bộ môn và xây lộ trình phù hợp với thể trạng, lịch sống và định hướng của bạn.</p>
          </div>
          <div className="route-grid">
            <a className="route-card route-card-large" href="boxing.html">
              <img src="/assets/images/nova/boxing-power.jpg" alt="Boxing tại NOVA" />
              <div className="route-overlay"><span>FIGHT</span><h3>BOXING</h3><p>Kỹ thuật, phản xạ, sức bền và bản lĩnh.</p><b>Xem Boxing →</b></div>
            </a>
            <a className="route-card" href="conditioning.html">
              <img src="/assets/images/nova/hyrox-ropes.jpg" alt="Strength và Conditioning tại NOVA" />
              <div className="route-overlay"><span>BUILD</span><h3>STRENGTH &amp; CONDITIONING</h3><p>Sức mạnh nền tảng, functional fitness và race prep.</p><b>Xem chương trình →</b></div>
            </a>
            <a className="route-card" href="bjj-groupx.html">
              <img src="/assets/images/nova/bjj-guard.jpg" alt="BJJ và GroupX tại NOVA" />
              <div className="route-overlay"><span>MOVE</span><h3>BJJ &amp; GROUPX</h3><p>Kỹ năng, mobility, nhịp điệu và kiểm soát cơ thể.</p><b>Khám phá tầng 2 →</b></div>
            </a>
            <a className="route-card route-card-wide" href="recovery.html">
              <img src="/assets/images/recovery-green.webp" alt="Recovery tại NOVA" />
              <div className="route-overlay"><span>RESET</span><h3>RECOVERY</h3><p>Ice bath, sauna và một không gian để cơ thể trở lại đúng nhịp.</p><b>Xem Recovery →</b></div>
            </a>
          </div>
          <div className="cta-row home-directory-cta">
            <a className="btn primary" href="programs.html">Xem toàn bộ bộ môn</a>
            <a className="btn" href="pricing.html">Xem gói tập</a>
          </div>
        </div>
      </section>

      <section className="section dark-2 system-section">
        <div className="container">
          <div className="section-head home-section-head">
            <div><span className="eyebrow">THE NOVA SYSTEM</span><h2 className="en-title">NOT RANDOM.<br />BUILT TO PROGRESS.</h2></div>
            <p className="lead">Một trải nghiệm tập luyện tốt phải giúp bạn biết hôm nay làm gì, vì sao làm và bước tiếp theo là gì.</p>
          </div>
          <div className="system-grid">
            <article className="system-card"><span>01</span><h3>COACH-LED</h3><p>Mỗi lớp có coach phụ trách, hướng dẫn kỹ thuật và điều chỉnh cường độ theo trình độ.</p></article>
            <article className="system-card"><span>02</span><h3>MEASURABLE</h3><p>Lịch lớp, số buổi, quyền lợi và tiến trình được trình bày rõ trong My NOVA.</p></article>
            <article className="system-card"><span>03</span><h3>RECOVERY-INTEGRATED</h3><p>Phục hồi là một phần của hệ thống, không phải lựa chọn thêm sau khi đã quá tải.</p></article>
            <article className="system-card"><span>04</span><h3>COMMUNITY-DRIVEN</h3><p>Workshop, run club, thử thách và thi đấu giúp bạn giữ nhịp lâu hơn.</p></article>
          </div>
        </div>
      </section>

      <section className="section first-timer-feature">
        <div className="container feature-editorial">
          <div className="feature-editorial-media"><img src="/assets/images/warmup.webp" alt="Người mới tập tại NOVA" /></div>
          <div className="feature-editorial-copy">
            <span className="eyebrow">FIRST TIMERS</span>
            <h2 className="en-title">YOU DO NOT NEED<br />TO BE READY.</h2>
            <p className="lead">Buổi đầu không phải bài kiểm tra. Bạn sẽ gặp coach, hiểu không gian, chọn đúng lớp và bắt đầu ở mức phù hợp.</p>
            <div className="mini-steps">
              <span><b>01</b>Đến sớm 15 phút</span>
              <span><b>02</b>Trao đổi mục tiêu</span>
              <span><b>03</b>Tập đúng trình độ</span>
            </div>
            <a className="btn primary" href="first-timers.html">Xem hướng dẫn First Timers</a>
          </div>
        </div>
      </section>

      <section className="section journal-home">
        <div className="container">
          <div className="section-head home-section-head"><div><span className="eyebrow">NOVA JOURNAL</span><h2 className="en-title">KNOW MORE.<br />TRAIN BETTER.</h2></div><p className="lead">Kiến thức ngắn gọn về tập luyện, phục hồi, người mới và văn hóa NOVA.</p></div>
          <div className="blog-grid">
            {posts.map((post) => (
              <article className="article-card" key={post.slug}>
                <img src={post.image} alt={post.title} />
                <div className="body">
                  <span className="article-meta">{post.category} · {post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <a className="card-link" href={`article.html?post=${post.slug}`}>Đọc bài</a>
                </div>
              </article>
            ))}
          </div>
          <div className="cta-row home-directory-cta"><a className="btn" href="blog.html">Xem tất cả bài viết</a></div>
        </div>
      </section>

      <section className="section compact home-final-cta">
        <div className="container">
          <div className="callout callout-premium">
            <div><span className="eyebrow">STRONGER EVERY ROUND</span><h2 className="en-title">YOUR NEXT LEVEL<br />STARTS WITH ONE SESSION.</h2><p>Để lại thông tin. NOVA sẽ tư vấn bộ môn, lịch lớp và bước khởi đầu phù hợp.</p></div>
            <a className="btn primary" href="trial.html">Đăng ký trải nghiệm</a>
          </div>
        </div>
      </section>
    </main>
      <SiteFooter />
    </>
  );
}
