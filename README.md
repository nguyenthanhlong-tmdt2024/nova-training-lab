# NOVA Training Lab

Website clone/demo cho đồ án CRM Boxing.

## Công nghệ

- Next.js
- React
- TypeScript
- Supabase (chuẩn bị cho phần CRM/database)

## Yêu cầu

- Node.js 20.9 trở lên
- npm
- Visual Studio Code

## Cách chạy trên máy

Clone project:

```bash
git clone <LINK_GITHUB_CUA_BAN>
cd NOVA_TRAINING_LAB_SEND
```

Cài thư viện:

```bash
npm install
```

Chạy website:

```bash
npm run dev
```

Mở trình duyệt:

```text
http://localhost:3000
```

Dừng server bằng:

```text
Ctrl + C
```

## Cấu trúc chính

```text
src/        Source code chính
public/     Hình ảnh và tài nguyên tĩnh
assets/     CSS/tài nguyên giao diện
supabase/   Schema và cấu hình phục vụ phần CRM
```

## Lưu ý

- Đây là website phục vụ đồ án và sử dụng dữ liệu mô phỏng.
- Không commit các file `.env`, secret, `node_modules`, `.next` hoặc `supabase/.temp`.
- Phần CRM/Supabase có thể cần cấu hình biến môi trường riêng khi triển khai kết nối dữ liệu thật.
