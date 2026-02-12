# 📚 StudyHub - AI-Powered Study Platform

StudyHub là một nền tảng học tập thông minh kết hợp AI tutor, deep work sessions, camera tracking, và gamification để giúp bạn học tập hiệu quả hơn.

## ✨ Tính năng chính

### 🎯 Deep Work Mode
- **Pomodoro Timer**: Timer linh hoạt với thời gian tùy chỉnh
- **Camera Tracking**: Ghi lại quá trình học tập của bạn (timelapse)
- **Focus Music**: Nhạc lofi để tập trung
- **XP & Streaks**: Hệ thống điểm kinh nghiệm và chuỗi ngày học

### 🧠 AI Tutor
- **Document Upload**: Hỗ trợ PDF, DOCX, TXT, MD
- **Smart Summary**: Tạo tóm tắt tự động từ tài liệu
- **Quiz Generation**: Tạo câu hỏi trắc nghiệm từ nội dung
- **Mind Maps**: Sơ đồ tư duy tự động (upcoming)
- **Virtual Lecturer**: Text-to-Speech giảng bài (upcoming)

### 🎮 Gamification
- **XP System**: Kiếm điểm khi học tập
- **Leaderboard**: Bảng xếp hạng cộng đồng
- **Achievements**: Huy chương và thành tích
- **Study Streaks**: Chuỗi ngày học liên tục

### 👥 Community (Upcoming)
- Chia sẻ ghi chú và tài liệu
- Thảo luận và hỏi đáp
- Study groups

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- (Tùy chọn) Supabase account cho backend

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình môi trường

Sao chép file `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Lưu ý**: Ứng dụng có thể chạy ở chế độ demo mà không cần Supabase. Tất cả dữ liệu sẽ được lưu trong localStorage.

### Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 📱 Build cho production

```bash
npm run build
npm start
```

## 🏗️ Cấu trúc dự án

```
study-hub/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── deep-work/         # Trang Deep Work
│   │   ├── ai-tutor/          # Trang AI Tutor
│   │   └── ...
│   ├── components/            # React components
│   │   ├── deep-work/         # Components cho Deep Work
│   │   ├── ai-tutor/          # Components cho AI Tutor
│   │   └── music/             # Music player
│   ├── lib/                   # Utilities & helpers
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
└── ...
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, Lucide Icons
- **AI**: Transformers.js (client-side AI)
- **State**: Zustand
- **Backend**: Supabase (optional)
- **Storage**: IndexedDB, localStorage
- **Media**: MediaRecorder API, Web Audio API

## 🎯 Roadmap

- [x] Pomodoro Timer
- [x] Camera Recording
- [x] Focus Music Player
- [x] Document Upload
- [x] AI Summary
- [x] Quiz Generator
- [ ] Mind Map Generator
- [ ] Text-to-Speech Lecturer
- [ ] Community Forum
- [ ] Study Groups
- [ ] Mobile App (React Native)

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 💡 Tips sử dụng

1. **Camera Permission**: Cho phép quyền truy cập camera để sử dụng tính năng recording
2. **Notification**: Bật thông báo để nhận nhắc nhở khi hết giờ Pomodoro
3. **Offline Mode**: Ứng dụng hoạt động hoàn toàn offline sau khi tải lần đầu
4. **Document Processing**: Tất cả xử lý AI diễn ra trên máy của bạn, đảm bảo riêng tư

## 🐛 Báo lỗi

Nếu gặp lỗi, vui lòng tạo issue trên GitHub với thông tin:
- Trình duyệt và phiên bản
- Các bước tái hiện lỗi
- Screenshots (nếu có)

## 📞 Liên hệ

- GitHub: [Your GitHub]
- Email: your@email.com

---

**Happy Studying! 📚✨**
