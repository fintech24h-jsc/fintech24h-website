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

## Cập nhật 2026-09-21 — kiểm tra trực tiếp wp-admin và cPanel (chỉ đọc)
**Đã xoá xong 102 bài spam** (xác minh: publish 345, category spam 0 bài đã xuất bản; 100 bản nháp và 19 bài thùng rác cũ giữ nguyên).

Kết quả kiểm tra:
| Hạng mục | Kết quả |
|---|---|
| Tài khoản WP | Chỉ 2 quản trị: `admin` (id 1, thanhphattdc@gmail.com) và `phat` (id 2). **Không có user lạ.** Toàn bộ spam đăng dưới `admin` |
| Application Passwords của `admin` | 3 cái: **`Autocontent11092026`** (tạo 11/09/2026, dùng gần nhất 20/09/2026, IP thấy được là IPv6 của Cloudflare `2a06:98c0:3600::103` nên không lộ IP thật), `phatvt!!` và `phatvt` (cùng tạo 01/07/2026, **chưa từng dùng**) |
| Plugin | Chỉ `Fintech24h Team Directory 1.2.0`, **trùng từng byte với bản trong repo** (không có AIOSEO/Rank Math đang chạy, không có mu-plugins/drop-ins) |
| Theme `fintech24h-headless` | Sạch: không eval, không gọi từ xa. Ghi chú trong code: XML-RPC và Application Passwords **cố ý để bật cho "Content Studio"** |
| `wp-content/uploads` | 4.420 file, **0 file PHP**, không file ẩn lạ |
| Core (`wp-admin`, `wp-includes`) | Không file ẩn, `cgi-bin` trống. Hàng loạt file được thay đồng thời lúc **17/09 20:02** (gồm `version.php`, `update-core.php`) → giống một lần auto-update core (`WP_AUTO_UPDATE_CORE=minor`), không phải sửa lẻ. Chưa chạy checksum chính thức |
| `wp-config.php` | Không có mã độc. Sửa lần cuối 14/09 03:44. Có hằng `CF_DEPLOY_HOOK` (URL deploy hook Cloudflare; **đã bị in ra trong phiên làm việc này**, nên coi là cần xoay vòng) |
| `php.error.log` | 727 lỗi fatal ngày 04–10/09: kiểu quét trực tiếp file trong `wp-includes/*.php` (bot dò quét). Dừng từ 12/09. Không thấy webshell |
| Access log | Có file `fintech24h.com-ssl_log-Sep-2026.gz` (2,5 MB) trong `/home/fintechh/logs` nhưng không đọc được qua API; cần tải từ cPanel → Raw Access để tìm POST lúc 18/09 16:28 UTC |

**Kết luận tạm (chưa chắc chắn):** không tìm thấy backdoor PHP hay file bị chèn trên máy chủ. Bài spam được tạo qua REST API bằng danh tính `admin`. Ứng viên số 1 là **hệ thống đăng bài tự động (Content Studio / Application Password `Autocontent…`)**, hoặc credential của nó bị lộ, hoặc chính pipeline đó đăng nhầm nội dung của dự án khác (đa ngôn ngữ, dạng SEO casino) vào site này. Cần kiểm tra ở phía Content Studio: xem [prompt-content-studio.md](prompt-content-studio.md).
Dòng thời gian: spam ID 2774–2985 nằm sau bài 2707 (14/09 01:58) và trước 2808 (15/09), tức bắt đầu khoảng 14/09; đợt 1win 18/09 16:28:11–14 UTC.

