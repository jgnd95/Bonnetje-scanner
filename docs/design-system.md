# Design System

Style: **Dark Mode — Minimalist & Clean**

Dark card-based UI with one blue accent. The app is always in dark mode — there is no light mode toggle.

---

## Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Background | `#0F0F0F` | Main background for all pages |
| Surface | `#1E1E1E` | Cards, list items, input fields |
| Border | `#2E2E2E` | Subtle dividers between sections |
| Text Primary | `#FFFFFF` | Main text, amounts, headings |
| Text Secondary | `#6B7280` | Labels, subtext, placeholders |
| Accent | `#2563EB` | CTA buttons, active navigation, links |
| Danger | `#EF4444` | Error messages, delete actions, expired states |

---

## Typography

**Font:** Inter (Google Fonts)

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Amounts | 28-32px | Bold | `#FFFFFF` |
| Labels | 11-12px | Regular, uppercase, letter-spacing | `#6B7280` |
| Body | 16px | Regular | `#FFFFFF` |
| Subtext | 14px | Regular | `#6B7280` |

---

## Component Styles

### Cards
```
bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl
```
Used for: receipt items, dashboard stats, category tiles.

### Primary Button
```
bg-[#2563EB] rounded-full px-6 py-3 text-white font-medium
```
Used for: main actions like "Save", "Scan", "Export".

### Secondary Button
```
bg-[#1E1E1E] border border-[#2E2E2E] rounded-full px-5 py-3 text-white font-medium
```
Used for: secondary actions like "Upload vanuit galerij".

### Danger Button
```
border border-[#EF4444] rounded-full text-[#EF4444]
```
Used for: destructive actions like "Bonnetje verwijderen".

### Category Label
```
bg-[#2E2E2E] rounded-md px-2 py-0.5 text-[11px] font-medium text-white
```
Used for: category indicators on receipt list items. Plain text, no emojis.

### Bottom Navigation
```
bg-[#1E1E1E] border-t border-[#2E2E2E] — fixed bottom, 3 items
```
- **3 items:** Home | + (scan) | Bonnetjes
- **Spacing:** `justify-content: space-evenly; align-items: center;` for equal distribution
- **"+" button:** Centered, round, blue (`#2563EB`), slightly raised above the nav bar with subtle blue box-shadow
  - Size: 56px × 56px
  - Margin-top: -12px (raises it above the nav)
  - Box-shadow: `0 2px 12px rgba(37, 99, 235, 0.4)` (blue glow)
  - Tapping "+" opens a bottom sheet popup (not a separate screen)

#### Icons
**SVG Line Icons (no emojis):**
- **Home:** House/home icon with door detail
- **Bonnetjes:** Document/page icon with lines (represents a receipt)

SVG usage: inline `<svg>` elements with `stroke-width: 2` for consistent line thickness

### Settings Button (Header)
```
w-10 h-10 rounded-full bg-[#1E1E1E] border border-[#2E2E2E]
```
Round button in the top-right of the header. Replaces the user avatar. Opens settings screen.

**Styling:**
- Size: 40px × 40px
- Border: 1px solid `var(--border)`
- Hover/active: border-color changes to `var(--accent)`
- Icon: ⚙️ emoji (or SVG gear icon)

### Bottom Sheet
```
bg-[#1E1E1E] rounded-t-2xl — fixed bottom, overlay backdrop
```
Used for: scan options popup, category management. Has a drag handle at the top.

**Styling:**
- Max-height: 70vh (scrollable if content exceeds)
- Overflow: `overflow-y: auto`
- Padding: 20px 20px 40px
- Drag handle: 40px wide, 4px tall, centered
- Overlay: `rgba(0,0,0,0.6)` (60% opaque black backdrop)

### Receipt Item Layout
```
display: flex; align-items: center; gap: 12px
```
Receipt list items show:
1. **Datum** (left, bold) — primary identifier
2. **Meta row** (flex with separators):
   - Bedrag: €27,85
   - Separator: •
   - BTW%: "21%"
   - Separator: •
   - Category: text label chip

**Example:** "25 mrt 2026" | "€ 34,85 • BTW 21% • Boodschappen"

### Form Layouts

#### Review Grid (2-column layout)
```
display: grid; grid-template-columns: 1fr 1fr; gap: 12px
```
For "Controleer gegevens" screen:
- First input (Datum) spans full width: `grid-column: 1 / -1`
- Remaining pairs (Bedrag + BTW%, BTW bedrag + payment method) in 2 columns

### Input Fields
Used for: text inputs, dates, textarea, selects.
- Padding: 14px 16px
- Border-radius: 12px
- Focus border: changes to `var(--accent)`

#### Select Dropdowns
- Use custom SVG dropdown arrow (chevron down)
- Arrow positioned right with padding-right: 40px
- Remove default browser dropdown arrow with `appearance: none`

### Dashboard: Total Amount Display
```
text-center; padding: 24px
```
Shows:
- Month header (e.g., "Maart 2026") — label style
- Total amount (e.g., "€ 487,52") — large amount style (32px, bold)
- Receipt count (e.g., "23 bonnetjes") — subtext

### Export Section (Bonnetjes pagina)
```
background: var(--surface); padding: 16px; margin-bottom: 16px
```
Located on the Bonnetjes list page, not the Dashboard. Contains:
- Label: "Exporteer bonnetjes"
- Two date inputs in flex row: `display: flex; gap: 8px;`
- Primary button below: full width, "Download CSV"

### Button States
- **Default:** opacity 1
- **Active/Pressed:** opacity 0.8
- **Disabled:** (not yet implemented, define when needed)

### Form Validation
*(To be defined when form validation is implemented)*

Currently no validation styling is defined. When adding form validation, define:
- Error input border-color (use `--danger` red)
- Error message styling (text color, font size)
- Success/confirmation states if needed

### General Rules
- **No shadows** — borders handle visual separation (exception: blue glow on "+" button)
- **No emojis in UI** — use SVG icons for navigation, plain text labels for categories
- **Rounded corners** — `rounded-2xl` for cards, `rounded-full` for buttons
- **Spacing** — consistent padding using Tailwind's spacing scale

---

## Tailwind Configuration

```js
// tailwind.config.ts
module.exports = {
  darkMode: 'class', // always 'dark' on <html>
}
```

The `dark` class is always present on the `<html>` element. All Tailwind dark variants are active by default.

---

## PWA Manifest Colors

```json
{
  "background_color": "#0F0F0F",
  "theme_color": "#0F0F0F"
}
```

These ensure the browser chrome and splash screen match the app's dark background.
