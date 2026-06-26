# Animation System — Fintech24h

> Đọc file này trước khi viết bất kỳ `animation`, `transition`, hay GSAP code nào. Không tuân thủ = giao diện "mùi AI".

---

## 1. TRIẾT LÝ ANIMATION

### Quy tắc số 0: Animation phải có lý do tồn tại

Trước khi thêm bất kỳ animation nào, hỏi: **"Nếu bỏ cái này đi, người dùng mất gì?"**

Nếu câu trả lời là "không mất gì" → đừng thêm.

### Ba mục đích hợp lệ duy nhất

1. **Hướng dẫn chú ý** — giúp người dùng nhìn vào thứ quan trọng hơn
2. **Phản hồi trạng thái** — báo hiệu "đã click", "đang load", "thành công"
3. **Tạo chiều sâu không gian** — ambient background cho cảm giác depth, không phải flat design

Tất cả animation không thuộc 3 mục đích trên = bỏ đi.

---

## 2. PHÂN LOẠI & TIMING CHUẨN

### Loại 1 — Ambient Background

```
Mục đích:   Tạo cảm giác "vũ trụ sống" mà không gây phân tâm
Duration:   6s – 14s (chậm, không đếm được)
Easing:     ease-in-out
Loop:       infinite
Opacity:    tối đa 0.25 — không bao giờ vượt qua
Chỉ dùng:  background elements (orbs, grid, particles)
```

**Orb Animation:**
```css
.orb-cyan {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0,200,240,0.18) 0%, transparent 70%);
  filter: blur(40px);
  animation:
    orb-pulse 9s ease-in-out infinite,
    orb-drift 14s ease-in-out infinite;
  will-change: transform, opacity;
}

.orb-purple {
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(124,92,252,0.14) 0%, transparent 70%);
  filter: blur(50px);
  animation:
    orb-pulse 11s ease-in-out infinite 3s,
    orb-drift 17s ease-in-out infinite 5s;
}
```

**Grid Pattern:**
```css
.grid-overlay {
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: grid-shimmer 8s ease-in-out infinite;
}
```

### Loại 2 — Entrance (ScrollTrigger)

```
Mục đích:   Phần tử xuất hiện có ý đồ khi scroll vào viewport
Duration:   0.6s – 0.9s
Easing:     power3.out (GSAP) / cubic-bezier(0.16, 1, 0.3, 1) (CSS)
Stagger:    0.08s – 0.12s giữa các phần tử
Start:      'top 82%' – 'top 86%' (không quá sớm, không quá muộn)
Once:       TRUE — animation chỉ play 1 lần khi vào, không replay khi scroll lại
```

**Chỉ có 4 kiểu entrance được phép:**

```typescript
// Kiểu 1: fade-up — dùng cho headings, paragraphs, generic content
{ from: { opacity: 0, y: 28 }, to: { opacity: 1, y: 0 } }

// Kiểu 2: scale-in — dùng cho cards, thumbnails
{ from: { opacity: 0, scale: 0.94, y: 16 }, to: { opacity: 1, scale: 1, y: 0 } }

// Kiểu 3: fade-in — dùng cho elements không cần movement (dividers, badges)
{ from: { opacity: 0 }, to: { opacity: 1 } }

// Kiểu 4: slide-left/right — chỉ dùng cho 2-column layouts
{ from: { opacity: 0, x: -32 }, to: { opacity: 1, x: 0 } } // left column
{ from: { opacity: 0, x: 32 }, to: { opacity: 1, x: 0 } }  // right column
```

**TUYỆT ĐỐI KHÔNG dùng:**
- `rotateX`, `rotateY`, `rotateZ` cho entrance
- `scale: 0` (quá dramatic)
- `filter: blur(20px)` cho thân bài — chỉ blur cho Hero H1
- `y: 60px` trở lên (quá nhiều movement)

### Loại 3 — Micro-interaction (Hover/Focus/Click)

```
Mục đích:   Phản hồi tức thì khi user tương tác
Duration:   0.18s – 0.3s (hover), 0.1s – 0.15s (active/click)
Easing:     ease-out (hover in), ease-in-out (hover out)
Rule:       CSS transition LUÔN ưu tiên hơn GSAP cho hover (performance)
```

**Catalog micro-interactions:**

```css
/* Card lift */
.card:hover { transform: translateY(-3px); }
.card { transition: transform 0.25s ease-out, border-color 0.25s ease-out, box-shadow 0.25s ease-out; }

/* Button glow */
.btn-primary:hover { box-shadow: 0 0 24px rgba(0,200,240,0.4), 0 0 48px rgba(124,92,252,0.15); }
.btn-primary { transition: box-shadow 0.25s ease-out, transform 0.2s ease-out; }

/* Icon rotate (arrow icons, chevrons) */
.arrow-icon { transition: transform 0.2s ease-out; }
.parent:hover .arrow-icon { transform: translateX(4px); }

/* Border glow on focus */
.input-field:focus { box-shadow: 0 0 0 3px rgba(0,200,240,0.15); }
.input-field { transition: box-shadow 0.2s ease-out, border-color 0.2s ease-out; }

/* Link underline slide */
.nav-link { position: relative; }
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-cyan);
  transition: width 0.25s ease-out;
}
.nav-link:hover::after { width: 100%; }

/* Service card neon border on hover */
.service-card {
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.service-card:hover {
  border-color: rgba(0, 200, 240, 0.25);
  box-shadow: 0 0 24px rgba(0,200,240,0.08), 0 12px 40px rgba(0,0,0,0.3);
}
```

