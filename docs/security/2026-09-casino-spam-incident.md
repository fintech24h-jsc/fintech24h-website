# Sự cố 2026-09: 102 bài casino/cá cược bị chèn vào WordPress

Điều tra ngày 2026-09-19 (chỉ đọc qua REST công khai + đọc repo). **Chưa xoá gì trên WordPress** vì tôi không có quyền ghi. Danh sách 102 ID: [spam-post-ids-2026-09.csv](spam-post-ids-2026-09.csv).

## Bằng chứng đã xác minh
1. **Tạo trong 12–18/09/2026, không phải 09/2025.** ID 2774–3057 xen giữa các bài thật tháng 9/2026 (2707, 2808, 2867, 2926, 2990, 3020). ID do WordPress cấp tăng dần theo thời điểm tạo, nên các bài này bị **backdate về 14–17/09/2025** để chìm khỏi danh sách "bài mới".
2. **Đợt cuối 2026-09-18 16:28:11 → 16:28:14 UTC**: 4 bài 1win cách nhau 1 giây → script tự động, có quyền đăng bài (tác giả user 1). Đợt lớn 2774–2985 nằm trong 12–17/09.
3. Cả 102 bài: cùng category `Chưa phân loại` (id 1), cùng tác giả user 1, `guid` dạng permalink (bài thật gần đây có `guid ?p=ID`) → tạo bằng đường lập trình khác đường soạn thảo.
4. Mỗi bài chèn 1 link ra domain casino (cleopatra-casino.ch, jamslots-casino.fr, 21bit-casino.pl, 1winbet.pl…). Bài có tiêu đề vô hại (crypto/AI/nhạc) vẫn chèn link.
5. Có khoảng trống ID (vd 2796, 2809–2814, 2839–2855, 2986–3053…) là các đối tượng **không nằm trong bản publish** (nháp, thùng rác, revision, file media, hoặc bài spam khác) → phải kiểm tra bằng WP-CLI/DB, không thấy được từ ngoài.
6. `sitemap-blog.xml` đã liệt kê các bài này (đã gửi Google).
7. **Phía Astro không phải nguồn:** không có đường ghi vào WP, không có Application Password/credential trong code hay 278 commit git; site chỉ GET REST. Plugin `fintech24h-team-directory` chỉ có 1 route GET công khai (chỉ đọc).

## Nguyên nhân: giả thuyết xếp theo khả năng (chưa xác minh, cần log máy chủ)
1. **Credential/Application Password của tài khoản user 1 (admin) đang bị kẻ xấu giữ.** Đăng 4 bài trong 4 giây bằng tài khoản có quyền là dấu hiệu của API (REST hoặc XML-RPC) dùng thông tin đăng nhập hợp lệ. Application Password **không mất khi đổi mật khẩu**, và có thể đã được cài từ trước (khớp ghi chú sự cố 07/2026: dữ liệu migrate mang theo rogue admin/app password).
   - `xmlrpc.php` đang bật (GET trả 405, chuẩn của XML-RPC đang chạy). Rule WAF cũ chỉ chặn HTTP/1.x; bot dùng HTTP/2 vẫn qua.
2. **Backdoor PHP tái nhiễm** (hiroshi.php/item.php kiểu `eval(gzinflate(base64))`) trên hosting: gọi `wp_insert_post` trực tiếp, không cần mật khẩu. Đã xảy ra 2 lần trên 2 hosting khác nhau, nên nguồn nhiều khả năng nằm trong dữ liệu/`uploads`/DB đã copy sang.
3. **Rò rỉ từ hệ thống đăng bài tự động** (VPS `seo-studio-vps`, app `content-auto` đăng lô bài AI) nếu nó giữ credential WP. Chỉ là giả thuyết: tôi chưa vào máy này, chưa thấy bằng chứng.
4. Ít khả năng hơn: plugin/theme có lỗ hổng (chưa liệt kê được plugin vì REST yêu cầu đăng nhập).

**Không xác minh được từ bên ngoài:** IP/endpoint đã dùng. Cách xác minh: raw access log của hosting vào 2026-09-18 16:28 UTC (tìm `POST` tới `xmlrpc.php`, `wp-json/wp/v2/posts`, `admin-ajax.php`, hay file `.php` lạ) và 12–17/09.

## Thứ tự xử lý (làm ĐÚNG thứ tự, nếu xoá bài trước khi chặn nguồn thì chúng sẽ được đăng lại)
### A. Giữ bằng chứng (5 phút)
Tải raw access log + error log các ngày 12–18/09 từ cPanel; export DB (`wp db export`) trước khi xoá.

