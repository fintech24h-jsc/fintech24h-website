# Hướng dẫn: (1) Rule WAF Cloudflare, (2) cài mu-plugin Spam Guard

## Bằng chứng đã kiểm tra trước khi đề xuất
- 2 bot dùng đúng các UA: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) … Chrome/124.0.0.0 Safari/537.36` và `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0` (thêm biến thể Mac/Linux/Edg 124 của scanner).
- Log site 04–21/09: 57.470 request dùng 2 UA này; **~99,8% là chuỗi tấn công** (`wp-login`, `wp-admin`, `admin-ajax`, `wp-json`, `options-permalink`, tạo bài). Khách xem trang thật dùng Chrome 124: **3 request** trong 17 ngày.
- Đội ngũ (log nginx VPS Studio, 55.862 lượt) dùng **Chrome 152/153** trên Win/Mac. Không ai dùng Chrome 124/Firefox 133, nên rule không khoá người của bạn.
- Studio dùng UA `SEO-Content-Studio/1.0`, Astro dùng `Fintech24h-Astro-SSR/1.0`: không bị ảnh hưởng.
- Giới hạn: kẻ tấn công đổi UA là qua (bot Firefox/148 ngày 19/09 dùng UA thật). Đây là biện pháp tạm. Biện pháp thật là đổi mật khẩu + 2FA.

## 1. Cloudflare WAF (bạn thao tác, zone `fintech24h.com` ở tài khoản `fintech24hvn@gmail.com`)
Trình duyệt hiện tại chỉ đăng nhập tài khoản `thanhphattdc` (zone coinstori.com), nên cần đăng nhập đúng tài khoản.

**Đường vào:** Cloudflare → chọn zone `fintech24h.com` → **Security → WAF → Custom rules → Create rule**.
Gói Free cho tối đa 5 custom rule (đang có 1 rule chặn HTTP/1.x). Đặt rule mới **lên đầu**.

### Rule 1 — Block UA của bot
- Name: `Block WP bot UAs (Chrome124/Firefox133)`
- Bấm **Edit expression** và dán:
```
(
  (http.user_agent contains "Chrome/124.0.0.0" or http.user_agent contains "Firefox/133.0")
  and (
    http.request.uri.path contains "/wp-login.php"
    or http.request.uri.path contains "/wp-admin"
    or http.request.uri.path contains "/wp-json"
    or http.request.uri.path contains "/xmlrpc.php"
  )
)
```
- Action: **Block**. Deploy.
(Dùng `contains` chứ không dùng `starts_with`/regex vì gói Free.)

### Rule 2 (khuyến nghị) — Managed Challenge cho trang đăng nhập
- Name: `Challenge wp-login`
- Expression: `(http.request.uri.path eq "/wp-login.php")`
- Action: **Managed Challenge** (KHÔNG chọn Block). Bot dùng script sẽ không qua được bước GET đầu tiên; bạn đăng nhập bằng trình duyệt sẽ qua một lần kiểm tra.
- Không áp dụng cho `/wp-json` (Studio dùng Application Password, sẽ bị challenge nhầm).

### Kiểm tra sau khi bật (tôi chạy được khi bạn báo xong)
```bash
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
curl -s -o /dev/null -w "bot UA -> %{http_code}\n" -A "$UA" https://fintech24h.com/wp-login.php     # kỳ vọng 403
curl -s -o /dev/null -w "Studio UA REST -> %{http_code}\n" -A "SEO-Content-Studio/1.0" https://fintech24h.com/wp-json/wp/v2/posts?per_page=1   # kỳ vọng 200
```
Rồi vào Security → Events xem rule đang chặn bao nhiêu request.

### Rủi ro của phần này
- Chỉ chặn nhầm được ai dùng đúng Chrome 124 / Firefox 133 / Edge 124 để vào admin (đội bạn không dùng).
- Nếu sau này bạn (hoặc thành viên) dùng Chrome 124 thật: rule sẽ chặn, gỡ rule là xong.
- Rule 2 làm bạn thấy một trang xác minh khi đăng nhập.

## 2. Cài mu-plugin `fintech24h-spam-guard` v1.1.1 (cPanel File Manager)
Thư mục `wp-content/mu-plugins/` hiện **chưa tồn tại** (đã kiểm tra), cần tạo.
1. cPanel → **File Manager** → `public_html/wp-content` → **+ Folder** → tên `mu-plugins`.
2. Vào `mu-plugins` → **Upload** → chọn file `wp-plugin/fintech24h-spam-guard/fintech24h-spam-guard.php` (trong repo, máy bạn). Hoặc **+ File** đặt tên `fintech24h-spam-guard.php` rồi **Edit** và dán nội dung.
3. Kiểm tra: wp-admin → **Plugins** → xuất hiện tab **Must-Use** liệt kê "Fintech24h Spam Guard 1.1.1" (tab **Phải dùng / Must-Use**).
4. Nếu có sự cố: đổi tên file thành `fintech24h-spam-guard.php.off` là vô hiệu hoá ngay (không cần đụng code khác).

### Kiểm thử sau khi cài (tôi có thể chạy giúp và xoá bài thử ngay)
- Tạo bài thử tiêu đề `TEST casino`, nội dung có từ "casino" và 1 link `https://example.com` (đặt category bất kỳ), bấm **Publish** → kỳ vọng bài **tự về Draft**, và (nếu mail hoạt động) có email cảnh báo. Rồi xoá bài thử.
- Đăng 1 bài bình thường có category → phải giữ **Published**.

