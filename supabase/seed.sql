-- Local-only admin account: admin@hypetraininglab.vn / TurnItUp2026
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-4111-8111-111111111111',
  'authenticated', 'authenticated', 'admin@hypetraininglab.vn',
  crypt('TurnItUp2026', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"name":"HYPE Admin"}', now(), now(),
  '', '', '', ''
);

insert into auth.identities (
  provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id
) values (
  '11111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '{"sub":"11111111-1111-4111-8111-111111111111","email":"admin@hypetraininglab.vn"}',
  'email', now(), now(), now(), gen_random_uuid()
);

update public.profiles
set role = 'admin', status = 'active', full_name = 'HYPE Admin'
where id = '11111111-1111-4111-8111-111111111111';

insert into public.coaches (id, name, specialty, image_path) values
  ('kid', 'Coach Rodel Orais (KID)', 'Boxing Technique & Padwork', '/assets/images/boxing-coach.webp'),
  ('minh', 'Coach Minh', 'Strength, HYROX & Conditioning', '/assets/images/conditioning-agility.webp'),
  ('linh', 'Coach Linh', 'Yoga, Mobility & GroupX', '/assets/images/groupx-woman.webp'),
  ('bjjteam', 'HYPE BJJ Coach Team', 'BJJ Fundamentals', '/assets/images/community-ring.webp'),
  ('team', 'HYPE Coach Team', 'Open Training Support', '/assets/images/boxing-team.webp');

insert into public.class_sessions
  (id, program, format, coach_id, starts_at, ends_at, floor, level, capacity)
values
  ('bx-mon-0715','Boxing','Boxing Fundamentals','kid','2026-08-03 07:15+07','2026-08-03 08:30+07','Tầng 1','Mọi trình độ',24),
  ('fn-mon-1200','Functional','Express Conditioning','minh','2026-08-03 12:00+07','2026-08-03 12:50+07','Tầng trệt','Mọi trình độ',18),
  ('hy-mon-1730','HYROX','Engine & Sled','minh','2026-08-03 17:30+07','2026-08-03 18:30+07','Tầng trệt','Trung cấp',16),
  ('bx-mon-1900','Boxing','Boxing Conditioning','kid','2026-08-03 19:00+07','2026-08-03 20:15+07','Tầng 1','Mọi trình độ',24),
  ('yg-tue-0630','Yoga','Morning Flow','linh','2026-08-04 06:30+07','2026-08-04 07:30+07','Tầng 2','Mọi trình độ',20),
  ('bx-tue-0900','Boxing','Technique & Bagwork','kid','2026-08-04 09:00+07','2026-08-04 10:15+07','Tầng 1','Mọi trình độ',24),
  ('bjj-tue-1800','BJJ','BJJ Fundamentals','bjjteam','2026-08-04 18:00+07','2026-08-04 19:15+07','Tầng 2','Người mới',18),
  ('zx-tue-1930','Zumba','Zumba Energy','linh','2026-08-04 19:30+07','2026-08-04 20:30+07','Tầng 2','Mọi trình độ',24),
  ('fn-wed-0600','Functional','Strength Base','minh','2026-08-05 06:00+07','2026-08-05 07:00+07','Tầng trệt','Mọi trình độ',18),
  ('bx-wed-0715','Boxing','Boxing Fundamentals','kid','2026-08-05 07:15+07','2026-08-05 08:30+07','Tầng 1','Mọi trình độ',24),
  ('cf-wed-1900','Cross Training','Power & Capacity','minh','2026-08-05 19:00+07','2026-08-05 20:00+07','Tầng trệt','Trung cấp',16),
  ('aer-thu-1730','Aerobic','Cardio Rhythm','linh','2026-08-06 17:30+07','2026-08-06 18:30+07','Tầng 2','Mọi trình độ',24),
  ('bjj-thu-1930','BJJ','BJJ All Levels','bjjteam','2026-08-06 19:30+07','2026-08-06 20:45+07','Tầng 2','Mọi trình độ',18),
  ('roof-fri-0600','Rooftop','Sunrise Conditioning','minh','2026-08-07 06:00+07','2026-08-07 07:00+07','Tầng 3','Mọi trình độ',20),
  ('bx-fri-1900','Boxing','Fight Night Skills','kid','2026-08-07 19:00+07','2026-08-07 20:15+07','Tầng 1','Trung cấp',24),
  ('bx-sat-0900','Boxing','Weekend Boxing','kid','2026-08-08 09:00+07','2026-08-08 10:15+07','Tầng 1','Mọi trình độ',24),
  ('bx-sat-1515','Boxing','Weekend Boxing','kid','2026-08-08 15:15+07','2026-08-08 16:30+07','Tầng 1','Mọi trình độ',24),
  ('roof-sat-1700','Rooftop','Outdoor Team Session','team','2026-08-08 17:00+07','2026-08-08 18:00+07','Tầng 3','Mọi trình độ',20);

