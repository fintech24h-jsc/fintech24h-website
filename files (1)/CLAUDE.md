# CLAUDE.md — Fintech24h Project Intelligence

> **Đây là file bắt buộc đọc đầu tiên.** Claude Code PHẢI đọc file này trước khi chạm vào bất kỳ file nào trong dự án. Mọi quyết định kỹ thuật và thiết kế phải tuân theo tài liệu này.

---

## 1. DỰ ÁN LÀ GÌ

**Fintech24h.com** — Blockchain & AI Marketing Agency có trụ sở tại TP.HCM, Việt Nam.

Mục tiêu website: Chuyển đổi Traffic → Leads → Discovery Calls → Revenue **$20,000–$60,000 USD/tháng**.

Đây **không phải** một portfolio website thông thường. Đây là một **Revenue Engine** — mỗi pixel, mỗi dòng animation, mỗi CTA đều phục vụ mục tiêu kinh doanh cụ thể.

---

## 2. KIẾN TRÚC KỸ THUẬT (KHÔNG ĐƯỢC THAY ĐỔI)

```
WordPress (Headless CMS)          Astro 4.x (Frontend)
fintech24h.com/wp-admin    →     fintech24h.com (public)
WP REST API + WPGraphQL    →     Build tĩnh → Cloudflare Pages
```

| Layer | Technology | Ghi chú |
|---|---|---|
| Frontend | **Astro 4.x** | Static output, Islands Architecture |
| Styling | **Tailwind CSS 3.x** | Utility-first, design tokens qua CSS vars |
| Animation | **GSAP 3.x + ScrollTrigger** | Mọi scroll animation đều qua GSAP |
| 3D | **Spline embed** | Chỉ `client:visible`, KHÔNG dùng ở Hero |
| Interactive React | **React 18 Islands** | Chỉ dùng cho Form, Counter, Calendly |
| CMS | **WordPress Headless** | Không render giao diện WP |
| CRM | **HubSpot Forms API** | Real-time lead capture |
| Hosting | **Cloudflare Pages** | Free tier, CDN toàn cầu |
| CI/CD | **GitHub Actions** | Auto-build khi WP publish |

### 2.1 Quy tắc Astro Islands (BẮT BUỘC)

```
client:load   → Form, Calendly (cần ngay khi trang load)
client:visible → AnimatedCounter, Spline 3D, bất cứ gì dưới fold
client:idle   → Chatbot, analytics widget
KHÔNG DÙNG    → client:only cho bất cứ thứ gì có SEO content
```

### 2.2 Cấu trúc thư mục (đã chốt — không tự ý thêm thư mục mới)

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, MobileMenu
│   ├── sections/     # HeroSection, TrustBar, ServicesGrid...
│   ├── ui/           # Button, Card, Badge, Form components
│   └── seo/          # SchemaOrg, BreadcrumbSchema, OpenGraph
├── layouts/          # BaseLayout, BlogLayout, ServiceLayout
├── lib/              # wordpress.ts, hubspot.ts, utils.ts
├── pages/            # index, about, contact, services/*, case-studies/*, blog/*
├── styles/           # global.css (tokens), animations.css
└── data/             # services.ts, clients.ts, team.ts, navigation.ts
```

---

## 3. DESIGN SYSTEM — NGUỒN SỰ THẬT DUY NHẤT

> Đọc `docs/design-system.md` để biết chi tiết đầy đủ. Phần này là tóm tắt bắt buộc ghi nhớ.

### 3.1 Color Tokens (định nghĩa trong `src/styles/global.css`)

```css
/* Nền */
--bg-primary:    #050810   /* Nền chính — đen xanh thiên văn */
--bg-secondary:  #080d1a   /* Card, section nổi */
--bg-tertiary:   #0c1221   /* Elevated, hover state */
--bg-glass:      rgba(8, 13, 26, 0.75)  /* Glassmorphism */

/* Brand Accent — CHỈ 2 màu accent được phép */
--accent-cyan:   #00c8f0   /* Primary — Cyan lạnh, KHÔNG phải cyan điện */
--accent-purple: #7c5cfc   /* Secondary — Tím indigo, KHÔNG phải tím hồng */

