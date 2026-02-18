# SEO & Metadata in Next.js

> Reference documentation for SEO with Next.js App Router

## Overview

Next.js provides built-in metadata management via:
- Static `metadata` export (for fixed metadata)
- `generateMetadata` function (for dynamic, data-driven metadata)
- File-based conventions (`opengraph-image.tsx`, `sitemap.ts`, `robots.ts`)

## Static Metadata

```typescript
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | MyApp',
  description: 'Learn about our company and mission',
  openGraph: {
    title: 'About Us | MyApp',
    description: 'Learn about our company',
    type: 'website',
  },
}

export default function AboutPage() {
  return <div>About content</div>
}
```

## Dynamic Metadata (Data-Driven)

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// Cache the fetch to deduplicate between generateMetadata and Page
const getPost = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
})

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return <article>{post.content}</article>
}
```

## Metadata Title Template

```typescript
// app/layout.tsx - Root layout with title template
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'MyApp',           // Used when child doesn't set title
    template: '%s | MyApp',     // Child title replaces %s
  },
  description: 'My application',
}

// app/about/page.tsx - Child page
export const metadata: Metadata = {
  title: 'About',  // Renders as "About | MyApp"
}
```

## Common Metadata Fields

### Basic SEO

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description (150-160 characters)',
  robots: { index: true, follow: true },
  authors: [{ name: 'Author Name' }],
  alternates: {
    canonical: 'https://myapp.com/page',
  },
}
```

### Open Graph (Facebook, LinkedIn)

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    url: 'https://myapp.com/page',
    siteName: 'MyApp',
    images: [
      {
        url: 'https://myapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Image description',
      },
    ],
    type: 'website',  // or 'article', 'product'
    locale: 'en_US',
  },
}
```

### Twitter Cards

```typescript
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    site: '@username',
    title: 'Page Title',
    description: 'Page description',
    images: ['https://myapp.com/twitter-image.png'],
  },
}
```

### Article Metadata

```typescript
export const metadata: Metadata = {
  openGraph: {
    type: 'article',
    publishedTime: '2024-01-15T09:00:00Z',
    modifiedTime: '2024-01-16T10:30:00Z',
    authors: ['Author Name'],
    section: 'Technology',
    tags: ['React', 'Next.js'],
  },
}
```

## Structured Data (JSON-LD)

Add structured data via a script tag in the page component:

```typescript
export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  )
}
```

### Article Schema

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
  },
}
```

## generateStaticParams for SSG

Pre-render pages at build time for better performance:

```typescript
// app/blog/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')

  return (posts ?? []).map((post) => ({
    slug: post.slug,
  }))
}

// Pages will be pre-rendered at build time for all returned slugs
export default async function PostPage({ params }: Props) {
  // ...
}
```

### ISR (Incremental Static Regeneration)

```typescript
// Revalidate every 60 seconds
export const revalidate = 60

export default async function PostPage({ params }: Props) {
  // Page will be regenerated every 60 seconds
}
```

## Dynamic OG Images

```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        {post.title}
      </div>
    ),
    { ...size }
  )
}
```

## robots.ts

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: 'https://myapp.com/sitemap.xml',
  }
}
```

## sitemap.ts

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')

  const postUrls = (posts ?? []).map((post) => ({
    url: `https://myapp.com/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://myapp.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://myapp.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postUrls,
  ]
}
```

## Metadata Inheritance

Child routes inherit and can override parent metadata:

```typescript
// app/layout.tsx (parent)
export const metadata: Metadata = {
  title: { default: 'MyApp', template: '%s | MyApp' },
  openGraph: { siteName: 'MyApp' },  // Inherited by children
}

// app/blog/[slug]/page.tsx (child)
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost((await params).slug)
  return {
    title: post.title,  // Renders as "Post Title | MyApp" (template)
    description: post.excerpt,  // Overrides parent
    // og:site_name is inherited from parent
  }
}
```

## Verification & Testing

### Check SSR Output

```bash
# View page source to verify meta tags
curl -s https://myapp.com/blog/my-post | head -50

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

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org](https://schema.org/)
