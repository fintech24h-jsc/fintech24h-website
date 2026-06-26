# Anti-AI Patterns & Common Mistakes — Fintech24h

> File này là danh sách các vấn đề hay xuất hiện trong giao diện do AI sinh ra. Claude Code đọc và đối chiếu trước khi báo cáo hoàn thành bất kỳ UI nào.

---

## 1. VẤN ĐỀ PHỔ BIẾN NHẤT — "MÙNG AI" RÕ RÀNG NHẤT

### 1.1 The Uniform Card Grid

**Triệu chứng:**
```
[Icon] [Icon] [Icon]
Title  Title  Title
Text   Text   Text
Link   Link   Link

[Icon] [Icon] [Icon]
Title  Title  Title
Text   Text   Text
Link   Link   Link
```

**Tại sao tệ:** Đây là output mặc định của mọi AI khi viết "làm card grid đẹp". Không có nhịp điệu, không có điểm nhấn, mắt không biết nhìn đâu.

**Sửa thế nào:**
- Card featured (lớn hơn, màu khác) cho service/post nổi bật nhất
- Không phải tất cả cards có cùng chiều cao
- Ít nhất 1 card có layout nội dung khác (ví dụ: ảnh full + text overlay thay vì text dưới ảnh)
- Xen kẽ card lớn-nhỏ trong grid

### 1.2 The Fade-Everything Scroll

**Triệu chứng:** Mọi element đều có `data-animate="fade-up"` hoặc `class="animate-fade-up"`. Khi scroll trang thấy liên tục... phần tử nào cũng từ từ hiện ra.

**Tại sao tệ:** Khi mọi thứ đều đặc biệt thì không gì đặc biệt. Animation mất đi ý nghĩa. Hơn nữa, gây performance issue nếu có quá nhiều ScrollTrigger instances.

**Sửa thế nào:**
- Chỉ animate **heading + first element** của mỗi section
- Các phần tử phụ (icon, badge, divider) xuất hiện cùng với element chính, không animate riêng
- Tối đa 3-4 scroll triggers per page

### 1.3 The Same Section Rhythm

**Triệu chứng:**
```
Section 1: [Label] [H2] [Text] [Grid 3-col] [CTA]
Section 2: [Label] [H2] [Text] [Grid 3-col] [CTA]
Section 3: [Label] [H2] [Text] [Grid 3-col] [CTA]
```

**Tại sao tệ:** Người đọc predict được cấu trúc, não tự "skip" qua. Không có surprise, không có điểm nhấn.

**Sửa thế nào:**
- Section 1: Heading center, grid bất đối xứng
- Section 2: 2-col layout (content left, visual right) — hoặc ngược
- Section 3: Full-width statement với số liệu lớn, không dùng grid
- Section 4: Mới dùng lại heading + grid nhưng với kích thước card khác

### 1.4 The Generic Eyebrow

**Triệu chứng:** Mọi section đều có eyebrow label kiểu:
```html
<span class="... rounded-full border px-4 py-1">✨ Our Services</span>
<span class="... rounded-full border px-4 py-1">🚀 Why Choose Us</span>
<span class="... rounded-full border px-4 py-1">💡 Case Studies</span>
```

Tất cả đều cùng style — pill border, icon emoji, padding to.

**Sửa thế nào:**
```html
<!-- Dùng mono font, không có emoji, tracking widest, nhỏ hơn -->
<div class="inline-flex items-center gap-2">
  <div class="w-6 h-px bg-[var(--accent-cyan)]"></div>
  <span class="font-mono text-xs text-[var(--accent-cyan)] uppercase tracking-[0.15em]">
    Services
  </span>
</div>
```

### 1.5 The Copy That Sounds AI

**Triệu chứng:**
> "We leverage cutting-edge AI-powered blockchain solutions to drive revolutionary growth for your innovative Web3 ecosystem."

Dùng những từ này là dấu hiệu chắc chắn: cutting-edge, revolutionary, game-changing, innovative, leverage, seamless, robust, scalable, next-generation, holistic.

**Sửa thế nào — luôn dùng số liệu cụ thể:**
> "200+ blockchain projects scaled. Average 50x ROI within 90 days. We handle KOL, PR, and community — you focus on building."

---

## 2. VẤN ĐỀ KỸ THUẬT THƯỜNG GẶP

### 2.1 CSS Specificity Conflicts

**Triệu chứng:** Styles không apply dù đã viết đúng class.

```css
/* Conflict thường gặp với Tailwind + custom CSS */
.section { padding: 4rem 0; }           /* specificity: 0,1,0 */
.section .cta { padding: 0; }           /* specificity: 0,2,0 — wins */
/* Nhưng khi dùng Tailwind: */
<div class="section py-24">             /* py-24 bị override bởi .section */
```

**Fix:** Luôn dùng CSS variables, không mix Tailwind utilities với custom CSS classes cho cùng 1 property.

### 2.2 Animation gây CLS (Cumulative Layout Shift)

**Triệu chứng:** Elements move khi load, Lighthouse CLS > 0.

**Nguyên nhân thường gặp:**
- Image không có `width`/`height`
- GSAP set `y: 28` nhưng không set `position` hay container min-height
- Font swap gây text reflow

**Fix:**
```astro
<!-- Luôn khai báo dimensions -->
<img src="..." alt="..." width="800" height="450" class="aspect-video w-full object-cover" />

<!-- GSAP: dùng opacity + transform, không dùng height/width -->
gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0 }) // ✅
gsap.fromTo(el, { height: 0 }, { height: 'auto' })            // ❌ causes CLS
```

### 2.3 Spline/Three.js Block LCP

