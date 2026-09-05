# Styling Guide

## Tailwind CSS v4 Configuration

All Tailwind config is in `src/assets/styles/tailwind.css`:

### Theme Tokens

Defined in `@theme` block, mapped to CSS variables from `CustomStyles.astro`:

| Token               | CSS Variable                              | Usage                            |
| ------------------- | ----------------------------------------- | -------------------------------- |
| `--color-primary`   | `--aw-color-primary`                      | `bg-primary`, `text-primary`     |
| `--color-secondary` | `--aw-color-secondary`                    | `bg-secondary`, `text-secondary` |
| `--color-accent`    | `--aw-color-accent`                       | `bg-accent`, `text-accent`       |
| `--color-heading`   | `--aw-color-text-heading`                 | `text-heading` (titles, hero h1) |
| `--color-default`   | `--aw-color-text-default`                 | `text-default`                   |
| `--color-muted`     | `--aw-color-text-muted`                   | `text-muted`                     |
| `--color-link`      | `--aw-color-link` (falls back to primary) | `text-link`, active header link  |

### Custom Utilities

| Utility         | Purpose                                                                         |
| --------------- | ------------------------------------------------------------------------------- |
| `bg-page`       | Page background color                                                           |
| `bg-dark`       | Dark page background                                                            |
| `text-page`     | Legacy; `--aw-color-text-page` is not defined, so it inherits the parent colour |
| `btn`           | Base button styles                                                              |
| `btn-primary`   | Primary CTA button                                                              |
| `btn-secondary` | Secondary button                                                                |
| `btn-tertiary`  | Text-style button                                                               |

### Dark Mode

Class-based: add/remove `.dark` on `<html>`. Registered as:

```css
@variant dark (&:where(.dark, .dark *));
```

Use `dark:` prefix on any utility: `dark:text-slate-300`, `dark:bg-slate-800`. Prefer the tokens above over hard-coded colours so `CustomStyles.astro` stays the single place to re-theme.

### Scroll Animations

Custom `intersect` variant for IntersectionObserver animations:

```html
<div class="intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade"></div>
```

## Changing Colors

Edit `src/components/CustomStyles.astro`:

```css
:root {
  --aw-color-primary: rgb(1 97 239);
  --aw-color-secondary: rgb(1 84 207);
  --aw-color-accent: rgb(109 40 217);
  --aw-color-text-heading: rgb(0 0 0);
  /* optional: --aw-color-link: rgb(1 97 239); */
}
.dark {
  --aw-color-primary: rgb(1 97 239);
  /* ... */
}
```

Note: the demo pages wrap highlighted words in `text-accent dark:text-white` because the default purple accent has low contrast on the dark background. Remove `dark:text-white` or pick a lighter `--aw-color-accent` in `.dark` if you want the accent in dark mode.

## Changing Fonts

Fonts use Astro's native Fonts API (no `@fontsource` packages):

1. In `astro.config.ts`, edit the `fonts` array (provider, `name`, `cssVariable`, weights, subsets). Example: `fontProviders.google()` with `name: 'Poppins'` and `cssVariable: '--font-poppins'`.
2. In `src/layouts/Layout.astro`, update `<Font cssVariable="--font-poppins" preload />`.
3. In `src/components/CustomStyles.astro`, point `--aw-font-sans`, `--aw-font-serif` and `--aw-font-heading` at the new variable.

## Adding a New Theme Color

1. Add the CSS variable in `CustomStyles.astro` for both `:root` and `.dark`
2. Register in `tailwind.css` under `@theme`: `--color-yourcolor: var(--aw-color-yourcolor);`
3. Use as `bg-yourcolor`, `text-yourcolor`, etc.
