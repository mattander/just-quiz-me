import { appSettings } from '../src/content/settings/index.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'

const manifestCountLabel = quizManifests.length === 1 ? 'manifest' : 'manifests'

const featuredQuizExists = quizManifests.some(
  (manifest) => manifest.slug === appSettings.featuredQuizSlug,
)

if (!featuredQuizExists) {
  throw new Error(
    `Featured quiz slug "${appSettings.featuredQuizSlug}" does not match a registered quiz manifest.`,
  )
}

console.log(
  `Validated ${quizManifests.length} quiz ${manifestCountLabel} and app settings.`,
)