/* Text */
--text-primary:  #e8edf8   /* Body text — trắng ngà lạnh, không trắng tuyền */
--text-secondary:#8896b3   /* Muted — xanh xám */
--text-muted:    #4a5568   /* Rất muted */

/* Semantic */
--color-success: #10b981
--color-warning: #f59e0b
--color-danger:  #ef4444

/* Gradients — CHỈ dùng các gradient này, không tự tạo mới */
--gradient-primary:  linear-gradient(135deg, #00c8f0 0%, #7c5cfc 100%)
--gradient-glow-cyan: radial-gradient(ellipse at center, rgba(0,200,240,0.15) 0%, transparent 70%)
--gradient-glow-purple: radial-gradient(ellipse at center, rgba(124,92,252,0.12) 0%, transparent 70%)
--gradient-card:    linear-gradient(135deg, rgba(0,200,240,0.04) 0%, rgba(124,92,252,0.04) 100%)
--gradient-hero-bg: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,92,252,0.2) 0%, transparent 60%)
```

### 3.2 Typography (TUYỆT ĐỐI không thay đổi font)

```css
--font-display: 'Space Grotesk', sans-serif   /* H1, H2, H3, CTA buttons */
--font-body:    'Inter', sans-serif            /* Body, paragraph, caption */
--font-mono:    'JetBrains Mono', monospace   /* Code, số liệu kỹ thuật */
```

**Type Scale:**
```
--text-hero:  clamp(3rem, 7vw, 5.5rem) / line-height: 1.05 / tracking: -0.03em
--text-h1:    clamp(2.2rem, 4.5vw, 3.75rem) / line-height: 1.1 / tracking: -0.025em
--text-h2:    clamp(1.6rem, 3vw, 2.5rem) / line-height: 1.2 / tracking: -0.02em
--text-h3:    clamp(1.2rem, 2vw, 1.5rem) / line-height: 1.3
--text-body:  1rem / line-height: 1.75
--text-small: 0.875rem / line-height: 1.6
--text-xs:    0.75rem / line-height: 1.5 / tracking: 0.05em (dùng cho label/tag)
```

### 3.3 Spacing System

```css
/* Dùng bội số của 4px */
--space-1: 0.25rem    --space-2: 0.5rem    --space-3: 0.75rem
--space-4: 1rem       --space-6: 1.5rem    --space-8: 2rem
--space-12: 3rem      --space-16: 4rem     --space-24: 6rem
--space-32: 8rem

/* Section padding: py-24 mobile → py-32 desktop (KHÔNG dùng ít hơn py-16 cho section) */
/* Component gap: gap-6 default, gap-4 compact, gap-8 spacious */
```

### 3.4 Border Radius

```css
--radius-sm:   4px    /* Input, badge nhỏ */
--radius-md:   8px    /* Button, tag */
--radius-lg:   12px   /* Card nhỏ */
--radius-xl:   16px   /* Card lớn */
--radius-2xl:  24px   /* Section card, modal */
--radius-full: 9999px /* Pill button, avatar */
```

---

## 4. ANIMATION SYSTEM — ĐỌC KỸ TRƯỚC KHI VIẾT BẤT KỲ ANIMATION NÀO

> Chi tiết đầy đủ trong `docs/animation-system.md`. Phần này là luật — không có ngoại lệ.

### 4.1 Phân loại animation (3 loại được phép)

**LOẠI 1 — Ambient (Nền không gian, luôn chạy):**
Chỉ dùng cho background elements. Chậm, tinh tế, không gây phân tâm.
```
Duration: 6s–12s | Easing: ease-in-out | Lặp: infinite
Ví dụ: orb glow pulse, grid pattern shimmer, particle drift
```

**LOẠI 2 — Entrance (Phần tử xuất hiện khi scroll vào viewport):**
Trigger qua GSAP ScrollTrigger. Mỗi section chỉ được dùng 1 kiểu entrance.
```
Duration: 0.6s–1s | Easing: power3.out | Delay stagger: 0.08s–0.12s
Ví dụ: fade-up, fade-in, scale-in (từ 0.95 lên 1)
```

**LOẠI 3 — Interaction (Phản hồi hành động người dùng):**
Hover, click, focus. Nhanh và tức thì.
```
Duration: 0.2s–0.35s | Easing: ease-out (hover), ease-in-out (click)
Ví dụ: border glow hover, button lift, icon rotate
```

### 4.2 Quy tắc cứng về animation

```
✅ ĐƯỢC PHÉP:
- Mỗi phần tử: TỐI ĐA 1 loại animation entrance
- Background orbs: tối đa 2 orbs/section
- Hover effects: 1 hiệu ứng duy nhất mỗi component
- Text reveal: chỉ dùng ở Hero H1 và section heading lớn
- Counter animation: chỉ dùng cho số liệu kết quả (case study)

