# Design System — Fintech24h

> File này là nguồn sự thật tuyệt đối về thiết kế. Claude Code đọc file này TRƯỚC KHI viết bất kỳ dòng CSS hoặc HTML nào liên quan đến giao diện.

---

## 1. TRIẾT LÝ THIẾT KẾ — ĐỌC TRƯỚC KHI LÀM BẤT CỨ ĐIỀU GÌ

### Fintech24h trông như thế nào?

Hãy nghĩ đến cảm giác nhìn vào **kính viễn vọng James Webb lúc 3 giờ sáng** — bầu trời đen thẳm, những tinh vân màu lạnh, ánh sáng chỉ xuất hiện ở những điểm quan trọng nhất. Không có gì thừa. Mọi thứ đều có lý do tồn tại.

Đây là agency chuyên về blockchain và AI. Giao diện phải toát ra:
- **Precision** — chính xác, không trang trí thừa
- **Intelligence** — mọi lựa chọn đều có lý do
- **Trust** — dark UI = nghiêm túc, không phải flashy
- **Kinetic energy** — có chuyển động, nhưng chuyển động có mục đích

### 3 Vấn đề cần tránh ("Mùi AI" phổ biến nhất)

**Vấn đề 1 — The Clone Grid:** Mọi card đều cùng kích thước, cùng cấu trúc icon-title-text-link, cùng spacing. Nhìn vào là biết ngay AI viết. **Giải pháp:** Phá vỡ lưới ở 1-2 điểm quan trọng. Card featured lớn hơn, card đặc biệt có màu khác, layout bất đối xứng.

**Vấn đề 2 — The Fade Everything:** Mọi element đều fade-up khi scroll, kể cả những thứ không cần animation. **Giải pháp:** Chỉ animate phần tử chứa thông tin quan trọng. Những thứ bổ trợ (icon nhỏ, divider) xuất hiện ngay không cần animation.

**Vấn đề 3 — The Same Section Template:** Hero → Trust Bar → 3-Col Grid → CTA → Lặp lại với section khác. **Giải pháp:** Mỗi section có cấu trúc layout riêng. Không section nào được có cùng rhythm với section kế tiếp.

---

## 2. COLOR SYSTEM CHI TIẾT

### 2.1 Palette đầy đủ

```css
:root {
  /* ─── BACKGROUNDS ─── */
  --bg-primary:        #050810;  /* Nền chính — đen xanh thiên văn sâu */
  --bg-secondary:      #080d1a;  /* Card, elevated surface */
  --bg-tertiary:       #0c1221;  /* Hover state, deepest card */
  --bg-glass:          rgba(8, 13, 26, 0.75);   /* Glassmorphism base */
  --bg-glass-light:    rgba(255, 255, 255, 0.03); /* Subtle highlight */

  /* ─── BRAND ACCENTS ─── */
  --accent-cyan:       #00c8f0;  /* Primary — Cyan lạnh (không phải #00ffff điện) */
  --accent-cyan-dim:   #0090b0;  /* Hover/active state của cyan */
  --accent-cyan-glow:  rgba(0, 200, 240, 0.15);
  --accent-purple:     #7c5cfc;  /* Secondary — Tím indigo sâu */
  --accent-purple-dim: #5a3fd0;
  --accent-purple-glow: rgba(124, 92, 252, 0.12);

  /* ─── TEXT ─── */
  --text-primary:      #e8edf8;  /* Body text — trắng ngà lạnh */
  --text-secondary:    #8896b3;  /* Muted — xanh xám trung bình */
  --text-muted:        #4a5470;  /* Very muted — chỉ dùng cho metadata nhỏ */
  --text-inverted:     #050810;  /* Text trên gradient button */

  /* ─── BORDERS ─── */
  --border-default:    rgba(255, 255, 255, 0.06);  /* Card border mặc định */
  --border-hover:      rgba(255, 255, 255, 0.12);  /* Card border khi hover */
  --border-accent:     rgba(0, 200, 240, 0.25);    /* Accent border (active, focus) */
  --border-subtle:     rgba(255, 255, 255, 0.03);  /* Section divider cực nhạt */

  /* ─── SEMANTIC ─── */
  --color-success:     #10b981;
  --color-success-bg:  rgba(16, 185, 129, 0.1);
  --color-warning:     #f59e0b;
  --color-danger:      #ef4444;

  /* ─── GRADIENTS ─── */
  --gradient-primary:  linear-gradient(135deg, #00c8f0 0%, #7c5cfc 100%);
  --gradient-primary-hover: linear-gradient(135deg, #00dcff 0%, #9070ff 100%);
  --gradient-hero-bg:  radial-gradient(ellipse 80% 60% at 50% -20%,
                         rgba(124, 92, 252, 0.18) 0%, transparent 65%);
  --gradient-card:     linear-gradient(135deg,
                         rgba(0, 200, 240, 0.04) 0%,
                         rgba(124, 92, 252, 0.04) 100%);
  --gradient-glow-cyan:   radial-gradient(ellipse at center,
                            rgba(0, 200, 240, 0.18) 0%, transparent 70%);
  --gradient-glow-purple: radial-gradient(ellipse at center,
                            rgba(124, 92, 252, 0.14) 0%, transparent 70%);
  --gradient-text:     linear-gradient(135deg, #00c8f0 0%, #a78bfa 100%);
  --gradient-mesh:     /* Dùng trong Hero background */
    radial-gradient(ellipse 60% 50% at 20% 40%, rgba(0,200,240,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 80% 60%, rgba(124,92,252,0.10) 0%, transparent 60%);
}
```

