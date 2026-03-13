import { appSettings } from '../src/content/settings/index.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'
import { validateAuthoredContent } from '../src/lib/content-validation.ts'

const summary = validateAuthoredContent(quizManifests, appSettings)

console.log(
  `Validated ${summary.manifestCount} quiz ${summary.manifestCountLabel} and app settings.`,
)
