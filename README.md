# 🚀 Hướng dẫn Setup Muzi Studio — Supabase Version

## Tổng quan
- **Backend**: Supabase (database + auth miễn phí)
- **Hosting**: Vercel hoặc Netlify (miễn phí)
- **Thời gian setup**: ~15–20 phút

---

## BƯỚC 1 — Tạo project Supabase

1. Vào **https://supabase.com** → **Start your project**
2. Đăng ký tài khoản (dùng GitHub cho nhanh)
3. Nhấn **New project**
4. Điền:
   - **Name**: `muzi-studio`
   - **Database Password**: đặt mật khẩu mạnh, lưu lại
   - **Region**: `Southeast Asia (Singapore)` — gần Việt Nam nhất
5. Nhấn **Create new project** → chờ ~2 phút

---

## BƯỚC 2 — Tạo bảng `prompts` trong database

1. Vào **Table Editor** → **New table**
2. Đặt tên: `prompts`
3. **Bỏ chọn** "Enable Row Level Security" (sẽ bật sau)
4. Thêm các cột sau:

| Tên cột | Type | Default | Notes |
|---------|------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | Primary key ✅ |
| `user_id` | `uuid` | — | Foreign key → auth.users |
| `type` | `text` | — | Loại prompt |
| `goal` | `text` | `''` | Mục tiêu |
| `topic` | `text` | `''` | Chủ đề |
| `formula` | `text` | `''` | Công thức |
| `dur` | `text` | `''` | Thời lượng |
| `text` | `text` | — | Nội dung prompt |
| `created_at` | `timestamptz` | `now()` | Tự động |

5. Nhấn **Save**

---

## BƯỚC 3 — Cài Row Level Security (RLS)

Vào **Authentication** → **Policies** → chọn bảng `prompts` → **New Policy**

### Policy 1: Cho phép SELECT (đọc)
```sql
CREATE POLICY "Users can view own prompts"
ON prompts FOR SELECT
USING (auth.uid() = user_id);
```

### Policy 2: Cho phép INSERT (thêm)
```sql
CREATE POLICY "Users can insert own prompts"
ON prompts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Policy 3: Cho phép DELETE (xoá)
```sql
CREATE POLICY "Users can delete own prompts"
ON prompts FOR DELETE
USING (auth.uid() = user_id);
```

**Cách chạy SQL**: Vào **SQL Editor** → paste từng đoạn → nhấn **Run**

---

## BƯỚC 4 — Lấy API Keys

1. Vào **Project Settings** → **API**
2. Copy 2 giá trị:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key**: chuỗi dài bắt đầu bằng `eyJ...`

---

## BƯỚC 5 — Cập nhật file HTML

Mở file `muzi-studio-supabase.html`, tìm đoạn này (gần đầu `<script>`):

```javascript
// =============================================
// SUPABASE CONFIG — THAY THẾ 2 DÒNG NÀY
// =============================================
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
// =============================================
```

Thay bằng thông tin vừa copy:

```javascript
const SUPABASE_URL = 'https://abcdefghij.supabase.co'; // URL của Muzi
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...'; // Key của Muzi
```

---

## BƯỚC 6 — Deploy lên Netlify (Cách nhanh nhất)

### Cách A: Kéo thả file (không cần code)
1. Vào **https://netlify.com** → Đăng ký miễn phí
2. Kéo file `muzi-studio-supabase.html` vào trang chủ Netlify
3. Netlify tự deploy → cấp link dạng `https://random-name.netlify.app`
4. Đổi tên trong **Site settings** → `https://muzi-studio.netlify.app`

### Cách B: Deploy qua GitHub (khuyên dùng — dễ update sau)
1. Tạo repo GitHub mới (private)
2. Upload file HTML lên repo
3. Vào Netlify → **Import from Git** → chọn repo
4. Deploy tự động mỗi khi push code mới

---

## BƯỚC 7 — Tạo tài khoản cho team

**Cách 1: Tự đăng ký trực tiếp trên web**
- Vào link web → điền email + mật khẩu → đăng ký
- Supabase mặc định không cần xác nhận email (có thể bật/tắt)

**Cách 2: Tạo sẵn từ Supabase dashboard (khuyên dùng)**
1. Vào **Authentication** → **Users** → **Invite user**
2. Nhập email của thành viên team
3. Họ nhận email, click link → tự đặt mật khẩu

**Tắt xác nhận email (nếu muốn dùng ngay):**
- **Authentication** → **Providers** → **Email** → tắt **Confirm email**

---

## BƯỚC 8 — Kiểm tra hoạt động

1. Mở link web
2. Đăng ký tài khoản test
3. Tạo và lưu 1 prompt
4. Vào **Supabase** → **Table Editor** → bảng `prompts`
5. Thấy row mới = thành công ✅

---

## Cấu trúc phân quyền

```
Muzi (user A)          Team member (user B)
     │                        │
     ▼                        ▼
Thấy prompt của mình    Thấy prompt của mình
     │                        │
     └──── KHÔNG thấy nhau ───┘
              (RLS policy)
```

> **Nếu muốn thêm shared library sau này**: Thêm cột `is_public boolean default false` + policy `SELECT WHERE is_public = true` — prompt nào đánh dấu public thì cả team thấy.

---

## Giới hạn Free Tier Supabase

| Tính năng | Free |
|-----------|------|
| Database | 500 MB |
| Storage | 1 GB |
| Auth users | Không giới hạn |
| API requests | 50,000/tháng |
| Realtime connections | 200 |

→ Với team 2–5 người dùng nội bộ: **hoàn toàn đủ dùng** ✅

---

## Troubleshooting

**Lỗi "Invalid API key"**
→ Kiểm tra lại `SUPABASE_URL` và `SUPABASE_ANON_KEY` trong file HTML

**Lỗi "row-level security violation"**
→ Chạy lại 3 SQL policies ở Bước 3

**Không nhận được email xác nhận**
→ Tắt "Confirm email" trong Authentication settings

**Muốn đổi domain**
→ Netlify: Site settings → Domain management → Add custom domain

---

## Nâng cấp sau này

Khi team lớn hơn hoặc cần thêm tính năng:

- **Shared prompt library**: Thêm cột `is_shared` + policy mới
- **Tags / Filter**: Thêm cột `tags text[]`
- **Phân quyền admin**: Supabase có sẵn role system
- **Analytics**: Xem ai dùng nhiều nhất qua dashboard
- **Export to Sheets**: Dùng Supabase webhook → Google Apps Script