❌ TUYỆT ĐỐI KHÔNG:
- Không animation cho mọi thứ (scroll vào là fade = nhàm chán, "mùi AI" rõ nhất)
- Không dùng animate-bounce, animate-spin trừ loading indicator
- Không parallax phức tạp (gây CLS, performance kém trên mobile)
- Không text scramble/typewriter trừ Hero H1 (và chỉ 1 lần)
- Không infinite rotation 3D
- Không animation delay > 0.5s (người dùng sẽ tưởng trang bị lag)
- Không animation khi prefers-reduced-motion: reduce
```

### 4.3 GSAP ScrollTrigger boilerplate (luôn dùng pattern này)

```typescript
// src/styles/animations.ts — import và dùng trong component
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Pattern chuẩn cho entrance animation
export function animateFadeUp(selector: string, stagger = 0.1) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: selector,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true,  // QUAN TRỌNG: chỉ play 1 lần
      }
    }
  );
}

// Pattern cho text reveal Hero H1 (chỉ dùng đúng 1 lần toàn site)
export function animateHeroText(selector: string) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 24, filter: 'blur(8px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.07,
    }
  );
}
```

---

## 5. COMPONENT PATTERNS — KHÔNG TỰ Ý VIẾT KHÁC ĐI

### 5.1 Glass Card (dùng cho mọi card, service box, testimonial)

```html
<!-- Pattern chuẩn — không được viết glass effect khác -->
<div class="
  relative
  bg-[var(--bg-glass)]
  border border-white/[0.06]
  rounded-2xl
  backdrop-blur-md
  transition-all duration-300 ease-out
  hover:border-white/[0.12]
  hover:-translate-y-1
  hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
">
  <!-- Neon border highlight (chỉ thêm khi card là featured/active) -->
  <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent-cyan)]/5 to-[var(--accent-purple)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <!-- Content -->
</div>
```

### 5.2 Button Primary

```html
<!-- Gradient button với glow effect -->
<button class="
  relative inline-flex items-center gap-2
  px-6 py-3
  font-display font-semibold text-sm
  text-[#050810]
  bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)]
  rounded-lg
  transition-all duration-300 ease-out
  hover:shadow-[0_0_24px_rgba(0,200,240,0.4),0_0_48px_rgba(124,92,252,0.2)]
  hover:-translate-y-0.5
  active:translate-y-0
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-cyan)]
">
  <!-- Shimmer overlay on hover -->
  <div class="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
  <span class="relative">Button Label</span>
</button>
```

### 5.3 Section Header Pattern

```astro
<!-- Dùng cho tất cả section heading — không được viết heading section khác kiểu -->
<div class="text-center space-y-4 mb-16" data-animate="fade-up">
  <!-- Eyebrow label -->
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full
    border border-[var(--accent-cyan)]/20
    bg-[var(--accent-cyan)]/5
    text-[var(--accent-cyan)] text-xs font-mono font-medium tracking-widest uppercase">
    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
    Section Label
  </div>
  <!-- H2 -->
  <h2 class="font-display text-h2 font-bold text-[var(--text-primary)] max-w-2xl mx-auto">
    Main Heading Here
    <span class="bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] bg-clip-text text-transparent">
      Highlighted Part
    </span>
  </h2>
  <!-- Subtitle -->
  <p class="font-body text-[var(--text-secondary)] text-lg max-w-xl mx-auto leading-relaxed">
    Subtitle text — concise, không quá 2 câu.
  </p>
