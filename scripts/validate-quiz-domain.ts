import { seededAppSettings } from '../src/content/settings/index.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'
import {
  buildHomepageQuizFeed,
  listPublishedQuizzes,
  scoreQuizAnswers,
} from '../src/lib/quiz-domain.ts'
import {
  defineQuizManifest,
  defineQuizManifestCollection,
} from '../src/lib/quiz-manifest.ts'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

const domainFixtureManifests = defineQuizManifestCollection([
  ...quizManifests,
  defineQuizManifest({
    id: 'draft-fixture',
    slug: 'draft-fixture',
    status: 'draft',
    title: 'Draft Fixture',
    description: 'A draft fixture used to prove publication filtering behavior.',
    results: [
      {
        id: 'steady',
        title: 'Steady',
        description: 'You prefer a quiet, steady path.',
      },
      {
        id: 'wild',
        title: 'Wild',
        description: 'You prefer a wilder route through the quiz.',
      },
    ],
    questions: [
      {
        id: 'fixture-question',
        prompt: 'Choose a route for the fixture.',
        options: [
          {
            id: 'steady-option',
            label: 'Take the steady route.',
            weights: [{ resultId: 'steady', value: 2 }],
          },
          {
            id: 'wild-option',
            label: 'Take the wild route.',
            weights: [{ resultId: 'wild', value: 2 }],
          },
        ],
      },
    ],
  }),
])

const tieBreakerQuiz = defineQuizManifest({
  id: 'tie-breaker-fixture',
  slug: 'tie-breaker-fixture',
  status: 'published',
  title: 'Tie Breaker Fixture',
  description: 'A published fixture that produces a deterministic scoring tie.',
  results: [
    {
      id: 'alpha',
      title: 'Alpha',
      description: 'Alphabetically and positionally first.',
    },
    {
      id: 'beta',
      title: 'Beta',
      description: 'Second in manifest order.',
    },
  ],
  questions: [
    {
      id: 'equal-weight',
      prompt: 'Choose the perfectly balanced answer.',
      options: [
        {
          id: 'balanced-option',
          label: 'Give both results the same score.',
          weights: [
            { resultId: 'alpha', value: 2 },
            { resultId: 'beta', value: 2 },
          ],
        },
        {
          id: 'split-option',
          label: 'Split the difference unevenly.',
          weights: [
            { resultId: 'alpha', value: 1 },
            { resultId: 'beta', value: 2 },
          ],
        },
      ],
    },
  ],
})

const publishedQuizzes = listPublishedQuizzes(domainFixtureManifests)

assert(
  publishedQuizzes.length === quizManifests.length,
  'Published quiz filtering should exclude draft manifests.',
)

assert(
  publishedQuizzes.every((manifest) => manifest.status === 'published'),
  'Published quiz filtering returned a non-published manifest.',
)

const homepageFeed = buildHomepageQuizFeed(domainFixtureManifests, seededAppSettings, 6)

assert(homepageFeed.featuredQuiz !== null, 'Homepage feed should select a featured quiz.')
assert(
  homepageFeed.featuredQuiz?.slug === seededAppSettings.featuredQuizSlug,
  'Homepage feed should honor the configured featured quiz when it is published.',
)
assert(
  homepageFeed.quizzes.every((manifest) => manifest.status === 'published'),
  'Homepage feed should exclude draft quizzes.',
)
assert(
  homepageFeed.quizzes.every(
    (manifest) => manifest.slug !== homepageFeed.featuredQuiz?.slug,
  ),
  'Homepage feed should not duplicate the featured quiz in the remaining feed.',
)

const breakfastQuiz = quizManifests[0]

if (!breakfastQuiz) {
  throw new Error('Expected at least one authored quiz manifest for domain validation.')
}

const breakfastScore = scoreQuizAnswers(breakfastQuiz, [
  {
    questionId: 'alarm-style',
    optionId: 'ritualized-launch-sequence',
  },
  {
    questionId: 'kitchen-energy',
    optionId: 'mise-en-place-theatrics',
  },
  {
    questionId: 'social-bite',
    optionId: 'deliver-a-framework',
  },
  {
    questionId: 'comfort-object',
    optionId: 'cast-iron-pan',
  },
])

assert(
  breakfastScore.winningResult.resultId === 'overbuilt-omelette',
  'Quiz scoring should accumulate weights and choose the highest-scoring result.',
)

const tieBreakerScore = scoreQuizAnswers(tieBreakerQuiz, [
  {
    questionId: 'equal-weight',
    optionId: 'balanced-option',
  },
])

assert(
  tieBreakerScore.winningResult.resultId === 'alpha',
  'Quiz scoring should break ties by manifest result order.',
)
assert(
  tieBreakerScore.winningResult.tiedResultIds.length === 2,
  'Quiz scoring should expose the tied result set for downstream use.',
)

console.log('Validated publication filtering, homepage feed selection, and quiz scoring.')
