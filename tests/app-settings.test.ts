import assert from 'node:assert/strict'
import test from 'node:test'
import {
  defineAppSettings,
  parseAppSettings,
  parseStoredAppSettingsRecord,
} from '../src/lib/app-settings.ts'

test('app settings parsing trims identifiers and preserves booleans', () => {
  const settings = parseAppSettings({
    id: ' default ',
    adsEnabled: false,
    featuredQuizSlug: ' featured-quiz ',
  })

  assert.deepEqual(settings, {
    id: 'default',
    adsEnabled: false,
    featuredQuizSlug: 'featured-quiz',
  })
})

test('defineAppSettings shares the same validation rules as parseAppSettings', () => {
  const settings = defineAppSettings({
    id: 'homepage',
    adsEnabled: true,
    featuredQuizSlug: 'published-quiz',
  })

  assert.equal(settings.id, 'homepage')
  assert.equal(settings.adsEnabled, true)
  assert.equal(settings.featuredQuizSlug, 'published-quiz')
})

test('app settings parsing rejects blank featured quiz identifiers', () => {
  assert.throws(
    () =>
      parseAppSettings({
        id: 'default',
        adsEnabled: false,
        featuredQuizSlug: '   ',
      }),
    /Invalid app settings\./,
  )
})

test('stored app settings parsing accepts sqlite booleans and rejects blank identifiers', () => {
  const storedSettings = parseStoredAppSettingsRecord({
    id: 'default',
    ads_enabled: 1,
    featured_quiz_slug: 'featured-quiz',
  })

  assert.deepEqual(storedSettings, {
    id: 'default',
    ads_enabled: 1,
    featured_quiz_slug: 'featured-quiz',
  })

  assert.throws(
    () =>
      parseStoredAppSettingsRecord({
        id: 'default',
        ads_enabled: 0,
        featured_quiz_slug: '   ',
      }),
    /Invalid stored app settings\./,
  )
})
