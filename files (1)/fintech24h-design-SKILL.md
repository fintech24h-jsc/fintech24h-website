---
name: fintech24h-design
description: >
  Skill thiết kế UI/UX riêng cho dự án Fintech24h (Blockchain & AI Marketing Agency).
  LUÔN kích hoạt skill này khi: tạo component Astro mới, viết CSS/Tailwind, làm việc với
  animation/GSAP, thiết kế layout, chọn màu/font, review UI đã có, hoặc khi người dùng yêu
  cầu "làm đẹp hơn", "bớt giống AI", "thêm animation", "cải thiện giao diện". Skill này
  đảm bảo mọi output xuyên suốt dự án đều nhất quán về aesthetic và không rơi vào "khuôn
  mẫu AI" — kể cả khi làm việc ở các phiên Claude Code khác nhau.
---

# Fintech24h Design & Motion Skill

Đây là skill thiết kế riêng cho **Fintech24h.com** — Blockchain & AI Marketing Agency. Mục tiêu duy nhất: đảm bảo mọi giao diện sinh ra đều nhìn như được thiết kế bởi một senior designer chuyên về Web3/Tech, không phải AI chạy template.

---

## Bước đầu tiên khi nhận bất kỳ task UI nào

1. **Đọc `CLAUDE.md`** ở gốc dự án — file này là nguồn sự thật về kiến trúc và design system tóm tắt.
2. **Đọc `docs/design-system.md`** — chi tiết đầy đủ về colors, typography, components.
3. **Đọc `docs/animation-system.md`** — trước khi viết bất kỳ animation nào.
4. **Đọc `docs/anti-ai-patterns.md`** — để biết những gì cần tránh.

Không bỏ qua bước nào. Nếu đang vội, ít nhất đọc `CLAUDE.md`.

---

## Khi nào kích hoạt skill này

**Bắt buộc:**
- Tạo file `.astro` mới trong `src/components/` hoặc `src/pages/`
- Sửa CSS, Tailwind classes, hoặc CSS variables
- Viết bất kỳ animation hoặc GSAP code nào
- User yêu cầu: "làm đẹp hơn", "bớt giống AI", "thêm chuyển động", "cải thiện UI"
- Review lại component đã có để đánh giá chất lượng

**Không cần:**
- Sửa file `lib/wordpress.ts` hoặc `lib/hubspot.ts` (logic only)
- Sửa `astro.config.mjs`, `tailwind.config.mjs`
- Viết GitHub Actions workflow

---

## Nhận diện dự án — context cho Claude Code

```
Project: Fintech24h.com
Type:    Blockchain & AI Marketing Agency website
Stack:   Astro 4.x + Tailwind CSS + GSAP + React Islands
CMS:     WordPress Headless (REST API)
Host:    Cloudflare Pages (static)
Goal:    Revenue Engine — $20k-$60k USD/month từ website leads

Aesthetic DNA:
  → Dark UI (đen xanh thiên văn, không phải đen tuyền)
  → 2 accent: Cyan (#00c8f0) + Purple (#7c5cfc)
  → Font: Space Grotesk (headings) + Inter (body) + JetBrains Mono (labels)
  → Glassmorphism cards với border rất nhạt
  → Ambient orb backgrounds (subtle, không flashy)
  → Animation có chọn lọc — KHÔNG fade mọi thứ

Anti-patterns cần tránh:
  → 3-col card grid đồng đều với icon-title-text
  → Mọi element đều fade-up khi scroll
  → Eyebrow label dùng emoji trong pill/badge to
  → Copy dùng: cutting-edge, revolutionary, seamless, leverage
  → Gradient text ở mọi heading
```

---

## Quy trình khi tạo component mới

### Bước 1: Xác định loại component
- **Section** (1 phần của page) → đặt trong `src/components/sections/`
- **UI primitive** (button, card, badge) → đặt trong `src/components/ui/`
- **Interactive** (form, counter, carousel) → `.tsx` với React, đặt trong `src/components/ui/`
- **SEO** (schema, meta) → đặt trong `src/components/seo/`

### Bước 2: Brainstorm nhanh (làm trong đầu, 30 giây)
Hỏi: "Nếu AI khác làm component này, nó sẽ ra thế nào?" → Đó là output cần tránh.
Hỏi: "Fintech24h khác gì competitor?" → Build từ điểm đó.

