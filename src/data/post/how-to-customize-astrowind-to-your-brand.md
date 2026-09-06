---
publishDate: 2023-08-06T00:00:00Z
updateDate: 2026-09-06T00:00:00Z
title: How to customize AstroWind template to suit your branding
excerpt: Colours for light and dark mode, fonts, logo, favicons, the announcement bar, the header and footer, and the tokens you can use from Tailwind or shadcn/ui. Every file named.
image: https://images.unsplash.com/photo-1546984575-757f4f7c13cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80
category: Documentation
tags:
  - astro
  - tailwind css
  - theme
---

The demo is blue, uses Inter and says "AstroWind" everywhere. Making it yours is a handful of files, and none of them is inside a component you would rather not touch. This guide goes through them in the order most projects need.

## Colours: one file, two palettes

`src/components/CustomStyles.astro` declares the palette as CSS variables, once for light mode under `:root` and once for dark mode under `.dark`:

```css
:root {
  --aw-color-primary: rgb(1 97 239);
  --aw-color-secondary: rgb(1 84 207);
  --aw-color-accent: rgb(109 40 217);

  --aw-color-text-heading: rgb(0 0 0);
  --aw-color-text-default: rgb(16 16 16);
  --aw-color-text-muted: rgb(16 16 16 / 66%);
  --aw-color-bg-page: rgb(255 255 255);
}

.dark {
  --aw-color-primary: rgb(1 97 239);
  /* … */
  --aw-color-bg-page: rgb(3 6 32);
}
```

- `primary` is the brand colour: buttons, links, icons, the active menu item.
- `secondary` is used for taglines and secondary emphasis; `accent` for the occasional highlight.
- The three text colours and the page background are what every widget reads for headings, body copy, muted captions and surfaces.

Change the values and the whole site follows, including the new widgets, because components use Tailwind utilities such as `text-primary`, `text-heading`, `text-muted` and `bg-page` that map to these variables in `src/assets/styles/tailwind.css`. Pick a dark-mode primary that stays readable on your dark background; the demo keeps the same blue and lightens it where small text needs contrast.

The header has its own link colour if you want one: set `--aw-color-link` and the active menu item uses it instead of `primary`.

## Fonts

Fonts are loaded with Astro's Fonts API, declared in `astro.config.ts`:

```ts
fonts: [
  {
    provider: fontProviders.fontsource(),
    name: 'Inter',
    cssVariable: '--font-inter',
    weights: ['100 900'],
    styles: ['normal'],
    subsets: ['latin'],
    fallbacks: ['sans-serif'],
  },
],
```

Add another entry for a second face (a serif for headings, say), then point the `--aw-font-sans`, `--aw-font-serif` and `--aw-font-heading` variables in `CustomStyles.astro` at the new `cssVariable`. Astro downloads the files at build time, self-hosts them and generates the `@font-face` rules with metric-adjusted fallbacks, so there is no request to a third party at runtime. The `Font` component in `src/layouts/Layout.astro` injects them.

## Logo and site name

The name comes from `site.name` in `src/config.yaml`; `src/components/Logo.astro` renders it with a rocket emoji. Replace the component's content with your mark:

```astro
---
import { Image } from 'astro:assets';
import logo from '~/assets/images/logo.svg';
---

<Image src={logo} alt="Acme" width={120} height={32} class="self-center" />
```

Keep the `class="self-center"` so it aligns inside the header. If your logo needs a light and a dark version, render both and toggle them with `dark:hidden` and `hidden dark:block`.

## Favicons and the social image

The favicons live in `src/assets/favicons/`: `favicon.ico`, `favicon.svg` and `apple-touch-icon.png`. Replace the three files keeping the names. The default Open Graph image used when a page does not set its own is `src/assets/images/default.png` (1200 × 628); replace it too, or point `metadata.openGraph.images` in `config.yaml` at a different file. The `set-open-graph-image` skill in `.agents/skills/` has the details.

## Header, footer and announcement bar

`src/navigation.ts` exports `headerData` (menu entries, with optional dropdown `links`, and the `actions` buttons) and `footerData` (column links, secondary links, social links and the footer note). Internal links go through `getPermalink()` so they respect `base` if you deploy under a sub-path.

The header itself is `src/components/widgets/Header.astro`. Its props cover the common needs without editing it: `isSticky`, `isDark`, `isFullWidth`, `showToggleTheme`, `showRssFeed`, `position` (`left`, `center`, `right`). Pages can pass their own header (the personal and mobile-app demos do) through the `header` slot of `PageLayout`.

The bar above the header is the `Announcement` widget in `src/layouts/Layout.astro`. It takes `badge`, `text`, `href` and `showStars`; remove the component to remove the bar.

## Tokens for your own components

Two sets of tokens are available in any component or page:

- **AstroWind utilities:** `text-primary`, `text-secondary`, `text-accent`, `text-heading`, `text-muted`, `bg-page`, `bg-dark`, plus the `btn`, `btn-primary`, `btn-secondary` and `btn-tertiary` button classes and `font-heading`.
- **shadcn/ui-compatible tokens:** `bg-background`, `text-foreground`, `bg-card`, `border-border`, `ring-ring`, `text-muted-foreground`, `bg-destructive` and the rest of the shadcn palette, derived from the same variables in `src/assets/styles/shadcn.css`. Components copied from shadcn/ui or from the community blocks built on it render with your colours without editing their classes. Note that `primary`, `secondary`, `accent` and `muted` keep their AstroWind meaning.

Utilities of your own belong in `tailwind.css` as `@utility` blocks, next to the existing ones.

## Dark mode behaviour

`ui.theme` in `config.yaml` decides the default: `system` follows the operating system and shows the toggle; `light` or `dark` set a default but keep the toggle; `light:only` and `dark:only` remove the toggle. The choice is stored in `localStorage` and applied before the first paint, so there is no flash.

## A checklist

1. Palette in `CustomStyles.astro`, light and dark.
2. Fonts in `astro.config.ts`, mapped in `CustomStyles.astro`.
3. `Logo.astro`, the three favicons and `default.png`.
4. `site.name`, `site.site`, default title and description in `config.yaml`.
5. Menus in `navigation.ts`; the announcement bar in `Layout.astro`.
6. `npm run check`, then look at every page in light and dark mode.

Step-by-step versions of several of these live in `.agents/skills/` (`styling.md`, `customize-header.md`, `set-open-graph-image.md`, `use-shadcn-tokens.md`), written so that an AI coding assistant can carry them out, and short enough to follow yourself.
