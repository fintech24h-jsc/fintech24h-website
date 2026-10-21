# Giai đoạn 1 — Khảo sát site Fintech24h (chỉ đọc)

Ngày lấy dữ liệu: 2026-09-19. Nguồn: WordPress REST `GET /wp/v2/posts?status=publish` (5 trang × 100, chỉ GET, cách nhau 2 giây) qua `origin.fintech24h.com`, cộng với đọc code trong repo và vài `curl` GET tới site live. Không ghi gì lên WordPress.
Bảng đầy đủ 447 bài: [`posts-inventory.csv`](posts-inventory.csv) (id, ngày, category, nhóm, số từ, tiêu đề, slug, URL, bài đang link tới, cờ lỗi).

## 1. Kiến trúc thật (đọc từ code)

| Hạng mục | Thực tế |
|---|---|
| Stack | Astro 4 `output: 'hybrid'` + `@astrojs/cloudflare` (Worker SSR), Tailwind, React islands |
| Nguồn nội dung | WordPress headless (`origin.fintech24h.com`, gray-cloud → 172.96.186.230) |
| SEO plugin | **AIOSEO** (không phải Rank Math/Yoast). Code có `getSeoTitle()` đọc `aioseo_meta_data.title` |
| URL bài | `https://fintech24h.com/blog/{slug}` (flat slug, category không nằm trong URL). `/{slug}` và `/{slug}/` bị `src/pages/[slug].astro` 301 về `/blog/{slug}` nếu bài tồn tại; `/blog/{slug}/` bị `src/middleware.ts` bỏ dấu `/` cuối |
| Render bài | **SSR mỗi request** (`prerender = false`), lấy WP live, cache Workers Cache API: fresh 180 giây, stale 7 ngày. Trang bài gửi `Cache-Control: no-cache` |
| Cache trong repo | **Không có.** Không có file JSON/MDX chứa bài trong repo, nên không có "file cache bị ghi đè khi sync" |
| Redirect thật | Site chạy Worker nên `public/_redirects` chỉ có tác dụng cho trang tĩnh. Redirect động nằm ở: `src/middleware.ts` (chuẩn hoá host/protocol/legacy path, chạy cho route SSR), `LEGACY_REDIRECTS` trong `src/pages/[slug].astro` và `src/pages/[...path].astro`. **Chưa có cơ chế 301 theo từng bài `/blog/{slug}`** → phải thêm (Giai đoạn 4 sẽ đề xuất code) |
| Rebuild khi lưu bài | **Không.** Lưu/đăng bài trên WP không kích hoạt build/deploy (không có webhook, không có `.github/workflows`; deploy chỉ chạy khi `git push` lên `main` qua Cloudflare Workers Builds). Thay đổi trong WP hiện ra sau tối đa ~3 phút. Vì vậy phần "gộp/huỷ build lẻ" của Giai đoạn 5 **không áp dụng** trừ khi ta push code redirect |
| SEO title | Trang live dùng `<title>{title} \| Fintech24h</title>`. Ví dụ `/blog/top-10-cybersecurity-companies-to-watch-in-2026` → "Top 10 cybersecurity companies to watch in 2026 \| Fintech24h" |
| JSON-LD | Site tự sinh `BlogPosting` + `BreadcrumbList`; **script JSON-LD nhúng trong thân bài bị `stripEmbeddedJsonLd()` xoá** khi render (`src/lib/utils.ts`) |
| Sitemap | `/sitemap-blog.xml` (SSR) liệt kê mọi bài publish: hiện **443 URL**, trong đó có ≥ 41 URL casino (xem mục 3.1) |

Hạn chế: REST ẩn danh **không trả `aioseo_meta_data`** (0/447 bài có) và không có `context=edit`. Vì vậy chưa đọc được SEO title/meta description do AIOSEO lưu trong WP. Muốn có phải dùng tài khoản/Application Password của bạn (chỉ để GET `context=edit`). Hệ quả phụ cần kiểm tra: nếu AIOSEO không expose field này thì SEO title tuỳ chỉnh chưa bao giờ đến được trang live.

## 2. Số liệu tổng quan (447 bài publish)

| Nhóm (tôi phân loại) | Số bài | Ghi chú |
|---|---:|---|
| Spam casino/cá cược (category "Chưa phân loại") | 79 | 2025-09 (75 bài) + 4 bài 1win đăng **2026-09-18** |
| Guest-post chèn link "Chưa phân loại" chủ đề khác | 23 | 2025-09; tiêu đề nghe vô hại nhưng thân bài link tới domain casino/ngoài |
| PR / partner / news (tin đối tác, sự kiện) | 61 | Fintech24h là media partner cho VAP Group, Blockchain Life, Forex Expo, GM Vietnam… |
| Toplist đại lý 2023–2024 | 39 | Cùng một ý định "top crypto/web3/blockchain marketing agencies" |
| Bài kiến thức khác 2023–2025 | 137 | |
| **Lô AI 2026-08-05 → 2026-09-18** | **100** | Không tính 8 bài Top 10 |
| Top 10 danh sách công ty (2026-09-10 → 09-18) | 8 | Chuỗi toplist mới nhất |