### 2.2 Quy tắc sử dụng màu

**Accent cyan** → CTA chính, link active, highlight quan trọng nhất, icon dịch vụ chủ đạo  
**Accent purple** → Secondary CTA, badge, tag, accent decoration, gradient pair  
**Không bao giờ** dùng cyan và purple cùng độ sáng cạnh nhau (sẽ clash) — luôn 1 đậm 1 nhạt  
**Text màu** → chỉ dùng `--accent-cyan` cho text link và text highlight quan trọng, không dùng purple cho text  
**Background gradient** → chỉ dùng cho Hero section và CTA section — không dùng toàn trang  

---

## 3. TYPOGRAPHY CHI TIẾT

### 3.1 Font Loading (trong BaseLayout.astro)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?
  family=Space+Grotesk:wght@500;700&
  family=Inter:wght@400;500&
  family=JetBrains+Mono:wght@400;500&
  display=swap" rel="stylesheet">
```

### 3.2 Quy tắc sử dụng font theo vai trò

| Element | Font | Weight | Ghi chú |
|---|---|---|---|
| H1 Hero | Space Grotesk | 700 | Tracking -0.03em |
| H1, H2 | Space Grotesk | 700 | Tracking -0.02em |
| H3 | Space Grotesk | 500 | Tracking -0.01em |
| Button, CTA | Space Grotesk | 600 | Uppercase tracking 0.02em cho btn-ghost |
| Eyebrow/Label | JetBrains Mono | 500 | Uppercase, tracking 0.08em |
| Body text | Inter | 400 | Line-height 1.75 |
| Caption, meta | Inter | 400 | text-sm, color muted |
| Tag, badge text | Inter | 500 | text-xs |
| Số liệu lớn (stats) | Space Grotesk | 700 | Tabular nums |

**Quy tắc tuyệt đối:** Eyebrow label (dòng nhỏ trên heading) LUÔN dùng JetBrains Mono — đây là điểm nhận diện đặc trưng, không được dùng Inter hay Space Grotesk cho eyebrow.

### 3.3 Gradient Text (chỉ dùng có chọn lọc)

```css
/* Chỉ dùng cho 1 phần trong H1/H2 — không dùng toàn bộ heading */
.text-gradient {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Giới hạn:** Tối đa 1 gradient text per section. Nếu nhiều hơn 1 section đều có gradient text thì section dưới không được dùng.

---

## 4. COMPONENT LIBRARY CHI TIẾT

### 4.1 Glass Card Variants

```css
/* Variant 1: Default card */
.card-default {
  background: var(--bg-glass);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}
.card-default:hover {
  border-color: var(--border-hover);
  transform: translateY(-3px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
}

/* Variant 2: Featured card (1 trong N cards — dùng để phá vỡ lưới đồng đều) */
.card-featured {
  background: linear-gradient(135deg,
    rgba(0, 200, 240, 0.08) 0%,
    rgba(124, 92, 252, 0.08) 100%);
  border: 1px solid rgba(0, 200, 240, 0.2);
  border-radius: 20px;
  box-shadow: 0 0 0 1px rgba(0, 200, 240, 0.05),
              inset 0 1px 0 rgba(255,255,255,0.08);
}

/* Variant 3: Numbered card (cho process steps) */
.card-numbered {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.card-numbered::before {
  content: attr(data-step);
  position: absolute;
  top: -12px;
  right: 16px;
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.03);
  line-height: 1;
  user-select: none;
}
```

### 4.2 Button System

```css
/* Primary — gradient fill */
.btn-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #050810;
  background: var(--gradient-primary);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
}
.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 20px rgba(0, 200, 240, 0.35),
    0 0 60px rgba(124, 92, 252, 0.15),
    0 8px 24px rgba(0,0,0,0.3);
}
.btn-primary:hover::after { background: rgba(255,255,255,0.08); }
.btn-primary:active { transform: translateY(0); }

/* Ghost — bordered */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--accent-cyan);
  background: transparent;
  border: 1px solid rgba(0, 200, 240, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-ghost:hover {
  background: rgba(0, 200, 240, 0.08);
  border-color: rgba(0, 200, 240, 0.6);
  box-shadow: 0 0 16px rgba(0, 200, 240, 0.15);
}

/* Icon button (no text) */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-icon:hover {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  background: rgba(0, 200, 240, 0.06);
}
```

### 4.3 Badge / Tag System

```css
/* Tag mặc định */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid;
}
.tag-cyan {
  color: var(--accent-cyan);
  border-color: rgba(0, 200, 240, 0.25);
  background: rgba(0, 200, 240, 0.06);
}
.tag-purple {
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.25);
  background: rgba(124, 92, 252, 0.06);
}
.tag-gray {
  color: var(--text-secondary);
  border-color: var(--border-default);
  background: var(--bg-glass);
}
.tag-success {
  color: var(--color-success);
  border-color: rgba(16, 185, 129, 0.25);
  background: rgba(16, 185, 129, 0.06);
}
```

### 4.4 Form Elements

```css
/* Input field */
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}
.input-field::placeholder { color: var(--text-muted); }
.input-field:focus {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 200, 240, 0.1);
}
.input-field:focus-visible {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 200, 240, 0.15);
}

/* Select option button (thay dropdown bằng button grid) */
.select-option {
  padding: 0.625rem 1rem;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}
.select-option:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
}
.select-option[aria-pressed="true"],
.select-option.active {
  border-color: var(--accent-cyan);
  background: rgba(0, 200, 240, 0.08);
  color: var(--accent-cyan);
}
```

---

## 5. ANIMATION SYSTEM CHI TIẾT

### 5.1 CSS Keyframes bắt buộc (trong `src/styles/animations.css`)

```css
/* ─── AMBIENT (background effects) ─── */
@keyframes orb-pulse {
  0%, 100% { opacity: 0.12; transform: scale(1); }
  50%       { opacity: 0.22; transform: scale(1.08); }
}

@keyframes orb-drift {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(12px, -8px); }
  66%       { transform: translate(-8px, 6px); }
}

@keyframes grid-shimmer {
  0%, 100% { opacity: 0.03; }
  50%       { opacity: 0.06; }
}

@keyframes border-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(0,200,240,0.15); }
  50%       { box-shadow: 0 0 20px rgba(0,200,240,0.3); }
}

/* ─── ENTRANCE (dùng với GSAP ScrollTrigger, hoặc CSS khi không cần GSAP) ─── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* ─── INTERACTION ─── */
@keyframes shimmer-slide {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}

@keyframes count-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── LOADING ─── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(0.75); opacity: 0.5; }
}

/* ─── REDUCED MOTION OVERRIDE (TUYỆT ĐỐI PHẢI CÓ) ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.2 GSAP Patterns chuẩn

```typescript
// src/lib/animations.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // nếu có license

gsap.registerPlugin(ScrollTrigger);

// ── Pattern 1: Fade Up với stagger (dùng nhiều nhất) ──
export function fadeUpStagger(
  selector: string | Element,
  options: { stagger?: number; duration?: number; delay?: number } = {}
) {
  const { stagger = 0.1, duration = 0.75, delay = 0 } = options;
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration, delay, stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: selector as Element,
        start: 'top 84%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
}

// ── Pattern 2: Scale-in card (dùng cho cards/grid) ──
export function scaleInCards(selector: string) {
  return gsap.fromTo(
    selector,
    { opacity: 0, scale: 0.94, y: 20 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 0.65,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: selector,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
}

// ── Pattern 3: Counter animation (chỉ dùng cho stat numbers) ──
export function animateCounter(
  el: Element,
  target: number,
  prefix = '',
  suffix = ''
) {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        { val: 0 },
        {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() { el.textContent = prefix + Math.round(this.targets()[0].val) + suffix; },
        }
      );
    },
  });
}

