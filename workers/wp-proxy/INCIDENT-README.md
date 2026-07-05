# ⚠️ ĐỌC FILE NÀY TRƯỚC KHI SỬA `worker.js` HOẶC `wrangler.toml` TRONG THƯ MỤC NÀY

> Nếu bạn là AI/Claude Code đang debug lỗi "ảnh 404", "blog không lấy được bài viết từ WordPress", hoặc "không vào được /wp-admin", đây gần như chắc chắn là do file `worker.js` trong thư mục này bị cấu hình sai. Đọc kỹ toàn bộ file này trước khi đổi bất kỳ dòng nào.

## Bối cảnh kiến trúc (không được thay đổi)

- `fintech24h.com` (domain chính) được Cloudflare Worker **`fintech24h-website`** phục vụ toàn bộ — đây là build tĩnh Astro. Worker này **không** biết gì về WordPress, mọi path lạ (`/wp-admin`, `/wp-json/*`, `/wp-content/*`...) sẽ bị Astro trả về trang 404 của chính nó.
- WordPress thật (bản gốc, admin, media, REST API) chạy trên VPS LiteSpeed tại IP **`172.96.186.230`**, virtual-host theo `Host: fintech24h.com`.
- Để 2 thứ này cùng sống trên 1 domain, có Worker riêng **`fintech24h-wp-proxy`** (file `worker.js` trong thư mục này) với route trên zone `fintech24h.com`:
  ```
  /wp-content/*, /wp-admin/*, /wp-login.php*, /wp-login, /wp-includes/*, /wp-cron.php*, /wp-json/*
  ```
  Các route này có độ ưu tiên cao hơn route catch-all của `fintech24h-website`, nên request khớp pattern sẽ đi vào `fintech24h-wp-proxy` trước.

## DNS bắt buộc phải có

- Bản ghi **`origin.fintech24h.com`** → A record → `172.96.186.230`, **gray-cloud / DNS only** (KHÔNG bật proxy cam của Cloudflare).
- **TUYỆT ĐỐI KHÔNG tạo subdomain mới nào khác** để làm việc này (vd. không tạo `proxy.fintech24h.com` — sự cố 2026-07 từng làm vậy và gây lỗi vì subdomain đó chưa tồn tại trong DNS). Nếu cần một origin subdomain, dùng lại `origin.fintech24h.com` đã có sẵn.

## Lỗi đã xảy ra và nguyên nhân gốc (2026-07-05)

**Sự cố:** Ảnh lỗi 404, blog không lấy được bài viết, `/wp-admin` và `/wp-login.php` trả về 404.

**2 nguyên nhân liên tiếp, phải fix cả 2:**

1. **Sai subdomain đích:** Bản worker cũ dùng `cf.resolveOverride: 'proxy.fintech24h.com'` — subdomain này **chưa từng được tạo trong DNS** → fetch tới origin luôn fail.
2. **`cf.resolveOverride` là tính năng Enterprise-only của Cloudflare.** Trên tài khoản Cloudflare tiêu chuẩn (Free/Pro), thuộc tính này **bị bỏ qua hoàn toàn**, khiến request tự lặp lại vào chính `fintech24h.com` (tức là quay lại route catch-all của Astro) thay vì đi ra origin VPS → luôn nhận 404 từ Astro, dù đã sửa đúng subdomain.

## Cách fix ĐÚNG (đã áp dụng, đang chạy live)

Không dùng `cf.resolveOverride`. Thay vào đó, **fetch trực tiếp tới `https://origin.fintech24h.com`** (subdomain gray-cloud trỏ thẳng VPS, không qua Cloudflare proxy nên không cần override gì), và tự set header `Host: fintech24h.com` để LiteSpeed route đúng virtual host:

```js
const SITE_HOST  = 'fintech24h.com';
const PROXY_HOST = 'origin.fintech24h.com'; // gray-cloud DNS-only, → 172.96.186.230

reqHeaders.set('Host', SITE_HOST); // bắt buộc — LiteSpeed dựa vào Host header để chọn virtual host

const originReq = new Request(`https://${PROXY_HOST}${url.pathname}${url.search}`, {
  method: request.method,
  headers: reqHeaders,
  body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  redirect: 'manual',
});
```

Và `rewriteLocation()` phải thay cả IP gốc lẫn `PROXY_HOST` về lại `SITE_HOST` trong header `Location` của response redirect (vd. khi WordPress redirect `wp-admin` → `wp-login.php`), nếu không URL redirect sẽ lộ ra IP/subdomain nội bộ thay vì `fintech24h.com`.

## Quy tắc cho AI/Claude Code sau này

```
❌ KHÔNG dùng cf.resolveOverride trong bất kỳ Worker nào của dự án này — tài khoản Cloudflare là tiêu chuẩn, không phải Enterprise.
❌ KHÔNG tạo subdomain mới để làm origin proxy — luôn dùng origin.fintech24h.com đã có sẵn.
❌ KHÔNG đổi PROXY_HOST hay cách fetch trong worker.js mà không đọc hết file này trước.
✅ Nếu lỗi 404 xuất hiện lại ở /wp-admin, /wp-json, /wp-content: kiểm tra theo thứ tự
   1) origin.fintech24h.com có còn resolve đúng IP VPS không (dig origin.fintech24h.com)
   2) worker fintech24h-wp-proxy có đang deployed với đủ 7 routes không (wrangler deployments list --name fintech24h-wp-proxy)
   3) worker.js có đang dùng cf.resolveOverride (SAI) hay fetch trực tiếp origin.fintech24h.com (ĐÚNG)
   4) Cloudflare edge cache có đang cache cứng response 404 cũ không (kiểm tra header cf-cache-status; nếu HIT trên response lẽ ra phải DYNAMIC/no-store, cần purge cache theo path /wp-json/*, /wp-admin/*, /wp-content/* trên dashboard)
✅ Test nhanh sau khi sửa:
   curl -I https://fintech24h.com/wp-json/wp/v2/posts   → phải 200, có header x-wp-total
   curl -I https://fintech24h.com/wp-admin/             → phải 302 redirect tới wp-login.php
   curl -I https://fintech24h.com/wp-content/uploads/<ảnh có thật>  → phải 200, content-type image/*
```

Nếu bạn (AI) định sửa lại theo hướng khác với những gì mô tả ở trên (đặc biệt là quay lại dùng `resolveOverride` hoặc tạo subdomain mới), gần như chắc chắn bạn đang lặp lại lỗi đã từng xảy ra — dừng lại, đọc lại file này, và hỏi người dùng trước khi đổi.