## Cập nhật 2026-09-21 (chiều) — kiểm tra trực tiếp VPS Content Studio
- **Spam vẫn còn 43 bài** (ID 3160–3224, tạo 19/09 10:45–19:39 UTC, không có đợt mới hơn). Astro đang ẩn chúng (404, không vào sitemap) nhưng chúng **chưa bị xoá** trong WP.
- WP: `Autocontent11092026` tạo **11/09 08:16 UTC**, dùng gần nhất **20/09 05:08 UTC** (khớp lúc Studio đăng bài KYC 3163 lúc 05:09), IP thấy được là IP Cloudflare. Đã thu hồi 2 mật khẩu `phatvt`, `phatvt!!` (chưa từng dùng) lúc 21/09.
- VPS `seo-studio-vps` (chỉ đọc): SSH chỉ có 1 key được dùng (key của bạn) từ 2 IP Việt Nam quen thuộc, 15 lần đoán mật khẩu thất bại; không process/cron/kết nối lạ; source app không có chuỗi casino/eval; log Studio từ 10/09 có **0** từ khoá casino; Studio **không có lệnh publish nào** trùng 18/09 16:28 UTC hay các đợt 14–17/09; mọi lệnh `publish` đến từ 4 IP Việt Nam của đội ngũ (75 lần, 07–20/09). Một IP ngoài VN (`202.60.111.166`) đăng nhập 16/09 chỉ đọc hộp thư/thông báo, không ghi.
- Cần xác nhận: `authorized_keys` của cả `ubuntu` và `studio` chứa 4 key không khớp máy Mac này: `ssh` (RSA), `vps2-render-tunnel`, `vpsweb2-revtunnel`, `no comment` (RSA). Chưa thấy key nào dùng trong log còn lưu.
- Rủi ro cấu hình: `studio.db` quyền 644 và backup `.tar.gz` (644) chứa `studio.db` + `.studio-key` + `.session-secret` cùng nhau (thư mục cha `/home/studio` 750 nên người dùng khác trên VPS chưa đọc được).
- `origin.fintech24h.com` trả REST trực tiếp (né Cloudflare/WAF); `workers/wp-proxy/worker.js` xoá IP thật của người gọi nên log WP không truy được kẻ tấn công.


## Cập nhật 2026-09-21 (tối) — KẾT LUẬN từ raw access log cPanel (04–20/09, 264.211 dòng)
**Bài spam không tạo bằng Application Password của Studio mà bằng phiên đăng nhập `admin` qua trình duyệt/bot.** 184 lệnh `POST /wp-json/wp/v2/posts → 201` chia theo User-Agent:
| UA | Số bài tạo | Thời gian (UTC) | Khớp với |
|---|---:|---|---|
| Chrome/124 Windows | 51 | 14/09 16:06 → 17/09 15:29 | 98 bài đợt 1 (cùng với dòng dưới) |
| Firefox/133 Windows | 47 | 14/09 16:23 → 17/09 14:23 | |
| Chrome/145 **Mac** | 4 | **18/09 16:28:11 → 16:28:14** | 4 bài 1win |
| Firefox/148 Windows | 43 | 19/09 10:45 → 19:39 | 43 bài đợt 3 |
| `SEO-Content-Studio/1.0` | 39 | 06–19/09, 1–8 bài/ngày | bài hợp lệ của Studio |

- Có **2 bot đăng nhập tự động** (Chrome/124 Win và Firefox/133 Win): mỗi bot ~3.100 lần `POST /wp-login.php` trả **302 (đăng nhập thành công)**, theo chuỗi cố định `GET wp-login → POST wp-login → GET wp-admin/ → admin-ajax → options-permalink.php → GET wp-json/`. Bắt đầu **04/09 08:24 UTC**, **vẫn hoạt động lúc 20/09 19:12 UTC** (log dừng ở đó). Nghĩa là kẻ tấn công **đang giữ mật khẩu đúng của `admin`** (hoặc cookie/phiên) và đăng nhập liên tục.
- 10/09 có 803 lần đăng nhập thất bại (Chrome/120 Win) → thử mật khẩu.
- Đợt 19/09 dùng Firefox/148 Win, chỉ 15 lần đăng nhập → thao tác thủ công, không phải bot cũ.
- Chrome/145 Mac tạo 4 bài 1win: cần bạn xác nhận đó có phải thiết bị/trình duyệt của bạn hoặc của thành viên nào không. Nếu không, đó là kẻ tấn công dùng UA Mac.
- Bộ log trong cPanel chỉ thấy IP Cloudflare (`2a06:98c0…`) vì `wp-proxy` xoá IP thật; không truy được IP kẻ tấn công. Sửa `wp-proxy` để chuyển `CF-Connecting-IP` là cần thiết.
- Rate-limit Cloudflare hiện tại (5 req/10 s) **không chặn được** vì bot đăng nhập ~1 lần/2 phút.
- **Studio không phải nguồn của các bài này** (UA Studio chỉ tạo 39 bài hợp lệ). Application Password `Autocontent` không liên quan tới spam theo bằng chứng này.

