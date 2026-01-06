# SEO & Head Management

> Reference documentation for SEO with TanStack Start

## Overview

TanStack Router provides built-in document head management for:
- Title tags
- Meta tags (description, Open Graph, Twitter Cards)
- Link tags (canonical, stylesheets)
- Script tags

## Required Components

### Root Layout Setup

```typescript
// src/routes/__root.tsx
import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

## Head Configuration

### Static Head

```typescript
export const Route = createFileRoute('/about')({
  head: () => ({
    title: 'About Us | MyApp',
    meta: [
      { name: 'description', content: 'Learn about our company and mission' },
      { property: 'og:title', content: 'About Us | MyApp' },
      { property: 'og:description', content: 'Learn about our company' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: AboutPage,
})
```

### Dynamic Head from Loader Data

```typescript
export const Route = createFileRoute('/posts/$postId')({
  head: ({ loaderData }) => ({
    title: `${loaderData.post.title} | MyBlog`,
    meta: [
      { name: 'description', content: loaderData.post.excerpt },
      // Open Graph
      { property: 'og:title', content: loaderData.post.title },
      { property: 'og:description', content: loaderData.post.excerpt },
      { property: 'og:image', content: loaderData.post.coverImage },
      { property: 'og:type', content: 'article' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: loaderData.post.title },
      { name: 'twitter:description', content: loaderData.post.excerpt },
      { name: 'twitter:image', content: loaderData.post.coverImage },
    ],
    links: [
      { rel: 'canonical', href: `https://myblog.com/posts/${loaderData.post.slug}` },
    ],
  }),
  loader: async ({ params }) => {
    const post = await fetchPost({ data: { id: params.postId } })
    return { post }
  },
  component: PostPage,
})
```

### Head with Route Parameters

```typescript
export const Route = createFileRoute('/categories/$category')({
  head: ({ params }) => ({
    title: `${capitalize(params.category)} Articles | MyBlog`,
    meta: [
      { name: 'description', content: `Browse all ${params.category} articles` },
    ],
  }),
  component: CategoryPage,
})
```

## Common Meta Tags

### Basic SEO

```typescript
head: () => ({
  title: 'Page Title | Site Name',
  meta: [
    { name: 'description', content: 'Page description (150-160 chars)' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'Author Name' },
  ],
})
```

### Open Graph (Facebook, LinkedIn)

```typescript
meta: [
  { property: 'og:title', content: 'Page Title' },
  { property: 'og:description', content: 'Page description' },
  { property: 'og:image', content: 'https://example.com/image.jpg' },
  { property: 'og:url', content: 'https://example.com/page' },
  { property: 'og:type', content: 'website' }, // or 'article', 'product'
  { property: 'og:site_name', content: 'Site Name' },
]
```

### Twitter Cards

```typescript
meta: [
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: '@username' },
  { name: 'twitter:title', content: 'Page Title' },
  { name: 'twitter:description', content: 'Page description' },
  { name: 'twitter:image', content: 'https://example.com/image.jpg' },
]
```

### Article Metadata

```typescript
meta: [
  { property: 'article:published_time', content: '2024-01-15T09:00:00Z' },
  { property: 'article:modified_time', content: '2024-01-16T10:30:00Z' },
  { property: 'article:author', content: 'Author Name' },
  { property: 'article:section', content: 'Technology' },
  { property: 'article:tag', content: 'React' },
]
```

## Structured Data (JSON-LD)

### Adding JSON-LD Scripts

```typescript
export const Route = createFileRoute('/products/$productId')({
  head: ({ loaderData }) => ({
    title: `${loaderData.product.name} | MyStore`,
    meta: [
      { name: 'description', content: loaderData.product.description },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: loaderData.product.name,
          description: loaderData.product.description,
          image: loaderData.product.image,
          offers: {
            '@type': 'Offer',
            price: loaderData.product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }),
      },
    ],
  }),
  loader: async ({ params }) => {
    const product = await fetchProduct({ data: { id: params.productId } })
    return { product }
  },
  component: ProductPage,
})
```

### Article Schema

```typescript
scripts: [
  {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: loaderData.post.title,
      description: loaderData.post.excerpt,
      image: loaderData.post.coverImage,
      datePublished: loaderData.post.publishedAt,
      dateModified: loaderData.post.updatedAt,
      author: {
        '@type': 'Person',
        name: loaderData.post.author.name,
      },
    }),
  },
]
```

## Head Inheritance

Child routes inherit and can override parent head tags.

```typescript
// Parent: /blog
export const Route = createFileRoute('/blog')({
  head: () => ({
    title: 'Blog | MyApp',
    meta: [
      { name: 'description', content: 'Our blog' },
      { property: 'og:site_name', content: 'MyApp' }, // Inherited
    ],
  }),
})

// Child: /blog/$postId - overrides title and description
export const Route = createFileRoute('/blog/$postId')({
  head: ({ loaderData }) => ({
    title: `${loaderData.post.title} | Blog | MyApp`, // Overrides parent
    meta: [
      { name: 'description', content: loaderData.post.excerpt }, // Overrides
      // og:site_name is inherited from parent
    ],
  }),
})
```

## SSR Requirements for SEO

For SEO to work, the route must have SSR enabled:

```typescript
export const Route = createFileRoute('/blog/$postId')({
  ssr: true, // Required for meta tags to appear in HTML source

  head: ({ loaderData }) => ({
    title: loaderData.post.title,
    // ...
  }),

  loader: async ({ params }) => {
    return { post: await fetchPost({ data: { id: params.postId } }) }
  },
})
```

**Note**: With `ssr: false`, head tags are set client-side only and won't be visible to crawlers.

## Canonical URLs

```typescript
head: ({ loaderData }) => ({
  links: [
    {
      rel: 'canonical',
      href: `https://myapp.com/posts/${loaderData.post.slug}`,
    },
  ],
})
```

## Verification & Testing

### Check SSR Output

```bash
# View page source to verify meta tags
curl -s https://myapp.com/posts/my-post | head -50

# Should see:
# <title>Post Title | MyApp</title>
# <meta name="description" content="...">
# <meta property="og:title" content="...">
```

### Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Validator](https://validator.schema.org/)

## References

- [TanStack Router Head Management](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org](https://schema.org/)
