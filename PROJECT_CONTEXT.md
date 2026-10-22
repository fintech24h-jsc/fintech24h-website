# PROJECT_CONTEXT.md — Hồ sơ đầy đủ dự án Fintech24h (dành cho mọi AI)

> **Mục đích:** bất kỳ AI nào (Claude Code, Codex, ...) ở bất kỳ tài khoản/máy nào, chỉ cần đọc file này là hiểu dự án là gì, đang chạy trên hạ tầng nào, đã làm gì, cái gì cấm đụng, cái gì còn dở. **Đọc hết file này TRƯỚC KHI chạm vào code.** Sau đó đọc `CLAUDE.md` (hoặc `AGENTS.md`) cho design system, và `DEPLOYMENT.md` nếu đụng vào deploy/WordPress.
>
> **Cập nhật gần nhất:** 2026-10-07 (tạo file). Mục 16 (Nhật ký thay đổi) là **append-only**: mỗi ngày làm việc phải thêm 1 mục mới ở đó.

---

## 0. QUY TẮC DÀNH CHO AI (ĐỌC TRƯỚC)

### 0.1 Quy tắc cập nhật file này (BẮT BUỘC, mỗi ngày làm việc)

Cuối mỗi phiên làm việc (hoặc ngay sau mỗi thay đổi đáng kể), AI **phải** thêm 1 mục vào **Mục 16 — Nhật ký thay đổi** theo mẫu:

```
### YYYY-MM-DD
- **Đã làm:** (thêm/sửa/xoá gì, ở file nào, commit nào nếu có)
- **Vì sao:** (yêu cầu của chủ dự án / lỗi gốc là gì)
- **Trạng thái:** (đã deploy & verify live / mới commit local / dang dở)
- **Việc còn lại / lưu ý cho AI sau:** (nếu có)
```

Ngoài nhật ký, nếu thay đổi làm **sai lệch** một phần khác của file này (ví dụ thêm Worker mới, đổi hạ tầng, thêm route, đổi quy tắc, xử lý xong 1 mục ở Mục 13), phải **sửa luôn phần đó** và ghi vào Mục 16. Không để file tự mâu thuẫn với thực tế. Không bao giờ ghi token/mật khẩu/API key vào file này.

### 0.2 Cách chủ dự án làm việc (rút từ rất nhiều phiên)

- Chủ dự án: **Phat Vo** (CPO, Fintech24h). Giao tiếp bằng **tiếng Việt**; nội dung website thì **tiếng Anh**.
- Muốn AI **tự làm đến cùng rồi báo cáo ngắn gọn**, không hỏi lại vặt. Chỉ hỏi khi quyết định thật sự của chủ dự án (xoá dữ liệu, thay đổi hiển thị, tốn tiền, đụng hạ tầng ngoài repo).
- **Luôn verify trên live** sau khi deploy (curl / chụp màn hình), đừng báo "xong" chỉ vì build xanh. Xem `DEPLOYMENT.md`.
- Git: chỉ commit/push khi được yêu cầu ("commit và deploy"). Commit message kết thúc bằng dòng `Co-Authored-By: Claude ...` theo cấu hình của Claude Code hiện hành.
- Nhiều AI/phiên có thể **làm song song trên cùng repo** (có nhiều branch `claude/*`, `codex/*` và thư mục `.claude/worktrees/`). Trước khi sửa: chạy `git status` + `git log -5`; nếu thấy file đã bị đổi mà mình không làm, **coi là có chủ đích, không revert**. Chỉ `git add` đúng file mình sửa, không `git add -A`.

### 0.3 Sở thích/luật cứng của chủ dự án (đừng vi phạm)

1. **Giữ nguyên hiển thị & hiệu ứng hiện có** khi tối ưu (performance/refactor): chỉ làm thay đổi "vô hình". Muốn đổi giao diện/animation phải hỏi trước.
2. **Không dùng dấu gạch ngang dài "—" (em-dash)** trong nội dung hiển thị: chủ dự án thấy nó "giống AI". Dùng dấu chấm, phẩy, hai chấm. (Giữ trong code comment, và trong thẻ `<title>` kiểu "Tên trang — Fintech24h" là quy ước SEO. En-dash trong khoảng số như `$500K–$1M` thì được.)
3. **Chữ nội dung phải đủ lớn, dễ đọc** (đã nâng `text-sm`→15px, `text-base`→17px ngày 2026-09-06). Không thu nhỏ lại.
4. **Không tạo subdomain mới.** Dùng lại `origin.fintech24h.com` đã có.
5. **DealMakers' Club (`/dealmakers/*`) là microsite độc lập về thiết kế** (header/footer/màu/font riêng). Không dùng chung `BaseLayout`/`Navbar`/`Footer`/`global.css`/màu cyan-purple/font Space Grotesk ở đó. Tránh look "AI template" (lưới icon đều nhau, hiệu ứng mờ nhạt).
6. **i18n DealMakers:** sửa copy tiếng Anh của `/dealmakers/*` thì **phải cập nhật luôn bản dịch** các ngôn ngữ khác (hiện có `ar`, `zh`; sau này thêm nữa cũng áp dụng).
7. **Không đoán/viết đè code Google Apps Script.** Luôn xin bản code hiện tại từ chủ dự án, chỉ sửa kiểu thêm nhánh (additive), test thật, chờ chủ dự án xác nhận.
8. **Không chặn theo quốc gia** ở Cloudflare (khách toàn cầu, Googlebot crawl từ US).
9. Nhiều thao tác cần quyền ngoài repo (WordPress admin/SSH, Google Apps Script editor, Cloudflare dashboard, Google Search Console): AI **không có**. Khi gặp, hướng dẫn chủ dự án làm, đừng giả vờ đã làm.

---

## 1. DỰ ÁN LÀ GÌ

