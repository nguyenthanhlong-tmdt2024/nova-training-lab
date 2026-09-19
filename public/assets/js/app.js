(() => {
  'use strict';

  const D = window.HYPE_DATA || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const store = {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
    del(key) { localStorage.removeItem(key); }
  };

  const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const pageName = () => document.body.dataset.page || 'home';
  const coachById = id => D.coaches?.find(coach => coach.id === id) || D.coaches?.[0];

  function seedDemoData() {
    if (localStorage.getItem('hype_demo_v2_seeded')) return;
    store.set('hype_leads', [
      {name:'Trần Minh Anh', phone:'0901 234 567', email:'minhanh@example.com', interest:'Boxing', source:'Form trải nghiệm', status:'Mới', createdAt:'2026-07-31T08:20:00'},
      {name:'Nguyễn Khánh Linh', phone:'0902 345 678', email:'khanhlinh@example.com', interest:'Yoga / GroupX', source:'Website', status:'Đã liên hệ', createdAt:'2026-07-30T11:10:00'},
      {name:'Lê Hoàng Duy', phone:'0903 456 789', email:'hoangduy@example.com', interest:'HYROX / Conditioning', source:'Lịch lớp', status:'Mới', createdAt:'2026-07-29T16:45:00'}
    ]);
    store.set('hype_bookings', [
      {classId:'bx-mon-0715', status:'confirmed', name:'Nguyễn Hyper', email:'hyper@demo.vn', phone:'0900 000 000', note:'', createdAt:'2026-07-31T07:30:00'},
      {classId:'hy-mon-1730', status:'waitlist', name:'Nguyễn Hyper', email:'hyper@demo.vn', phone:'0900 000 000', note:'', createdAt:'2026-07-31T07:35:00'}
    ]);
    store.set('hype_recovery_bookings', [
      {slotId:'rec-1700', status:'confirmed', name:'Nguyễn Hyper', email:'hyper@demo.vn', createdAt:'2026-07-31T07:40:00'}
    ]);
    store.set('hype_event_bookings', [
      {eventId:'run-club', status:'confirmed', name:'Nguyễn Hyper', email:'hyper@demo.vn', createdAt:'2026-07-31T07:45:00'}
    ]);
    store.set('hype_notifications', [
      {title:'Lớp Boxing đã được xác nhận', message:'03/08/2026 · 07:15–08:30 · Coach KID', date:'31/07/2026'},
      {title:'NOVA Run Club', message:'Bạn đã có tên trong danh sách 10K Base.', date:'31/07/2026'}
    ]);
    store.set('hype_demo_v2_seeded', true);
  }

  function headerHTML() {
    const page = pageName();
    const active = (...pages) => pages.includes(page) ? 'active' : '';
    return `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="NOVA TRAINING LAB">
            <img src="assets/images/nova-logo-full.svg" alt="NOVA TRAINING LAB">
          </a>
          <nav class="desktop-nav" aria-label="Điều hướng chính">
            <a class="${active('home')}" href="index.html">Trang chủ</a>
            <a class="${active('programs','boxing','boxing-basics','conditioning','gym','functional','hyrox','cross-training','bjj-groupx','bjj','yoga','groupx','recovery','rooftop')}" href="programs.html">Bộ môn</a>
            <a class="${active('classes')}" href="classes.html">Lịch lớp</a>
            <a class="${active('first-timers')}" href="first-timers.html">First Timers</a>
            <a class="${active('blog','article')}" href="blog.html">Journal</a>
          </nav>
          <div class="header-actions">
            <a class="btn ghost small" href="login.html" data-auth-link>Đăng nhập</a>
            <a class="btn primary small" href="trial.html">Bắt đầu</a>
            <button class="menu-toggle" aria-label="Mở menu" aria-expanded="false"><span></span></button>
          </div>
        </div>
      </header>
      <nav class="mobile-nav" aria-label="Điều hướng di động">
        <a href="index.html">Trang chủ</a>
        <a href="programs.html">Bộ môn</a>
        <a href="classes.html">Lịch lớp</a>
        <a href="first-timers.html">First Timers</a>
        <a href="about.html">Về NOVA</a>
        <a href="pricing.html">Gói tập</a>
        <a href="blog.html">NOVA Journal</a>
        <div class="mobile-actions">
          <a class="btn ghost" href="login.html" data-auth-link>Đăng nhập</a>
          <a class="btn primary" href="trial.html">Bắt đầu trải nghiệm</a>
        </div>
      </nav>`;
  }

  function footerHTML() {
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <img src="assets/images/nova-logo-full.svg" alt="NOVA TRAINING LAB">
              <p>Stronger Every Round — tiến bộ qua từng buổi tập, với coaching rõ ràng và một cộng đồng cùng giữ nhịp.</p>
            </div>
            <div class="footer-col">
              <h4>Train</h4>
              <a href="programs.html">Tất cả bộ môn</a>
              <a href="boxing.html">Boxing</a>
              <a href="conditioning.html">Strength & Conditioning</a>
              <a href="bjj-groupx.html">BJJ & GroupX</a>
              <a href="recovery.html">Recovery</a>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              <a href="classes.html">Lịch lớp</a>
              <a href="first-timers.html">First Timers</a>
              <a href="blog.html">NOVA Journal</a>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <a href="pricing.html">Gói tập</a>
              <a href="policies.html#membership">Chính sách hội viên</a>
              <a href="policies.html#classes">Đăng ký và hủy lớp</a>
              <a href="policies.html#privacy">Quyền riêng tư</a>
              <a href="trial.html">Nhận tư vấn</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2026 NOVA TRAINING LAB.</span>
            <span>${D.site.address} · ${D.site.hours}</span>
          </div>
        </div>
      </footer>`;
  }

  function injectChrome() {
    const header = $('[data-site-header]');
    const footer = $('[data-site-footer]');
    if (header) header.innerHTML = headerHTML();
    if (footer) footer.innerHTML = footerHTML();

    const user = store.get('hype_user');
    $$('[data-auth-link]').forEach(link => {
      if (user) {
        link.textContent = user.role === 'admin' ? 'Admin' : 'My NOVA';
        link.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
      }
    });

    const toggle = $('.menu-toggle');
    toggle?.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    $$('.mobile-nav a').forEach(link => link.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  function toast(title, message = '', type = 'ok', timeout = 4500) {
    let stack = $('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const node = document.createElement('div');
    node.className = `toast ${type === 'error' ? 'error' : ''}`;
    node.innerHTML = `<strong>${escapeHTML(title)}</strong>${message ? `<span>${escapeHTML(message)}</span>` : ''}`;
    stack.appendChild(node);
    setTimeout(() => node.remove(), timeout);
  }
  window.HYPEToast = toast;

  function cookieBanner() {
    if (store.get('hype_cookie_choice')) return;
    const banner = document.createElement('div');
    banner.className = 'cookie-banner show';
    banner.innerHTML = `
      <p>NOVA sử dụng cookie cần thiết để duy trì đăng nhập và ghi nhớ lựa chọn. Cookie phân tích hoặc marketing chỉ được bật khi bạn đồng ý. <a class="text-lime" href="policies.html#cookies">Xem chính sách cookie</a>.</p>
      <div class="cookie-actions">
        <button class="btn small" data-cookie="essential">Chỉ cookie cần thiết</button>
        <button class="btn primary small" data-cookie="all">Đồng ý tất cả</button>
      </div>`;
    document.body.appendChild(banner);
    $$('[data-cookie]', banner).forEach(button => button.addEventListener('click', () => {
      store.set('hype_cookie_choice', button.dataset.cookie);
      banner.remove();
      toast('Đã lưu lựa chọn cookie');
    }));
  }

  function notificationFab() {
    if (pageName() === 'admin') return;
    const button = document.createElement('button');
    button.className = 'notification-fab';
    button.title = 'Bật thông báo NOVA';
    button.setAttribute('aria-label', 'Bật thông báo NOVA');
    button.innerHTML = '<img src="assets/images/hype-icon.png" alt="">';
    button.addEventListener('click', async () => {
      if (!('Notification' in window)) {
        toast('Thiết bị chưa hỗ trợ thông báo', 'Bạn vẫn có thể xem thông tin trong My NOVA.', 'error');
        return;
      }
      try {
        const permission = await Notification.requestPermission();
        store.set('hype_push_permission', permission);
        if (permission === 'granted') {
          new Notification('NOVA TRAINING LAB', { body: 'Thông báo lịch lớp và sự kiện đã được bật.' });
          toast('Đã bật thông báo NOVA');
        } else {
          toast('Thông báo chưa được bật', 'Bạn có thể thay đổi quyền trong cài đặt trình duyệt.', 'error');
        }
      } catch {
        toast('Không thể bật thông báo', 'Hãy chạy website bằng localhost hoặc HTTPS.', 'error');
      }
    });
    document.body.appendChild(button);
  }

  function bindTabs() {
    $$('[data-tabs]').forEach(group => {
      const buttons = $$('[data-tab]', group);
      const panels = $$('[data-panel]', group);
      buttons.forEach(button => button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.toggle('active', item === button));
        panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === button.dataset.tab));
      }));
    });
  }

  function buildBoxingSchedule() {
    const mount = $('[data-boxing-schedule]');
    if (!mount) return;
    const keys = ['mon','tue','wed','thu','fri','sat','sun'];
    const labels = ['T2','T3','T4','T5','T6','T7','CN'];
    const rows = D.boxingSchedule.map(row => `
      <tr>
        <td>${row.time}</td>
        ${keys.map((key, index) => {
          if (key === 'sun') return '<td class="off">Coming Soon</td>';
          return row[key] ? `<td class="slot">✓${key === 'sat' ? `<span>${row.time}</span>` : ''}</td>` : '<td class="off">—</td>';
        }).join('')}
      </tr>`).join('');
    mount.innerHTML = `
      <div class="schedule-shell">
        <div class="schedule-scroll">
          <table class="schedule-table">
            <thead><tr><th>Giờ</th>${labels.map(label => `<th>${label}</th>`).join('')}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="schedule-note">
          <span>Thứ Bảy có hai lớp: 09:00–10:15 và 15:15–16:30. Lịch có thể được cập nhật theo vận hành thực tế.</span>
          <a class="btn primary small" href="trial.html">Đăng ký lớp</a>
        </div>
      </div>`;
  }

  function renderPrograms() {
    $$('[data-program-directory]').forEach(mount => {
      const limit = Number(mount.dataset.limit || D.programs.length);
      mount.innerHTML = D.programs.slice(0, limit).map(program => `
        <article class="program-row">
          <img src="${program.image}" alt="${escapeHTML(program.name)}">
          <div class="content">
            <span class="kicker">${escapeHTML(program.floor)} · ${escapeHTML(program.viName)}</span>
            <h3>${escapeHTML(program.name)}</h3>
            <p>${escapeHTML(program.summary)}</p>
            <a class="card-link" href="${program.page}">Xem bộ môn</a>
          </div>
        </article>`).join('');
    });
  }

  function getBookings() { return store.get('hype_bookings', []); }
  function setBookings(value) { store.set('hype_bookings', value); }
  function getRecoveryBookings() { return store.get('hype_recovery_bookings', []); }
  function setRecoveryBookings(value) { store.set('hype_recovery_bookings', value); }
  function getEventBookings() { return store.get('hype_event_bookings', []); }
  function setEventBookings(value) { store.set('hype_event_bookings', value); }

  function queueEmail(email, subject, detail) {
    const queue = store.get('hype_email_queue', []);
    queue.push({ email, subject, detail, status:'Đang chờ gửi', createdAt:new Date().toISOString() });
    store.set('hype_email_queue', queue);
  }

  function ensureModal() {
    let modal = $('#hype-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'hype-modal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-card"><button class="modal-close" type="button" aria-label="Đóng">×</button><div data-modal-content></div></div>';
    document.body.appendChild(modal);
    $('.modal-close', modal).addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', event => { if (event.target === modal) modal.classList.remove('open'); });
    return modal;
  }

  function openClassModal(classId) {
    const classItem = D.classes.find(item => item.id === classId);
    if (!classItem) return;
    const coach = coachById(classItem.coachId);
    const isFull = classItem.booked >= classItem.capacity;
    const user = store.get('hype_user', {});
    const modal = ensureModal();
    const content = $('[data-modal-content]', modal);
    content.innerHTML = `
      <div class="booking-layout">
        <aside class="coach-profile">
          <img src="${coach.image}" alt="${escapeHTML(coach.name)}">
          <div class="body">
            <span class="article-meta">Coach phụ trách</span>
            <h3>${escapeHTML(coach.name)}</h3>
            <p><strong>${escapeHTML(coach.specialty)}</strong></p>
            <p>${escapeHTML(coach.bio)}</p>
            <span class="kicker">${escapeHTML(coach.credentials)}</span>
          </div>
        </aside>
        <div>
          <span class="eyebrow">Đăng ký lớp</span>
          <h2 class="vi-title medium">${escapeHTML(classItem.format)}</h2>
          <p class="text-muted">${escapeHTML(classItem.note)}</p>
          <div class="booking-details">
            <div><span>Ngày và giờ</span><strong>${classItem.date} · ${classItem.time}</strong></div>
            <div><span>Khu vực</span><strong>${classItem.area}</strong></div>
            <div><span>Trình độ</span><strong>${classItem.level}</strong></div>
            <div><span>Sức chứa</span><strong>${classItem.booked}/${classItem.capacity} người</strong></div>
            <div><span>Trạng thái</span><strong class="${isFull ? 'text-muted' : 'text-lime'}">${isFull ? 'Hàng chờ' : `Còn ${classItem.capacity - classItem.booked} chỗ`}</strong></div>
          </div>
          <form class="form-grid" data-class-booking-form>
            <input type="hidden" name="classId" value="${classItem.id}">
            <div class="form-group"><label>Họ và tên</label><input name="name" required value="${escapeHTML(user.name || '')}" autocomplete="name"></div>
            <div class="form-group"><label>Số điện thoại</label><input name="phone" required value="${escapeHTML(user.phone || '')}" autocomplete="tel"></div>
            <div class="form-group full"><label>Email nhận xác nhận</label><input type="email" name="email" required value="${escapeHTML(user.email || '')}" autocomplete="email"></div>
            <div class="form-group full"><label>Ghi chú dành cho coach</label><textarea name="note" placeholder="Mục tiêu, chấn thương cũ hoặc yêu cầu cần coach lưu ý."></textarea></div>
            <label class="check-row full"><input type="checkbox" name="health" required><span>Tôi xác nhận đã khai báo trung thực tình trạng sức khỏe liên quan và sẽ tuân thủ hướng dẫn an toàn của coach.</span></label>
            <label class="check-row full"><input type="checkbox" name="policy" required><span>Tôi đồng ý với <a class="text-lime" href="policies.html#classes" target="_blank">quy định đăng ký, hủy lớp và hàng chờ</a> của NOVA.</span></label>
            <div class="form-group full"><button class="btn primary block" type="submit">${isFull ? 'Đăng ký hàng chờ' : 'Xác nhận đăng ký lớp'}</button></div>
          </form>
        </div>
      </div>`;
    modal.classList.add('open');

    $('[data-class-booking-form]', modal).addEventListener('submit', event => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
      const bookings = getBookings();
      if (bookings.some(booking => booking.classId === classItem.id && booking.email === formData.email)) {
        toast('Bạn đã đăng ký lớp này', 'Hãy kiểm tra trong My NOVA.', 'error');
        return;
      }
      const status = isFull ? 'waitlist' : 'confirmed';
      bookings.push({ classId:classItem.id, status, name:formData.name, phone:formData.phone, email:formData.email, note:formData.note || '', createdAt:new Date().toISOString() });
      setBookings(bookings);
      queueEmail(formData.email, status === 'waitlist' ? 'Xác nhận vào hàng chờ NOVA' : 'Xác nhận đăng ký lớp NOVA', `${classItem.format} · ${classItem.date} · ${classItem.time} · ${coach.name}`);
      modal.classList.remove('open');
      toast(status === 'waitlist' ? 'Đã vào hàng chờ' : 'Đăng ký lớp thành công', 'Email xác nhận demo đã được đưa vào hàng gửi.');
    });
  }

  function renderClasses() {
    const mount = $('[data-class-grid]');
    if (!mount) return;
    const programFilter = $('[data-filter-program]');
    const dayFilter = $('[data-filter-day]');
    const levelFilter = $('[data-filter-level]');
    const timeFilter = $('[data-filter-time]');

    if (programFilter && programFilter.options.length <= 1) {
      [...new Set(D.classes.map(item => item.program))].forEach(program => programFilter.insertAdjacentHTML('beforeend', `<option value="${program}">${program}</option>`));
    }

    const draw = () => {
      const items = D.classes.filter(item => {
        const timeHour = Number(item.time.slice(0,2));
        const timeMatch = !timeFilter?.value || (timeFilter.value === 'morning' && timeHour < 12) || (timeFilter.value === 'afternoon' && timeHour >= 12 && timeHour < 17) || (timeFilter.value === 'evening' && timeHour >= 17);
        return (!programFilter?.value || item.program === programFilter.value)
          && (!dayFilter?.value || item.day === dayFilter.value)
          && (!levelFilter?.value || item.level === levelFilter.value)
          && timeMatch;
      });
      mount.innerHTML = items.length ? items.map(item => {
        const coach = coachById(item.coachId);
        const isFull = item.booked >= item.capacity;
        const percent = Math.min(100, Math.round((item.booked / item.capacity) * 100));
        return `
          <article class="class-card">
            <div class="class-meta"><span>${item.day} · ${item.date}</span><span>${item.area}</span></div>
            <div><span class="article-meta">${item.program}</span><h3>${escapeHTML(item.format)}</h3></div>
            <p>${escapeHTML(item.note)}</p>
            <div class="coach-line">
              <img src="${coach.image}" alt="${escapeHTML(coach.name)}">
              <div><strong>${escapeHTML(coach.name)}</strong><span>${escapeHTML(coach.specialty)}</span></div>
            </div>
            <div class="capacity">
              <div class="capacity-row"><span>${item.time}</span><span>${isFull ? 'Đã đủ chỗ' : `Còn ${item.capacity - item.booked} chỗ`}</span></div>
              <div class="progress"><span style="width:${percent}%"></span></div>
            </div>
          <a class="btn ${isFull ? 'soft' : 'primary'} block" href="trial.html">${isFull ? 'Vào hàng chờ' : 'Đăng ký lớp'}</a>
          </article>`;
      }).join('') : '<p class="text-muted">Chưa có lớp phù hợp với bộ lọc này.</p>';
    };

    [programFilter, dayFilter, levelFilter, timeFilter].filter(Boolean).forEach(filter => filter.addEventListener('change', draw));
    draw();
  }

  function renderRecovery() {
    const mount = $('[data-recovery-slots]');
    if (!mount) return;
    mount.innerHTML = D.recoverySlots.map(slot => {
      const full = slot.booked >= slot.capacity;
      return `
        <article class="class-card">
          <div class="class-meta"><span>${slot.date}</span><span>Tầng trệt</span></div>
          <div><span class="article-meta">Recovery</span><h3>${slot.service}</h3></div>
          <p>${escapeHTML(slot.note)}</p>
          <div class="capacity"><div class="capacity-row"><span>${slot.time}</span><span>${slot.booked}/${slot.capacity} người</span></div><div class="progress"><span style="width:${Math.min(100, slot.booked/slot.capacity*100)}%"></span></div></div>
          <a class="btn ${full ? 'soft' : 'primary'} block" href="trial.html">${full ? 'Vào hàng chờ' : 'Đặt khung giờ'}</a>
        </article>`;
    }).join('');
  }

  function openRecoveryModal(slotId) {
    const slot = D.recoverySlots.find(item => item.id === slotId);
    if (!slot) return;
    const full = slot.booked >= slot.capacity;
    const user = store.get('hype_user', {});
    const modal = ensureModal();
    $('[data-modal-content]', modal).innerHTML = `
      <span class="eyebrow">Recovery Booking</span>
      <h2 class="vi-title medium">Đặt khung giờ ${slot.service}</h2>
      <div class="booking-details">
        <div><span>Ngày</span><strong>${slot.date}</strong></div>
        <div><span>Khung giờ</span><strong>${slot.time}</strong></div>
        <div><span>Sức chứa</span><strong>${slot.booked}/${slot.capacity} người</strong></div>
        <div><span>Trạng thái</span><strong>${full ? 'Hàng chờ' : `Còn ${slot.capacity - slot.booked} chỗ`}</strong></div>
      </div>
      <form class="form-grid" data-recovery-form>
        <div class="form-group"><label>Họ và tên</label><input name="name" required value="${escapeHTML(user.name || '')}"></div>
        <div class="form-group"><label>Số điện thoại</label><input name="phone" required value="${escapeHTML(user.phone || '')}"></div>
        <div class="form-group full"><label>Email nhận xác nhận</label><input type="email" name="email" required value="${escapeHTML(user.email || '')}"></div>
        <label class="check-row full"><input type="checkbox" required><span>Tôi đã đọc yêu cầu an toàn, không có chống chỉ định đã biết và sẽ thông báo ngay nếu cảm thấy bất thường.</span></label>
        <div class="form-group full"><button class="btn primary block" type="submit">${full ? 'Đăng ký hàng chờ' : 'Xác nhận khung giờ'}</button></div>
      </form>`;
    modal.classList.add('open');
    $('[data-recovery-form]', modal).addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      const bookings = getRecoveryBookings();
      bookings.push({slotId:slot.id, status:full ? 'waitlist' : 'confirmed', name:data.name, email:data.email, createdAt:new Date().toISOString()});
      setRecoveryBookings(bookings);
      queueEmail(data.email, 'Xác nhận Recovery tại NOVA', `${slot.service} · ${slot.date} · ${slot.time}`);
      modal.classList.remove('open');
      toast(full ? 'Đã vào hàng chờ Recovery' : 'Đã đặt khung giờ Recovery');
    });
  }

  function renderEvents() {
    const mount = $('[data-event-grid]');
    if (!mount) return;
    mount.innerHTML = D.events.map(event => {
      const full = event.booked >= event.capacity;
      return `
        <article class="card clean" id="${event.id}">
          <div class="card-media"><img src="${event.image}" alt="${escapeHTML(event.title)}"></div>
          <div class="card-body">
            <span class="article-meta">${event.type} · ${event.date} · ${event.time}</span>
            <h3 class="card-title">${escapeHTML(event.title)}</h3>
            <p>${escapeHTML(event.description)}</p>
            <div class="capacity-row"><span>${event.booked}/${event.capacity} người</span><span>${full ? 'Hàng chờ' : `Còn ${event.capacity - event.booked} chỗ`}</span></div>
            <a class="btn ${full ? 'soft' : 'primary'} block" href="trial.html">${full ? 'Vào hàng chờ' : 'Đăng ký hoạt động'}</a>
          </div>
        </article>`;
    }).join('');
  }

  function openEventModal(eventId) {
    const item = D.events.find(event => event.id === eventId);
    if (!item) return;
    const full = item.booked >= item.capacity;
    const user = store.get('hype_user', {});
    const modal = ensureModal();
    $('[data-modal-content]', modal).innerHTML = `
      <span class="eyebrow">NOVA CREW Community</span>
      <h2 class="vi-title medium">${escapeHTML(item.title)}</h2>
      <p class="lead">${escapeHTML(item.description)}</p>
      <div class="booking-details"><div><span>Thời gian</span><strong>${item.date} · ${item.time}</strong></div><div><span>Sức chứa</span><strong>${item.booked}/${item.capacity} người</strong></div></div>
      <form class="form-grid" data-event-form>
        <div class="form-group"><label>Họ và tên</label><input name="name" required value="${escapeHTML(user.name || '')}"></div>
        <div class="form-group"><label>Số điện thoại</label><input name="phone" required value="${escapeHTML(user.phone || '')}"></div>
        <div class="form-group full"><label>Email nhận xác nhận</label><input type="email" name="email" required value="${escapeHTML(user.email || '')}"></div>
        <div class="form-group full"><label>Ghi chú</label><textarea name="note" placeholder="Pace chạy, kinh nghiệm hoặc thông tin NOVA cần lưu ý."></textarea></div>
        <label class="check-row full"><input type="checkbox" required><span>Tôi đồng ý tuân thủ hướng dẫn an toàn và quy định của hoạt động.</span></label>
        <div class="form-group full"><button class="btn primary block" type="submit">${full ? 'Đăng ký hàng chờ' : 'Xác nhận đăng ký'}</button></div>
      </form>`;
    modal.classList.add('open');
    $('[data-event-form]', modal).addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      const bookings = getEventBookings();
      bookings.push({eventId:item.id, status:full ? 'waitlist' : 'confirmed', name:data.name, email:data.email, note:data.note || '', createdAt:new Date().toISOString()});
      setEventBookings(bookings);
      queueEmail(data.email, 'Xác nhận hoạt động NOVA CREW Community', `${item.title} · ${item.date} · ${item.time}`);
      modal.classList.remove('open');
      toast(full ? 'Đã vào hàng chờ' : 'Đăng ký hoạt động thành công');
    });
  }

  async function saveLead(data, source = 'Website', leadType = 'trial') {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          leadType,
          name:data.name || data.fullName || '',
          phone:data.phone || '',
          email:data.email || '',
          interest:data.interest || data.package || data.program || 'Tư vấn chung',
          preferredTime:data.preferredTime || '',
          goal:data.goal || '',
          experienceLevel:data.experienceLevel || '',
          ageRange:data.ageRange || '',
          preferredContact:data.preferredContact || '',
          sourceChannel:data.sourceChannel || '',
          note:data.note || '',
          source,
          policy:data.policy || data.contactConsent || false,
          marketing:data.marketing || false,
          website:data.website || ''
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  function bindLeadForms() {
    $$('[data-lead-form]').forEach(form => form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      const button = $('[type=submit]', form);
      if (button) button.disabled = true;
      const saved = await saveLead(data, form.dataset.source || location.pathname, 'trial');
      if (button) button.disabled = false;
      if (!saved) { toast('Không thể gửi thông tin', 'Vui lòng thử lại sau.', 'error'); return; }
      form.reset();
      toast('NOVA đã nhận thông tin', 'Đội ngũ NOVA sẽ liên hệ trong thời gian sớm nhất.');
    }));

    $$('[data-newsletter-form]').forEach(form => form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.email) return;
      const saved = await saveLead({email:data.email, interest:'Bản tin NOVA', policy:'yes', marketing:'yes'}, 'Blog newsletter', 'newsletter');
      if (!saved) { toast('Không thể đăng ký bản tin', 'Vui lòng thử lại sau.', 'error'); return; }
      form.reset();
      toast('Đã đăng ký nhận bản tin NOVA');
    }));
  }

  function bindLogin() {
    const form = $('[data-login-form]');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const registered = store.get('hype_registered_users', []);
      const accounts = [D.demoAccounts.admin, D.demoAccounts.member, ...registered];
      const user = accounts.find(account => account.email === data.email && account.password === data.password);
      if (!user) {
        toast('Không thể đăng nhập', 'Kiểm tra lại email và mật khẩu demo.', 'error');
        return;
      }
      store.set('hype_user', user);
      location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
    });
    $$('[data-social-login]').forEach(button => button.addEventListener('click', () => toast('Đăng nhập mạng xã hội đang ở chế độ demo', 'Khi triển khai thật cần kết nối Google hoặc Facebook OAuth.')));
  }

  function bindRegister() {
    const form = $('[data-register-form]');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.password !== data.passwordConfirm) {
        toast('Mật khẩu xác nhận chưa khớp', '', 'error');
        return;
      }
      const users = store.get('hype_registered_users', []);
      if (users.some(user => user.email === data.email)) {
        toast('Email này đã được đăng ký', '', 'error');
        return;
      }
      const user = {name:data.name, email:data.email, phone:data.phone, password:data.password, role:'member', memberId:'Chờ kích hoạt', activated:false, package:'Chưa đối soát'};
      users.push(user);
      store.set('hype_registered_users', users);
      queueEmail(data.email, 'Kích hoạt tài khoản My NOVA', 'Mã kích hoạt demo: 2026. Khi vận hành thật, liên kết kích hoạt sẽ được gửi qua email đã đăng ký với NOVA.');
      store.set('hype_pending_activation', data.email);
      location.href = 'activate.html';
    });
  }

  function bindActivation() {
    const form = $('[data-activation-form]');
    if (!form) return;
    const emailInput = $('[name=email]', form);
    if (emailInput && !emailInput.value) emailInput.value = store.get('hype_pending_activation', '');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.code !== '2026') {
        toast('Mã kích hoạt chưa đúng', 'Mã demo là 2026.', 'error');
        return;
      }
      const users = store.get('hype_registered_users', []);
      const index = users.findIndex(user => user.email === data.email);
      if (index < 0) {
        toast('Không tìm thấy tài khoản', '', 'error');
        return;
      }
      users[index] = {...users[index], activated:true, memberId:`HYP-${String(Date.now()).slice(-4)}`, package:'Chờ NOVA đối soát'};
      store.set('hype_registered_users', users);
      store.set('hype_user', users[index]);
      queueEmail(data.email, 'Tài khoản My NOVA đã được kích hoạt', 'Bạn có thể xem lịch, quyền lợi và đăng ký lớp trên My NOVA.');
      location.href = 'dashboard.html';
    });
  }

  function requireUser(role = null) {
    const user = store.get('hype_user');
    if (!user || (role && user.role !== role)) {
      location.href = 'login.html';
      return null;
    }
    return user;
  }

  function dashboardInit() {
    if (pageName() !== 'dashboard') return;
    const user = requireUser();
    if (!user) return;
    $('[data-user-name]').textContent = user.name;
    $('[data-user-id]').textContent = user.memberId || 'Chờ kích hoạt';
    $('[data-package-name]')?.replaceChildren(document.createTextNode(user.package || 'Chưa đối soát'));
    if (!user.activated) $('[data-activation-warning]').hidden = false;

    const bookings = getBookings();
    const recovery = getRecoveryBookings();
    const events = getEventBookings();
    $('[data-booking-count]').textContent = bookings.filter(item => item.status === 'confirmed').length;
    $('[data-recovery-count]').textContent = recovery.filter(item => item.status === 'confirmed').length;
    $('[data-event-count]').textContent = events.filter(item => item.status === 'confirmed').length;

    const classRows = bookings.length ? bookings.map(booking => {
      const classItem = D.classes.find(item => item.id === booking.classId);
      const coach = classItem ? coachById(classItem.coachId) : null;
      return classItem ? `<tr><td>${classItem.date}</td><td>${classItem.time}</td><td>${classItem.format}</td><td>${coach?.name || ''}</td><td><span class="status-pill ${booking.status === 'waitlist' ? 'full' : 'open'}">${booking.status === 'waitlist' ? 'Hàng chờ' : 'Đã xác nhận'}</span></td><td><button class="btn danger small" data-cancel-class="${booking.classId}">Hủy</button></td></tr>` : '';
    }).join('') : '<tr><td colspan="6">Chưa có lớp nào. <a class="text-lime" href="classes.html">Xem lịch lớp</a>.</td></tr>';
    $$('[data-my-classes]').forEach(mount => mount.innerHTML = classRows);

    $$('[data-cancel-class]').forEach(button => button.addEventListener('click', () => {
      const classItem = D.classes.find(item => item.id === button.dataset.cancelClass);
      setBookings(getBookings().filter(item => item.classId !== button.dataset.cancelClass));
      queueEmail(user.email, 'Xác nhận hủy lớp NOVA', `${classItem?.format || ''} · ${classItem?.date || ''}`);
      toast('Đã hủy đăng ký lớp', 'Email xác nhận demo đã được đưa vào hàng gửi.');
      location.reload();
    }));

    const recoveryMount = $('[data-my-recovery]');
    if (recoveryMount) recoveryMount.innerHTML = recovery.length ? recovery.map(booking => {
      const slot = D.recoverySlots.find(item => item.id === booking.slotId);
      return slot ? `<tr><td>${slot.date}</td><td>${slot.time}</td><td>${slot.service}</td><td>${booking.status === 'waitlist' ? 'Hàng chờ' : 'Đã xác nhận'}</td><td><button class="btn danger small" data-cancel-recovery="${booking.slotId}">Hủy</button></td></tr>` : '';
    }).join('') : '<tr><td colspan="5">Chưa đặt Recovery.</td></tr>';

    $$('[data-cancel-recovery]').forEach(button => button.addEventListener('click', () => {
      setRecoveryBookings(getRecoveryBookings().filter(item => item.slotId !== button.dataset.cancelRecovery));
      toast('Đã hủy lịch Recovery');
      location.reload();
    }));

    const eventMount = $('[data-my-events]');
    if (eventMount) eventMount.innerHTML = events.length ? events.map(booking => {
      const event = D.events.find(item => item.id === booking.eventId);
      return event ? `<tr><td>${event.date}</td><td>${event.title}</td><td>${event.type}</td><td>${booking.status === 'waitlist' ? 'Hàng chờ' : 'Đã xác nhận'}</td></tr>` : '';
    }).join('') : '<tr><td colspan="4">Chưa đăng ký hoạt động cộng đồng.</td></tr>';

    const notices = store.get('hype_notifications', []);
    const noticeMount = $('[data-member-notices]');
    if (noticeMount) noticeMount.innerHTML = [
      {title:'Quyền lợi hội viên', message:'Bạn còn 17/24 buổi Boxing và 6/8 Recovery Credits trong chu kỳ demo.'},
      {title:'Sắp đến cuối chu kỳ', message:'Hãy sắp lịch để sử dụng đầy đủ số buổi và quyền lợi còn lại.'},
      ...notices
    ].slice(0, 6).map(notice => `<div class="notice"><strong>${escapeHTML(notice.title)}</strong><p>${escapeHTML(notice.message || notice.date || '')}</p></div>`).join('');

    $$('[data-dashboard-tab]').forEach(button => button.addEventListener('click', () => {
      $$('[data-dashboard-tab]').forEach(item => item.classList.toggle('active', item === button));
      $$('[data-dashboard-panel]').forEach(panel => panel.hidden = panel.dataset.dashboardPanel !== button.dataset.dashboardTab);
    }));
    $('[data-logout]')?.addEventListener('click', () => { store.del('hype_user'); location.href = 'index.html'; });
  }

  function adminInit() {
    if (pageName() !== 'admin') return;
    const user = requireUser('admin');
    if (!user) return;
    $('[data-admin-name]').textContent = user.name;
    const leads = store.get('hype_leads', []);
    const members = [D.demoAccounts.member, ...store.get('hype_registered_users', [])];
    const emails = store.get('hype_email_queue', []);
    $('[data-admin-leads]').textContent = leads.length;
    $('[data-admin-members]').textContent = members.length;
    $('[data-admin-bookings]').textContent = getBookings().length;
    $('[data-admin-emails]').textContent = emails.length;

    const leadTable = $('[data-lead-table]');
    if (leadTable) leadTable.innerHTML = leads.length ? leads.map(lead => `<tr><td>${escapeHTML(lead.name || '')}</td><td>${escapeHTML(lead.phone || '')}</td><td>${escapeHTML(lead.email || '')}</td><td>${escapeHTML(lead.interest || '')}</td><td>${escapeHTML(lead.source || '')}</td><td><span class="status-pill open">${escapeHTML(lead.status || 'Mới')}</span></td></tr>`).join('') : '<tr><td colspan="6">Chưa có lead trong trình duyệt này.</td></tr>';

    const memberTable = $('[data-member-table]');
    if (memberTable) memberTable.innerHTML = members.map(member => `<tr><td>${escapeHTML(member.name)}</td><td>${escapeHTML(member.email)}</td><td>${escapeHTML(member.memberId || 'Chờ kích hoạt')}</td><td>${escapeHTML(member.package || 'Boxing Athlete')}</td><td><span class="status-pill ${member.activated ? 'open' : 'full'}">${member.activated ? 'Đang hoạt động' : 'Chờ kích hoạt'}</span></td></tr>`).join('');

    const classTable = $('[data-admin-class-table]');
    if (classTable) classTable.innerHTML = D.classes.map(classItem => {
      const coach = coachById(classItem.coachId);
      return `<tr><td>${classItem.date}</td><td>${classItem.time}</td><td>${classItem.format}</td><td>${coach.name}</td><td>${classItem.booked}/${classItem.capacity}</td><td>${classItem.booked >= classItem.capacity ? 'Hàng chờ' : 'Còn chỗ'}</td></tr>`;
    }).join('');

    const emailTable = $('[data-email-table]');
    if (emailTable) emailTable.innerHTML = emails.length ? emails.slice().reverse().map(email => `<tr><td>${escapeHTML(email.email)}</td><td>${escapeHTML(email.subject)}</td><td>${escapeHTML(email.detail)}</td><td>${escapeHTML(email.status)}</td></tr>`).join('') : '<tr><td colspan="4">Chưa có email demo trong hàng gửi.</td></tr>';

    $$('[data-admin-tab]').forEach(button => button.addEventListener('click', () => {
      $$('[data-admin-tab]').forEach(item => item.classList.toggle('active', item === button));
      $$('[data-admin-panel]').forEach(panel => panel.hidden = panel.dataset.adminPanel !== button.dataset.adminTab);
    }));
    $('[data-admin-logout]')?.addEventListener('click', () => { store.del('hype_user'); location.href = 'index.html'; });
    $('[data-export-leads]')?.addEventListener('click', () => exportCSV('hype-leads.csv', leads));
    $('[data-export-members]')?.addEventListener('click', () => exportCSV('hype-members.csv', members));

    $$('[data-save-content]').forEach(button => button.addEventListener('click', () => {
      const card = button.closest('.editor-card');
      const key = button.dataset.saveContent;
      const fields = Object.fromEntries($$('input,textarea,select', card).map(input => [input.name, input.value]));
      const content = store.get('hype_admin_content', {});
      content[key] = fields;
      store.set('hype_admin_content', content);
      toast('Đã lưu nội dung demo', 'Thay đổi được lưu trong trình duyệt.');
    }));

    $$('[data-media-input]').forEach(input => input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const image = $('img', input.closest('.editor-card'));
      if (image) image.src = URL.createObjectURL(file);
      toast('Đã xem trước hình ảnh', 'Để lưu thật cần kết nối kho media và backend.');
    }));

    $('[data-send-broadcast]')?.addEventListener('click', () => {
      const subject = $('[name=broadcast_subject]')?.value;
      const body = $('[name=broadcast_body]')?.value;
      if (!subject || !body) { toast('Chưa đủ nội dung', '', 'error'); return; }
      members.forEach(member => queueEmail(member.email, subject, body));
      toast('Đã tạo chiến dịch email demo', `${members.length} người nhận được đưa vào hàng gửi.`);
      location.reload();
    });
  }

  function exportCSV(filename, rows) {
    if (!rows.length) { toast('Không có dữ liệu để xuất', '', 'error'); return; }
    const keys = [...new Set(rows.flatMap(row => Object.keys(row)))];
    const csv = [keys.join(','), ...rows.map(row => keys.map(key => `"${String(row[key] ?? '').replaceAll('"','""')}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8'}));
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function renderPricing() {
    $$('[data-pricing-grid]').forEach(mount => {
      mount.innerHTML = D.packages.map(item => `
        <article class="price-card ${item.featured ? 'featured' : ''}">
          ${item.featured ? '<span class="tag">Được chọn nhiều</span>' : ''}
          <span class="kicker">${escapeHTML(item.name)}</span>
          <div class="price">${escapeHTML(item.price)} <small>${escapeHTML(item.unit)}</small></div>
          <p class="text-muted">${escapeHTML(item.note)}</p>
          <ul class="price-features">
            <li>${typeof item.sessions === 'number' ? `<strong>${item.sessions}</strong> buổi tập trong tháng` : `<strong>${escapeHTML(item.sessions)}</strong>`}</li>
            <li>${typeof item.recovery === 'number' ? `<strong>${item.recovery}</strong> lượt Recovery` : `<strong>${escapeHTML(item.recovery)}</strong>`}</li>
            <li>Coach-led class và hỗ trợ lịch tập</li>
          </ul>
          <a class="btn primary block" href="trial.html?package=${item.id}">Nhận tư vấn gói</a>
        </article>`).join('');
    });
  }

  function renderShop() {
    const mount = $('[data-product-grid]');
    if (!mount) return;
    const limit = Number(mount.dataset.limit || D.products.length);
    mount.innerHTML = D.products.slice(0, limit).map(product => `
      <article class="product-card">
        <img src="${product.image}" alt="${escapeHTML(product.name)}">
        <div class="body">
          <span class="article-meta">${escapeHTML(product.category)}</span>
          <h3>${escapeHTML(product.name)}</h3>
          <div class="product-price">${escapeHTML(product.price)}</div>
          <p>${escapeHTML(product.note)}</p>
          <a class="btn small block" href="trial.html?product=${product.id}">Nhận tư vấn sản phẩm</a>
        </div>
      </article>`).join('');
  }

  async function publishedPosts() {
    try {
      const response = await fetch('/api/posts', {cache:'no-store'});
      if (response.ok) return await response.json();
    } catch {}
    return D.posts || [];
  }

  async function renderBlog() {
    const posts = await publishedPosts();
    $$('[data-blog-grid]').forEach(mount => {
      const limit = Number(mount.dataset.limit || posts.length);
      mount.innerHTML = posts.slice(0, limit).map(post => `
        <article class="article-card">
          <img src="${post.image}" alt="${escapeHTML(post.title)}">
          <div class="body">
            <span class="article-meta">${escapeHTML(post.category)} · ${post.date}</span>
            <h3>${escapeHTML(post.title)}</h3>
            <p>${escapeHTML(post.excerpt)}</p>
            <a class="card-link" href="article.html?post=${post.slug}">Đọc bài</a>
          </div>
        </article>`).join('');
    });
  }

  async function renderArticle() {
    if (pageName() !== 'article') return;
    const posts = await publishedPosts();
    const slug = new URLSearchParams(location.search).get('post') || posts[0].slug;
    const post = posts.find(item => item.slug === slug) || posts[0];
    $('[data-article-title]').textContent = post.title;
    $('[data-article-meta]').textContent = `${post.category} · ${post.date}`;
    $('[data-article-image]').src = post.image;
    $('[data-article-image]').alt = post.title;
    $('[data-article-excerpt]').textContent = post.excerpt;
    const content = $('[data-article-sections]');
    if (content) content.innerHTML = post.sections.map(section => `<h2>${escapeHTML(section.title)}</h2><p>${escapeHTML(section.body)}</p>`).join('');
    const related = $('[data-related-posts]');
    if (related) related.innerHTML = posts.filter(item => item.slug !== post.slug).slice(0, 4).map(item => `<a href="article.html?post=${item.slug}">${escapeHTML(item.title)}</a>`).join('');
  }

  function renderMarquee() {
    $$('[data-image-marquee]').forEach(mount => {
      const images = (mount.dataset.images || 'boxing-power,boxing-team,community-wide,recovery-green,conditioning-warmup,groupx-woman').split(',').map(item => item.trim());
      const sequence = [...images, ...images];
      mount.innerHTML = `<div class="image-track">${sequence.map(name => `<img src="assets/images/${name}.webp" alt="NOVA TRAINING LAB">`).join('')}</div>`;
    });
  }

  function bindDemoButtons() {
    $$('[data-demo-action]').forEach(button => button.addEventListener('click', () => toast(button.dataset.demoTitle || 'Tính năng đang ở chế độ demo', button.dataset.demoMessage || 'Khi triển khai thật, tính năng này sẽ được kết nối với backend.')));
    $$('[data-logout]').forEach(button => button.addEventListener('click', () => { store.del('hype_user'); location.href = 'index.html'; }));
  }

  function init() {
    seedDemoData();
    injectChrome();
    cookieBanner();
    notificationFab();
    bindTabs();
    buildBoxingSchedule();
    renderPrograms();
    renderClasses();
    renderRecovery();
    renderEvents();
    bindLeadForms();
    bindLogin();
    bindRegister();
    bindActivation();
    dashboardInit();
    adminInit();
    renderPricing();
    renderShop();
    renderBlog();
    renderArticle();
    renderMarquee();
    bindDemoButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