insert into public.leads
  (lead_type, full_name, phone, email, interest, source_path, status, consent_at, created_at)
values
  ('trial','Trần Minh Anh','0901 234 567','minhanh@example.com','Boxing','Trial form','new',now(),now() - interval '2 days'),
  ('consultation','Nguyễn Khánh Linh','0902 345 678','khanhlinh@example.com','Yoga / GroupX','Website','contacted',now(),now() - interval '4 days'),
  ('trial','Lê Hoàng Duy','0903 456 789','hoangduy@example.com','HYROX / Conditioning','Lịch lớp','closed',now(),now() - interval '6 days');

insert into public.blog_posts
  (slug, category, title, excerpt, content, hero_image_path, status, published_at)
values
  ('vao-nhip-boxing','Training','Vào nhịp Boxing mà không bị quá tải','Cách phân bổ kỹ thuật, conditioning và recovery trong tuần đầu tại HYPE.',
   E'## Bắt đầu bằng kỹ thuật, không bắt đầu bằng tốc độ\nTrong tuần đầu, mục tiêu quan trọng nhất là hiểu tư thế, cách giữ tay, di chuyển và nhịp thở. Khi nền tảng ổn định, cường độ mới thực sự tạo ra tiến bộ thay vì chỉ tạo cảm giác mệt.\n\n## Tần suất phù hợp cho người mới\nHai đến ba buổi mỗi tuần là nhịp khởi đầu hợp lý với phần lớn người mới. Xen kẽ một ngày nghỉ hoặc một buổi Recovery giúp cơ thể thích nghi tốt hơn.\n\n## Trao đổi thẳng với coach\nHãy nói rõ mục tiêu, tiền sử chấn thương và mức vận động gần đây. Coach sẽ điều chỉnh bài tập, biên độ và khối lượng phù hợp với bạn.',
   '/assets/images/boxing-drill.webp','published','2026-07-31 08:00+07'),
  ('recovery-la-ky-luat','Recovery','Recovery không phải nghỉ — đó là một phần của kỷ luật','Khi nào nên ngâm đá, sauna và cách theo dõi phản ứng của cơ thể.',
   E'## Phục hồi phải phục vụ cho buổi tập tiếp theo\nRecovery hiệu quả không nằm ở việc làm thật nhiều phương pháp, mà nằm ở việc chọn đúng công cụ vào đúng thời điểm. Giấc ngủ, dinh dưỡng và quản lý tải tập vẫn là nền tảng.\n\n## Ice bath và sauna không dành cho mọi thời điểm\nNgâm lạnh có thể hữu ích sau các giai đoạn vận động nặng hoặc khi cần giảm cảm giác mỏi. Sauna hỗ trợ thư giãn và tạo thói quen phục hồi. Người có bệnh lý cần tham khảo ý kiến chuyên môn trước khi sử dụng.\n\n## Theo dõi phản ứng của chính bạn\nHãy ghi nhận giấc ngủ, mức đau mỏi, nhịp tim nghỉ và cảm giác sẵn sàng trước buổi tập. Dữ liệu đơn giản nhưng đều đặn có giá trị hơn cảm tính nhất thời.',
   '/assets/images/recovery-action.webp','published','2026-07-28 08:00+07'),
  ('hyper-community','Community','Một cộng đồng mạnh được xây từ những buổi tập đều','Workshop, run club và thử thách nội bộ giúp HYPER đi xa hơn cùng nhau.',
   E'## Cộng đồng không chỉ là một bức ảnh đông người\nVăn hóa HYPER được tạo ra từ việc mọi người cùng đến đúng giờ, hỗ trợ nhau trong buổi tập và tôn trọng tiến trình riêng của từng thành viên.\n\n## Có mục tiêu chung, nhưng không ép mọi người giống nhau\nRun Club, workshop, giải nội bộ và các nhóm chuẩn bị thi đấu giúp mỗi người tìm được mục tiêu phù hợp mà vẫn giữ được cảm giác thuộc về một tập thể.\n\n## Đi xa hơn cùng nhau\nKhi động lực giảm, lịch tập và cộng đồng sẽ giữ bạn ở lại. Đó là lý do HYPE xây hệ thống hoạt động dài hạn thay vì chỉ tạo ra những sự kiện ngắn hạn.',
   '/assets/images/community-class.webp','published','2026-07-25 08:00+07'),
  ('hyrox-foundation','Conditioning','HYROX Foundation: bắt đầu từ engine, không phải tốc độ','Nền tảng sức bền, kỹ thuật station và cách tăng tải có kiểm soát.',
   E'## Engine là khả năng duy trì chất lượng vận động\nHYROX đòi hỏi khả năng chạy xen kẽ với các trạm sức mạnh và sức bền cơ bắp. Người mới nên ưu tiên nhịp ổn định trước khi cố gắng đạt tốc độ cao.\n\n## Kỹ thuật giúp tiết kiệm năng lượng\nSled push, sled pull, burpee broad jump hay wall ball đều có chiến lược kỹ thuật riêng. Tập đúng mẫu vận động giúp bạn duy trì hiệu suất lâu hơn.\n\n## Tăng tải theo chu kỳ\nMột tuần nên có buổi engine, buổi strength và buổi mô phỏng ngắn. Không cần biến mọi buổi tập thành một cuộc thi.',
   '/assets/images/conditioning-agility.webp','published','2026-07-21 08:00+07'),
  ('first-class-checklist','First Timers','Checklist cho buổi tập đầu tiên tại HYPE','Đến sớm, chuẩn bị dụng cụ và trao đổi mục tiêu với coach để bắt đầu đúng nhịp.',
   E'## Đến sớm 15 phút\nKhoảng thời gian này đủ để check-in, làm quen không gian, trao đổi nhanh với coach và chuẩn bị dụng cụ.\n\n## Mang theo những gì cần thiết\nTrang phục thoải mái, giày phù hợp, nước uống và khăn cá nhân. Với Boxing, HYPE sẽ hướng dẫn thêm về băng quấn tay và găng.\n\n## Không cần cố chứng minh điều gì trong buổi đầu\nBuổi đầu tiên là để hiểu nhịp lớp, cách coach hướng dẫn và cách cơ thể phản ứng. Tiến bộ bền vững luôn bắt đầu từ mức tải phù hợp.',
   '/assets/images/warmup.webp','published','2026-07-18 08:00+07'),
  ('rooftop-training','Lifestyle','Rooftop mornings: tập ngoài trời, giữ nhịp cả ngày','Các lớp có coach trên tầng thượng được thiết kế cho sáng sớm và khí trời.',
   E'## Một không gian khác tạo ra một nhịp tập khác\nRooftop Training ưu tiên các buổi sáng sớm, bài tập toàn thân và hoạt động nhóm. Không gian mở giúp buổi tập nhẹ nhàng hơn về cảm giác nhưng vẫn có cấu trúc rõ ràng.\n\n## Luôn có phương án thay đổi khi thời tiết không phù hợp\nHYPE sẽ theo dõi điều kiện thời tiết và thông báo thay đổi khu vực hoặc lịch nếu cần để đảm bảo an toàn.\n\n## Tập ngoài trời vẫn cần coaching\nMỗi buổi Rooftop đều có coach phụ trách, giới hạn số lượng người và hướng dẫn cường độ theo khả năng.',
   '/assets/images/exterior-building.webp','published','2026-07-15 08:00+07');
