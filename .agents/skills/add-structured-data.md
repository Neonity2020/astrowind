# Add Structured Data (JSON-LD)

Out of the box the template emits `BlogPosting` and `BreadcrumbList` on every blog post (`src/pages/[...blog]/index.astro`, `src/components/common/Breadcrumbs.astro`) and `FAQPage` from the `FAQs` widget when it receives `schema`. `src/components/common/Metadata.astro` handles title, description, canonical, robots, Open Graph (including `article:*`) and Twitter through `astro-seo`. Anything else (Organization, Product, HowTo…) is added as described below.

## Site-wide (Organization / WebSite)

In `src/layouts/Layout.astro`, inside `<head>`:

```astro
---
import { SITE } from 'astrowind:config';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.site,
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## Per page

Create `src/components/common/StructuredData.astro`:

```astro
---
export interface Props {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}
const { schema } = Astro.props;
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

Pages can put it in the head through the `head` slot that `Layout.astro` and `PageLayout.astro` expose:

```astro
<Layout metadata={metadata}>
  <Fragment slot="head">
    <script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
  </Fragment>
  …
</Layout>
```

JSON-LD is also valid anywhere in the body if a slot is not available (widgets like `FAQs` do that).

## Blog posts (Article)

Already done: `src/pages/[...blog]/index.astro` builds this object from the front matter (`publishDate`, `updateDate`, `author`, `category`, `tags`, `image`). Extend it there if you need more properties:

```ts
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  datePublished: post.publishDate.toISOString(),
  dateModified: (post.updateDate ?? post.publishDate).toISOString(),
  author: post.author ? { '@type': 'Person', name: post.author } : undefined,
  image: typeof image === 'string' ? image : image?.src,
  mainEntityOfPage: String(url),
};
```

Render it with `<script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />`.

## Notes

- Always use `set:html` with `JSON.stringify`; never interpolate user content directly.
- Validate with https://validator.schema.org/ or Google's Rich Results Test.
- `astro-compress` minifies HTML but leaves `application/ld+json` scripts intact.