### Việc phải làm ngay (bạn tự thực hiện, vì là thay đổi bảo mật)
1. Đổi mật khẩu `admin` và `phat` (mật khẩu dài, ngẫu nhiên, duy nhất), bấm **"Đăng xuất khỏi mọi nơi"**, đổi `AUTH_KEY/SALT` trong `wp-config.php` (làm mất mọi cookie hiện có).
2. Bật 2FA cho mọi quản trị.
3. Tạo user quản trị mới có tên đăng nhập khó đoán, hạ `admin` xuống Editor hoặc xoá; hiện bot dùng đúng username `admin`.
4. Cloudflare WAF (dừng tạm cho tới khi có 2FA): rule **Block** trên `/wp-login.php` và `/wp-json/wp/v2/posts` (POST) khi User-Agent chứa `Chrome/124.0.0.0` hoặc `Firefox/133.0`; rule **Managed Challenge** cho `POST /wp-login.php`. Đây là chữ ký hiện tại của bot, không phải bảo vệ lâu dài.
5. Cài mu-plugin chống đăng lại: `wp-plugin/fintech24h-spam-guard/fintech24h-spam-guard.php` → `wp-content/mu-plugins/`.

## Điểm chung của bài spam (từ 102 bài đã lưu)
| Đặc điểm | Spam | Bài thật |
|---|---:|---:|
| Chỉ thuộc category "Chưa phân loại" (id 1) | 102/102 | 0/345 |
| Không có ảnh đại diện | 102/102 | 2/345 |
| Có ≥1 link ra domain ngoài | 102/102 | 169/345 |
| Đúng 1 domain ngoài | 101/102 | 51/345 |
| Tác giả `admin` (id 1) | 102/102 | 105/345 |
| Ngôn ngữ không phải tiếng Anh | 85/102 | 6/345 |
| Tiêu đề/slug có từ khoá casino | 79/102 | 3/345 |
| Không có tag | 102/102 | 305/345 |
| Không có excerpt tự viết | 102/102 | 327/345 |
| 300–1.100 từ | 101/102 | 96/345 |
| Đăng thẳng "publish", ngày lùi ~12 tháng (đợt 1), đợt dồn dập (20 bài/giờ, 4 bài/4 giây) | có | không |
| 103 domain ngoài khác nhau, TLD chủ yếu .nl .de .pl .fr .bet .ch .es | có | không |

Quy tắc mu-plugin (chuyển bài về **nháp**, không chặn cứng): (1) đăng vào category mặc định/không có category; (2) từ khoá cờ bạc + link ngoài; (3) link ngoài + nội dung không phải tiếng Anh; (4) ngày đăng lùi >7 ngày cho bài mới; (5) >4 bài mới/10 phút cùng tác giả. Đo trên 447 bài: rule (1) bắt 102/102 với 0 sai; nếu kẻ tấn công gán category thật thì rule (2)+(3) vẫn bắt 99/102 với 1 nhầm (bài cũ id 234), và plugin **bỏ qua bài đã đăng** nên không ảnh hưởng việc Studio cập nhật bài cũ. Mã đã parse hợp lệ (chưa chạy trên PHP thật vì máy không có PHP).
