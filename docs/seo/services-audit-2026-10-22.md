# Audit SEO 7 trang dịch vụ (2026-10-22)

Nguồn: (1) Google Search Console export 2025-07-01 → 2026-10-19; (2) phân tích đối thủ ICODA, NinjaPromo (+ Coinbound làm mốc); (3) audit code + HTML live của `/services/*`.
Định hướng đã chốt với chủ dự án: tiếng Anh toàn cầu, H1 từ khoá đứng trước, giữ phong cách từng trang (được thêm section, chỉnh animation), KHÔNG số liệu case, giữ 7 trang và viết sâu, phủ mọi biến thể blockchain / crypto / Web3 / fintech (+ NFT, DeFi).

---

## 1. Hiện trạng theo dữ liệu GSC

- 584 click / ~259k hiển thị trong 16 tháng. Click không chứa thương hiệu: ~39 trên ~180k hiển thị.
- 7 trang dịch vụ cộng lại: ~600 hiển thị, 4 click. Hub `/services/`: 805 hiển thị, vị trí 4,7 (chủ yếu truy vấn thương hiệu).
- Nhu cầu có thật nhưng đang rơi vào ~102 bài blog cũ dạng "agency" (131k hiển thị, 64 click, vị trí 40–80): bài blog tranh từ khoá với trang dịch vụ.
- Lượt hiển thị/tháng: 47k (07/2025) → 6–10k (2026). Click hồi lại 13 → 57–81/tháng sau khi ra site mới (07/2026).
- Quốc gia theo lượt hiển thị: Mỹ 145k, Anh 30k, Ấn Độ 11k, UAE 8k. Click: Việt Nam nhiều nhất (thương hiệu).

### Lượt hiển thị theo nhóm từ khoá (16 tháng, vị trí trung bình)

| Nhóm | Hiển thị | Truy vấn tiêu biểu |
|---|---|---|
| Agency chung | 99k | nft marketing agency 5,5k (39) · blockchain marketing agency 4,8k (63) · defi marketing agency 4,3k (30) · web3 seo agency 2,4k (38) · defi marketing services 1,9k (34) |
| PR | 24k | blockchain pr agency 3,9k (56) · web3 pr agency 2k (60) · blockchain pr services 1,4k (76) · nft pr agency 1,1k (45) · defi pr agency 1k (40) |
| Community | 17k | crypto community management services 1,1k (56) · web3 community management 493 (42) · crypto community management agency 307 (64) |
| KOL | 9k | web3 influencer marketing 743 (47) · crypto influencer marketing services 358 (78) · web3 influencer agency 279 (73) · nft influencer marketing agency 237 (49) |
| Event / AI / BD | < 1,5k mỗi nhóm | Chủ yếu tên sự kiện trong bài tin; AI là truy vấn không liên quan |

### Lỗi kỹ thuật
6 URL `/service-post/*` trả **404**: `community-management-service` (1.487 hiển thị), `airdrop`, `video-marketing`, `website-seo-solutions`, `seeding-shilling`, `whitepaper-tokenomics`. Bảng redirect ở `src/pages/[...path].astro:14-18` mới có 5 dòng.

---

## 2. Đối thủ: điểm rút ra

- Khung chung của các trang đang lên top: H1 "[Crypto/Web3] [Service] Agency" → định nghĩa → các lỗi hay gặp + cách xử lý → hạng mục dịch vụ → phân loại (tầng KOL/báo) → quy trình 3–6 bước → tab theo loại dự án (token launch, sàn/DEX, DeFi, L1/L2, fintech) → bằng chứng → mô hình hợp tác → FAQ 7–13 câu → form.
- Độ dài: Coinbound 1,4–2,4k chữ, ICODA 2,5–3,6k, NinjaPromo 3,5–5,5k.
- **Event Marketing và Business Development: cả ICODA lẫn NinjaPromo đều KHÔNG có trang dịch vụ.** Đây là hai cơ hội rõ nhất.
- AI marketing: ICODA thống trị nhờ ~112 bài listicle tự xếp hạng. Không đối đầu trực tiếp, giữ hướng AI cho crypto/fintech.
- Lợi thế riêng: Việt Nam/Đông Nam Á (KOL Việt, Telegram, báo trong nước, sự kiện châu Á) gần như bỏ trống.
- Uy tín không cần số liệu: công khai quy trình kiểm tra KOL, bảng quy định công bố bài trả phí (FTC/MiCA, ghi rõ không phải tư vấn pháp lý), cam kết quy trình ("không gì đăng khi chưa có bạn duyệt"), gói theo tình huống (đang launch / vừa gọi vốn / mở thị trường), người thật có LinkedIn.
- Không bắt chước: AggregateRating tự chấm (Google không hiển thị và coi là rủi ro hướng dẫn).

