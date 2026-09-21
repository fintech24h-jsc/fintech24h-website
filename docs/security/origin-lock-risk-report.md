# Báo cáo rủi ro: bước 3 "Khoá truy cập thẳng origin" (chỉ đọc, 21/09/2026)

Nguồn bằng chứng: raw access log cPanel (268.534 dòng SSL, 04–21/09), `.htaccess` và danh sách chứng chỉ trên cPanel, DNS + TLS thật của origin, code repo (Astro, `wp-proxy`, `blog-monitor`), DB và code Content Studio trên VPS. **Chưa thay đổi gì.**

## Kết luận ngắn
1. **Bước 3 không chặn được cuộc tấn công này.** Trong 17 ngày log có **0 lệnh ghi (POST/PUT/DELETE) đi thẳng vào origin**. Mọi lần đăng nhập của bot và mọi bài spam đều đi qua Cloudflare → `wp-proxy`. Nguyên nhân thật vẫn là mật khẩu `admin` bị lộ.
2. **Không ai có thể cam kết 100% an toàn.** Bản "khoá toàn bộ origin" có rủi ro làm sập blog và wp-admin (chi tiết dưới). Bản **khoá hẹp** (chỉ đường đăng nhập/ghi) thì rủi ro thấp hơn nhiều.
3. Nếu làm, làm theo 3 tầng ở cuối; tầng 0 (chặn `xmlrpc.php`) hầu như không có rủi ro.

## Cách site đang gọi vào origin (đo từ log)
| Nguồn | Số request/17 ngày | Đi qua | Ghi chú |
|---|---:|---|---|
| Astro Worker (`Fintech24h-Astro-SSR/1.0`) | 181.187 | trực tiếp `origin.fintech24h.com` | **1.377 request (0,76%) đến từ IP `104.28.x.x`, KHÔNG nằm trong danh sách IP Cloudflare công bố** |
| `wp-proxy` (admin, REST, ảnh, wp-cron, khách, bot) | ~87.300 (phần còn lại của 268.534) | Cloudflare → Worker → origin, IP `2a06:98c0…` | luôn thấy IP Cloudflare, mất IP thật |
| WP-Cron loopback (`WordPress/7.1`) | 998 | qua `fintech24h.com` → `wp-proxy` | |
| Studio (`SEO-Content-Studio/1.0`) | 39 lệnh tạo bài | qua `fintech24h.com` → `wp-proxy` | Studio không dùng origin, không dùng `xmlrpc` (đã grep code + DB) |
| Quét công cộng gọi thẳng origin | 116 | trực tiếp | scanner/AI crawler, toàn GET |
| `xmlrpc.php` | 2 (đều là GET 405 của chính tôi) | | **không có người dùng thật** |