## Kết quả kiểm thử plugin (PHP 8.3.33 thật, giả lập hook WordPress)
| Kiểm thử | Kết quả |
|---|---|
| Cú pháp PHP | OK |
| Studio: tạo nháp có category rồi `publish` | giữ Published |
| Trình soạn thảo wp-admin: publish kèm category cùng request REST | giữ Published |
| Trình soạn thảo cổ điển có category | giữ Published |
| Bot: REST publish thẳng, không category | về Draft (rule E) |
| Bot: casino + link, đã gán category thật | về Draft (rule A) |
| Bot: tiếng Ba Lan + link | về Draft (rule B) |
| Bot: ngày đăng lùi 12 tháng | về Draft (rule C) |
| Bot: 6 bài publish trong 10 phút | bài 5 và 6 về Draft (rule D) |
| Bài đã đăng, sửa sau đó có chữ casino + link | không bị đụng |
| Nháp còn ở category mặc định rồi mới publish | về Draft (theo thiết kế) |
| Trang (page) | bỏ qua |
| 447 bài thật/spam đã lưu, mô phỏng đăng mới | spam **102/102** bị chặn; bài thật **1/345** (id 234) |

Lỗi tôi đã phát hiện và sửa trong quá trình kiểm thử: bản v1.0 kiểm tra category **trước** khi WordPress lưu category (REST lưu sau khi chèn), nên sẽ hạ nhầm mọi bài đăng từ trình soạn thảo và từ Studio về nháp. v1.1 kiểm tra category ở hook `rest_after_insert_post`.

### Lưu ý khi dùng
- 99 bản nháp Studio đang nằm ở category "Chưa phân loại". Nếu ai đăng chúng mà chưa đổi category, plugin sẽ đưa về Draft (kèm email). Đổi category trước khi đăng.
- Muốn đăng bài tiếng Việt/ngôn ngữ khác có link ngoài: đặt `F24H_GUARD_FOREIGN_RULE = false`.
- Studio khi bị quarantine sẽ nhận phản hồi 200 (thấy như đã đăng) nhưng bài là Draft; kiểm tra email/Drafts.
- Plugin chỉ ghi log lỗi PHP (`error_log`) và gửi mail qua `wp_mail`; hãy kiểm tra `admin_email` (Settings → General) đúng hộp thư bạn đọc. Mail của host có thể vào spam.

## Nhật ký lỗi đã phát hiện khi chạy thật (21/09/2026)
- Thư mục phải tên `mu-plugins` (có s). mu-plugin không có nút Activate; xem ở tab **Phải dùng (Must-Use)**.
- v1.1.0 trên site thật: bài thử category mặc định bị đưa về Draft (đúng), nhưng bài thử "casino + link ngoài" với category thật **vẫn đăng**. Nguyên nhân: `wp_insert_post_data` truyền dữ liệu đã **slashed** (`href=\"…\"`), regex link không khớp. Sửa ở v1.1.1 bằng `wp_unslash()`. Bộ giả lập kiểm thử đã được sửa để mô phỏng dữ liệu slashed (v1.1.0 fail 2/13 kịch bản, v1.1.1 đạt 13/13).
- Các bài thử (ID 3229, 3230) đã xoá vĩnh viễn.
