type SeoPageType = 'website' | 'article'

type SeoPageInput = {
  title: string
  description: string
  canonicalUrl: string
  pageType?: SeoPageType
  robots?: string
  imageUrl?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
}

type SitemapEntry = {
  url: string
}

type PageMetadataEntry =
  | {
      title: string
    }
  | {
      name: string
      content: string
    }
  | {
      property: string
      content: string
    }

export function buildAbsoluteUrl(
  siteUrl: string,
  pathname: string,
  searchParams?: URLSearchParams,
): string {
  const url = new URL(pathname, siteUrl)

  if (searchParams && Array.from(searchParams.keys()).length > 0) {
    url.search = searchParams.toString()
  }

  return url.toString()
}

export function createPageMetadata(input: SeoPageInput) {
  const pageType = input.pageType ?? 'website'
  const imageUrl =
    input.imageUrl ?? new URL('/images/logo-card.png', input.canonicalUrl).toString()
  const imageAlt = input.imageAlt ?? 'Just Quiz Me logo mark'
  const imageWidth = input.imageWidth ?? 1200
  const imageHeight = input.imageHeight ?? 630
  const metadata: PageMetadataEntry[] = [
    {
      title: input.title,
    },
    {
      name: 'description',
      content: input.description,
    },
    {
      property: 'og:title',
      content: input.title,
    },
    {
      property: 'og:description',
      content: input.description,
    },
    {
      property: 'og:type',
      content: pageType,
    },
    {
      property: 'og:url',
      content: input.canonicalUrl,
    },
    {
      property: 'og:site_name',
      content: 'Just Quiz Me',
    },
    {
      property: 'og:image',
      content: imageUrl,
    },
    {
      property: 'og:image:width',
      content: String(imageWidth),
    },
    {
      property: 'og:image:height',
      content: String(imageHeight),
    },
    {
      property: 'og:image:alt',
      content: imageAlt,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: input.title,
    },
    {
      name: 'twitter:description',
      content: input.description,
    },
    {
      name: 'twitter:image',
      content: imageUrl,
    },
    {
      name: 'twitter:image:alt',
      content: imageAlt,
    },
  ]

  if (input.robots) {
    metadata.push({
      name: 'robots',
      content: input.robots,
    })
  }

  return metadata
}

export function createCanonicalLinks(canonicalUrl: string) {
  return [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ]
}

export function buildRobotsTxt(siteUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${buildAbsoluteUrl(siteUrl, '/sitemap.xml')}\n`
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n  </url>`,
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
  ].join('\n')
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