## Bảng rủi ro (nếu khoá origin)
| # | Rủi ro | Mức | Bằng chứng | Cách giảm |
|---|---|---|---|---|
| 1 | **Khoá theo danh sách IP Cloudflare sẽ chặn nhầm Astro Worker** | Cao | 1.377 request Astro đến từ `104.28.x.x` ngoài dải công bố; phần còn lại thì trong dải | **Không dùng allowlist IP.** Dùng header bí mật |
| 2 | Astro không đọc được secret runtime: `src/lib/wordpress.ts` dùng `import.meta.env` ở cấp module, không có ngữ cảnh request | Cao | code | Phải refactor hoặc nhúng secret lúc build. Thất bại = blog ẩn khỏi menu, sitemap/RSS 503 (không mất dữ liệu) |
| 3 | **`wp-proxy` là điểm duy nhất** cho wp-admin, REST, ảnh, wp-cron. Sửa sai = mất wp-admin | Cao | lịch sử: sự cố 07/2026, và lần sửa forward-IP từng gây 404 hàng loạt phải revert | Sửa bản nhỏ, kiểm thử bằng route riêng, giữ đường lui qua cPanel |
| 4 | **Gia hạn chứng chỉ TLS của origin** (Let's Encrypt qua AutoSSL, HTTP-01) cần `/.well-known/acme-challenge/` mở trực tiếp | Cao | cert `origin.fintech24h.com` hết hạn **03/12/2026**; `.well-known/acme-challenge` tồn tại | Luôn ngoại lệ `/.well-known/`; nếu sót → hết hạn 03/12 → Astro và `wp-proxy` cùng lỗi TLS |
| 5 | `.htaccess` sai cú pháp → **HTTP 500 toàn bộ WordPress** (blog, REST, admin) | Cao | file gộp khối LiteSpeed + cPanel + WordPress + khối hardening của bạn | Sao lưu, đặt khối mới ngoài các khối tự sinh, thử bằng 1 đường dẫn nhỏ, sửa lại qua cPanel (độc lập với website) |
| 6 | Bí mật header bị mất đồng bộ giữa origin và Worker khi xoay vòng → sập | Trung | | Quy trình: thêm Worker gửi secret mới → mở cả 2 secret ở origin → bỏ secret cũ |
| 7 | Secret nằm trong `.htaccess` (ai vào cPanel/backup đều đọc được) | Trung | | Dùng secret dài, riêng; coi cPanel là vùng tin cậy |
| 8 | **Hai IP cùng phục vụ WP**: `172.96.191.232` (DNS hiện tại) và `172.96.186.230` (IP cũ trong code/docs), cùng DB (đều 347 bài), chứng chỉ khác nhau (cái ở IP cũ hết hạn **29/09/2026**) | Trung | curl + openssl | Luật `.htaccess` phủ cả hai (cùng vhost). Cập nhật comment/docs. Cert IP cũ hết hạn không ảnh hưởng vì DNS không trỏ tới |
| 9 | LiteSpeed cache (`CacheLookup on`) có thể trả nội dung cache cho request thiếu header | Thấp–Trung | `.htaccess` còn khối LSCACHE dù plugin không còn | Test 403 trên trang có cache và không có cache |
| 10 | Không rõ hết mọi client hợp lệ | Thấp | chỉ tìm thấy Astro; 116 gọi trực tiếp còn lại là scanner | Chạy thử ở chế độ chỉ ghi log trước |
| 11 | Khoá không khôi phục IP thật, và **không ngăn** kẻ tấn công đi qua `fintech24h.com` | (giới hạn) | 0 lệnh ghi trực tiếp trong log | Vẫn cần đổi mật khẩu, 2FA, WAF theo UA, mu-plugin |
| 12 | Ảnh hưởng ngoài: cPanel/webmail/mail | Không | tài khoản chỉ có 1 domain (`fintech24h.com`), không có subdomain/addon; mail dùng `tino.vn`; cPanel cổng 2083 không đi qua `.htaccess` | — |

## Phát hiện phụ (ngoài phạm vi, ghi lại)
- **Astro gọi `/wp-json/wp/v2/case-study` 111.020 lần/17 ngày (61% mọi request) và luôn 404** vì endpoint không tồn tại và kết quả rỗng không được cache. Lãng phí lớn, từng góp phần gây rate-limit của WP. Nên cache kết quả rỗng.
- Một scanner `Go-http-client` đã quét recon `wp-admin`, `wp-content/plugins` **1.152 lần qua đường Cloudflare** (bị WAF chưa chặn).
- Astro ~200 request `posts` trả 400 (trang vượt tổng số).

## Đề xuất theo tầng (rủi ro tăng dần)
**Tầng 0 — chặn `xmlrpc.php` hoàn toàn (rủi ro ≈ 0).** Không có ai dùng trong 17 ngày, Studio không dùng. Thêm vào cuối `public_html/.htaccess` (ngoài các khối tự sinh):
```apache
# Fintech24h: xmlrpc.php khong duoc su dung (Studio/Astro dung REST)
<Files "xmlrpc.php">
  Require all denied
</Files>
```
**Tầng 1 — khoá hẹp bằng header bí mật (rủi ro thấp–trung).** Chỉ yêu cầu header cho `/wp-login.php`, `/wp-admin/` và mọi lệnh ghi `/wp-json/` (POST/PUT/PATCH/DELETE), miễn `/.well-known/`. **Astro chỉ GET nên không bị ảnh hưởng**, chỉ `wp-proxy` cần thêm header. Điều kiện: bạn deploy được `wp-proxy` (máy này chưa đăng nhập Cloudflare), thử ở chế độ log-only trước.
**Tầng 2 — khoá toàn bộ, gồm cả Astro (không khuyến nghị lúc này).** Cần refactor Astro (rủi ro #2), cần deploy 2 Worker cùng lúc, và không có lợi ích thêm cho sự cố hiện tại.

## Thứ tự ưu tiên thực sự cho sự cố này
1. Đổi mật khẩu `admin`/`phat`, đăng xuất mọi phiên, đổi SALT, bật 2FA, đổi tên đăng nhập `admin`.
2. WAF Cloudflare chặn UA `Chrome/124.0.0.0`, `Firefox/133.0` ở `/wp-login.php`.
3. Cài mu-plugin `fintech24h-spam-guard`.
4. Tầng 0 (`xmlrpc.php`).
5. Sau đó mới xem xét Tầng 1.
