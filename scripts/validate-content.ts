import { quizManifests } from '../src/content/quizzes/index.ts'

const manifestCountLabel = quizManifests.length === 1 ? 'manifest' : 'manifests'

console.log(`Validated ${quizManifests.length} quiz ${manifestCountLabel}.`)
