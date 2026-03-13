import { seededAppSettings } from '../content/settings/index.ts'
import {
  parseAppSettings,
  parseStoredAppSettingsRecord,
  type AppSettings,
} from './app-settings.ts'

export type AppSettingsRepository = {
  read(): Promise<AppSettings>
}

export function createAppSettingsRepository(
  database: D1Database | undefined,
): AppSettingsRepository {
  if (!database) {
    return createSeededAppSettingsRepository()
  }

  return createD1AppSettingsRepository(database)
}

function createSeededAppSettingsRepository(): AppSettingsRepository {
  return {
    async read() {
      return seededAppSettings
    },
  }
}

function createD1AppSettingsRepository(database: D1Database): AppSettingsRepository {
  return {
    async read() {
      const row = await database
        .prepare(
          `
            SELECT id, ads_enabled, featured_quiz_slug
            FROM app_settings
            ORDER BY updated_at DESC
            LIMIT 1
          `,
        )
        .first<StoredAppSettingsRow>()

      if (!row) {
        return seededAppSettings
      }

      const storedSettings = parseStoredAppSettingsRecord(row)

      return parseAppSettings({
        id: storedSettings.id,
        adsEnabled: storedSettings.ads_enabled === 1,
        featuredQuizSlug: storedSettings.featured_quiz_slug,
      })
    },
  }
}

type StoredAppSettingsRow = {
  id: string
  ads_enabled: 0 | 1
  featured_quiz_slug: string
}
