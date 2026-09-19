import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LegacyRuntime } from "@/components/legacy-runtime";
import type { LegacySlug } from "@/lib/legacy-routes";

const novaLeadForm = `<form class="form-grid" data-lead-form data-source="NOVA CRM lead form">
<div class="form-group"><label>Họ và tên</label><input name="name" required autocomplete="name" placeholder="Tên của bạn"></div>
<div class="form-group"><label>Số điện thoại</label><input name="phone" required autocomplete="tel" placeholder="09xx xxx xxx"></div>
<div class="form-group full"><label>Email (không bắt buộc)</label><input type="email" name="email" autocomplete="email" placeholder="email@example.com"></div>
<div class="form-group"><label>Bộ môn quan tâm</label><select name="interest" required><option value="">Chọn bộ môn</option><option>Boxing</option><option>Strength Gym</option><option>Functional</option><option>HYROX</option><option>Cross Training</option><option>BJJ</option><option>Yoga</option><option>Aerobic / Zumba</option><option>Recovery</option><option>Tư vấn chung</option></select></div>
<div class="form-group"><label>Mục tiêu chính</label><select name="goal" required><option value="">Chọn mục tiêu</option><option>Học kỹ thuật Boxing</option><option>Tăng thể lực và sức bền</option><option>Giảm mỡ, cải thiện vóc dáng</option><option>Tăng sức mạnh</option><option>Chuẩn bị thi đấu</option><option>Giảm căng thẳng, duy trì thói quen</option><option>Cần tư vấn thêm</option></select></div>
<div class="form-group"><label>Kinh nghiệm tập luyện</label><select name="experienceLevel" required><option value="">Chọn mức kinh nghiệm</option><option>Chưa từng tập</option><option>Mới tập dưới 6 tháng</option><option>Đã tập 6–24 tháng</option><option>Đã tập trên 2 năm</option></select></div>
<div class="form-group"><label>Nhóm tuổi</label><select name="ageRange" required><option value="">Chọn nhóm tuổi</option><option>Dưới 18</option><option>18–24</option><option>25–34</option><option>35–44</option><option>45+</option></select></div>
<div class="form-group"><label>Khung giờ ưu tiên</label><select name="preferredTime"><option>Chưa chắc, cần tư vấn</option><option>06:00–10:00</option><option>10:00–16:00</option><option>16:00–19:00</option><option>19:00–22:00</option></select></div>
<div class="form-group"><label>Kênh liên hệ ưu tiên</label><select name="preferredContact" required><option value="">Chọn kênh liên hệ</option><option>Điện thoại</option><option>Zalo</option><option>Email</option></select></div>
<div class="form-group"><label>Bạn biết NOVA qua đâu?</label><select name="sourceChannel"><option value="">Không nhớ / không muốn trả lời</option><option>Facebook</option><option>Instagram</option><option>TikTok</option><option>Google</option><option>Bạn bè giới thiệu</option><option>Đi ngang qua CLB</option><option>Kênh khác</option></select></div>
<div class="form-group full"><label>Điều NOVA cần biết thêm</label><textarea name="note" placeholder="Chấn thương cũ, câu hỏi hoặc điều bạn muốn đội ngũ tư vấn lưu ý."></textarea></div>
<label class="check-row full"><input type="checkbox" name="policy" value="yes" required><span>Tôi đồng ý để NOVA xử lý thông tin nhằm tư vấn và vận hành yêu cầu của tôi theo <a class="text-lime" href="policies.html#privacy" target="_blank">chính sách quyền riêng tư</a>.</span></label>
<label class="check-row full"><input type="checkbox" name="marketing" value="yes"><span>Tôi đồng ý nhận tin về lớp, workshop và ưu đãi. Tôi có thể rút lại đồng ý bất kỳ lúc nào.</span></label>
<div class="form-group full"><button class="btn primary block" type="submit">Nhận tư vấn từ NOVA</button></div>
</form>`;

const applyNovaBrand = (content: string) => content
  .replaceAll("START YOUR HYPE.", "START YOUR ROUND.")
  .replaceAll("READY TO TURN IT UP?", "STRONGER EVERY ROUND.")
  .replaceAll("FOUR WAYS TO<br>TURN IT UP.", "FOUR WAYS TO<br>GET STRONGER.")
  .replaceAll("CHOOSE YOUR HYPE.", "CHOOSE YOUR PATH.")
  .replaceAll('href="mailto:hypetraininglab@gmail.com"', 'href="trial.html"')
  .replaceAll("https://www.google.com/maps?q=336%2F18%20Nguy%E1%BB%85n%20V%C4%83n%20Lu%C3%B4ng%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20L%C3%A2m%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed", "about:blank")
  .replaceAll("336/18 Nguyễn Văn Luông, Phường Phú Lâm, TP. Hồ Chí Minh", "Địa chỉ sẽ được cập nhật")
  .replaceAll("0909 995 702", "Hotline sẽ được cập nhật")
  .replaceAll("hypetraininglab@gmail.com", "Email sẽ được cập nhật")
  .replaceAll("HYPE Training Lab", "NOVA TRAINING LAB")
  .replaceAll("HYPER", "NOVA CREW")
  .replaceAll("HYPE", "NOVA")
  .replaceAll("Turn It Up", "Stronger Every Round")
  .replaceAll("TURN IT UP", "STRONGER EVERY ROUND");

