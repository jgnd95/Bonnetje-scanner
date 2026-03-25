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

### FAB (Floating Action Button)
```
bg-[#2563EB] rounded-full — positioned bottom-right
```
Used for: the scan/upload button, always visible on main screens.

### General Rules
- **No shadows** — borders handle visual separation
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
