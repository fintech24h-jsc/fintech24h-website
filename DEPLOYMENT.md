# ⚠️ ĐỌC FILE NÀY TRƯỚC KHI ĐỘNG VÀO `wrangler.jsonc`, `public/.assetsignore`, `astro.config.mjs`, hoặc `src/lib/wordpress.ts`

> Nếu bạn là AI/Claude Code đang debug lỗi "site không cập nhật dù đã push", "blog không hiển thị bài viết thật", hoặc "build xanh nhưng site vẫn cũ" — đây gần như chắc chắn là 1 trong 3 lỗi đã xảy ra ngày 2026-07-05 và được mô tả chi tiết dưới đây. Đọc hết trước khi sửa.

## Kiến trúc deploy (đã chốt, không tự ý đổi)

```
GitHub push (main) → Cloudflare Workers Builds (git-integration cấu hình
  trong Cloudflare Dashboard, KHÔNG có file trong .github/workflows/)
  → npm run build (astro build, output: "hybrid", adapter: @astrojs/cloudflare)
  → npx wrangler deploy  (đọc wrangler.jsonc ở gốc repo)
  → cập nhật Worker "fintech24h-website" (site live)
```

**Quan trọng:** "build thành công" (hiện trong log Cloudflare) và "deploy thành công" là 2 bước RIÊNG BIỆT, có thể fail độc lập với nhau. Đừng bao giờ báo cáo "đã xong" chỉ vì thấy build log xanh — luôn verify bằng:

```
npx wrangler deployments list --name fintech24h-website
```
và so sánh timestamp deployment mới nhất với thời điểm push. Nếu timestamp KHÔNG mới hơn, deploy đã fail âm thầm — phải xem log build đầy đủ trên Cloudflare Dashboard (tab Builds) để tìm lỗi ở bước "Executing user deploy command".

## 3 lỗi đã xảy ra liên tiếp (2026-07-05) — TUYỆT ĐỐI không lặp lại

### Lỗi 1: Thiếu `wrangler.jsonc` → deploy fail âm thầm

Sau khi chuyển `astro.config.mjs` từ `output: 'static'` sang `output: 'hybrid'` + `adapter: cloudflare()` (để blog chạy SSR, xem phần dưới), lệnh `npx wrangler deploy` không biết entry point Worker nằm ở đâu → lỗi `Missing entry-point to Worker script or to assets directory`. Build vẫn xanh, nhưng Worker live KHÔNG được cập nhật, kéo dài từ 2026-07-04 đến khi phát hiện.

**Fix:** file `wrangler.jsonc` ở gốc repo, trỏ `main` tới `./dist/_worker.js/index.js` (nơi adapter Cloudflare xuất ra Worker entry) và `assets.directory` tới `./dist`.

❌ KHÔNG xoá file `wrangler.jsonc`.
❌ KHÔNG đổi `name` khác `"fintech24h-website"` (sẽ tạo Worker mới thay vì update Worker live).
❌ KHÔNG thêm field `"routes"` vào file này (routes đang được quản lý trực tiếp trên Cloudflare Dashboard; thêm vào đây có thể ghi đè/xoá routes hiện có).

### Lỗi 2: Thiếu `public/.assetsignore` → wrangler từ chối deploy

Sau khi fix lỗi 1, deploy tiếp tục fail với lỗi khác: `Uploading a Pages _worker.js directory as an asset` — wrangler phát hiện thư mục `dist/_worker.js` (chứa code server-side) nằm trong `assets.directory` và từ chối upload công khai vì lo lộ code.

**Fix:** file `public/.assetsignore` chứa đúng 1 dòng `_worker.js`. Astro tự copy mọi thứ trong `public/` vào `dist/` mỗi lần build, nên file này luôn có mặt ở `dist/.assetsignore` mà không cần đụng vào build output.

❌ KHÔNG xoá `public/.assetsignore`.

