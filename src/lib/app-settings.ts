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

export type AppSettings = v.InferOutput<typeof appSettingsSchema>
export type AppSettingsInput = v.InferInput<typeof appSettingsSchema>

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