### Bước 3: Viết code theo design system
- Màu → dùng `var(--accent-cyan)`, `var(--text-primary)` — không hardcode hex
- Font → `font-display` (Space Grotesk), `font-body` (Inter), `font-mono` (JetBrains)
- Animation → xem `docs/animation-system.md` trước khi viết bất kỳ dòng nào
- Component size → dưới 150 dòng, nếu hơn thì tách nhỏ

### Bước 4: Self-review với checklist
```
□ Màu dùng CSS variables, không hardcode?
□ Animation có mục đích rõ ràng, không phải "thêm cho đẹp"?
□ Component này có khác với "AI template default" không?
□ Mobile 375px hoạt động không?
□ prefers-reduced-motion được handle không?
□ Có ít nhất 1 micro-interaction (hover effect) không?
□ Border contrast đủ không (≥ rgba(255,255,255,0.06) minimum)?
```

---

## Quick Reference — Patterns hay dùng nhất

### Glass Card (dùng nhiều nhất)
```astro
<div class="
  relative overflow-hidden
  bg-[var(--bg-glass)] backdrop-blur-md
  border border-white/[0.06]
  rounded-2xl
  transition-all duration-300 ease-out
  hover:border-white/[0.12]
  hover:-translate-y-[3px]
  hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]
  group
">
  <slot />
</div>
```

### Section Header (template chuẩn)
```astro
<div class="text-center space-y-4 mb-16" data-animate="fade-up">
  <div class="inline-flex items-center gap-2">
    <div class="w-6 h-px bg-[var(--accent-cyan)]"></div>
    <span class="font-mono text-xs text-[var(--accent-cyan)] uppercase tracking-[0.12em]">
      Section Label
    </span>
    <div class="w-6 h-px bg-[var(--accent-cyan)]"></div>
  </div>
  <h2 class="font-display text-h2 font-bold text-[var(--text-primary)]">
    Main Heading <span class="bg-gradient-to-r from-[var(--accent-cyan)] to-[#a78bfa] bg-clip-text text-transparent">Highlight</span>
  </h2>
  <p class="font-body text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
    Subtitle text.
  </p>
</div>
```

### Ambient Background (dùng cho mọi section chính)
```astro
<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
  <div class="absolute w-[500px] h-[500px] rounded-full"
    style="background:var(--gradient-glow-cyan);top:-10%;left:-5%;animation:orb-pulse 9s ease-in-out infinite,orb-drift 13s ease-in-out infinite;filter:blur(40px);opacity:0.2">
  </div>
  <div class="absolute w-[400px] h-[400px] rounded-full"
    style="background:var(--gradient-glow-purple);bottom:-5%;right:-8%;animation:orb-pulse 11s ease-in-out infinite 3s,orb-drift 16s ease-in-out infinite 5s;filter:blur(50px);opacity:0.15">
  </div>
</div>
```

### Button Primary
```astro
<a href={href} class="
  relative inline-flex items-center gap-2
  px-6 py-3 rounded-lg
  font-display font-semibold text-[0.9375rem]
  text-[var(--text-inverted)]
  bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)]
  transition-all duration-250 ease-out
  hover:-translate-y-0.5
  hover:shadow-[0_0_24px_rgba(0,200,240,0.4),0_0_60px_rgba(124,92,252,0.15)]
  active:translate-y-0
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-cyan)]
">
  <slot />
</a>
```

### GSAP Entrance (scroll trigger chuẩn)
```typescript
// Trong <script> của component, hoặc gọi từ BaseLayout
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ScrollTrigger.batch('[data-animate="fade-up"]', {
    onEnter: (els) => gsap.fromTo(els,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
    ),
    start: 'top 84%',
    once: true,
  });
}
```

---

## Một số câu hỏi tự vấn trước khi submit

- Nếu tôi đưa screenshot này cho 10 designer khác với cùng brief, họ có ra output y hệt không? → Nếu có, làm lại.
- Người dùng có biết ngay đây là website của agency chuyên blockchain, hay trông như mọi SaaS site khác?
- Animation có giúp người dùng hiểu content hơn, hay chỉ là decoration?
- Copy có chứa ít nhất 1 số liệu cụ thể không?
