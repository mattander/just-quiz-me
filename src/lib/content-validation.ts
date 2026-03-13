import type { AppSettings } from './app-settings.ts'
import type { QuizManifest } from './quiz-manifest.ts'

export type ContentValidationSummary = {
  manifestCount: number
  manifestCountLabel: 'manifest' | 'manifests'
}

export function validateAuthoredContent(
  manifests: readonly QuizManifest[],
  settings: AppSettings,
): ContentValidationSummary {
  const featuredQuizExists = manifests.some(
    (manifest) => manifest.slug === settings.featuredQuizSlug,
  )

  if (!featuredQuizExists) {
    throw new Error(
      `Featured quiz slug "${settings.featuredQuizSlug}" does not match a registered quiz manifest.`,
    )
  }

  return {
    manifestCount: manifests.length,
    manifestCountLabel: manifests.length === 1 ? 'manifest' : 'manifests',
  }
}