### B. Chặn nguồn (chạy WP-CLI qua SSH hosting, hoặc tương đương trong wp-admin)
```bash
wp user list --fields=ID,user_login,user_email,roles,user_registered   # tìm admin lạ
wp user application-password list 1                                    # liệt kê app password
wp user application-password delete 1 --all                            # thu hồi toàn bộ (làm cho mọi user có quyền)
wp user update 1 --user_pass="$(openssl rand -base64 24)"              # đổi mật khẩu admin
wp user session destroy --all 1                                        # đăng xuất mọi phiên
wp config shuffle-salts                                                # vô hiệu mọi cookie đăng nhập
wp plugin list --format=table ; wp theme list --format=table
wp core verify-checksums ; wp plugin verify-checksums --all            # file core/plugin bị sửa
```
Tìm backdoor:
```bash
find ~/public_html -name '*.php' -newermt '2026-09-01' -not -path '*/node_modules/*' | head -100
find ~/public_html/wp-content/uploads -name '*.php' -o -name '*.phtml' -o -name '*.ico' -size +0 | head   # uploads không được chứa PHP
grep -RIlE "eval\(\s*(gzinflate|base64_decode|str_rot13)|assert\(\s*\$_(POST|REQUEST)|preg_replace\(.*/e" ~/public_html | head
ls -la ~/public_html/wp-content/mu-plugins 2>/dev/null                 # mu-plugins lạ
```
Tắt XML-RPC (nếu không dùng): thêm vào `wp-content/mu-plugins/disable-xmlrpc.php` → `<?php add_filter('xmlrpc_enabled','__return_false');` và chặn `/xmlrpc.php` bằng WAF Cloudflare cho mọi phiên bản HTTP (rule hiện tại chỉ chặn HTTP/1.x).
Tắt Application Passwords nếu không cần: `add_filter('wp_is_application_passwords_available','__return_false');`
Kiểm tra ngoài WP: Google Search Console → Settings → Users and permissions (chủ sở hữu lạ), Sitemaps (sitemap lạ); Cloudflare → Members/API tokens; VPS `content-auto`: đổi mọi credential WP mà nó giữ.

### C. Xoá bài spam (sau B)
Kiểm tra số lượng trước:
```bash
wp post list --post_type=any --post_status=any --cat=1 --format=count    # kỳ vọng ≥ 102
wp post list --post_type=post --post_status=any --cat=1 --fields=ID,post_date,post_title | head
```
Category id 1 hiện chỉ chứa spam (đã đối chiếu 447 bài: 0 bài thật nằm trong đó). Xoá vĩnh viễn:
```bash
wp post delete $(wp post list --post_type=post --post_status=any --cat=1 --format=ids) --force
```
Sau đó tìm thêm bài spam nằm ngoài category 1 (tác giả user 1, tạo 12–18/09, có link casino):
```bash
wp db query "SELECT ID,post_status,post_type,post_date,post_title FROM wp_posts WHERE ID BETWEEN 2774 AND 3057 AND post_type <> 'revision' ORDER BY ID;"
wp db query "SELECT ID,post_title FROM wp_posts WHERE post_content REGEXP 'casino|1win|slot|bet' AND post_status IN ('publish','draft','pending','private');"
```
(Đổi `wp_` theo tiền tố bảng thật.) Xoá cả nháp/thùng rác chứa link casino.

### D. Dọn dấu vết SEO
Xoá xong → cache Worker tự hết trong ≤ 3 phút. Sitemap `/sitemap-blog.xml` tự bỏ. Trong GSC: gửi lại sitemap, dùng "Removals" cho các URL casino nếu Google đã index; kiểm tra Manual actions / Security issues.

## Đã làm phía Astro (chưa commit/push, đang ở working tree)
`src/lib/wordpress.ts`: hàm `isSpamPost()` loại mọi bài thuộc category id 1 hoặc slug/tiêu đề có từ khoá casino khỏi trang bài (404), `/blog`, category, author, RSS và `sitemap-blog.xml`; list request thêm `categories_exclude=1`. Đối chiếu 447 bài: chặn đủ 102/102 spam, 0 bài thật bị chặn nhầm. Lưới an toàn tạm thời, KHÔNG thay thế việc xoá trong WP. (`astro check`: 11 lỗi đã có từ trước, không có lỗi mới.)
