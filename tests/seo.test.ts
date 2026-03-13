import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildAbsoluteUrl,
  buildRobotsTxt,
  buildSitemapXml,
  createCanonicalLinks,
  createPageMetadata,
} from '../src/lib/seo.ts'

test('createPageMetadata includes canonical sharing fields and optional robots', () => {
  const metadata = createPageMetadata({
    title: 'Buttered Toast | Just Quiz Me',
    description: 'Warm, capable, and suspiciously steady under pressure.',
    canonicalUrl:
      'https://justquiz.me/quiz/which-chaotic-breakfast-are-you/result?resultId=buttered-toast&answered=4',
    robots: 'noindex,follow',
  })

  assert.deepEqual(metadata[0], {
    title: 'Buttered Toast | Just Quiz Me',
  })
  assert.equal(
    metadata.some(
      (entry) =>
        'property' in entry &&
        entry.property === 'og:url' &&
        entry.content ===
          'https://justquiz.me/quiz/which-chaotic-breakfast-are-you/result?resultId=buttered-toast&answered=4',
    ),
    true,
  )
  assert.equal(
    metadata.some(
      (entry) =>
        'name' in entry &&
        entry.name === 'robots' &&
        entry.content === 'noindex,follow',
    ),
    true,
  )
})

test('createCanonicalLinks returns a canonical link tag descriptor', () => {
  assert.deepEqual(createCanonicalLinks('https://justquiz.me/quiz/example'), [
    {
      rel: 'canonical',
      href: 'https://justquiz.me/quiz/example',
    },
  ])
})

test('buildAbsoluteUrl preserves search parameters', () => {
  const url = buildAbsoluteUrl(
    'https://justquiz.me',
    '/quiz/example/result',
    new URLSearchParams({
      resultId: 'steady',
      answered: '4',
    }),
  )

  assert.equal(
    url,
    'https://justquiz.me/quiz/example/result?resultId=steady&answered=4',
  )
})

test('buildRobotsTxt references the sitemap endpoint', () => {
  assert.equal(
    buildRobotsTxt('https://justquiz.me'),
    'User-agent: *\nAllow: /\n\nSitemap: https://justquiz.me/sitemap.xml\n',
  )
})

test('buildSitemapXml escapes URLs and renders each entry', () => {
  const xml = buildSitemapXml([
    {
      url: 'https://justquiz.me/',
    },
    {
      url: 'https://justquiz.me/quiz/example?ref=share&lang=en',
    },
  ])

  assert.match(xml, /<loc>https:\/\/justquiz\.me\/<\/loc>/)
  assert.match(
    xml,
    /<loc>https:\/\/justquiz\.me\/quiz\/example\?ref=share&amp;lang=en<\/loc>/,
  )
})