Category: Knowledge 284, Chưa phân loại 102, Partner Relationship 55, News 28. Số từ: trung vị 1.050, tối đa 4.824. Tác giả: user 1 viết 207 bài (gồm cả 102 bài "Chưa phân loại"), user 2 viết 240.

## 3. Phát hiện chính

### 3.1 (Nghiêm trọng) 102 bài "Chưa phân loại" là spam/link injection, và đang nằm trong sitemap
- 102 bài, cùng tác giả user 1, đa ngôn ngữ (DE, NL, FR, PL, ES, IT, FI, CZ, HU, RO, EL…), 300–650 từ, mỗi bài đăng một link ra một domain casino (`cleopatra-casino.ch`, `jamslots-casino.fr`, `21bit-casino.pl`, `zen-casino.cz`, `shibuspins.org`, `icefishin.it`…). Có bài tiêu đề về crypto/AI/nhạc/thiên văn nhưng vẫn chèn link casino.
- 98 bài đăng 2025-09-14→17 (dồn dập), **4 bài mới đăng 2026-09-18** (`1win-poland-…`, `1win-login-security-guide-for-canadian-players`, `1win-polska-…`, `1win-recenzja-…`, có link `1winbet.pl`). Bài 2026-09-18 xuất hiện chỉ 1 ngày trước ngày khảo sát.
- URL live: `/blog/1win-poland-kompletny-przewodnik-po-aplikacji-i-mobilnym-doswiadczeniu` trả **HTTP 200**. `sitemap-blog.xml` liệt kê chúng, tức đã gửi Google.
- Liên hệ với ghi chú sự cố 2026-07 (nghi backdoor tái nhiễm, GSC bị chèn sitemap): đây có thể là tài khoản/khoá còn bị kiểm soát, hoặc đăng guest-post trả phí do chính bạn/cộng sự cho phép. **Tôi không biết là loại nào, cần bạn xác nhận** trước khi coi là nhiễm độc.
- Ngoài phạm vi yêu cầu (SEO/bảo mật), chưa sửa gì. Đề xuất tách thành việc riêng.

### 3.2 Lô 100 bài AI tháng 8–9/2026 lệch thương hiệu, đồng khuôn
Đăng 2026-08-05 → 09-18, trung bình ~2,3 bài/ngày, liên kết chéo dày (nhiều bài có 15–19 bài link tới). Chủ đề (số bài, số từ min/TB/max):

| Cụm | Bài | Số từ | Nhận xét |
|---|---:|---|---|
| AI security | 16 | 951 / 1.546 / 3.243 | 15 bài đơn + 1 Top 10 châu Âu |
| Binance (cách hoạt động, phí, luật, API…) | 16 | 1.056 / 1.574 / 2.885 | Trùng ý định giữa "what is / how it works / guide" |
| Synthetic data | 10 | 1.048 / 1.460 / 1.874 | |
| Python | 10 | 1.066 / 1.481 / 1.769 | Ít liên quan fintech/marketing |
| NFC / mobile payments / tokenization | 8 | 1.015 / 1.608 / 2.719 | |
| Wallet interoperability / API docs | 7 | 1.020 / 1.448 / 1.820 | |
| GraphQL | 4 | 971 / 1.542 / 2.047 | Ngoài mảng |
| Insurance/InsurTech, CBDC, green finance, 6G, AI chatbots | 4/2/4/3/3 | | |
| Bài agency on-brand (Why most … fail…) | 10 | 955 / 1.400 / 2.118 | Cùng khuôn "Why most … fail to …?" |

Khuôn tiêu đề lặp (2 từ đầu, số bài): "Strategic trade-offs" 3, "Why most" 3, "Reality check" 2, "Operational playbook" 2, "Decision framework" 2, "Financial framework" 2, "Economic evaluation" 2, "Technical limitations" 2, "Financial impact" 2, "Strategic career" 2, "Operational realities" (id 2493). Số từ đều nhau đáng ngờ trong từng cụm (CV 0,14–0,37, các cụm Python/CBDC/Synthetic data đồng đều nhất).
Vấn đề: các cụm này (Python, GraphQL, 6G, Binance) không thuộc "fintech/blockchain marketing agency", có nguy cơ loãng chủ đề (topical authority) và cannibalize trong nội bộ cụm; cần quyết định giữ/gộp/gỡ ở Giai đoạn 4.