// ── Pattern 4: Hero headline (chỉ dùng đúng 1 lần) ──
export function animateHeroHeadline(lines: Element[]) {
  gsap.fromTo(
    lines,
    { opacity: 0, y: 32, filter: 'blur(6px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 1.0,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.1,
    }
  );
}

// ── Pattern 5: Horizontal line reveal (dùng cho dividers/timelines) ──
export function revealLine(el: Element) {
  gsap.fromTo(
    el,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    }
  );
}
```

### 5.3 Background Orbs Pattern (dùng trong mọi section chính)

```astro
<!-- Đặt ở đầu section, aria-hidden -->
<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
  <!-- Orb 1 — Cyan, góc trên trái hoặc trung tâm -->
  <div class="absolute w-[500px] h-[500px] rounded-full"
    style="
      background: var(--gradient-glow-cyan);
      top: -10%;
      left: -5%;
      animation: orb-pulse 8s ease-in-out infinite, orb-drift 12s ease-in-out infinite;
    ">
  </div>
  <!-- Orb 2 — Purple, góc đối lập (không phải đối xứng hoàn toàn) -->
  <div class="absolute w-[400px] h-[400px] rounded-full"
    style="
      background: var(--gradient-glow-purple);
      bottom: -5%;
      right: -8%;
      animation: orb-pulse 10s ease-in-out infinite 2s, orb-drift 15s ease-in-out infinite 4s;
    ">
  </div>
  <!-- Grid pattern overlay -->
  <div class="absolute inset-0"
    style="
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 48px 48px;
      animation: grid-shimmer 6s ease-in-out infinite;
    ">
  </div>