---

## 3. Bản đồ từ khoá đề xuất (mỗi trang làm chủ 1 cụm)

| Trang | Từ khoá chính | Biến thể phủ trong H2/FAQ/thân bài | H1 đề xuất |
|---|---|---|---|
| Hub `/services/` | blockchain marketing services | crypto / Web3 / NFT / DeFi marketing services, fintech marketing services | Blockchain & Crypto Marketing Services (giữ gần như hiện tại) |
| KOL | crypto influencer marketing agency | crypto KOL marketing, Web3 influencer marketing/agency, NFT influencer marketing, blockchain & fintech influencer marketing | Crypto KOL & Influencer Marketing Agency |
| PR | blockchain PR agency | crypto PR agency, Web3 PR agency/services, NFT & DeFi PR, crypto press release, fintech PR | Blockchain & Crypto PR Agency |
| Community | crypto community management agency | Web3 community management, Telegram & Discord community management, ambassador program, NFT/DeFi community | Crypto & Web3 Community Management Agency |
| Event | crypto event marketing agency | Web3 & blockchain event marketing, conference marketing, side events, TOKEN2049 / Asia blockchain weeks, sponsorship | Crypto & Web3 Event Marketing Agency |
| AI (đã làm) | crypto AI marketing agency | blockchain / fintech AI marketing, GEO cho dự án crypto (không chiếm từ khoá của trang ai-seo-geo tương lai) | Giữ nguyên |
| BD | Web3 business development agency | crypto business development, exchange listing support, VC/investor introductions, launchpad & market maker intros, strategic partnerships | Web3 & Crypto Business Development Agency |
| Custom | crypto go-to-market strategy | Web3 GTM agency, dedicated Web3 growth team, custom blockchain/AI marketing programs | (cần chủ dự án duyệt, xem mục 6) |

Trang chủ và 3 pillar giữ "blockchain/crypto marketing agency" (+ quốc gia). Trang dịch vụ không dùng nguyên cụm đó trong H1.

---

## 4. Lỗi on-page theo trang

| Trang | Chữ (riêng) | P0 | P1/P2 |
|---|---|---|---|
| KOL | ~730 | H1 slogan; CTA hero link về chính trang (`KolCtaSection.astro:65`) | 3 ảnh pravatar người lạ; "We guarantee reach, engagement, CTR"; meta 176 ký tự; FAQPage chứa HTML; không link dịch vụ khác/blog |
| PR | ~700 | H1 slogan, nửa sau gần như vô hình (stroke); marquee logo Bloomberg/Forbes/TechCrunch... ngầm nói đã lên báo; CTA hero link về chính trang (`PrCtaSection.astro:25`) | H2 "Fintech24h" + H3 rác trong mockup tờ báo; texture bị CSP chặn; meta 181 |
| Community | ~650 | H1 slogan; "+500K / 24/7 / 6" (`:130-146`) | H2 "# faq-channel"; stat card + sóng SVG tối cứng (light theme hỏng); title 67 |
| Event | ~570 | H1 slogan; trang mỏng nhất; chữ "crypto" xuất hiện 0 lần | blur reveal trên mọi đoạn; "$50K/300/200"; texture bị CSP chặn; title hứa "Speaker & Sponsor" nhưng thân bài không có |
| AI | ~1.380 | – | Chưa đủ độ dài; ambient 4s (<6s); thiếu link sang KOL/Event/BD/blog |
| BD | ~930 | H1 slogan | Section dịch vụ thiếu H2; cả khối hero bắt đầu opacity 0 (hại LCP); "6 months/80%"; `animate-ping`; title 71 |
| Custom | ~600 | KPI đầy số và hype ("99%", "10x", "500+ portals"...); 55 thẻ dịch vụ chỉ sinh bằng JS (crawler thấy lưới rỗng) | Không FAQ; nhảy H2→H4; canvas xoay 3D vô hạn bỏ qua reduced-motion; thẻ div không dùng bàn phím được; không link 6 trang dịch vụ |
| Hub | ~320 | – | Thiếu custom-solutions; 6 link thiếu `/` cuối (301); anchor "Explore Service"; `services.ts` còn hype + mâu thuẫn trang AI |

