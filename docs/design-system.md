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
- **Icons:** Simple SVG line icons (no emojis)
- **"+" button:** Centered, round, blue (`#2563EB`), slightly raised above the nav bar with subtle blue box-shadow
- Tapping "+" opens a bottom sheet popup (not a separate screen)

### Settings Button (Header)
```
w-10 h-10 rounded-full bg-[#1E1E1E] border border-[#2E2E2E] — gear icon
```
Round button in the top-right of the header. Replaces the user avatar. Opens settings screen.

### Bottom Sheet
```
bg-[#1E1E1E] rounded-t-2xl — fixed bottom, overlay backdrop
```
Used for: scan options popup, category management. Has a drag handle at the top.

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
