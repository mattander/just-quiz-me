type SeoPageType = 'website' | 'article'

type SeoPageInput = {
  title: string
  description: string
  canonicalUrl: string
  pageType?: SeoPageType
  robots?: string
}

type SitemapEntry = {
  url: string
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
  const metadata = [
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
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: input.title,
    },
    {
      name: 'twitter:description',
      content: input.description,
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
