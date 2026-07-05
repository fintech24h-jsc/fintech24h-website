# ⚠️ ĐỌC FILE NÀY TRƯỚC KHI SỬA `worker.js` HOẶC `wrangler.toml` TRONG THƯ MỤC NÀY

## Worker này để làm gì

`fintech24h-blog-monitor` là một Worker chạy theo **Cron Trigger** (không nhận request public), cứ mỗi 2 giờ:

1. Fetch `https://fintech24h.com/blog`.
2. Kiểm tra response **KHÔNG chứa** bất kỳ title nào trong `MOCK_POSTS` (định nghĩa trong `src/lib/wordpress.ts`) — nếu có nghĩa là fallback dev-only đã lọt ra production.
3. Kiểm tra response **CÓ chứa** ít nhất 1 article title thật (`<h2 class="font-display...`) — nếu không, blog đang rỗng/hỏng âm thầm.
4. Nếu 1 trong 2 check trên fail → gửi cảnh báo Telegram.

## Vì sao Worker này tồn tại

Sự cố 2026-07-05 (xem `DEPLOYMENT.md` ở gốc repo): blog đã hiện MOCK_POSTS ở production và sau đó bị rỗng hoàn toàn (lỗi 522 khi fetch WordPress), nhưng **không ai phát hiện cho đến khi kiểm tra thủ công**, kéo dài nhiều ngày. Worker này là cơ chế phát hiện tự động duy nhất cho lớp lỗi này — không thay thế cho việc fix nguyên nhân gốc, chỉ để phát hiện sớm nếu nó tái phát.

## Kênh cảnh báo — TÁI SỬ DỤNG, không tạo mới

Worker gửi alert qua **cùng Telegram bot** đã dùng cho lead notification (`workers/apps-script/Code.gs`). Token/chat ID **KHÔNG hardcode trong `worker.js`** — chúng được set làm Worker secrets:

```
npx wrangler secret put TELEGRAM_TOKEN --config workers/blog-monitor/wrangler.toml
npx wrangler secret put TELEGRAM_CHAT_ID --config workers/blog-monitor/wrangler.toml
```

Giá trị lấy từ biến `TELEGRAM_TOKEN` / `TELEGRAM_CHAT_ID` trong `workers/apps-script/Code.gs`.

❌ KHÔNG tạo bot Telegram mới hay kênh cảnh báo khác (email, Slack...) trừ khi bot hiện tại ngừng hoạt động.
❌ KHÔNG hardcode token/chat ID trực tiếp vào `worker.js` — dùng `env.TELEGRAM_TOKEN` / `env.TELEGRAM_CHAT_ID` qua secrets.

## Quy tắc cho AI/Claude Code sau này

```
✅ Nếu MOCK_POSTS trong src/lib/wordpress.ts đổi title → cập nhật mảng MOCK_TITLES
   trong worker.js cho khớp, nếu không check #2 sẽ mất tác dụng.
✅ Nếu markup article title trong src/pages/blog/index.astro đổi khỏi
   `<h2 class="font-display ...>` → cập nhật ARTICLE_TITLE_RE trong worker.js.
✅ Deploy: npx wrangler deploy --config workers/blog-monitor/wrangler.toml
   (Worker riêng biệt, KHÔNG liên quan gì tới wrangler.jsonc ở gốc repo hay
   workers/wp-proxy/wrangler.toml — 3 Worker độc lập, đừng nhầm lẫn config.)
✅ Verify sau khi deploy: npx wrangler tail fintech24h-blog-monitor --format pretty
   rồi đợi tới lần chạy cron kế tiếp (hoặc trigger thủ công qua Dashboard →
   Worker → Triggers → "Trigger scheduled event" nếu có).
❌ KHÔNG đổi Worker này thành public-facing route trên zone fintech24h.com —
   nó chỉ nên chạy qua cron, không cần route nào cả.
```