</div>
```

### 5.4 Neon Divider (thay thế `<hr>` thông thường)

```html
<div class="w-16 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/60 to-transparent mx-auto" />
```

---

## 6. DANH SÁCH DỰ ÁN CỐT LÕI

### 6.1 Thông tin công ty

```
Tên:      Fintech24h
Website:  https://fintech24h.com
Email:    info@fintech24h.com
Địa chỉ: 1014 Đ. Phạm Văn Đồng, Hiệp Bình, TP.HCM
```

### 6.2 Social Media (dùng đúng URL này)

```
LinkedIn:  https://www.linkedin.com/company/fintech24h/
Facebook:  https://www.facebook.com/fintech24hnews
Instagram: https://www.instagram.com/fintech24h/
X:         https://x.com/fintech24h_com
Telegram:  https://t.me/fintech24h
Medium:    https://medium.com/@fintech24h
```

### 6.3 Ecosystem sites (hiển thị ở Footer)

```
Coinstori:  https://coinstori.com
CMO Intern: https://cmointern.com
```

### 6.4 External Resources

```
Media Kit:   https://drive.google.com/drive/folders/1fPgwA514HzHmkBOkhh_P4QfV6lie9OUh
Partnership: https://docs.google.com/forms/d/e/1FAIpQLSeOhaoV-q4dyjEgVa5fVQToKPtHyqDmKBj9fHig9bNS3JrYqw/viewform
```

### 6.5 Sáu dịch vụ cốt lõi (không thêm bớt)

```
1. KOL & Influencer Marketing    → /services/kol-influencer-marketing
2. PR & Media                    → /services/pr-media
3. Community Management          → /services/community-management
4. Growth & Airdrop Campaigns    → /services/growth-airdrop
5. Business Development          → /services/business-development
6. Content Strategy & SEO        → /services/content-strategy-seo
```

---

## 7. SEO RULES (tuân thủ tuyệt đối)

- Mỗi trang: 1 `<h1>` duy nhất, `<title>` và `<meta description>` unique
- Schema JSON-LD bắt buộc: Organization (mọi trang), Article (blog), Service (service pages), FAQ (homepage), BreadcrumbList (mọi trang con)
- Image: luôn có `alt`, khai báo `width`/`height`, ảnh hero dùng `loading="eager" fetchpriority="high"`
- Canonical URL: tuyệt đối đúng cho mọi trang
- `robots.txt`: block `/wp-admin/` và `/wp-json/`
- Localized keywords: viết section "Agency in [Country]" cuối mỗi service page thay vì dùng hreflang

---

## 8. PERFORMANCE RULES

- Lighthouse target: **≥ 95** tất cả 4 chỉ số
- LCP < 2.5s: hero image phải preload, không dùng `background-image` CSS cho ảnh quan trọng
- CLS = 0: mọi ảnh phải có `width`/`height` hoặc `aspect-ratio`
- Spline/Three.js: LUÔN `client:visible`, KHÔNG BAO GIỜ tại Hero (ảnh hưởng LCP)
- CSS: chỉ Tailwind utilities, không viết CSS ad-hoc trừ animation keyframes và CSS variables
- Font: preconnect Google Fonts, chỉ load 2 weights mỗi font (400 + 600 cho Inter, 500 + 700 cho Space Grotesk)

---

## 9. CHECKLIST TỰ KIỂM TRA TRƯỚC KHI BÁO CÁO XONG

Trước khi báo cáo task hoàn thành, Claude Code phải tự hỏi:

```
□ Component này có đang dùng đúng CSS variables hay hardcode màu hex?
□ Animation có phục vụ mục đích rõ ràng, hay chỉ là "thêm cho đẹp"?
□ Tất cả text có đủ contrast với nền tối (≥ 4.5:1)?
□ Mobile layout có test ở 375px không?
□ Interactive elements có :focus-visible không?
□ Có bất kỳ dấu hiệu "AI template" nào (card grid đồng đều với icon tròn, heading + body + CTA lặp lại y hệt, ...) không?
□ GSAP animation có dùng `once: true` trong ScrollTrigger không?
□ prefers-reduced-motion có được tôn trọng không?
□ Spline/3D có dùng `client:visible` không?
```

Nếu bất kỳ mục nào là "Không" → sửa trước khi báo cáo xong.
