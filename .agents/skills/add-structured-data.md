# Add Structured Data (JSON-LD)

The template does not generate Schema.org markup out of the box (`src/components/common/Metadata.astro` handles title, description, canonical, robots, Open Graph and Twitter through `astro-seo`). Add JSON-LD manually.

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

`Layout.astro` has no `<head>` slot; either add one (`<slot name="head" />` inside `<head>`) and pass the component through `PageLayout`, or place the `<script>` in the page body — JSON-LD is valid anywhere in the document.

## Blog posts (Article)

In `src/pages/[...blog]/index.astro` you already have `post` and `url`:

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
