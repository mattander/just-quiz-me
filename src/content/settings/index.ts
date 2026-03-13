import { defineAppSettings } from '../../lib/app-settings.ts'

export const seededAppSettings = defineAppSettings({
  id: 'default',
  adsEnabled: false,
  featuredQuizSlug: 'which-chaotic-breakfast-are-you',
})

export const appSettings = seededAppSettings
