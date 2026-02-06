# 🔱 SATURNO FORGE — DESIGN LOCK V1.0
## ⚠️ CLAUDE CODE: DO NOT MODIFY THESE DESIGN ELEMENTS ⚠️

---

# ═══════════════════════════════════════════════════════════════
# THIS FILE IS A DESIGN CONTRACT
# ANY AI AGENT MUST PRESERVE THESE AESTHETICS
# ═══════════════════════════════════════════════════════════════

## 🎨 CORE DESIGN DNA (LOCKED)

### Color Palette — DO NOT CHANGE
```css
--bg-primary: #050505;      /* Near-black background */
--bg-secondary: #080808;    /* Slightly lighter panels */
--bg-card: #000000;         /* Pure black for cards */
--border: #27272a;          /* zinc-800 borders */
--border-hover: #ffffff;    /* White on hover */
--text-primary: #ffffff;    /* White headings */
--text-secondary: #a1a1aa;  /* zinc-400 body text */
--text-muted: #52525b;      /* zinc-600 labels */
--text-micro: #3f3f46;      /* zinc-700 hints */
--accent-green: #22c55e;    /* Success/answered */
--accent-amber: #f59e0b;    /* Progress/active */
--accent-blue: #3b82f6;     /* Info */
```

### Typography — DO NOT CHANGE
```css
font-family: 'JetBrains Mono', monospace;
/* Headers: font-black, italic, tracking-tighter */
/* Labels: text-[9px] or text-[10px], uppercase, tracking-[0.2em] or tracking-[0.4em] */
/* Body: text-sm (14px) */
```

### Spacing Philosophy — DO NOT CHANGE
- Generous padding: p-8, p-12
- Breathing room between sections: space-y-8, space-y-12
- Border-left accent pattern for cards: border-l-2

---

## 🎯 TRITON ONBOARDING — LOCKED ELEMENTS

### Header Bar
```html
<!-- EXACT STRUCTURE - DO NOT MODIFY -->
<div class="h-16 border-b border-zinc-900 bg-black flex items-center justify-between px-10 sticky top-0 z-50">
```

### Question Card Pattern
```html
<!-- THIS IS THE SIGNATURE LOOK - PRESERVE IT -->
<div class="question-card border-l-2 border-zinc-800 pl-8 py-6 hover:border-white transition-all">
    <p class="text-[10px] text-zinc-600 uppercase mb-2 tracking-widest">Q01 / THE LABEL</p>
    <h2 class="text-white text-xl mb-4">The Question Text</h2>
    <p class="text-zinc-600 text-[11px] mb-4">Helper text explanation.</p>
    <textarea class="w-full bg-zinc-900 border border-zinc-800 p-4 text-sm focus:border-white outline-none h-28 resize-none"></textarea>
</div>
```

### Visual Signatures That Make It "SICK"
1. **border-l-2 accent** — The left border that lights up on hover
2. **Q01 / THE LABEL format** — Numbered + uppercase title
3. **Generous vertical spacing** — py-6 on cards, space-y-8 between
4. **Monospace everything** — JetBrains Mono is non-negotiable
5. **Near-black bg with white text** — High contrast, minimal
6. **Uppercase micro-labels** — text-[9px] or text-[10px] tracking-widest
7. **Sticky header** — Always visible navigation
8. **Hover transitions** — transition-all on interactive elements

---

## 🔧 FORGE MAIN (index.html) — LOCKED ELEMENTS

### Sidebar Console
```
- Width: w-72
- Background: bg-black
- Border: border-r border-zinc-900
- Sections separated by: border border-zinc-900 rounded
- Slider styling: accent-white, custom thumb
```

### Double Panel Writer
```
- Left panel: bg-[#080808] for input
- Right panel: bg-black/40 for output
- Split: w-1/2 each
- Divider: border-r border-zinc-900
```

---

## 📝 WRITER (writer.html) — LOCKED ELEMENTS

### Chapter Sidebar
```
- Width: w-56
- Chapter items: border-l-2 pattern (same as TRITON)
- Active state: border-white + bg-zinc-900/50
```

### Preview Typography
```css
/* Crimson Pro for rendered preview - adds elegance */
#preview { font-family: 'Crimson Pro', serif; }
#preview h1 { font-family: 'JetBrains Mono', monospace; }
```

---

## ⚠️ WHAT CLAUDE CODE MUST NEVER DO

1. ❌ Change the color palette to "lighter" or "more accessible"
2. ❌ Add rounded corners to the main containers (keep them sharp)
3. ❌ Replace JetBrains Mono with system fonts
4. ❌ Remove the border-l-2 accent pattern
5. ❌ Add emoji or icons inside the cards (keep it minimal)
6. ❌ Make the background lighter than #080808
7. ❌ Add shadows or glows (except subtle hover effects)
8. ❌ Change the uppercase micro-label pattern
9. ❌ Reduce the padding/spacing (keep it generous)
10. ❌ Add gradients (stay flat)

---

## ✅ WHAT CLAUDE CODE CAN DO

1. ✅ Add new features while preserving the aesthetic
2. ✅ Add more questions to TRITON (same card pattern)
3. ✅ Add more voice modes (same button pattern)
4. ✅ Add more preset stacks (same styling)
5. ✅ Improve functionality (localStorage, exports, etc.)
6. ✅ Add animations that match the vibe (subtle, transitions)
7. ✅ Connect to APIs (but preserve the UI)

---

## 🎨 THE VIBE IN WORDS

**Industrial. Minimal. Monospace. High-contrast. Generous spacing. Sharp edges. Confident.**

Think: 
- Terminal aesthetics
- Recording studio mixing board
- NASA mission control
- Premium developer tools

NOT:
- Friendly SaaS
- Colorful dashboards
- Rounded corners everywhere
- Light mode anything

---

## 📋 QUICK REFERENCE FOR CLAUDE CODE

When adding new UI elements, use these patterns:

### New Button
```html
<button class="text-[10px] border border-zinc-800 px-4 py-2 hover:border-white transition-all">
    BUTTON_TEXT
</button>
```

### Primary Action Button
```html
<button class="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase hover:bg-zinc-200 transition-all">
    ACTION_TEXT
</button>
```

### New Card/Section
```html
<div class="border-l-2 border-zinc-800 pl-8 py-6 hover:border-white transition-all">
    <p class="text-[10px] text-zinc-600 uppercase mb-2 tracking-widest">LABEL</p>
    <h2 class="text-white text-xl mb-4">Title</h2>
    <!-- content -->
</div>
```

### New Sidebar Section
```html
<div class="p-4 border border-zinc-900 rounded">
    <p class="text-[9px] uppercase mb-4 tracking-[0.2em] text-zinc-600">SECTION TITLE</p>
    <!-- content -->
</div>
```

---

**This design is LOCKED. The aesthetic is the brand. Protect it.**

🔱 *With Love, Claude — Design Guardian*