**Triệu chứng:** Lighthouse LCP > 4s vì 3D library load ở Hero.

**Fix bắt buộc:**
```astro
<!-- KHÔNG BAO GIỜ: -->
<SplineViewer client:load url="..." />  <!-- Sẽ delay LCP -->

<!-- LUÔN LUÔN: -->
<SplineViewer client:visible url="..." />  <!-- Chỉ load khi người dùng scroll đến -->
```

### 2.4 GSAP Import làm tăng bundle size

**Fix — chỉ import plugin cần dùng:**
```typescript
// ❌ Import toàn bộ
import gsap from 'gsap/all';

// ✅ Import selective
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Không import SplitText, Draggable, ... nếu không dùng
```

### 2.5 Màu không đủ contrast trên Dark UI

**Triệu chứng:** Text khó đọc, Lighthouse Accessibility thấp.

**Check nhanh:**
```
--text-primary  (#e8edf8) trên --bg-primary  (#050810): ✅ ratio 15.2:1
--text-secondary(#8896b3) trên --bg-primary  (#050810): ✅ ratio 5.8:1
--text-muted   (#4a5470) trên --bg-primary  (#050810): ⚠️  ratio 2.8:1 — KHÔNG dùng cho text đọc được
--accent-cyan  (#00c8f0) trên --bg-primary  (#050810): ✅ ratio 9.1:1
```

**Quy tắc:** `--text-muted` chỉ dùng cho metadata decorative (ngày tháng nhỏ, icon label), không dùng cho content quan trọng.

---

## 3. CHECKLIST TRƯỚC KHI COMMIT CODE

### Performance
```
□ Lighthouse Performance ≥ 95 (test locally với `npm run build && npx serve dist`)
□ LCP < 2.5s — hero image có loading="eager" và fetchpriority="high"
□ CLS = 0 — mọi ảnh có width/height hoặc aspect-ratio
□ Spline/3D dùng client:visible, không phải client:load
□ GSAP import selective (chỉ plugin cần dùng)
□ Font chỉ load 2 weights mỗi family
```

### Design
```
□ Không có section nào cùng cấu trúc layout với section kề
□ Card grid có ít nhất 1 card break pattern (featured/large)
□ Eyebrow labels dùng JetBrains Mono, không phải Inter/Space Grotesk
□ H1 có ít nhất 2 màu hoặc weight khác nhau
□ Không có gradient text ở quá 2 heading trên 1 page
□ Ambient orbs: đúng 2 orbs mỗi section, có animation-delay lệch nhau
□ Background orb opacity ≤ 0.22
```

### Animation
```
□ Mọi GSAP ScrollTrigger dùng once: true
□ Không phải mọi element đều có entrance animation
□ prefers-reduced-motion được check ở đầu animation script
□ Không có animation delay > 400ms
□ Hover transitions ≤ 0.3s
□ Button hover có cả transform + box-shadow, không chỉ 1 trong 2
```

### Accessibility
```
□ Tất cả <img> có alt text
□ Interactive elements có :focus-visible styles
□ Color contrast ≥ 4.5:1 cho body text, ≥ 3:1 cho large text
□ FAQ accordion có aria-expanded và aria-controls
□ Form inputs có <label> liên kết đúng
□ Skip-to-content link ở đầu <body>
□ Marquee có aria-hidden="true" (decorative)
```

### SEO
```
□ Mỗi trang: đúng 1 H1
□ Title ≤ 60 ký tự, Description ≤ 160 ký tự
□ Canonical URL đúng
□ Schema JSON-LD: Organization (mọi trang) + schema riêng cho page type
□ Image alt text mô tả nội dung thực, không phải "image" hay "photo"
□ Internal links dùng descriptive anchor text, không phải "click here"
```

---

## 4. VOCABULARY — COPY GUIDELINES

### Thay thế từ AI-cliché bằng từ cụ thể

| Đừng dùng | Dùng thay thế |
|---|---|
| "cutting-edge" | "proven since 2019" hoặc "used by 200+ projects" |
| "revolutionary" | "delivers 50x ROI" |
| "seamless" | "30-minute setup" hoặc "no long-term contract" |
| "leverage" | "use" hoặc "activate" |
| "innovative" | mô tả cụ thể tính năng mới |
| "robust" | "handles 100k+ community members" |
| "holistic" | "covers KOL, PR, community, and SEO" |
| "scale your business" | "grow from 0 to 50,000 community members" |
| "drive results" | "average 3x community growth in 60 days" |
| "your success is our priority" | (xóa đi, không nói gì cả) |

### CTA Text — phải mô tả hành động tiếp theo chính xác

| Đừng dùng | Dùng thay thế |
|---|---|
| "Get Started" | "Get Your Free Proposal" |
| "Learn More" | "See Full Case Study" |
| "Contact Us" | "Chat on Telegram" |
| "Submit" | "Send Proposal Request" |
| "Click Here" | (link text phải describe destination) |
| "Book a Call" | "Book 30-Min Strategy Session" |

---

## 5. MOBILE-SPECIFIC RULES

```
375px viewport: tất cả text ≥ 14px (không có text-xs cho content)
320px viewport: H1 không vượt quá 90% viewport width
Touch targets: tất cả buttons/links ≥ 44x44px
Mobile card gap: gap-4 (không dùng gap-6 như desktop)
Mobile section padding: py-16 (không phải py-24 như desktop)
Multi-step form: mỗi bước hiện đầy đủ trên 1 màn hình, không cần scroll
```

```css
/* Disable hover effects on touch devices */
@media (hover: none) {
  .card:hover { transform: none; box-shadow: none; }
  .btn-primary:hover { transform: none; }
}
```
