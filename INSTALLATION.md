# 🚀 Hướng dẫn cài đặt StudyHub

## Cách 1: Chạy trực tiếp (Khuyến nghị)

### Bước 1: Giải nén file
```bash
unzip study-hub.zip
cd study-hub
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

**Lưu ý**: Quá trình này có thể mất 2-5 phút tùy vào tốc độ internet.

### Bước 3: Chạy ứng dụng
```bash
npm run dev
```

### Bước 4: Mở trình duyệt
Mở [http://localhost:3000](http://localhost:3000)

🎉 **Xong!** Ứng dụng đã sẵn sàng sử dụng.

---

## Cách 2: Build cho Production

Nếu bạn muốn build cho production:

```bash
npm run build
npm start
```

---

## ⚙️ Cấu hình (Tùy chọn)

### Supabase Backend (Không bắt buộc)

Mặc định, ứng dụng chạy ở chế độ offline với localStorage và IndexedDB. Nếu bạn muốn thêm backend:

1. Tạo tài khoản tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy URL và Anon Key từ Project Settings
4. Cập nhật file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema (Nếu dùng Supabase)

Chạy các migration trong thư mục `supabase/migrations/`:

```sql
-- Create users table
create table users (
  id uuid references auth.users primary key,
  username text unique,
  xp integer default 0,
  created_at timestamp with time zone default now()
);

-- Create study_sessions table
create table study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration integer,
  xp_earned integer,
  created_at timestamp with time zone default now()
);

-- Create documents table
create table documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  name text,
  content text,
  summary text,
  created_at timestamp with time zone default now()
);
```

---

## 🔧 Troubleshooting

### Lỗi "npm: command not found"
- Cài đặt Node.js từ [nodejs.org](https://nodejs.org)
- Khuyến nghị phiên bản LTS (18.x hoặc 20.x)

### Lỗi "Port 3000 already in use"
- Đổi port bằng cách chạy: `PORT=3001 npm run dev`
- Hoặc tắt ứng dụng đang chạy trên port 3000

### Camera không hoạt động
- Cấp quyền camera cho trình duyệt
- Chỉ hoạt động trên HTTPS hoặc localhost
- Thử trình duyệt khác (Chrome/Edge khuyến nghị)

### Audio không phát
- Kiểm tra volume của trình duyệt
- Một số trình duyệt yêu cầu user interaction trước khi phát audio
- Click vào trang web một lần trước khi bấm play

### Build bị lỗi
```bash
# Xóa cache và rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Mobile browsers (một số tính năng có thể bị hạn chế)

---

## 💡 Tips

1. **Chế độ Demo**: Ứng dụng hoạt động hoàn toàn offline, không cần database
2. **PWA**: Có thể cài đặt như app trên desktop/mobile
3. **Privacy**: Tất cả dữ liệu được lưu trên máy của bạn
4. **Performance**: Lần đầu load có thể chậm do tải AI models

---

## 📞 Cần hỗ trợ?

- Đọc [README.md](./README.md) để biết thêm thông tin
- Kiểm tra console log của browser (F12) để debug
- Tạo issue trên GitHub nếu gặp lỗi

---

**Happy Coding! 🚀**