### Lỗi 3: `WP API Error 522` khi fetch WordPress lúc runtime (không phải lúc build)

Sau khi lỗi 1 và 2 được fix, deploy thành công, nhưng `/blog` vẫn không hiện bài viết thật. Xem log runtime bằng:
```
npx wrangler tail fintech24h-website --format pretty
```
(chú ý: tên Worker là positional argument, KHÔNG phải `--name`)

Log cho thấy `getAllPosts()` fail với `WP API Error 522` (mã lỗi riêng của Cloudflare = "connection timed out reaching origin"). Nguyên nhân: `src/lib/wordpress.ts` đang fetch qua đường công khai `https://fintech24h.com/wp-json/...`, bị Cloudflare route sang Worker khác (`fintech24h-wp-proxy`, xem `workers/wp-proxy/`) — đây là request Worker-to-Worker cùng zone, và chuỗi `fintech24h-website → fintech24h-wp-proxy → origin.fintech24h.com` bị timeout không ổn định, dù request thẳng tới `origin.fintech24h.com` từ bên ngoài luôn nhanh và ổn định (đã test nhiều lần bằng curl).

**Fix:** `src/lib/wordpress.ts` fetch thẳng `https://origin.fintech24h.com/wp-json/wp/v2` (kèm header `Host: fintech24h.com` để LiteSpeed route đúng virtual host), bỏ qua hoàn toàn hop trung gian qua `fintech24h-wp-proxy`.

❌ KHÔNG đổi `WP_API_BASE` trong `wordpress.ts` quay lại `https://fintech24h.com/wp-json/...` — trông có vẻ "sạch" hơn nhưng sẽ tái phát lỗi 522.
❌ KHÔNG xoá `fintech24h-wp-proxy` Worker — nó vẫn cần thiết để **con người/trình duyệt** truy cập `/wp-admin`, `/wp-login.php`, và public `/wp-json/*`. Chỉ có fetch nội bộ của chính Astro site là bỏ qua nó.

## Quy tắc chẩn đoán khi lỗi tái phát

```
1. npx wrangler deployments list --name fintech24h-website
   → timestamp có mới hơn lần push gần nhất không? Nếu KHÔNG → xem lỗi 1/2, đọc log build đầy đủ trên Dashboard.
2. curl -sL https://fintech24h.com/blog | grep "Web3 Community in 2026"
   → nếu CÓ match, đang hiện MOCK_POSTS (fallback dev-only lẽ ra không nên chạy ở prod) → kiểm tra import.meta.env.DEV có bị sai không.
3. npx wrangler tail fintech24h-website --format pretty (rồi curl trang / và /blog vài lần)
   → xem log warning "WP API fail" — đọc rõ message lỗi (403? 429? 522? timeout?) trước khi đoán nguyên nhân.
4. Test trực tiếp: curl -H "Host: fintech24h.com" https://origin.fintech24h.com/wp-json/wp/v2/posts?per_page=1
   → nếu 200 nhanh & ổn định nhưng Worker vẫn lỗi → nghi ngờ hop trung gian (Worker-to-Worker), không phải WordPress.
```

Xem thêm chi tiết kỹ thuật liên quan đến WordPress proxy tại [workers/wp-proxy/INCIDENT-README.md](workers/wp-proxy/INCIDENT-README.md).

## Giám sát tự động — phát hiện sớm nếu tái phát

Sau sự cố này, đã thêm Worker `fintech24h-blog-monitor` (cron mỗi 2 giờ, check `/blog` không có MOCK_POSTS và có bài viết thật, cảnh báo qua Telegram nếu fail). Xem [workers/blog-monitor/INCIDENT-README.md](workers/blog-monitor/INCIDENT-README.md). Worker này **đã deploy và đang chạy live**, dùng lại Telegram bot/chat của lead notification (secrets `TELEGRAM_TOKEN`/`TELEGRAM_CHAT_ID`, không hardcode trong code).