### Vấn đề chung
1. 5/7 H1 là slogan.
2. 4 title > 60 ký tự, 5 meta > 160 ký tự. Meta trang chủ có em-dash.
3. Gần như không nhắc "crypto" (KOL 1, Community 2, Event 0, BD 0, Custom 0).
4. Internal link: chỉ AI link sang dịch vụ khác; không trang nào link blog; link pillar là chú thích nhỏ lặp lại.
5. Schema Service tối giản (thiếu `name`, `areaServed`, provider không dùng `@id #organization`); FAQPage chứa HTML thô. Trang AI là mẫu đúng.
6. Animation "mọi thứ đều fade": 15–25 trigger/trang, `transition-delay` inline làm hover bị trễ, H1 ẩn tới khi JS chạy (không có guard `(scripting: enabled)`).
7. Không có `:focus-visible` toàn cục; CTA và `<summary>` thiếu focus style.
8. Light theme: `opacity-70` trên `--text-secondary` ~4.0:1 (trượt AA), `hover:text-white` ở link FAQ.
9. `src/layouts/ServiceLayout.astro` không được dùng (code chết).

---

## 5. Kế hoạch đề xuất

**Giai đoạn 0. Sửa nhanh, rủi ro thấp (không đổi giao diện)**
- 301 cho 6 URL `/service-post/*` còn 404.
- CTA hero KOL/PR → `/contact/`.
- Hub: thêm `/` cuối link, anchor = tên dịch vụ, thêm custom-solutions.
- Đổi H2/H3 rác thành `span` (PR, Community).
- Schema Service + FAQPage theo mẫu trang AI cho 6 trang; FAQPage cho Custom khi có FAQ.
- Rút title ≤ 60, meta 150–160.
- Guard `(scripting: enabled)` cho `.reveal` để H1 không ẩn.
- Focus-visible cho CTA/summary; sửa contrast light theme.

**Giai đoạn 1. Viết lại từng trang (mỗi trang 1 lần duyệt)**
Thứ tự đề xuất theo nhu cầu tìm kiếm + độ trống của đối thủ: PR → Community → KOL → Event → BD → Custom → bổ sung AI → Hub.
Mỗi trang: H1 từ khoá, đoạn định nghĩa, các lỗi hay gặp, hạng mục dịch vụ, phân loại, quy trình, tab theo loại dự án (có fintech), "how we measure" không số, ghi chú thị trường VN/SG/UAE có link pillar, 2–3 dịch vụ liên quan, 1–2 bài blog, FAQ 8–12 câu. Mục tiêu 1.800–2.500 chữ. Animation: 1 entrance/section, ambient ≥ 6s, không blur ngoài H1.

**Giai đoạn 2. Xử lý bài blog tranh từ khoá** (sau giai đoạn 1, cần chủ dự án duyệt danh sách).

---

## 6. Câu hỏi chờ chủ dự án quyết

1. Logo báo trên trang PR (CoinTelegraph, Yahoo Finance, Bloomberg, Decrypt, The Block, CoinDesk, TechCrunch, Forbes): đã thật sự có bài trên báo nào?
2. Bài blog tranh từ khoá: (a) giữ, đổi hướng thành bài hướng dẫn + link về trang dịch vụ; hay (b) 301 những bài gần trùng về trang dịch vụ.
3. Custom Solutions: đổi hướng thành "Crypto Go-To-Market / Dedicated Web3 Growth Team" và link từng hạng mục về trang dịch vụ tương ứng?
4. 3 ảnh avatar người lạ (pravatar) ở hero KOL: thay bằng minh hoạ trừu tượng, hay bạn có ảnh KOL thật được phép dùng?

### Quyết định của chủ dự án (2026-10-22)
1. Logo báo trang PR: **bỏ hết**, thay bằng phân loại tầng báo không nêu tên.
2. Bài blog tranh từ khoá: **giữ hết, chỉ thêm link** về trang dịch vụ (không 301).
3. Custom Solutions: **đổi hướng thành Crypto & Web3 Go-To-Market / Dedicated Growth Team**, link từng hạng mục về trang riêng, bỏ KPI số, render HTML thật.
4. Triển khai: **làm Giai đoạn 0 ngay**, rồi làm lại trang PR đầu tiên.
5. Avatar pravatar ở hero KOL: chưa hỏi; mặc định thay bằng minh hoạ trừu tượng khi làm lại trang KOL.