</div>
```

---

## 6. LAYOUT SYSTEM — PHÁ VỠ LƯỚI ĐỀU (ANTI-AI-CLONE)

### 6.1 Service Grid — Không dùng 3-col đều nhau

```
Layout option A — 2+1 asymmetric:
┌─────────────────┐ ┌───────────┐
│                 │ │  Card 2   │
│    Card 1       │ │           │
│   (Featured)    │ ├───────────┤
│                 │ │  Card 3   │
└─────────────────┘ └───────────┘
┌──────┐ ┌──────┐ ┌──────┐
│  4   │ │  5   │ │  6   │
└──────┘ └──────┘ └──────┘

Layout option B — masonry-like:
┌────────────────────────────────┐
│         Card 1 (wide)          │
└────────────────────────────────┘
┌────────┐ ┌────────┐ ┌────────┐
│ Card 2 │ │ Card 3 │ │ Card 4 │
└────────┘ └────────┘ └────────┘
┌─────────────┐ ┌─────────────┐
│   Card 5    │ │   Card 6    │
└─────────────┘ └─────────────┘
```

Tailwind implementation cho Layout A:
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-2 md:row-span-2"><!-- Featured card --></div>
  <div><!-- Card 2 --></div>
  <div><!-- Card 3 --></div>
  <div><!-- Card 4 --></div>
  <div><!-- Card 5 --></div>
  <div><!-- Card 6 --></div>
</div>
```

### 6.2 Stats Section — Không dùng simple 4-col grid

```
Pattern chuẩn: Dùng divider dọc và horizontal offset

┌──────────────────────────────────────────────┐
│  200+         │   50x          │    6         │
│  Projects     │   Avg ROI      │  Countries   │
│               │                │              │
│  ↑ stagger    │  ↑ +0.1s       │  ↑ +0.2s    │
└──────────────────────────────────────────────┘
```

```html
<div class="grid grid-cols-3 divide-x divide-white/[0.06]">
  <div class="text-center px-8">
    <div class="font-display text-5xl font-bold text-[var(--accent-cyan)]" data-count="200" data-suffix="+">0+</div>
    <div class="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mt-2">Projects Scaled</div>
  </div>
  <!-- ... -->
</div>
```

### 6.3 Case Study Section — Horizontal scroll hoặc highlight card

```
Option A: Feature một case study chính, list nhỏ bên phải
┌─────────────────────┐ ┌───────────────────┐
│                     │ │ GT Protocol  ↗    │
│   GT Protocol       │ │ ROI: 50x           │
│   FULL DETAIL       │ ├───────────────────┤
│   50x ROI           │ │ Client B      ↗   │
│   [Read Case Study] │ ├───────────────────┤
│                     │ │ Client C      ↗   │
└─────────────────────┘ └───────────────────┘

Option B: Horizontal scroll cards (trên mobile tự thành scroll)
[Card 1] → [Card 2] → [Card 3] → [Card 4 →]
```

---

## 7. SECTION-BY-SECTION GUIDE

### 7.1 Hero Section

**Vấn đề thường gặp:** Hero có H1 + subtext + 2 buttons + graphic = đúng template AI.