export function readLegacyPage(slug: LegacySlug) {
  const html = readFileSync(join(process.cwd(), "src", "content", "templates", `${slug}.html`), "utf8");
  let main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const page = html.match(/<body data-page="([^"]+)"/)?.[1];

  if (!main || !title || !page) {
    throw new Error(`Không đọc được cấu trúc ${slug}.html`);
  }

  main = main
    .replaceAll("assets/video/hype-hero.mp4", "assets/video/nova-hero.mp4")
    .replaceAll("assets/images/boxing-bag.webp", "assets/images/nova/boxing-bag.jpg")
    .replaceAll("assets/images/boxing-blue.webp", "assets/images/nova/boxing-blue.jpg")
    .replaceAll("assets/images/boxing-class.webp", "assets/images/nova/boxing-class.jpg")
    .replaceAll("assets/images/boxing-coach.webp", "assets/images/nova/boxing-coach.jpg")
    .replaceAll("assets/images/boxing-drill.webp", "assets/images/nova/boxing-drill.jpg")
    .replaceAll("assets/images/boxing-power.webp", "assets/images/nova/boxing-power.jpg")
    .replaceAll("assets/images/boxing-team.webp", "assets/images/nova/boxing-team.jpg")
    .replaceAll("assets/images/boxing-technique.webp", "assets/images/nova/boxing-technique.png")
    .replaceAll("assets/images/coach-action.webp", "assets/images/nova/coach-action.jpg")
    .replaceAll("assets/images/conditioning-agility.webp", "assets/images/nova/hyrox-sled.jpg")
    .replaceAll("assets/images/conditioning-group.webp", "assets/images/nova/hyrox-event.jpg")
    .replaceAll("assets/images/conditioning-line.webp", "assets/images/nova/hyrox-ropes.jpg")
    .replaceAll("assets/images/conditioning-warmup.webp", "assets/images/nova/hyrox-race.png")
    .replaceAll("assets/images/community-champions.webp", "assets/images/nova/bjj-belt-quote.png")
    .replaceAll("assets/images/community-class.webp", "assets/images/nova/bjj-throw-blur.jpg")
    .replaceAll("assets/images/community-ring.webp", "assets/images/nova/bjj-takedown.jpg")
    .replaceAll("assets/images/community-wide.webp", "assets/images/nova/bjj-belt.jpg")
    .replaceAll("assets/images/groupx-coach.webp", "assets/images/nova/bjj-movement.jpg")
    .replaceAll("assets/images/groupx-woman.webp", "assets/images/nova/bjj-guard.jpg")
    .replace(/<section class="section dark-2"><div class="container split"><div class="split-media"><img src="assets\/images\/locker\.webp"[\s\S]*?<\/section>/g, "")
    .replace(/<a\b[^>]*\bhref="(?:location|shop|community)\.html"[^>]*>[\s\S]*?<\/a>/g, "")
    .replace(/(<a\b[^>]*\bclass="[^"]*\bbtn\b[^"]*"[^>]*\bhref=")(?:classes\.html|recovery\.html#booking)(">\s*(?:Đăng ký|Đặt)[^<]*<\/a>)/g, "$1trial.html$2")
    .replaceAll('href="classes.html">Đăng ký lớp mới</a>', 'href="trial.html">Đăng ký lớp mới</a>')
    .replaceAll('href="register.html">Tạo tài khoản My HYPE</a>', 'href="trial.html">Nhận tư vấn từ NOVA</a>')
    .replace(/<button data-dashboard-tab="events">[\s\S]*?<\/button>/g, "")
    .replace(/<section data-dashboard-panel="events"[^>]*>[\s\S]*?<\/section>/g, "");

  if (slug === "trial") {
    main = main.replace(/<form class="form-grid" data-lead-form[\s\S]*?<\/form>/, novaLeadForm);
    if (!main.includes('name="goal"')) throw new Error("Không thể gắn form lead NOVA");
  }

  return {
    main: applyNovaBrand(main),
    title: applyNovaBrand(title),
    description: description ? applyNovaBrand(description) : description,
    page,
  };
}

export function LegacyPage({ slug }: { slug: LegacySlug }) {
  const page = readLegacyPage(slug);

  return (
    <>
      <div data-site-header />
      <main dangerouslySetInnerHTML={{ __html: page.main }} />
      <div data-site-footer />
      <LegacyRuntime page={page.page} />
    </>
  );
}