### 3.3 Toplist đã có
**Chuỗi mới (đều "Top 10", số công ty khớp tiêu đề, 2.582–3.243 từ):**

| ID | Ngày | URL | Tiêu đề |
|---|---|---|---|
| 2028 | 09-10 | `/blog/top-10-blockchain-companies-and-industry-leaders-to-watch-in-2026` | Top 10 blockchain companies and industry leaders to watch in 2026 (Fintech24h xếp **#4**) |
| 2582 | 09-11 | `/blog/top-10-saas-technology-companies-supporting-business-digital-transformation` | Top 10 SaaS technology companies supporting business digital transformation |
| 2707 | 09-14 | `/blog/top-10-cybersecurity-companies-to-watch-in-2026` | Top 10 cybersecurity companies to watch in 2026 |
| 2808 | 09-15 | `/blog/top-10-data-infrastructure-companies-shaping-the-future-of-data` | Top 10 data infrastructure companies shaping the future of data |
| 2867 | 09-16 | `/blog/top-10-singaporean-companies-shaping-the-future-of-ai-powered-financial-infrastructure` | Top 10 Singaporean companies shaping the future of AI-powered financial infrastructure |
| 2926 | 09-17 | `/blog/top-10-european-companies-building-infrastructure-for-ai-security` | Top 10 European companies building infrastructure for AI security |
| 3020 | 09-18 | `/blog/top-10-remote-workforce-management-platforms-canadian-businesses-should-consider-in-2026` | Top 10 remote workforce management platforms Canadian businesses should consider in 2026 |
| 2990 | 09-18 | `/blog/top-10-financial-planning-analysis-software-companies-2026` | Top 10 financial planning & analysis software companies 2026 |

Đặc điểm: tất cả mở bằng "Top 10" (8/8 cùng 2 từ đầu), trong đó 4 bài có chữ 2026 trong tiêu đề, mỗi bài có mục "Frequently Asked Questions" và (theo kiểm tra từ khoá) **chỉ 3/8 bài có câu chữ giống công bố tiêu chí/disclosure, không bài nào dùng `rel="sponsored"`** (chỉ 1 bài cũ 145 có). Mức phủ chủ đề: chưa có bài nào về marketing/PR/KOL, RWA, stablecoin, custody, payments, lending.

**Chuỗi cũ 2023–2024 (cùng ý định "top … marketing/PR/dev agencies"):** 39 bài, xem danh sách trong CSV (`group = Agency-toplist-2023-24`) và mục 4. Ví dụ tự cạnh tranh: "Top Web3 Marketing Agencies in 2024" (373), "Top 10 Blockchain Marketing Agencies" (147), "Best 13 Blockchain Marketing Agencies 2024" (145), "Top 7 Crypto Marketing Agencies of 2024" (251), "18 Best Crypto Marketing Agencies" (272), "Top Web3 Marketing Companies" (488), "WEB3 SEO AGENCY: Top 10 Web3 Agencies" (299)…

Fintech24h tự xếp mình #1 trong nhiều bài cũ (145, 251, 299) và #4 trong 2028. Chưa thấy ghi rõ xung đột lợi ích ở đa số bài.

### 3.4 Lỗi dữ liệu
- **Placeholder năm** (`[year]`, `{year}`, `%year%`, `[YYYY]`) trong tiêu đề, thân bài và JSON-LD: **không tìm thấy**. Chỉ có `[your token name]` (bài 796, chủ ý là ví dụ mẫu), `[contact us]`/`[Get a Free Proposal]` (bài 98, 102, 122, 9: chữ trong nút/khối text, không phải placeholder năm). Cho nên hàm thay thế `[year]` trong code sync vẫn có thể thêm để phòng ngừa, nhưng hiện không có lỗi cần vá. Đây cũng không có "sync": site đọc WP live.
- **Tiêu đề năm cũ:** 64 bài (không tính spam) còn 2023/2024/2025 trong tiêu đề, phần lớn là toplist 2024 (cờ `stale-year-in-title` trong CSV). Slug cũng gắn năm (ví dụ `…-in-2024`, `why-fixed-fee-blockchain-agency-pricing-models-2025-…`). Slug giữ URL nên chỉ sửa tiêu đề.
- **Số trong tiêu đề khớp số mục:** Top 7 (251) = 7 ✔, 13 (145) = 13 ✔, 18 (272) = 18 ✔, 10 (299, 310, 314) ✔; 8 bài Top 10 mới ✔. **147** ("Top 10 Blockchain Marketing Agencies") không có heading đánh số, không kiểm chứng được. **488** "Top Web3 Marketing Companies" không có số trong tiêu đề, thân có 12 mục đánh số. Một số tiêu đề toplist thiếu số nên không đủ điều kiện quy tắc "Top N" mới.
- **Slug lệch:** `5454-2` (id 106, bài LBank partner) là slug vô nghĩa; 2 bài trùng tiêu đề "Blockchain Forum 2025: Global Crypto Leaders to Meet in Moscow" (id 72 và 68, slug gần giống); "Fintech24h Joins Forces with Global Blockchain Show 2024" xuất hiện 2 lần (id 526 và 433, bài 433 rỗng). "Top Best Web3 Marketing Agency" (771) là cụm dư chữ. Slug ≠ tiêu đề kiểu "top-10 nhưng bài 5 mục": chưa thấy ca nào.
- **Bài mỏng < 600 từ (không tính spam):** 61 bài. Phân bố: Partner Relationship 31, Knowledge 13, News + Partner 12, News 4, Knowledge + Partner 1. Có 6 bài partner **0 từ** (id 427, 429, 431, 433, 435, 437, đăng 2024-04-05; có thể chỉ có hình/embed), cần xem tay. Phần lớn là tin PR ngắn, hợp lý cho dạng tin, nhưng 13 bài Knowledge dưới 600 từ đáng xem lại.
- **Slug vs SEO title:** không đối chiếu được (mục 1, cần AIOSEO qua `context=edit`).

### 3.5 Trùng lặp ý định / tự cạnh tranh
- Cụm "agency toplist" 39 bài + các bài landing "Fintech24h: Leading Blockchain Marketing Agency USA/UK/Asia/Singapore/Vietnam" (5 bài, mỗi bài ~1.000–1.950 từ) + các bài "Blockchain Marketing Agency: …" đều nhắm cùng nhóm từ khoá "blockchain/crypto/web3 marketing agency".
- Lô Binance 16 bài tự cạnh tranh trong cụm; lô AI security 16 bài tương tự.
- Bài được link nhiều nhất (bài chủ đề nền): "What is blockchain technology?" (810) nhận link từ 78 bài, "What is Blockchain Marketing?" (775) 38 bài, "Blockchain Marketing Agency: Elevate Your Web3 Project with Fintech24h" (155) 27 bài, "What is a Crypto Community?" (779) 27 bài.
- Trong 447 bài, 197 bài có ít nhất một link nội bộ trỏ tới, **250 bài không được link tới từ bài nào** (trừ menu/trang khác).

### 3.6 Liên kết nội bộ tới bài nghi ngờ (chi tiết ID nằm ở cột `inbound_from_ids` trong CSV)
Cụm agency-toplist 2023–24 nhận link từ nội bộ như sau (số bài link tới): 122 → 9, 147 → 8, 149 → 9, 151 → 6, 141 → 6, 348 → 5, 145 → 5, 130 → 4, 124 → 4, 488 → 3, 153 → 3, 137 → 3; phần lớn các toplist còn lại 0–1. Nghĩa là gộp/301 phần lớn toplist cũ ít làm vỡ link nội bộ, riêng các bài landing "Fintech24h: … Agency" và 147/145/149 cần đổi link khi gộp (Giai đoạn 4 liệt kê từng cái).
Các bài đại diện của lô AI 2026 nhận nhiều link chéo nhất: 1158 (19), 1157 (19), 1159 (17), 1579 (17), 1577 (16), 1160 (16), 1578 (15), 1583 (15). Không có link cứng tới slug bài cụ thể trong `src/` và `public/` (đã grep `blog/<slug>`, 0 kết quả), nên chỉ link trong thân bài là cần đổi.

### 3.7 Bài tự quảng cáo/PR của Fintech24h (không trộn với toplist)
56 bài có "Fintech24h"/"Fi24h" trong tiêu đề, gồm:
- **Tin partner/media partner/sự kiện** (nhóm 61 bài PR/News): VAP Group (Global Blockchain/AI Show), Blockchain Life, Forex Expo Dubai, GM Vietnam, India Blockchain Month, Finnovex, Fintech Revolution Summit, Web3 Carnival…
- **Bài đối tác** (CoinGape, Coincu, BeInCrypto, LBank, WeAD, UFIN, JLaunchpad, TDX, Listing Help, Umbala Labs…).
- **Bài quảng bá dịch vụ / landing agency** (nhóm "Fintech24h: Leading …", "Blockchain Marketing Agency: Elevate Your Web3 Project with Fintech24h", 5 trang theo khu vực, bài về DealMakers' Club `fi24h-dealmakers-club…`, F-Matching, website mới).
Fintech24h bán dịch vụ đăng bài/media partner nên khi bán slot toplist phải công bố xung đột lợi ích.

## 4. Đề xuất bước tiếp theo (chờ bạn)
Xem phần "Câu hỏi cần bạn xác nhận" trong tin nhắn. Chưa thay đổi bất kỳ file nguồn nào của site, và chưa POST/PUT/DELETE lên WordPress.