**Yêu cầu cho Hero Fintech24h:**
- H1 phải tách thành 3 dòng với weight/color khác nhau để tạo rhythm
- Background: mesh gradient + orbs + grid pattern (3 lớp, không chỉ 1)
- Animation: chỉ H1 reveal + form fade-in. KHÔNG animate subtext, KHÔNG animate buttons (chúng cần clickable ngay)
- Right column: là form 3-bước, KHÔNG phải mockup/3D object (tránh clichés Web3)
- Eyebrow: `font-mono uppercase tracking-widest` — KHÔNG phải pill/badge to

```astro
<!-- H1 structure chuẩn -->
<h1 class="font-display font-bold leading-[1.05]">
  <span class="block text-[var(--text-secondary)] text-[clamp(1rem,2vw,1.25rem)] font-mono tracking-widest uppercase mb-3">
    Blockchain & AI Marketing Agency
  </span>
  <span class="block text-[clamp(3rem,7vw,5.5rem)] tracking-[-0.03em] text-[var(--text-primary)]">
    We Scale
  </span>
  <span class="block text-[clamp(3rem,7vw,5.5rem)] tracking-[-0.03em] bg-gradient-to-r from-[var(--accent-cyan)] to-[#a78bfa] bg-clip-text text-transparent">
    AI & Blockchain
  </span>
  <span class="block text-[clamp(3rem,7vw,5.5rem)] tracking-[-0.03em] text-[var(--text-primary)]">
    Startups Globally
  </span>
</h1>
```

### 7.2 Trust Bar

**Không chỉ logo chạy.** Kết hợp 2 yếu tố:
- Row 1: Platform badges (Crunchbase, Clutch...) — static, không scroll
- Row 2: Client logos — marquee scroll, grayscale → color on hover

```css
/* Marquee với pause on hover */
.marquee-track {
  display: flex;
  gap: 4rem;
  animation: marquee-scroll 35s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### 7.3 Services Grid

Dùng Layout A (2+1 asymmetric). Card featured (service đầu tiên hoặc được chọn lọc) ở bên trái, 2 card nhỏ bên phải. 3 card đều bên dưới.

**Card content structure — không phải icon-title-text:**
```
[Number tag: 01]  [Category tag: KOL]
H3: Service Name
Paragraph: 2-3 câu thực tế, có con số
→ 3 bullet points cực ngắn (keyword-based)
[Link: Explore →]
```

### 7.4 Case Study / Results Section

```
BẮT BUỘC có số liệu lớn. Số liệu = trust signal mạnh nhất.
Format: [Số lớn 5xl] / [Label mono uppercase nhỏ]
Màu: success green (#10b981) cho ROI, cyan cho reach
Background: card với border gradient left accent
```

### 7.5 Process Section

Không dùng icon circles + line kết nối (quá AI clichés).

**Thay bằng:** Numbered list với card lớn, step number làm background watermark. Hoặc dùng horizontal timeline với connector line reveal animation.

### 7.6 CTA Section (cuối trang)

Không phải full-width gradient block thông thường.

**Thay bằng:** Floating card trên nền tối, với border glow animation, text lớn, và 2 CTA (primary + secondary Telegram link). Thêm social proof nhỏ bên dưới buttons.

---

## 8. CHECKLIST ANTI-AI-LOOK

Trước khi hoàn thành bất kỳ component hay page nào, tự hỏi:

```
LAYOUT
□ Có ít nhất 1 element phá vỡ lưới đồng đều không?
□ Không phải mọi section đều cùng cấu trúc heading+text+grid?
□ Có sự đa dạng về kích thước card trong cùng 1 grid không?

TYPOGRAPHY
□ Eyebrow labels dùng JetBrains Mono, không phải Inter?
□ H1 có ít nhất 2 màu/weight khác nhau không?
□ Không phải mọi text đều cùng 1 màu (--text-primary)?

ANIMATION
□ Không phải mọi thứ đều fade-up khi scroll?
□ Chỉ có đúng 1 text reveal kiểu "blurred" (chỉ ở Hero H1)?
□ Background orbs có offset thời gian (animation-delay) khác nhau không?
□ prefers-reduced-motion được handle không?

COLOR
□ Không dùng cyan và purple cùng độ sáng cạnh nhau?
□ Không có quá 2 gradient text trên toàn trang?
□ Text links dùng cyan, KHÔNG dùng purple?

CONTENT
□ Copy có con số cụ thể không (50x, 200+, 30 days)?
□ Không dùng cụm từ "cutting-edge", "revolutionary", "game-changing"?
□ CTA text mô tả chính xác hành động tiếp theo không?
```
