import { defineAppSettings } from '../../lib/app-settings.ts'

export const seededAppSettings = defineAppSettings({
  id: 'default',
  adsEnabled: false,
  featuredQuizSlug: 'which-greek-god-would-block-you-on-slack',
})

export const appSettings = seededAppSettings