---

## 3. GSAP SCROLL TRIGGER PATTERNS

### 3.1 Setup bắt buộc (trong BaseLayout.astro `<script>` cuối body)

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global scroll setup — chỉ chạy 1 lần
document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // Dừng tất cả GSAP animation

  // Batch animate tất cả [data-animate] elements
  ScrollTrigger.batch('[data-animate="fade-up"]', {
    onEnter: (elements) => {
      gsap.fromTo(elements,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
      );
    },
    start: 'top 84%',
    once: true,
  });

  ScrollTrigger.batch('[data-animate="scale-in"]', {
    onEnter: (elements) => {
      gsap.fromTo(elements,
        { opacity: 0, scale: 0.93, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, stagger: 0.09, ease: 'power2.out' }
      );
    },
    start: 'top 82%',
    once: true,
  });
});
```

### 3.2 Data attributes cho Astro components

```astro
<!-- Heading section -->
<div data-animate="fade-up">
  <h2>...</h2>
  <p>...</p>
</div>

<!-- Card grid -->
<div class="grid grid-cols-3 gap-6">
  <div data-animate="scale-in">Card 1</div>
  <div data-animate="scale-in">Card 2</div>
  <div data-animate="scale-in">Card 3</div>
</div>
```

### 3.3 Counter Animation (cho Stats section)

```typescript
// Sử dụng trong component AnimatedCounter.tsx (client:visible)
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current.textContent = prefix + target + suffix;
      return;
    }

    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate() {
            if (ref.current) {
              ref.current.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
            }
          },
        });
      },
    });
  }, [target, prefix, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}
```

### 3.4 Hero H1 Line-by-line Reveal

```typescript
// Dùng trong HeroSection.astro <script>
// Chỉ gọi 1 lần duy nhất trong toàn dự án
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroLines = document.querySelectorAll('[data-hero-line]');
  if (!heroLines.length) return;

  gsap.fromTo(
    heroLines,
    { opacity: 0, y: 32, filter: 'blur(8px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 1.0,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 0.2,
    }
  );

  // Fade in hero form sau khi H1 xong
  gsap.fromTo(
    '[data-hero-form]',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.8,
    }
  );
});
```

```astro
<!-- Trong HeroSection.astro -->
<h1>
  <span data-hero-line class="block ...">We Scale</span>
  <span data-hero-line class="block ...">AI & Blockchain</span>
  <span data-hero-line class="block ...">Startups Globally</span>
</h1>
<!-- Form -->
<div data-hero-form class="...">
  <MultiStepForm client:load />
</div>
```

---

## 4. NHỮNG GÌ TUYỆT ĐỐI KHÔNG LÀM

```
❌ Typewriter effect cho body text
   (Hero H1 được phép 1 lần — mọi chỗ khác đều KHÔNG)

❌ Continuous rotation animation cho bất cứ thứ gì
   (Ngoại lệ duy nhất: loading spinner)

❌ Parallax nhiều lớp phức tạp
   (Gây CLS, lag trên mobile, không cải thiện conversion)

❌ Animation delay > 400ms
   (Người dùng tưởng trang lag)

❌ Bounce / elastic easing cho UI elements
   (Chỉ phù hợp game/kids app)

❌ Hover animation trên mobile touch
   (Dùng :hover media query để loại trừ touch devices)

❌ Animate placeholder text trong input fields
   (Confusing UX)

❌ Page transition toàn màn hình
   (Slow, not needed cho static site)

❌ Scroll-jacking (cướp control scroll của người dùng)

❌ Video background autoplay ở Hero
   (Ảnh hưởng LCP nghiêm trọng)
```

---

## 5. PERFORMANCE RULES

```
will-change: transform   → Chỉ thêm cho elements đang/sẽ animate
will-change: auto        → Default, không thêm will-change cho mọi thứ

transform + opacity      → Dùng để animate (GPU composited)
width, height, top, left → KHÔNG dùng để animate (layout thrash)
background-color         → Hạn chế animate (paint operation)

GSAP vs CSS:
- Hover effects → CSS transition (always)
- ScrollTrigger → GSAP (always)
- Counter → GSAP (always)
- Loading states → CSS animation (always)
- Complex sequences → GSAP timeline

Lazy load GSAP:
- Import GSAP chỉ trong component cần dùng
- Dùng dynamic import cho ScrollTrigger:
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
```

---

## 6. SHIMMER LOADING STATE

```css
/* Dùng khi fetch data (case studies, blog posts) */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.07) 50%,
    rgba(255,255,255,0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

---

## 7. NAVBAR SCROLL BEHAVIOR

```typescript
// Trong Navbar.astro <script>
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Thêm backdrop-blur khi scroll
  if (currentScrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }

  // Hide khi scroll xuống nhanh, show khi scroll lên
  if (currentScrollY > 200) {
    if (currentScrollY > lastScrollY + 10) {
      navbar?.classList.add('hidden-up');
    } else if (currentScrollY < lastScrollY - 5) {
      navbar?.classList.remove('hidden-up');
    }
  }

  lastScrollY = currentScrollY;
}, { passive: true });
```

```css
#navbar {
  transition: transform 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease;
}
#navbar.scrolled {
  background: rgba(5, 8, 16, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
#navbar.hidden-up {
  transform: translateY(-100%);
}
```
