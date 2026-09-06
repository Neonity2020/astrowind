---
publishDate: 2023-08-12T00:00:00Z
updateDate: 2026-09-06T00:00:00Z
author: John Smith
title: Get started with AstroWind to create a website using Astro and Tailwind CSS
excerpt: From an empty folder to a deployed site in an afternoon. Create the project, learn where things live, edit the home page, publish a post and build for production.
image: https://images.unsplash.com/photo-1516996087931-5ae405802f9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80
category: Tutorials
tags:
  - astro
  - tailwind css
---

AstroWind is a free template for [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/). It gives you a complete marketing site with a blog, dark mode, image optimisation and SEO metadata, built as a set of typed components you compose in pages. This guide takes you from nothing to a deployed site.

## What you need

- **Node.js 22.22.3 or newer.** The version is pinned in `.nvmrc`; if you use nvm, `nvm use` picks it up.
- A terminal and an editor. Visual Studio Code with the Astro extension gives you syntax highlighting and completion inside `.astro` files.
- A GitHub account if you want the one-click deploys at the end.

## Create the project

The Astro CLI can scaffold a project from any GitHub repository:

```shell
npm create astro@latest -- --template arthelokyo/astrowind
```

Answer the prompts (project folder, install dependencies, initialise git), then:

```shell
cd my-site
npm run dev
```

Open `http://localhost:4321`. You are looking at the demo site: a home page, four alternative home pages, six landing pages, a blog with six posts, and the usual about, services, pricing, contact and legal pages. Everything you see is a file you can edit; the dev server reloads on save.

## Where things live

You will spend nearly all your time in `src/`:

| Path                                | What is there                                                          |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `src/pages/`                        | One file per route. `index.astro` is the home page.                    |
| `src/components/widgets/`           | The page sections: heroes, features, pricing, FAQ, testimonials…       |
| `src/data/post/`                    | Blog posts as Markdown or MDX files.                                   |
| `src/config.yaml`                   | Site name, URL, default SEO metadata, blog settings, analytics, theme. |
| `src/navigation.ts`                 | The header menu, the header button and the footer columns.             |
| `src/components/CustomStyles.astro` | Colours and fonts as CSS variables, for light and dark mode.           |
| `src/assets/images/`                | Images that Astro optimises at build time.                             |
| `public/`                           | Files copied as they are (robots rules, verification files…).          |

The template's own machinery lives in `vendor/integration/`. You do not need to touch it.

## Make it yours: the three files to edit first

**`src/config.yaml`.** Change `site.name` and `site.site` (your final URL, needed for the sitemap, RSS and Open Graph tags), then the default `metadata.title` and `metadata.description`. The `apps.blog` block controls the blog: set `isEnabled: false` if you do not want one, or change `postsPerPage` and the `permalink` pattern.

**`src/navigation.ts`.** Replace the demo menus with your pages. Each entry is `{ text, href }`; use `getPermalink('/about')` for internal links so the base path is respected if you ever deploy under a sub-folder.

**`src/components/CustomStyles.astro`.** Your brand colours: `--aw-color-primary`, `--aw-color-secondary` and `--aw-color-accent`, plus the text and background colours, once for light and once for dark. Everything in the template reads these variables. Fonts are declared in `astro.config.ts` (the `fonts` entry, served by Astro's Fonts API) and mapped to `--aw-font-*` in the same file. The [customisation guide](/how-to-customize-astrowind-to-your-brand) covers this in depth.

## Edit the home page

Open `src/pages/index.astro`. A page is a layout plus a stack of widgets, each configured with props:

```astro
---
import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Features from '~/components/widgets/Features.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'Acme: invoices without the spreadsheet',
  description: 'Send, track and reconcile invoices in one place.',
};
---

<Layout metadata={metadata}>
  <Hero
    tagline="Invoicing"
    title="Invoices without the spreadsheet"
    subtitle="Send, track and reconcile in one place."
    actions={[{ variant: 'primary', text: 'Start free', href: '#pricing' }]}
    image={{ src: '~/assets/images/hero-image.png', alt: 'Product screenshot' }}
  />

  <Features
    id="features"
    title="What you get"
    items={[
      { title: 'Recurring invoices', description: 'Set it once.', icon: 'tabler:repeat' },
      { title: 'Payment links', description: 'Card or bank transfer.', icon: 'tabler:credit-card' },
    ]}
  />

  <CallToAction title="Ready?" actions={[{ variant: 'primary', text: 'Start free', href: '/signup' }]} />
</Layout>
```

Every widget accepts `title`, `subtitle`, `tagline`, an `id` for anchors and a `bg` slot for a custom background. Icons come from the [Tabler](https://tabler.io/icons) set through `astro-icon`. The full catalogue of widgets, with their props and the demo page where each is used, is in `.agents/skills/use-widgets.md`; the six landing pages under `src/pages/landing/` show them combined into complete pages.

## Publish a post

Create `src/data/post/hello-world.md`:

```markdown
---
publishDate: 2026-09-06T00:00:00Z
title: Hello, world
excerpt: The first post on the new site.
image: ~/assets/images/hello.jpg
category: News
tags:
  - company
author: Your name
---

Write in Markdown. Headings, lists, tables, code blocks and images all work;
use the `.mdx` extension to embed components.
```

The post appears at `/hello-world` (the `permalink` setting in `config.yaml` decides the pattern), in the blog list, in its category and tag pages, in the RSS feed and in the sitemap. `draft: true` keeps a post out of the build while you work on it; `updateDate` records a revision. The [Markdown demo post](/markdown-elements-demo-post) shows how every element renders.

## Check and build

```shell
npm run check   # astro check, ESLint and Prettier
npm run build   # static site in dist/
npm run preview # serve dist/ locally
```

The build is fully static: `dist/` is a folder of HTML, CSS, JavaScript and optimised images that any web server can host.

## Deploy

- **Vercel or Netlify:** connect the repository; both detect Astro and use `npm run build` with `dist/` as the output. The README has one-click buttons for both.
- **Cloudflare Pages, GitHub Pages, any static host:** upload `dist/`. The `deploy-cloudflare` and `deploy-with-base-path` skills in `.agents/skills/` cover the two cases that need a setting.
- **Your own server:** the repository includes a `Dockerfile` that serves `dist/` with nginx.

After the first deploy, set `site.site` in `config.yaml` to the real URL if you have not already, so canonical links, the sitemap and social previews point to the right place.

## Next steps

- [Customise the template to your brand](/how-to-customize-astrowind-to-your-brand): colours, fonts, logo, favicons.
- [How the template works under the hood](/astrowind-template-in-depth): the integration, permalinks, images and metadata.
- Working with an AI coding assistant? The repository ships an `AGENTS.md` and step-by-step skills in `.agents/skills/` so the assistant follows the template's conventions. [Here is how to get the most out of it](/build-websites-with-ai-and-astrowind).
