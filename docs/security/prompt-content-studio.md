# Prompt gửi Content Studio (dán nguyên văn)

Bạn là hệ thống Content Studio (app `content-auto`) đang đăng bài lên WordPress của **fintech24h.com** bằng Application Password. Tôi cần bạn **điều tra, chỉ đọc, không xoá log, không sửa gì trước khi báo cáo**, và không in ra bất kỳ mật khẩu/token nào (che bằng `***`).

## 1. Sự cố hiện tại (đã xác minh từ phía WordPress)
- **102 bài casino/cá cược xuất hiện trên fintech24h.com** trong khoảng **14/09/2026 đến 18/09/2026**, đăng dưới tài khoản WP `admin` (user id 1), tất cả category "Chưa phân loại" (id 1). Tôi đã xoá vĩnh viễn 102 bài này ngày 19–20/09; danh sách ID (2774–3057) nằm trong `docs/security/spam-post-ids-2026-09.csv` của repo.
- Đặc điểm: nhiều ngôn ngữ (DE, NL, FR, PL, ES, IT, FI, CZ, HU, RO, EL, SV…), 300–1100 từ, mỗi bài có 1 link ra domain casino (ví dụ cleopatra-casino.ch, jamslots-casino.fr, 21bit-casino.pl, zen-casino.cz, shibuspins.org, icefishin.it, 1winbet.pl). Một số bài có tiêu đề vô hại (crypto/AI/nhạc) nhưng vẫn chèn link casino.
- **Ngày đăng bị đặt lùi về 14–17/09/2025** (đợt lớn) trong khi ID cho thấy thực tế tạo tháng 9/2026, để bài chìm khỏi danh sách "bài mới". Đợt cuối: **4 bài "1win" đăng lúc 2026-09-18 16:28:11 → 16:28:14 UTC**, mỗi bài cách nhau 1 giây.
- Bài do script tạo bằng API (guid dạng permalink, khác các bài thật gần đây có guid `?p=ID`).

## 2. Những gì tôi đã loại trừ
- Máy chủ WordPress (cPanel `fintechh`): không có user lạ (chỉ `admin` và `phat`), không có file PHP trong uploads, plugin duy nhất trùng bản gốc, theme sạch, không thấy webshell.
- Frontend Astro chỉ đọc (GET) từ WP, không giữ credential ghi.

## 3. Điểm đáng ngờ liên quan trực tiếp tới bạn
- Trong WP có Application Password tên **`Autocontent11092026`** của user `admin`: **tạo 11/09/2026, sử dụng gần nhất 20/09/2026** (tức là vẫn được dùng sau khi spam bị phát hiện). Còn 2 mật khẩu `phatvt` và `phatvt!!` (tạo 01/07/2026, chưa từng dùng).
- Theme WordPress ghi rõ XML-RPC và Application Passwords được bật riêng cho "Content Studio". Nên mọi hành động bằng credential này đều hiện là `admin`.
- `wp-config.php` của WP có `CF_DEPLOY_HOOK` (deploy hook Cloudflare). Tôi chưa biết thành phần nào gọi nó. Có thể mỗi lần đăng bài kích hoạt một build.

## 4. Hãy kiểm tra và trả lời, kèm bằng chứng (đoạn log đã che secret)
1. **Log đăng bài**: liệt kê MỌI request tạo/sửa bài gửi tới fintech24h.com từ **10/09 đến 21/09/2026** (thời điểm UTC, endpoint, HTTP method, job/run id, người hoặc tác nhân kích hoạt). Đặc biệt **2026-09-18 16:28:10–16:28:15 UTC** và các đợt **14–17/09**.
2. Có job/campaign/template nào tạo nội dung **casino, cá cược, 1win** hoặc nhiều ngôn ngữ châu Âu không? Nếu có: của dự án/khách nào, cấu hình target WP nào, vì sao trỏ vào fintech24h.com?
3. **Nguồn nội dung**: các bài đó do LLM sinh, nhập từ file/CSV/API ngoài, hay do người dùng hoặc khách hàng của Content Studio gửi vào? Có chức năng "guest post", "sponsored", "backlink insertion" nào tự chèn link ngoài không?
4. Tại sao **ngày đăng bị đặt về 09/2025**? Có tham số `date`/`schedule`/`backdate` trong code không?
5. **Bảo mật credential**: Application Password `Autocontent11092026` được lưu ở đâu (env, DB, file, repo, log)? Ai/dịch vụ nào đọc được? Đã từng xuất hiện trong log, backup, ảnh chụp màn hình, repo git, tin nhắn hay bị commit chưa? Có user nào khác của Content Studio dùng chung không? Kiểm tra `git log -S` và các file `.env`.
6. **Truy cập vào chính Content Studio**: danh sách tài khoản, API key, SSH key, phiên đăng nhập gần đây; có đăng nhập lạ từ IP lạ từ 10/09 không? Kiểm tra cron, tiến trình chạy nền, gói pip/npm mới cài, file sửa trong `/home/studio/content-auto` từ 10/09. Có dấu hiệu bị chiếm quyền không?
7. Có site WordPress **khác** cùng dùng Content Studio bị đăng nội dung tương tự không? Có dự án khác có credential của fintech24h.com không?
8. Ai/cái gì gọi **`CF_DEPLOY_HOOK`**? Mỗi lần đăng bài có kích hoạt build Cloudflare không, và có debounce/gộp không? (Sitemap và RSS của site từng bị build rỗng vì build chạy lúc WP phản hồi chậm.)

## 5. Hành động đề xuất (hỏi tôi trước khi thực hiện, KHÔNG tự làm)
- Tạm dừng mọi job đăng bài lên fintech24h.com cho tới khi có kết luận.
- Tạo Application Password mới cho một user riêng **có quyền tối thiểu (Author/Editor, không phải Administrator)**, chỉ đủ để tạo bài ở trạng thái **draft**; tôi sẽ thu hồi `Autocontent11092026`, `phatvt`, `phatvt!!`.
- Bắt buộc mọi bài ra ngoài category cho phép phải ở draft, cấm chèn link ngoài domain không nằm trong whitelist, cấm đặt ngày đăng quá khứ, và ghi log mỗi lần đăng (job id, người kích hoạt, hash nội dung).
- Đề xuất cơ chế phát hiện: cảnh báo khi số bài đăng/giờ vượt ngưỡng hoặc nội dung chứa từ khoá casino/betting.

## 6. Định dạng báo cáo
Trả về: (a) kết luận 3 dòng: Content Studio **có phải** nguồn phát sinh 102 bài hay không, kèm mức chắc chắn; (b) dòng thời gian bằng chứng; (c) danh sách phát hiện với mức độ; (d) hành động đã làm (nên là 0) và hành động đề xuất; (e) những gì bạn **không xác minh được**. Không suy đoán mà ghi "chưa xác minh".