**Fintech24h** (https://fintech24h.com): Blockchain, Fintech & AI marketing agency, trụ sở TP.HCM, Việt Nam (1014 Phạm Văn Đồng, Hiệp Bình). Email: info@fintech24h.com.

Website là **"Revenue Engine"**, không phải portfolio: mục tiêu chuyển Traffic → Leads → Discovery Calls → doanh thu **$20k–$60k/tháng**. Mọi CTA phục vụ việc này.

**6 dịch vụ cốt lõi (không thêm bớt):** KOL & Influencer Marketing, PR & Media, Community Growth & Management, Event Marketing, AI Marketing, Business Development. Ngoài ra có trang Custom Solutions.

**Các mảng trên cùng một repo:**

| Mảng | Là gì |
|---|---|
| Site chính | Trang chủ, About, Services (6 + custom), Contact, Careers, Case Studies (đang ẩn), Privacy/Terms |
| Blog | Bài lấy live từ WordPress headless, ~447 bài, có sidebar TOC, phân trang, category, author |
| SEO pillar pages | 3 trang "Blockchain marketing agency in Vietnam / Singapore / Dubai" |
| **DealMakers' Club** | Microsite chương trình kết nối Founder–Investor "F-Matching Season 3", 3 ngôn ngữ (en/ar/zh) |
| Verify Members | `/verify-members/` công cụ chống giả mạo nhân sự Fintech24h |
| Hạ tầng phụ | 4 Cloudflare Worker, Google Apps Script backend cho form, 2 plugin WordPress, bot Telegram |

Hệ sinh thái liên quan (hiển thị ở footer): Coinstori (coinstori.com), CMO Intern (cmointern.com).

---

## 2. KIẾN TRÚC THỰC TẾ (HIỆN TẠI)

> ⚠️ `CLAUDE.md`/`AGENTS.md` mục 2 mô tả kiến trúc **cũ** ("static output → Cloudflare Pages, GitHub Actions"). **Thực tế khác:** xem dưới. Phần design system/animation trong CLAUDE.md vẫn đúng.

```
                         ┌────────────────────────────────────────────┐
 Trình duyệt/Googlebot → │ Cloudflare edge (zone fintech24h.com)       │
                         └───────────────┬────────────────────────────┘
                                         │
        path khớp 7 pattern WP?          │
   /wp-admin/* /wp-login* /wp-json/*     │
   /wp-content/* /wp-includes/*          │
   /wp-cron.php*                         │
        ├── CÓ ──► Worker fintech24h-wp-proxy ──► origin.fintech24h.com (VPS LiteSpeed, WordPress)
        └── KHÔNG ► Worker fintech24h-website (Astro 4, output "hybrid", @astrojs/cloudflare)
                       ├─ trang tĩnh (prerender): about, services, contact, privacy, terms, careers, ...
                       └─ trang SSR (prerender=false): /, /blog/*, /author/*, sitemap-blog.xml, rss.xml,
                          [slug], [...path]  ──► fetch THẲNG origin.fintech24h.com/wp-json (bỏ qua wp-proxy)
                                                  + cache Workers Cache API (fresh 180s, stale 7 ngày)
```

| Lớp | Công nghệ thật |
|---|---|
| Frontend | **Astro 4.x**, `output: 'hybrid'`, adapter `@astrojs/cloudflare` ^11 |
| Styling | Tailwind CSS 3 + CSS variables (`src/styles/global.css`); DealMakers có `dealmakers.css` riêng |
| React islands | Form (`ServiceInquiryForm`, `JobApplicationForm`, DealMakers forms/directory/CommunityActivity), `CalendlyEmbed` |
| Animation | CSS + IntersectionObserver là chính (GSAP đã gỡ khỏi critical path 2026-07-01); GSAP còn dùng cục bộ ở vài section (vd GlobalNetwork load khi vào viewport) |
| CMS | **WordPress headless** (SEO plugin: **AIOSEO**; REST công khai chỉ GET) |
| Hosting site | **Cloudflare Worker `fintech24h-website`** (Workers + Static Assets), KHÔNG phải Pages |
| Hosting WordPress | VPS/cPanel LiteSpeed, hostname `origin.fintech24h.com` (DNS-only/gray-cloud) |
| Lead backend | **Google Apps Script** Web App (Sheet + Telegram + Email) + HubSpot Forms API (tùy chọn) |
| Analytics | GA4 `G-4TDZQMBWLR` chạy qua Partytown; chỉ chạy sau khi người dùng đồng ý cookie |
| Agent discovery | RFC 8288 Link headers, `/.well-known/api-catalog`, `public/auth.md` |

**Deploy:** push `main` → Cloudflare Workers Builds (cấu hình trong Dashboard, **không có** `.github/workflows`) → `npm run build` → `npx wrangler deploy` (đọc `wrangler.jsonc`). Chi tiết + 3 lỗi đã gặp: **`DEPLOYMENT.md`**.

---

## 3. HẠ TẦNG & TÀI KHOẢN (không chứa secret)

| Thứ | Giá trị / ghi chú |
|---|---|
| Cloudflare account chứa mọi thứ của dự án | `fintech24hvn@gmail.com`, account id `f19a1ad20a5cf825ec8530f167aacc30`. Zone `fintech24h.com` id `7c7732422232ad012784405b66a44bdb` |
| Cloudflare account KHÁC (đừng nhầm) | `thanhphattdc@gmail.com` (zone coinstori.com). `wrangler login` phải đúng tài khoản `fintech24hvn` khi deploy Worker |
| Worker | `fintech24h-website` (site), `fintech24h-wp-proxy`, `fintech24h-blog-monitor` (cron), `fintech24h-dealmakers-community` (Telegram + D1) |
| Project Pages thừa | `fintech24h` (chỉ `fintech24h.pages.dev`, không dùng). `wrangler pages ...` chỉ chạm project thừa này, **không** ảnh hưởng site live |
| Origin WordPress | `origin.fintech24h.com`, A record DNS-only. IP trong tài liệu cũ: `172.96.186.230`; báo cáo 2026-09-21 ghi DNS hiện tại là `172.96.191.232` (cả hai cùng phục vụ WP, cùng DB). Xem `docs/security/origin-lock-risk-report.md` |
| Wrangler | Dev dependency `wrangler ^4`. Phải ghim ^4 mới có tác dụng `assets.html_handling` (sự cố 2026-08-27) |
| Google Apps Script | Source tham khảo trong repo: `workers/apps-script/Code.gs` (đã bỏ secret, dùng placeholder). Bản live giữ token Telegram trong source (xem Mục 13). URL `/exec` hardcode làm fallback trong `src/lib/leadSubmit.ts` (`DEFAULT_LEAD_WEBHOOK`) |
| Biến môi trường dùng trong code | `PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`, `PUBLIC_CAREERS_WEBHOOK_URL` (fallback hardcode), `PUBLIC_HUBSPOT_PORTAL_ID`, `PUBLIC_HUBSPOT_FORM_ID`, `PUBLIC_DEALMAKERS_PULSE_API_URL`, `WP_API_URL` (tùy chọn). File `.env` không commit |
| Telegram | Một bot dùng chung cho thông báo lead + blog-monitor. Token/chat id là **Worker secrets / Script Properties**, không nằm trong code |
| IndexNow | 2 key file trong `public/`: `4e228d27...txt` (key mà `scripts/indexnow-submit.mjs` dùng) và `55651ac1...txt` (cho hệ thống "SEO Content Studio"). Phải nằm ở `public/` của repo Astro (không phải WordPress), vì Astro Worker sở hữu gốc domain |
| SEO Content Studio | Hệ thống ngoài (VPS `seo-studio-vps`, app `content-auto`) tự đăng bài AI lên WordPress bằng Application Password. **Nghi vấn là nguồn/đường vào của sự cố spam 09/2026** (Mục 11) |
| Search Console | Property `sc-domain:fintech24h.com`. Từng có email lạ được thêm làm owner + sitemap độc (07/2026): luôn kiểm tra Settings → Users and permissions |

---

## 4. BẢN ĐỒ REPO

```
/
├── CLAUDE.md / AGENTS.md        # Luật thiết kế + animation (cho Claude / Codex). Bắt buộc đọc.
├── PROJECT_CONTEXT.md           # (file này) hồ sơ tổng thể + nhật ký thay đổi
├── DEPLOYMENT.md                # Pipeline deploy + 3 sự cố 2026-07-05 + runbook chẩn đoán
├── design-system.md, animation-system.md, anti-ai-patterns.md, fintech24h-design-SKILL.md
├── FINTECH24H_SERVICES_CONTENT_AND_PROMPT.md, Fintech24h_Brand_SEO_Guide.(docx|txt)  # nội dung/brand
├── wrangler.jsonc               # ⚠️ KHÔNG XOÁ. Cấu hình deploy của Worker site chính
├── astro.config.mjs, tailwind.config.mjs, tsconfig.json, package.json
├── public/                      # file tĩnh copy nguyên vào dist/
│   ├── .assetsignore            # ⚠️ KHÔNG XOÁ. Chứa "_worker.js"
│   ├── _headers, _redirects, _routes.json, robots.txt, consent.js, auth.md
│   ├── <key>.txt ×2             # IndexNow
│   ├── dealmakers/              # logo đối tác, ảnh member, og-ss3.png
│   └── og-{vietnam,singapore,dubai}.png, images/, favicon.*
├── src/
│   ├── middleware.ts            # chuẩn hoá host/https/legacy URL, 301; bỏ qua localhost
│   ├── layouts/                 # BaseLayout, BlogLayout, ServiceLayout, DealMakersLayout (độc lập)
│   ├── pages/                   # (xem Mục 5)
│   ├── components/
│   │   ├── layout/              # NavbarFast.astro (đang dùng), Footer, MobileMenu, (Navbar/NavbarReact cũ)
│   │   ├── sections/            # Hero, ServicesGrid, TrustBar, GlobalNetwork, Process, Faq, BlogHighlight, ...
│   │   │   └── dealmakers/      # mọi section của microsite
│   │   ├── seo/                 # SchemaOrg, BreadcrumbSchema, OpenGraph
│   │   └── ui/                  # Button, Card, Badge, CookieBanner, forms, CalendlyEmbed, Pagination
│   ├── lib/                     # wordpress.ts, leadSubmit.ts, hubspot.ts, utils.ts, verify-team.ts
│   ├── data/                    # services, clients, team, jobs, navigation, categorySeo, features
│   │   └── dealmakers/          # ss3(.ar/.zh).ts, content.ts, chrome.ts, members.ts, seasons.ts
│   └── styles/                  # global.css (tokens), dealmakers.css (design system riêng)
├── workers/
│   ├── wp-proxy/                # Worker proxy WordPress  (đọc INCIDENT-README.md trước khi sửa)
│   ├── blog-monitor/            # Cron 2h kiểm tra /blog, báo Telegram  (INCIDENT-README.md)
│   ├── dealmakers-community/    # Telegram webhook + D1 cho "Community Activity" (README.md)
│   └── apps-script/Code.gs      # bản tham khảo backend form (KHÔNG tự deploy)
├── wp-plugin/                   # mu-plugin WordPress, cài tay lên server
│   ├── fintech24h-spam-guard/   # v1.1.1, đưa bài nghi spam về draft
│   └── fintech24h-team-directory/ # CPT team_member + Ecosystem Links cho /verify-members
├── scripts/
│   ├── indexnow-submit.mjs      # chạy ở postbuild, gửi URL sitemap lên IndexNow
│   └── dealmakers-members-scraper/  # dựng lại members.ts từ site nguồn (README có hướng dẫn)
└── docs/
    ├── security/                # báo cáo sự cố spam 09/2026, origin-lock, WAF, prompt cho Content Studio
    └── toplist-audit/           # khảo sát 447 bài (posts-inventory.csv)
```

---

## 5. BẢN ĐỒ ROUTE

**Tĩnh (prerender):** `/about`, `/contact`, `/privacy`, `/terms`, `/services` + 6 trang dịch vụ + `/services/custom-solutions`, `/careers`, `/careers/[slug]` (2 vị trí: Content & Social Media Specialist, Community & Partnership Specialist), `/case-studies` (+`[slug]`; **đang noindex/ẩn** vì WP chưa có CPT `case-study`), 3 pillar `/blockchain-marketing-agency-{vietnam,singapore,dubai}`, `/dealmakers/*`, `/verify-members`, `404`.

**SSR (`prerender=false`):** `/` (trang chủ, vì có BlogHighlight), `/blog`, `/blog/[slug]`, `/blog/page/[page]`, `/blog/category/[category](/page/[page])`, `/author/[...path]`, `/category/[slug]` (legacy), `/[slug]` (301 URL WP cũ về `/blog/{slug}`), `/[...path]` (catch-all + legacy redirect), `/sitemap-blog.xml`, `/rss.xml`.

**DealMakers:** `/dealmakers/` (301 → mùa active), `/dealmakers/ss3/` (landing), `/ss3/join/` (form vào group Telegram, URL riêng để staff gửi cho ứng viên), `/ss3/partner-benefits/`, `/dealmakers/members/` (thư viện member xuyên mùa). Bản dịch: `/dealmakers/ar/...` (RTL) và `/dealmakers/zh/...`.

**URL chuẩn:** trang tĩnh có dấu `/` cuối (`/about/`); blog/author **không** có `/` cuối (`/blog/{slug}`). Điều này do `wrangler.jsonc` (`html_handling: force-trailing-slash`) + `public/_redirects` + `src/middleware.ts` phối hợp. Đổi một trong ba thì phải kiểm tra cả ba.

---

## 6. LUỒNG DỮ LIỆU CHÍNH

### 6.1 WordPress → website (`src/lib/wordpress.ts`)

- `WP_API_BASE` mặc định `https://origin.fintech24h.com/wp-json/wp/v2`, gửi header `Host: fintech24h.com`, UA `Fintech24h-Astro-SSR/1.0`. **Không** quay lại `https://fintech24h.com/wp-json` (gây lỗi 522, xem DEPLOYMENT.md).
- `fetchWP()` cache bằng Workers Cache API: **fresh 180s**, **stale 7 ngày** (dùng khi WP lỗi). `cf.cacheEverything` KHÔNG hiệu quả với request Worker-to-Worker cùng zone.
- Production **không bao giờ fallback sang `MOCK_POSTS`** (chỉ khi `import.meta.env.DEV`). Lỗi thì trả rỗng.
- `isBlogAvailable()` (memoized): menu Blog, link footer, section BlogHighlight trên trang chủ tự **ẩn** khi không lấy được bài.
- Nội dung bài render bằng `set:html`. Hai lớp bảo vệ: `stripEmbeddedJsonLd()` (xoá `<script type="application/ld+json">` nhúng trong thân bài vì có bài chứa JSON hỏng) và `stripHtml()` (xoá luôn nội dung script/style khi tạo excerpt).
- **Bài spam casino/cá cược bị chặn khỏi render, danh sách, RSS, sitemap** (phía Astro, commit 2026-09-19). Plugin `fintech24h-spam-guard` chặn ở phía WordPress.
- `<title>`/og dùng `getSeoTitle()` đọc tiêu đề AIOSEO nếu có.
- WordPress KHÔNG kích hoạt build khi đăng bài. Bài mới hiện sau tối đa ~3 phút nhờ SSR + cache.

### 6.2 Form lead (`src/lib/leadSubmit.ts` → Apps Script)

`submitLead(data, formType, hubspotFields?)` → `fetch(webhook, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON})`. **Không đọc response** (Apps Script trả 302 sang `googleusercontent.com/macros/echo`, đọc cross-origin không ổn định). Fetch resolve = thành công; chỉ lỗi mạng mới báo lỗi.

Backend `doPost` rẽ theo `formType`:
- `dealmakers-ss3` → sheet "DealMakers Apply to Join"
- `dealmakers-ss3-telegram-join` → sheet "DealMakers Telegram Join" (group `@Fi24h_DealMakers_Club`)
- bắt đầu bằng `Job Application` → sheet "Job Applications" (+ lưu CV vào Drive, `JOB_DRIVE_FOLDER_ID`)
- mọi loại khác (Service Inquiry, Contact, Custom Solutions, ...) → sheet "Leads"

Mỗi nhánh có sheet + định dạng Telegram + email riêng. Cột `Status` có dropdown (Pending/Approved/Rejected) cho 2 nhánh DealMakers. Form có checkbox đồng ý marketing (tùy chọn, thêm 2026-08-24). Calendly chỉ nạp sau khi người dùng bấm đồng ý.

**Quy trình sửa Apps Script:** xin bản live từ chủ dự án → sửa additive → kiểm cú pháp `node -e "new Function(src)"` → chủ dự án dán vào editor và Deploy → **Manage deployments → New version của deployment CŨ** (tạo deployment mới sẽ đổi URL `/exec` và làm hỏng site) → test bằng `curl` với dữ liệu ghi rõ `TEST — ignore/delete` → chủ dự án xác nhận → cập nhật lại `workers/apps-script/Code.gs` trong repo.

### 6.3 Đồng ý cookie

`src/components/ui/CookieBanner.astro` + `public/consent.js`: GA4 chỉ chạy sau khi đồng ý (GDPR opt-in). DealMakers có banner riêng (`DealMakersLayout`) dùng chung cookie đồng ý với site chính.

---

## 7. DESIGN SYSTEM (tóm tắt, chi tiết ở `CLAUDE.md` + `design-system.md`)

- Nền tối `--bg-primary #050810`; accent chỉ 2 màu: cyan `#00c8f0`, purple `#7c5cfc` (kèm warm `#f0a278` ở vài chỗ). Font: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (label/số liệu). Phong cách "liquid glass".
- **Có chế độ sáng (light mode)** hoàn chỉnh (thêm 2026-08-03/19): `data-theme` trên `<html>`, token riêng, đã vá contrast WCAG AA. Mọi component mới phải đúng ở cả hai theme; dùng CSS var, không hardcode hex.
- Lỗi Tailwind từng gặp: modifier opacity trên màu CSS-var (vd `bg-[var(--x)]/10`) biên dịch thành không có gì → dùng `color-mix(in srgb, var(--x) 10%, transparent)` (sửa 2026-08-20).
- Nền "dải ngân hà" (starfield) dùng kỹ thuật `box-shadow` với toạ độ **`vw`/`vh`**, không dùng px cố định (bug 2026-09-06 và 09-09: dải sao chỉ phủ ~2000px đầu trên màn hình rộng). Nếu thêm starfield ở chỗ khác, dùng `vw/vh` và `translateY(-100vh)` cho vòng lặp.
- Kích thước chữ: `tailwind.config.mjs` đã nâng `body`/`small`/`sm`/`base`. `xs` giữ nguyên (dành cho nhãn/eyebrow chữ hoa).
- Animation: theo `animation-system.md` (3 loại: ambient/entrance/interaction; tôn trọng `prefers-reduced-motion`; không scroll-fade mọi thứ).
- DealMakers: bảng màu gold/emerald, font display Fraunces, class tiền tố `dm-*`, `--dm-*`.

---

## 8. DEALMAKERS' CLUB (microsite)

- **Là gì:** chương trình "F-Matching Season 3": mạng lưới Founder/Investor/Exchange/Web3 builder đã xác thực, giới thiệu chiến lược. Fintech24h là **Official Capital Partner Season 3**. Có mục Last Season (SS2) partners, Media Partners, Capital/Solution/Media partner tracks, bảng giá gói, FAQ, Members directory, Community Activity live.
- **Đa ngôn ngữ:** resolver `getSS3Content(locale)` / `getChrome(locale)` (`src/data/dealmakers/content.ts`, `chrome.ts`). Dữ liệu: `ss3.ts` (en), `ss3.ar.ts`, `ss3.zh.ts`. Thêm ngôn ngữ = thêm file dữ liệu + page + mục `chrome`. **Sửa copy EN phải sửa bản dịch tương ứng** (luật 0.3.6). Layout Ả Rập **không** phản chiếu cấu trúc, chỉ RTL chữ.
- **Mùa:** `src/data/dealmakers/seasons.ts` (hiện chỉ `ss3` active). Mùa mới = thêm entry + `ssN.ts` + `pages/dealmakers/ssN/index.astro`.
- **Members Directory:** `members.ts` sinh từ site nguồn bằng `node scripts/dealmakers-members-scraper/run.mjs` (ghi đè hoàn toàn; sửa tay thì mất khi chạy lại). Xem README ở đó.
- **Community Activity (live):** Worker `workers/dealmakers-community` nhận webhook Telegram, lưu **chỉ** metadata (tên hiển thị, username, thời điểm; không lưu nội dung tin nhắn) vào D1; frontend `CommunityActivity.tsx` poll `PUBLIC_DEALMAKERS_PULSE_API_URL` mỗi 60s. Có "role note" cho vài thành viên (Vincent Nguyen, JAYC, Tracy Ho...), mascot nội bộ (Mr Cá, Mr Bông) hiển thị hàng riêng. Chưa có tin nhắn thì hiển thị trạng thái "setup" trung thực, không làm giả hoạt động.
- **Layout độc lập:** `DealMakersLayout.astro` là `<html>` riêng, có JSON-LD Organization riêng, banner cookie riêng, starfield riêng + spotlight theo con trỏ.
- Danh sách partner (capital/media/solution) nằm trong `ss3*.ts` + `public/dealmakers/partners/`; thêm/sửa partner = sửa dữ liệu + thêm logo; logo thường link ra X/website của partner.

---

## 9. SEO

- Bắt buộc mỗi trang: 1 `<h1>`, `<title>`+description riêng, canonical đúng, JSON-LD phù hợp (Organization toàn site, BlogPosting cho bài, FAQPage cho trang có FAQ, BreadcrumbList, Service cho trang dịch vụ, Person cho author). Ảnh luôn có `alt`/`width`/`height`.
- `robots.txt` chặn `/wp-admin/` và `/wp-json/` cho crawler.
- **Redirect/canonical** (đã vá sau sự cố GSC 08/2026): `www`→apex, http→https (cần bật "Always Use HTTPS" trong Cloudflare Dashboard), `HOME.html`, `?paged=N`, URL WordPress cũ `/{slug}` → `/blog/{slug}`, `/service-post/*`, `/category/*`. 404 phải là **404 thật** (không soft-404).
- **Sitemap:** `sitemap-index.xml` + `sitemap-0.xml` (build, tĩnh) và `sitemap-blog.xml` + `rss.xml` (SSR mỗi request, không bao giờ trả rỗng, hỗ trợ HEAD).
- **IndexNow:** gửi tự động ở `postbuild`. **Hiện đang trả HTTP 403** (xem Mục 13).
- **Pillar pages** (09/2026): 3 trang thị trường, cross-link FAQ chéo nhau, OG image riêng (`public/og-*.png`).
- **Blog archive:** phân trang `/blog/page/N`, category, author; case-studies ẩn (`noindex`) cho tới khi có dữ liệu thật.
- Đã từng có lỗi GSC: JSON-LD hỏng trong thân bài (đã vá bằng `stripEmbeddedJsonLd`), duplicate canonical trailing-slash (đã vá), `origin.fintech24h.com` bị lộ công khai.
- `docs/toplist-audit/` có khảo sát 447 bài để làm kế hoạch gộp/redirect toplist (giai đoạn 1 của một dự án SEO; các giai đoạn sau chưa thực hiện).

---

## 10. HIỆU NĂNG & TRUY CẬP

- Mục tiêu Lighthouse ≥ 95. Đã làm: bỏ React Navbar (thay `NavbarFast.astro`, cùng thiết kế), bỏ GSAP khỏi critical path, GA4 qua Partytown, ảnh WebP/width-height, font preconnect.
- `NavbarReact.tsx` và `Navbar.astro` là code cũ không còn được `BaseLayout` dùng (chỉ `NavbarFast` được import). Đừng xoá khi chưa hỏi (chủ dự án ưu tiên giữ nguyên hiển thị).
- Light mode + contrast AA là yêu cầu, không phải tùy chọn.

---

## 11. BẢO MẬT & LỊCH SỬ SỰ CỐ

| Thời điểm | Sự cố | Trạng thái |
|---|---|---|
| 2026-07-04 | Bot flood ~552k req/ngày brute-force `wp-login.php` đốt quota Workers Free → `wp-proxy` ngừng → wp-admin/wp-json/ảnh 404. Đã tạo 2 rule Cloudflare (rate-limit + WAF chặn HTTP/1.x vào wp-login/xmlrpc/wp-json). Nghi backdoor PHP tái nhiễm + email lạ trong GSC | Rule đã tạo. Nguồn nhiễm chưa kết luận |
| 2026-07-05 | Chuỗi 3 lỗi deploy/WordPress (thiếu `wrangler.jsonc`, thiếu `.assetsignore`, lỗi 522 do hop Worker-to-Worker) | Đã sửa, tài liệu ở `DEPLOYMENT.md` |
| 2026-08-26/09-03 | GSC redirect validation fail; `run_worker_first` làm `sitemap-index.xml` 404 → đã revert | Đã sửa (`html_handling` + wrangler ^4) |
| 2026-09-12→18 | **102 bài casino/cá cược** chèn vào WordPress dưới user `admin` (backdate 09/2025). Bằng chứng ở `docs/security/2026-09-casino-spam-incident.md`; đã xoá 19–20/09; Astro chặn render; plugin spam-guard; báo cáo origin-lock (kết luận: khoá origin **không** chặn được vụ này, nguyên nhân vẫn là credential admin/Application Password) | Đã dọn bài; **nguồn credential chưa được xác minh hoàn toàn** |

**Biện pháp đang có:** rule Cloudflare ở trên; `fintech24h-spam-guard` mu-plugin (5 rule A–E, bài khả nghi bị đưa về draft + email admin); Astro lọc spam; `docs/security/waf-and-spam-guard-setup.md` (rule WAF theo UA bot Chrome/124 & Firefox/133 + hướng dẫn cài plugin); Telegram blog-monitor.

**Việc bảo mật chủ dự án phải tự làm (AI không có quyền):** thu hồi Application Password nghi ngờ (vd tên `Autocontent11092026`), đổi mật khẩu/2FA admin, tắt `xmlrpc.php`, rà `wp user list`, rà GSC owners, kiểm tra log VPS Studio. Prompt điều tra Content Studio: `docs/security/prompt-content-studio.md`.

---

## 12. WORKER & PLUGIN: HỢP ĐỒNG TÓM TẮT

| Thành phần | Việc làm | Lưu ý bắt buộc |
|---|---|---|
| `fintech24h-wp-proxy` | Proxy `/wp-admin`, `/wp-login*`, `/wp-json`, `/wp-content`, `/wp-includes`, `/wp-cron.php` sang `origin.fintech24h.com` (gửi `Host: fintech24h.com`, viết lại `Location`/cookie) | **Cấm** dùng `cf.resolveOverride` (Enterprise-only, bị bỏ qua âm thầm). Cấm tạo subdomain mới. Đọc `INCIDENT-README.md` trước khi sửa |
| `fintech24h-blog-monitor` | Cron 2h: `/blog` không được chứa tiêu đề `MOCK_POSTS`, phải có tiêu đề bài thật; lỗi → Telegram | Nếu đổi `MOCK_POSTS` hoặc markup tiêu đề bài ở `blog/index.astro` phải cập nhật `worker.js`. Deploy: `npx wrangler deploy --config workers/blog-monitor/wrangler.toml` |
| `fintech24h-dealmakers-community` | Telegram webhook → D1; API `/v1/pulse`; `/telegram/seed-admins` | Secrets: `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_CHAT_ID`, `TELEGRAM_BOT_TOKEN`, `ADMIN_SEED_SECRET`. README có lệnh cài |
| `fintech24h-spam-guard` (WP mu-plugin) | Quarantine bài spam lúc publish | Cài tay vào `wp-content/mu-plugins/`; có test ở `tests/` |
| `fintech24h-team-directory` (WP plugin) | CPT `team_member` (+ Ecosystem Links), 1 route GET công khai | Chỉ đọc; allowlist domain cho LinkedIn/Telegram/Instagram. Phục vụ `/verify-members` |

3 Worker độc lập (`wrangler.jsonc` gốc, `wp-proxy/wrangler.toml`, `blog-monitor/wrangler.toml`, `dealmakers-community/wrangler.toml`): đừng nhầm config khi deploy.

---

## 13. VIỆC CÒN DỞ / RỦI RO ĐÃ BIẾT (AI cập nhật mục này khi xử lý xong)

**Cần chủ dự án làm (ngoài tầm AI):**
1. **WordPress thiếu CPT `case-study`** (endpoint `/wp-json/wp/v2/case-study` trả 404) → `/case-studies/` đang `noindex` có chủ đích. Đăng ký lại CPT thì tự hết.
2. ~~**`origin.fintech24h.com` truy cập công khai**~~ — kiểm 2026-10-21: `http(s)://origin.fintech24h.com/` đã trả **301 → `https://fintech24h.com/`** (LiteSpeed); request có `Host: fintech24h.com` (SSR/wp-proxy) vẫn 200. Lưu ý: `/wp-login.php` trên origin có còn vào thẳng được hay không thì chưa kiểm lại.
3. **Google Apps Script có trigger "On open" rác** gọi hàm không tồn tại `sendToTelegram` → mail báo lỗi mỗi lần mở Sheet "Connect Form Website". Xoá trigger đó ở Apps Script → Triggers (hàm thật là `sendTelegram`, gọi từ `doPost`). Form vẫn hoạt động bình thường.
4. **Apps Script live giữ token Telegram trong source** thay vì Script Properties. Nên chuyển sang `PropertiesService` (cần sửa script live + test lại).
5. **Dọn các dòng TEST** còn sót trong 2 sheet DealMakers.
6. **Bảo mật WordPress** theo Mục 11 (Application Password, xmlrpc, 2FA, rà user).
7. Bật/giữ "Always Use HTTPS" trong Cloudflare Dashboard (phần HTTP→HTTPS của sửa redirect phụ thuộc vào đó).

**Kỹ thuật chưa xử lý:**
- **Header bảo mật / CSP (cập nhật 2026-10-22):** CSP **không còn `'unsafe-inline'` trong `script-src`**. Trang tĩnh: `public/_headers` có placeholder `__CSP_SCRIPT_HASHES__`, được `scripts/csp-hashes.mjs` (hook `astro:build:done` trong `astro.config.mjs`) thay bằng sha256 của mọi `<script>` inline trong `dist/**/*.html`; build **fail** nếu thiếu placeholder hoặc dòng `_headers` > 2.000 ký tự. Trang SSR: `src/lib/securityHeaders.ts` tạo nonce mỗi request, `HTMLRewriter` gắn nonce cho mọi `<script>` **trừ** trong `[data-cms-content]` (HTML WordPress: `BlogLayout`, `case-studies/[slug]`, tiêu đề ở author). Danh sách directive phải giữ giống nhau ở 2 nơi; khác duy nhất `img-src` (SSR cho `https:` vì bài WP hotlink ảnh). HSTS không `includeSubDomains` (autodiscover.fintech24h.com không có HTTPS). `style-src` vẫn `'unsafe-inline'` (React/framer-motion style attr, `<style>` của Astro, ~320 `style=` trong bài WP).
- **Viết script mới:** dùng `<script>` thường (Astro xử lý thành file `/_assets/*.js`, `assetsInlineLimit: 0`). Tránh `is:inline`/`define:vars` (mỗi cái thêm 1 hash; truyền dữ liệu bằng `<script type="application/json">` như `ServicesGrid`/`custom-solutions`). Không dùng thuộc tính `onclick=`/`onload=` (CSP chặn). Font Google tải async qua `components/ui/AsyncStylesheet.astro`. CSS DealMakers dùng Tailwind config riêng `tailwind.dealmakers.config.mjs` (`@config`): component mới dùng trong /dealmakers/* mà nằm ngoài các path trong file đó thì phải thêm path, nếu không sẽ thiếu class.
- `/author/phat-vo` thỉnh thoảng trả 404 (~3/10 lần curl ngày 2026-10-21): `getUserBySlug` lúc lấy được lúc không từ WP. Có từ trước, chưa điều tra.
- `npm run build` → `postbuild` IndexNow luôn nhận **HTTP 403 `UserForbiddedToAccessSite`** (đã quan sát nhiều lần). Cần kiểm tra key file/`keyLocation` có truy cập được từ phía IndexNow, hoặc IP build bị chặn. Không làm hỏng build (script luôn exit 0).
- Lúc build, một số call WP trả 4xx (`/case-study` 404, đôi khi `/posts` 400/403 ở môi trường build); site vẫn build được vì các trang SSR fetch lúc request.
- Khuyến nghị cũ: ảnh bài viết hotlink về `wp-content` (qua wp-proxy) → nên host ảnh trong build hoặc R2 để không phụ thuộc quota Worker.
- `CLAUDE.md`/`AGENTS.md` mục 2 và "Hosting/CI/CD" đã lỗi thời so với thực tế (Mục 2 file này là nguồn đúng).
- Ghi chú wrangler: một lần `npx wrangler deployments list --name fintech24h-blog-monitor` ngày 2026-10-07 trả danh sách permission thay vì danh sách deploy (có thể phiên đăng nhập wrangler hết hạn hoặc sai tài khoản). Chưa xác minh trạng thái thật của blog-monitor trong phiên này.

---

## 14. CÁC "ĐỪNG" QUAN TRỌNG (tổng hợp từ sự cố)

```
❌ Xoá/đổi wrangler.jsonc (name, thêm "routes", bỏ html_handling), hoặc xoá public/.assetsignore
❌ Bật lại run_worker_first (làm sitemap-index.xml 404 do catch-all [...path].astro)
❌ Đổi WP_API_BASE về https://fintech24h.com/wp-json/... (lỗi 522)
❌ Dùng cf.resolveOverride; tạo subdomain mới; xoá Worker fintech24h-wp-proxy
❌ Trả lại mock data ở production; bỏ stripEmbeddedJsonLd
❌ Hardcode toạ độ px cho starfield; thu nhỏ lại chữ; thêm em-dash vào nội dung
❌ Dùng chung layout/CSS/màu của site chính trong /dealmakers/*
❌ Tạo deployment Apps Script mới (đổi URL /exec); đoán/viết đè code Apps Script
❌ Báo "đã xong" khi mới thấy build xanh: luôn `npx wrangler deployments list --name fintech24h-website` + curl live
❌ `git add -A` khi repo có thay đổi của AI/phiên khác; commit/push khi chưa được yêu cầu
❌ Đặt file xác thực (IndexNow, v.v.) ở WordPress: gốc domain thuộc Astro Worker, đặt vào public/
❌ Ghi secret (token, mật khẩu, Application Password) vào repo hoặc file này
❌ Thêm 'unsafe-eval' hoặc 'unsafe-inline' (script-src) vào CSP; sửa CSP ở public/_headers mà quên src/lib/securityHeaders.ts (hoặc ngược lại); xoá placeholder __CSP_SCRIPT_HASHES__; dùng onclick=/onload= trong HTML
❌ Đặt [data-dm-reveal] về opacity: 0 (0.01 là cố ý, để H1 hero được tính LCP); xoá các @font-face "... Fallback" trong dealmakers.css (chống CLS)
❌ Viết cú pháp TypeScript (`x: T`) trong `<script>` nằm trong `{cond && (...)}` (vd. cuối BlogLayout.astro): Astro không bóc type → JS lỗi; muốn qua `astro check` thì viết code để TS tự suy kiểu
❌ Đổi lại byline: mọi tài khoản WP không khớp thành viên team.ts PHẢI hiện "Phat Vo" (isPhatVoWpAuthor trong wordpress.ts)
```

Ngoài ra: kiểm preview local được vì `middleware.ts` đã bỏ qua `localhost`; nhưng Browser pane của một số công cụ AI từng cache 301 cũ của `localhost:4321` và bị đẩy về production. Nếu preview cứ nhảy về fintech24h.com, kiểm bằng `curl http://localhost:4321/` để xác định lỗi nằm ở công cụ chứ không ở code.

---

## 15. LỆNH THƯỜNG DÙNG

```bash
npm run dev                          # dev server (localhost:4321)
npm run build                        # build + postbuild IndexNow
npx astro check                      # kiểm TypeScript (có vài lỗi cũ ở ServicesGrid/TrustBar nếu chưa vá)
npx wrangler deployments list --name fintech24h-website      # xác nhận deploy mới
npx wrangler tail fintech24h-website --format pretty         # log runtime (tên Worker là tham số vị trí)
curl -sIL https://fintech24h.com/<path>                      # kiểm redirect/canonical
curl -sL https://fintech24h.com/blog | grep -o '<h2 class="font-display[^>]*>[^<]*' | head   # blog có bài thật không
```

---

## 16. NHẬT KÝ THAY ĐỔI (APPEND-ONLY, mục mới nhất xếp CUỐI)

> Phần "Lịch sử trước 2026-10-07" được dựng lại từ git log (301 commit) và các phiên làm việc. Từ 2026-10-07 trở đi mỗi ngày làm việc phải có 1 mục theo mẫu ở Mục 0.1.

### Lịch sử trước 2026-10-07 (tóm tắt theo giai đoạn)

- **2026-06-26 → 06-30: Dựng site.** Khởi tạo Astro 4 + Tailwind + design tokens; redesign hero (starfield parallax, sheen text), TrustBar marquee logo, ServicesGrid bento, GlobalNetwork (bản đồ + cờ), ProcessSection, FAQ 15 câu, 6 trang dịch vụ mỗi trang một phong cách riêng, form "liquid glass", BlogHighlight, trang 404 phong cách cyberpunk, JSON-LD cơ bản. Dựng pipeline lead: form → Google Apps Script (Sheet + Telegram). Dựng `wp-proxy` Worker; sửa viết lại `Set-Cookie` domain để đăng nhập wp-admin được.
- **2026-07-01/02: Hiệu năng & SEO nền.** Thay NavbarReact bằng `NavbarFast.astro` (0 bundle React), bỏ GSAP khỏi critical path (CSS + IntersectionObserver), WebP, Partytown cho GA4, RSS + sitemap + schema audit, RFC 8288 Link headers + API catalog + `auth.md`, GA4, redesign PR/AI/BD mockups, trang blog mới, sửa cờ bản đồ bằng phép chiếu equirectangular.
- **2026-07-04/05: Sự cố lớn.** Bot flood (Mục 11). Thêm Privacy/Terms. Chuyển sang `hybrid` + SSR cho blog; xử lý 3 lỗi deploy (`wrangler.jsonc`, `.assetsignore`, lỗi 522 → fetch thẳng origin); cache Workers Cache API (fresh 180s / stale 24h→7 ngày); ẩn blog khi lỗi; thêm `fintech24h-blog-monitor`; viết `DEPLOYMENT.md` + `INCIDENT-README.md` làm lan can chống sửa sai.
- **2026-07-06 → 07-17:** About page (HUD, core values, avatars), mobile menu liquid glass, mọi CTA "Get proposal" → `/contact`, Careers (2 vị trí, form có CV, webhook riêng), Custom Solutions, authors động + trang Phat Vo (Person schema), 301 URL WordPress cũ.
- **2026-07-19: SEO hardening.** Sitemap blog động, bỏ query khỏi canonical + 301 param legacy, 404 thật thay soft-404, 404 author rỗng, "Countries" 6 → 12+, "honest-metrics pass".
- **2026-08-02 → 08-19:** Bỏ mock fallback (fail-closed), canonical hoá URL, redirect HTTP→HTTPS, sidebar TOC + CTA cho bài blog (làm lại nhiều lần: sticky bằng JS), sửa entity HTML lộ chữ, **light mode toàn site** + sửa contrast WCAG AA.
- **2026-08-19 → 09-09: DealMakers' Club SS3.** Landing → microsite độc lập (EN), copy, logo thật, Apply form + Telegram Join form (2 pipeline Apps Script riêng), SEO (Offer/Service schema, 301 `/dealmakers/`), OG image, starfield + spotlight, mobile nav, cookie banner, **Community Activity** live (Telegram → D1), sửa starfield 2000px, nâng cỡ chữ, thêm team (Mr Cá, Mr Bông, avatars 2026/09).
- **2026-08-20/23/24:** Sửa lỗi Tailwind opacity với CSS var; cookie consent GDPR opt-in; Calendly gate bằng click; checkbox marketing opt-in.
- **2026-08-26 → 09-03: Sự cố GSC redirect.** Gom www/http về 1 hop 301; sửa `<title>` dùng tiêu đề AIOSEO; phát hiện cần ghim wrangler ^4; `run_worker_first` làm sitemap 404 → revert khẩn; thêm IndexNow tự động ở postbuild.
- **2026-09-14: Verify Members & Members Directory.** `/verify-members` + plugin `fintech24h-team-directory` (v1.1.x), thư viện member xuyên mùa + scraper, popup chia sẻ thẻ mời.
- **2026-09-15/17/18: DealMakers mở rộng.** Capital/Solution/Media partner tracks + trang partner-benefits, gói Solution Partner, **bản Ả Rập (RTL)** và **bản Trung giản thể (zh)** + dropdown ngôn ngữ, thêm nhiều Media Partner (BD Ventures, Unity Hub, BD GemX, Captain Capital, Atok, The Crypto Hype).
- **2026-09-19 → 09-24: Sự cố spam casino.** Chặn render/list/RSS/sitemap, sitemap + RSS SSR không bao giờ rỗng, plugin `fintech24h-spam-guard` v1.0→1.1.1, báo cáo origin-lock, tài liệu sự cố; sửa `/author/phat-vo` 404, phân trang blog/category/author, ẩn case-studies, **sửa 11 lỗi `astro check`**, đồng bộ Apps Script live + thêm nhánh Job Application.
- **2026-09-24 → 09-29: SEO.** Củng cố archive blog, metadata bài/sitemap; 3 pillar pages (Vietnam, Singapore, Dubai) + OG riêng + FAQ cross-link.
- **2026-09-28 → 10-02:** Làm lại trang partner-benefits SS3, thêm partner SS2 (Giakaa Capital, Jet Capital, Victus Global, X Founders, DTE Ventures), tinh chỉnh kích thước logo.

### 2026-09-06 → 2026-09-09 (các phiên có AI tham gia; ghi chi tiết)

- **Starfield trang chủ** (`HeroSection.astro`): toạ độ sao đổi từ px (0–2000) sang `vw/vh`, vòng lặp `translateY(-100vh)`. Lý do: màn hình >2000px mất sao nửa phải. Đã deploy & verify live ở 2560×1080.
- **Starfield DealMakers** (`DealMakersLayout.astro` + `dealmakers.css`): cùng lỗi, cùng cách sửa (2026-09-09). Đã verify live.
- **Cỡ chữ + em-dash** (2026-09-06): `tailwind.config.mjs` nâng `body`/`small`/`sm`/`base`; xoá em-dash khỏi copy hiển thị (data/services.ts, cookie banner, form disclaimers, KOL CTA, 5 trang dịch vụ, privacy/terms). Giữ nguyên em-dash trong comment và `<title>`. Đã deploy & verify responsive 375/768/1440/2560.
- **`middleware.ts`**: thêm bỏ qua canonicalization cho `localhost`/`127.0.0.1`/`*.local` (trước đó mọi request local bị 301 về production).
- **IndexNow key mới** `public/55651ac1b3f5cdeca8d79c377f97d303.txt` (cho SEO Content Studio). Phát hiện prompt đề xuất đặt ở WordPress là **sai kiến trúc** (gốc domain thuộc Astro Worker). Verify live: 200, `text/plain`, 32 byte, không BOM/newline.
- **JSON-LD hỏng trong thân bài** (GSC "Missing ',' or '}'"): thêm `stripEmbeddedJsonLd()` (`lib/utils.ts`) áp dụng cho `BlogLayout` + `case-studies/[slug]`, và `stripHtml()` xoá nội dung script/style. Verify live: còn 3 khối JSON-LD hợp lệ.
- **Chẩn đoán GSC (5 báo cáo):** canonical trailing-slash đã ổn từ sửa trước; `/case-studies/` noindex là chủ đích do thiếu CPT `case-study` trên WP; `origin.fintech24h.com` lộ công khai (rỗng).
- **Chẩn đoán mail Apps Script** "Script function not found: sendToTelegram": trigger "On open" rác trong Apps Script project, không thuộc code repo (Mục 13.3).
- **Việc dở:** xem Mục 13.

### 2026-10-07
- **Đã làm:** tạo `PROJECT_CONTEXT.md` (file này) làm hồ sơ tổng thể cho mọi AI; thêm chỉ thị "đọc file này đầu tiên + cập nhật nhật ký mỗi ngày" vào đầu `CLAUDE.md` và `AGENTS.md`; thêm memory trỏ tới file này.
- **Vì sao:** chủ dự án sắp đổi tài khoản AI, cần bất kỳ AI nào đọc lại là hiểu ngay dự án và những gì đã làm.
- **Trạng thái:** đã ghi file trên đĩa, **chưa commit** (chờ chủ dự án yêu cầu).
- **Việc còn lại / lưu ý cho AI sau:** mỗi ngày làm việc thêm 1 mục ở đây. Khi xử lý xong mục nào ở Mục 13 thì sửa mục đó. `CLAUDE.md`/`AGENTS.md` mục 2 còn lỗi thời (chưa sửa, vì chủ dự án chưa yêu cầu đổi nội dung các file luật đó).

### 2026-10-15
- **Đã làm:** rà soát bảo mật chỉ-đọc (không sửa code): đọc code, `npm audit`, và probe GET/HEAD công khai lên site live + origin. Không thay đổi file nào ngoài mục nhật ký này.
- **Vì sao:** chủ dự án yêu cầu kiểm tra bảo mật chi tiết.
- **Trạng thái:** chỉ báo cáo, chưa vá gì. Phát hiện chính: (1) các route SSR (`/`, `/blog/*`, 404) KHÔNG có header bảo mật/CSP vì `public/_headers` chỉ áp cho static asset; (2) `origin.fintech24h.com/wp-login.php` truy cập thẳng được (200), né WAF/rate-limit của zone, và wp-proxy xoá IP thật nên WP không chống brute-force theo IP; (3) `astro@4.16.19` + `@astrojs/cloudflare@11.2.0` dính advisory (critical/high, xem `npm audit`); (4) endpoint `/v1/pulse` công khai lộ Telegram user ID + username của admin group; (5) CSP có `unsafe-inline`/`unsafe-eval`; (6) Apps Script chỉ dùng `safeCell_` cho nhánh Job Application, các nhánh lead khác chưa chống formula injection; form lead không có CAPTCHA/rate limit.
- **Việc còn lại / lưu ý cho AI sau:** chờ chủ dự án chọn mục cần vá. Các probe `/_image` SSRF (403) và `/wp-json/wp/v2/users` (401) đều an toàn tại thời điểm kiểm tra.

### 2026-10-17
- **Đã làm:** tạo thư mục `R&D services/` (9 file markdown ngữ cảnh cho dự án claude.ai "R&D services" của chủ dự án: hướng dẫn, hồ sơ công ty, danh mục dịch vụ, ICP/thị trường, DealMakers, giọng thương hiệu, khung R&D, backlog ý tưởng, tóm tắt website). Thêm `R&D services/` vào `.gitignore` và `.git/info/exclude`.
- **Vì sao:** chủ dự án muốn có bộ ngữ cảnh tốt nhất cho dự án R&D, và yêu cầu thư mục đó KHÔNG được đưa lên git/deploy.
- **Trạng thái:** chỉ file local; đã xác minh `git check-ignore` bắt được thư mục. `.gitignore` đã sửa nhưng chưa commit.
- **Việc còn lại / lưu ý cho AI sau:** KHÔNG `git add` thư mục `R&D services/`. Các mục `[CẦN XÁC NHẬN]` trong file do chủ dự án điền. Dữ kiện trong thư mục lấy từ code/website, không có bí mật.

### 2026-10-19
- **Đã làm:** tạo thư mục `DealMakers content/` gồm `00_DAN_VAO_HUONG_DAN.md` (khối hướng dẫn dán vào ô Instructions của dự án claude.ai "DealMakers Fi24h Content": vai trò Content Lead, sản phẩm/giá SS3, loại nội dung, luật giọng văn, định dạng, trụ cột nội dung) và `01_Kien_thuc_DealMakers.md` (kiến thức chi tiết lấy từ `src/data/dealmakers/ss3.ts`: quyền lợi từng gói, ma trận, FAQ, đối tác đã xác nhận, mục `[CẦN XÁC NHẬN]`). Thêm `DealMakers content/` vào `.gitignore`.
- **Vì sao:** chủ dự án muốn tạo dự án viết content cho DealMakers, chỉ cần dán vào là hiểu việc.
- **Trạng thái:** chỉ file local, không deploy; `git check-ignore` đã bắt được thư mục. `.gitignore` sửa nhưng chưa commit. Lưu ý: file `R&D services/04_...` ghi "Fintech24h là Official Capital Partner SS3" là chưa chính xác; thực tế slot Capital Partner SS3 trên site vẫn là "Confirming soon".
- **Việc còn lại / lưu ý cho AI sau:** KHÔNG `git add` thư mục `DealMakers content/`. Chủ dự án điền mục 9 `[CẦN XÁC NHẬN]` trong file 01. Khi đổi giá/đối tác/gói trong `ss3.ts`, nên cập nhật file 01 theo.
- **Đã làm (bổ sung cùng ngày):** thêm media partner **Vooc Zone** (logo `wp-content/uploads/2026/10/Vooc-Zone.png`, link `https://www.vooczone.com/`) vào `mediaPartners` của `ss3.ts`, `ss3.ar.ts`, `ss3.zh.ts` (ngay sau The Crypto Hype); cập nhật danh sách trong `DealMakers content/` theo.
- **Trạng thái:** đã kiểm tra local (ô logo thứ 13 render, link mở tab mới đúng URL; ảnh trả 200). Đã commit `08f452e` (chỉ 3 file ss3*.ts), push main, **đã verify live** trên /dealmakers/ss3/, /ar/ss3/, /zh/ss3/ (logo tải được, link đúng). Lưu ý: lưới Media Partners giờ có 13 ô, hàng cuối chỉ 1 ô.

### 2026-10-21
- **Đã làm:** chẩn đoán 2 báo cáo GSC (chỉ probe bằng curl, không sửa code/hạ tầng). (1) "Đã lập chỉ mục nhưng không thể đọc nội dung" cho `http://origin.fintech24h.com/` (lần thu thập cuối 9/9/2026): hiện origin đã 301 → `https://fintech24h.com/` cho cả http/https, còn request có `Host: fintech24h.com` (SSR blog, wp-proxy) vẫn 200 → lỗi đã hết, GSC chỉ chưa thu thập lại. (2) "Bị chặn bằng robots.txt" cho `webmail.fintech24h.com/*` (Roundcube/cPanel webmail, đi qua Cloudflare): `robots.txt` của webmail là `Disallow: /` → đây là hành vi đúng mong muốn (trang đăng nhập webmail không nên lên Google), không phải lỗi.
- **Vì sao:** chủ dự án yêu cầu "fix 2 lỗi" trong GSC.
- **Trạng thái:** không cần thay đổi code. Việc cần làm nằm ở GSC (chủ dự án tự bấm).
- **Việc còn lại / lưu ý cho AI sau:** đừng bỏ `Disallow: /` của webmail và đừng mở webmail cho Google index. Lỗi origin chỉ cần GSC → "Xác thực bản sửa lỗi"/URL Inspection. Cập nhật Mục 13 mục 2 theo kết quả này.

### 2026-10-21
- **Đã làm:** thêm section **KOL Partners** dưới Media Partners trên `/dealmakers/ss3/` (+ `/ar/ss3/`, `/zh/ss3/`). Component mới `src/components/sections/dealmakers/KolPartners.astro`; dữ liệu `kolPartners` + `kolPartnerBenefits` + type `KolPartner`/`KolPlatform` trong `ss3.ts` (bản sao dữ liệu trong `ss3.ar.ts`, `ss3.zh.ts`); thêm lựa chọn "KOL Partner" (ar: "شريك KOL", zh: "KOL 合作伙伴") vào `interestOptions` để nút "Become a KOL Partner" điền sẵn form Apply. Bố cục: 1 thẻ Lead KOL (2×2 desktop) + thẻ nhỏ có ảnh, @handle, nhãn nền tảng (X/TG/YT...), tag chủ đề; `confirmed: false` hiện ô "Your spot". Hiện có 1 lead + 4 core, tất cả đều là placeholder.
- **Vì sao:** chủ dự án muốn có section KOL partner cho SS3. Mô hình đã chốt: **A, miễn phí, trao đổi như Media Partner** (chỉ có hồ sơ trên web + được chia sẻ trên social). Không hiển thị số follower trừ khi đã kiểm chứng và ghi ngày.
- **Trạng thái:** đã kiểm tra local: desktop, mobile 375px (không tràn ngang), bản ar/zh, nút CTA điền sẵn form ở cả 3 ngôn ngữ, console không có lỗi từ section mới (lỗi CORS /v1/pulse của CommunityActivity chỉ xảy ra trên localhost, có sẵn từ trước). Chủ dự án đã duyệt; commit `22698f4` (7 file của section), push main, **đã verify live** cả 3 trang en/ar/zh (section nằm ngay sau Media Partners, CTA điền sẵn "KOL Partner").
- **Việc còn lại / lưu ý cho AI sau:** chủ dự án sẽ gửi danh sách KOL (tên, handle, link nền tảng, ảnh, chủ đề, thị trường). Ảnh lưu ở `public/dealmakers/kol/` (vuông 400×400). Sửa ở `ss3.ts` thì phải sửa cả ar/zh. Chưa thêm KOL vào trang partner-benefits/ma trận quyền lợi.
- **Đã làm (bổ sung cùng ngày):** gắn **Web3Job** (https://web3job.work/) vào ô Solution Partner đầu tiên ở Hero (`heroPartners`, category `exchange`) cả en/ar/zh; đổi nhãn ô đó từ "Exchange Partner" thành "Solution Partner" (ar "شريك الحلول", zh "解决方案合作伙伴") vì Web3Job là nền tảng việc làm. Logo SVG tải về lưu ở `public/dealmakers/partners/web3job.svg` (CSP `img-src` không cho tải ảnh từ web3job.work). Tăng cỡ logo ô Solution ở Hero từ `h-5` lên `h-9 sm:h-10` cho đọc được.
- **Trạng thái:** chủ dự án đã duyệt; commit `5511175`, push main, **đã verify live** cả en/ar/zh (logo tải được từ CSP self, link đúng web3job.work).
- **Đã làm (bổ sung cùng ngày):** sửa lỗi sidebar bài blog (thẻ CTA "Get Proposal" + "On This Page") không còn ghim khi cuộn. Nguyên nhân: commit `20ff5e0` (feat: strengthen blog archive SEO) vô tình thêm lại 2 type annotation TypeScript (`id: string`, `e: MouseEvent`) vào script nằm trong `{hasToc && (...)}` của `src/layouts/BlogLayout.astro`. Script trong biểu thức điều kiện bị Astro coi là inline, không bóc TS → trình duyệt báo lỗi cú pháp, cả IIFE không chạy (đúng lỗi đã sửa ở `4264a96`). Đã bỏ 2 annotation.
- **Trạng thái:** đã kiểm tra local ở 1440px: script parse được (`node --check`), cuộn xuống thì `#sidebar-inner` chuyển sang `position: fixed; top: 128px`. Commit `c6215c0`, push main, **đã verify live** (HTML live không còn annotation). `wrangler deployments list` báo Authentication error [10000] (token wrangler local hết quyền), nên verify bằng curl.
- **Việc còn lại / lưu ý cho AI sau:** KHÔNG viết cú pháp TypeScript trong `<script>` cuối `BlogLayout.astro` (đã hỏng 2 lần). Sau khi push cần verify live trên 1 bài blog có TOC.
- **Đã làm (bổ sung cùng ngày):** (1) Tìm ra vì sao sidebar hỏng lại: `astro check` báo 2 lỗi `implicitly has an 'any' type` ở script đó, nên commit `20ff5e0` đã thêm lại annotation TS để `astro check` hết lỗi. Đã viết lại script (`Array.from(querySelectorAll('a[data-toc-link]'))`, `getAttribute('data-toc-link')`, `setActiveLink(id = '')`) để TS tự suy kiểu: `astro check` 0 lỗi, `node --check` OK, không cần annotation. Thêm comment cảnh báo trong script. (2) **Tác giả bài blog hiện "Editorfi24h / Contributor" thay vì Phat Vo.** Nguyên nhân: từ 2026-09-22 các bài "Top 10" được đăng bằng tài khoản WP thứ 3 **`Editorfi24h` (id 3, slug `editorfi24h`)**; code (không đổi từ 08/2026) chỉ đổi `admin` → Phat Vo, tài khoản khác hiện nguyên tên WP. Thống kê 100 bài mới nhất: admin (id 1) 73, Phat Vo (id 2, slug `phat`) 5, Editorfi24h (id 3) 22 (2026-09-22 → 10-17). Sửa: `getPostAuthor` dùng quy tắc mới, chỉ tài khoản khớp thành viên `team.ts` mới hiện tên thành viên đó, **mọi tài khoản khác đều hiện Phat Vo** (`isPhatVoWpAuthor`). `/author/editorfi24h` (và slug WP bất kỳ không thuộc team) 301 → `/author/phat-vo`; trang `/author/phat-vo` gom bài của mọi tài khoản đó (`getPhatVoAuthorIds`).
- **Vì sao:** chủ dự án yêu cầu tìm nguyên nhân + sửa để không bị lại (khi có tài khoản WP mới).
- **Trạng thái:** kiểm tra local: bài stablecoins hiện byline Phat Vo + JSON-LD author Phat Vo, không còn chữ "Editorfi24h"; `/author/phat-vo` 200, có bài của Editorfi24h; `/author/editorfi24h`, `/admin`, `/phat` (+`/page/2`) 301 → phat-vo. Commit `4f0d27b` (lúc đầu rơi nhầm vào nhánh `fix/ai-marketing-seo` của phiên khác vì dùng chung checkout; đã push riêng commit này lên main bằng `git push origin 4f0d27b:main`, fast-forward từ `da74386`). **Đã verify live:** bài stablecoins hiện Phat Vo, không còn "Editorfi24h"; `/author/editorfi24h` 301 → `/author/phat-vo`; trang phat-vo 200, có bài của Editorfi24h.
- **Việc còn lại / lưu ý cho AI sau:** muốn bài của 1 thành viên khác hiện đúng tên họ, thêm/sửa entry trong `src/data/team.ts` sao cho tên hiển thị WP hoặc slug WP khớp tên/tên đầu. **Chủ dự án xác nhận `Editorfi24h` là tài khoản hợp lệ**, tạo để lấy Application Password cho SEO Content Studio (`~/Public/Content Auto`) đăng bài tự động. KHÔNG xoá user này, cũng không đổi app password của nó. Studio đã viết sẵn bản sửa gửi `author: 2` (Phat Vo) khi tạo/sửa bài (chưa deploy bên Studio). Lưu ý: spam-guard Rule D giới hạn 4 bài mới/10 phút cho MỖI post_author, nên khi đó bài Studio và bài Phat đăng tay dùng chung giới hạn. Đổi post_author các bài cũ sang 2 là việc dọn dữ liệu, không bắt buộc (frontend đã hiện đúng), cần chủ dự án duyệt và sao lưu trước.
- **Đã làm (bổ sung cùng ngày, nhánh `fix/ai-marketing-seo`):** viết lại `/services/ai-marketing/` (chỉ sửa `src/pages/services/ai-marketing.astro` + thêm ảnh `public/og-ai-marketing.png` 1200×630). Định vị mới: DÙNG AI để vận hành marketing cho crypto/blockchain/Web3/fintech/AI startup, có người giám sát (KHÔNG phải AI SEO/GEO, dịch vụ đó sẽ có trang riêng `/services/ai-seo-geo/`). Title "Crypto & Blockchain AI Marketing Agency | Fintech24h" (52 ký tự), meta 154 ký tự, H1 hiện ra (trước là `sr-only`). Section mới: Hero (H1 + đoạn mở đầu, terminal chỉ còn trang trí `aria-hidden`), "Every project talks about AI...", 4 module (AI Community Support, Sentiment & Narrative Monitoring, Multilingual Content Engine, Retention Signal Analysis, mỗi module có "Human checkpoint"), "How we keep AI accountable" (thay bảng BENCHMARK_RESULTS), "How we work" 4 bước, "Where we work" (link 3 pillar), FAQ 10 câu (`<details>`). Xoá mọi số liệu chưa kiểm chứng/cụm hype/GPT-4, Claude 3. JSON-LD Service (alternateName, provider `@id` #organization, areaServed 6 nước) + FAQPage sinh từ chính mảng `faqs` + BreadcrumbList. Khối link sang `/services/ai-seo-geo/` nằm sau cờ `SHOW_AI_SEO_GEO_LINK = false` (đầu file): bật khi trang đó đã publish.
- **Trạng thái:** chủ dự án duyệt "deploy tất cả": commit `c95a7da` (2 file), fast-forward `main`, push `4f0d27b..c95a7da`. **Đã verify live** (~80s sau push): title mới, 1 H1, og:image `og-ai-marketing.png` 200, JSON-LD Service/FAQPage/Organization/BreadcrumbList, module + FAQ có trong HTML thô; GPTBot/ClaudeBot/PerplexityBot/Googlebot đều 200; robots.txt chỉ có `User-agent: *`, không chặn bot AI. Đã verify local: build 0 warning, `astro check` 0 lỗi, curl UA GPTBot thấy H1/module/FAQ/JSON-LD trong HTML thô, link nội bộ 200, dark/light/375px/reduced-motion ổn. Lighthouse mobile local (4 lần xen kẽ cũ/mới): cũ 92–93/97/82/100 → mới 99/100/82/100 (Perf/A11y/BP/SEO); LCP 3.2s → 1.7s; CLS 0 → ~0.014 (vẫn "Good"). Lưu ý: nhánh này đang chứa 2 commit của phiên khác (`da74386` CSP, `4f0d27b` byline Phat Vo) vì dùng chung checkout.
- **Việc còn lại / lưu ý cho AI sau:** `src/data/services.ts` (longDescription AI Marketing) vẫn còn "supercharge", "machine precision": nằm ngoài phạm vi, chờ chủ dự án duyệt. Nên đổi anchor text tới trang này thành "blockchain AI marketing"/"crypto AI marketing" ở trang chủ/ServicesGrid/blog (chưa làm).

### 2026-10-21 (header bảo mật + PageSpeed mobile DealMakers)
- **Đã làm:** (1) **Header bảo mật** (securityheaders.com chấm F vì trang chủ là SSR): `public/_headers` chỉ áp cho file tĩnh, trang do Worker render (`/`, `/blog/*`, author, trang quốc gia, 404, redirect) không có header nào. Thêm `src/lib/securityHeaders.ts` + bọc `src/middleware.ts` để gắn HSTS (`max-age=31536000`, không includeSubDomains), nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy, CSP. CSP mới cho cả tĩnh lẫn SSR: bỏ `'unsafe-eval'` và các host không dùng (js.hsforms.net, calendly script); thêm iframe YouTube/Vimeo/LinkedIn/X cho bài blog, `static.cloudflareinsights.com` (beacon Cloudflare Web Analytics trước đây bị CSP cũ chặn trên mọi trang tĩnh). Bỏ `haptic-feedback` khỏi Permissions-Policy (Chrome báo lỗi "Unrecognized feature"). Không thêm `interest-cohort` (cũng bị báo lỗi). Chạy Report-Only trước (commit `9ef540c`), quét 36 URL live bằng Puppeteer + console: 0 vi phạm mới → enforce (`da74386`). Cache-Control HTML: giữ nguyên (trang tĩnh đã `public, max-age=0, must-revalidate`; trang SSR `no-store` là cố ý để blog luôn mới). (2) **PageSpeed mobile `/dealmakers/ss3/`** (`98bbdda`): LCP mobile là chữ banner cookie (hiện sau 600 ms + 500 ms trượt) vì H1 hero bắt đầu ở `opacity: 0` nên Chrome không tính làm LCP → đổi `[data-dm-reveal]` thành `opacity: 0.01` (nhìn y hệt). Inline `consent.js` vào `DealMakersLayout` (bỏ 1 script chặn render, site chính vẫn dùng `/consent.js`). Thêm font dự phòng đã chỉnh metric (size-adjust/ascent/descent, tính bằng fontTools) cho Fraunces/Inter/JetBrains Mono → CLS khi đổi font 0.137 → 0.002.
- **Vì sao:** chủ dự án yêu cầu sửa điểm F của securityheaders.com và nâng mobile Performance trang SS3 lên 90+ mà không đổi thiết kế.
- **Trạng thái:** **đã deploy và verify live** (curl header cả trang SSR/tĩnh/asset; quét CSP 36 URL: chỉ còn 2 ảnh transparenttextures vốn bị chặn từ trước; form hydrate, Community Activity tải, GA consent default đúng thứ tự). Lighthouse 13.5 mobile chạy local trên máy chủ dự án với URL live: trước trung vị 73 (FCP 3.5 s, LCP 4.4 s), sau trung vị 92 (FCP 2.5 s, LCP 2.8 s, CLS 0.002); PSI API hết quota nên chưa có số PSI. Ảnh chụp cuối trước/sau giống hệt.
- **Việc còn lại / lưu ý cho AI sau:** chạy lại PageSpeed Insights (web) để lấy số chính thức. Checkout bị phiên khác chuyển sang nhánh `fix/ai-marketing-seo` giữa chừng: commit `da74386` được push thẳng `da74386:main` (fast-forward), KHÔNG kèm commit của nhánh đó. Trước khi commit luôn `git branch --show-current`. `wrangler` local đang đăng nhập sai tài khoản (Authentication error 10000) nên verify bằng curl.


### 2026-10-21 (anchor text + dọn copy AI Marketing trong data dùng chung)
- **Đã làm:** (1) `src/data/services.ts` entry `ai-marketing`: viết lại shortDescription/longDescription/features/benefits theo định vị mới (AI có người giám sát cho crypto/blockchain/Web3/fintech/AI startup), bỏ "supercharge", "machine precision", "Deep data scraping", "Hyper-personalized ... massive scale", "eliminate guesswork", "without scaling human headcount". Data này hiện ở bento trang chủ (`ServicesGrid.astro`: longDescription + features) và `/services/` (shortDescription + 3 feature đầu + metrics[0]). Trang `/services/ai-marketing/` KHÔNG đọc `services.ts` nên không bị ảnh hưởng. (2) 3 trang pillar: đổi tiêu đề mục AI (cũng là anchor text link tới `/services/ai-marketing/`) thành "Crypto AI Marketing" (Vietnam, Dubai) và "Blockchain AI Marketing" (Singapore), mô tả nói rõ "Human-supervised AI for community support, sentiment monitoring and content". Navbar/footer giữ "AI Marketing".
- **Trạng thái:** `astro check` 0 lỗi 0 warning; `astro build` 0 warning (chạy `npx astro build`, KHÔNG `npm run build` vì postbuild gửi IndexNow). Kiểm tra local 375px dark/light: không tràn ngang, không em-dash hiển thị. Chờ chủ dự án duyệt copy trước khi commit/push.
- **Việc còn lại / lưu ý cho AI sau:** nút CTA bento trang chủ vẫn là "Read Service Details" (chung cho 6 dịch vụ, không đổi để giữ thiết kế).

### 2026-10-22 (CSP không 'unsafe-inline' + tốc độ mobile DealMakers, đợt 2)
- **Đã làm:** (1) Bỏ `'unsafe-inline'` khỏi `script-src`: hash cho trang tĩnh (6 script inline còn lại: theme bootstrap, listener font async, consent DealMakers, snippet Partytown, 2 runtime island Astro), nonce cho SSR. Chuyển ~25 script `is:inline` sang script Astro xử lý (file ngoài, có `// @ts-nocheck` vì trước đây chưa từng type-check), `define:vars` → khối JSON, `map-test.html` → `map-test.js`, bỏ `onload="this.media='all'"`. Thêm `media-src 'self' https://fintech24h.com`. (2) Texture: tự host `stardust.png` vào `public/images/textures/` (giờ hiện ở /services/event-marketing/ như thiết kế gốc, theo lựa chọn của chủ dự án); `aged-paper.png` đã 404 ở nguồn nên bỏ div overlay (không đổi hiển thị). (3) CSS DealMakers: `@config` riêng → 147 KB → 47 KB (gzip 25 → 10 KB); computed style của mọi phần tử trên 9 trang DealMakers (en/ar/zh, mobile/desktop, mở menu/banner) giống hệt bản cũ.
- **Vì sao:** chủ dự án yêu cầu lên A+ securityheaders.com và mobile PSI 90+ cho /dealmakers/ss3/, làm trên preview trước.
- **Trạng thái:** preview bằng `wrangler versions upload` (token riêng, xem dưới) → Report-Only 0 vi phạm trên 36 URL → production Report-Only (`ccc53ff`) 0 vi phạm → enforce (`3a54529`), **đã verify live** 2026-10-22: quét 36 URL 0 vi phạm, menu/banner/form/island/font/embed X·LinkedIn·YouTube·Vimeo đều chạy. Form Apply to Join test 1 bản TEST từ local, chủ dự án xác nhận Telegram nhận được. Lighthouse local xen kẽ 6 cặp: production cũ trung vị 75 (FCP 3.8 s, LCP 4.6 s) → preview mới 87.5 (FCP 2.8 s, LCP 3.2 s); production sau deploy trung vị 90 (FCP 2.6 s, LCP 3.1 s, 6 lần). PSI API hết quota nên chưa có số PSI chính thức.
- **Việc còn lại / lưu ý cho AI sau:** wrangler cho dự án này dùng **API token riêng** trong `.env.cloudflare.local` (git bỏ qua, KHÔNG commit, KHÔNG in ra), vì `wrangler login` chung của máy là tài khoản thanhphattdc@gmail.com cho dự án khác. Chạy: `set -a; . ./.env.cloudflare.local; set +a; npx wrangler ...`. Token đã bị dán vào chat ngày 2026-10-22: nên Roll trên Cloudflare (My Profile → API Tokens → fintech24h-wrangler) rồi ghi lại. Lỗi có sẵn chưa sửa: `/services/custom-solutions/` lỗi JS `DOMTokenList` (thêm class có ký tự `[`); `/author/phat-vo` thỉnh thoảng 404.

