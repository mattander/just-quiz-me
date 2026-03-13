import * as v from 'valibot'

const settingsIdentifierSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Settings identifiers cannot be empty.'),
)

export const appSettingsSchema = v.object({
  id: settingsIdentifierSchema,
  adsEnabled: v.boolean(),
  featuredQuizSlug: settingsIdentifierSchema,
})

const storedBooleanSchema = v.picklist([0, 1])

const storedAppSettingsSchema = v.object({
  id: settingsIdentifierSchema,
  ads_enabled: storedBooleanSchema,
  featured_quiz_slug: settingsIdentifierSchema,
})

export type AppSettings = v.InferOutput<typeof appSettingsSchema>
export type AppSettingsInput = v.InferInput<typeof appSettingsSchema>
export type StoredAppSettings = v.InferOutput<typeof storedAppSettingsSchema>
export type StoredAppSettingsInput = v.InferInput<typeof storedAppSettingsSchema>

export function parseAppSettings(input: AppSettingsInput): AppSettings {
  const result = v.safeParse(appSettingsSchema, input)

  if (!result.success) {
    throw new Error(`Invalid app settings.\n${v.summarize(result.issues)}`)
  }

  return result.output
}

export function defineAppSettings(input: AppSettingsInput): AppSettings {
  return parseAppSettings(input)
}

export function parseStoredAppSettingsRecord(
  input: StoredAppSettingsInput,
): StoredAppSettings {
  const result = v.safeParse(storedAppSettingsSchema, input)

  if (!result.success) {
    throw new Error(`Invalid stored app settings.\n${v.summarize(result.issues)}`)
  }

  return result.output
}
